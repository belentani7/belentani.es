import { NextRequest, NextResponse } from 'next/server';

/**
 * Narración natural (NO Microsoft Speech).
 * Prioridad:
 *  1) ELEVENLABS_API_KEY → TTS ElevenLabs (voz natural / clon)
 *  2) VOICE_CLONE_UPSTREAM + VOICE_CLONE_API_KEY → proxy genérico
 *
 * En .env.local (nunca commit):
 *   ELEVENLABS_API_KEY=...
 *   ELEVENLABS_VOICE_ID=...   (opcional; default masculino multilenguaje)
 *   NEXT_PUBLIC_VOICE_CLONE_ENDPOINT=/api/voice/speak
 */
export const runtime = 'nodejs';

const DEFAULT_VOICE = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Adam — natural male

export async function POST(req: NextRequest) {
  let body: { text?: string; lang?: string; voiceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const text = (body.text || '').trim();
  if (!text || text.length > 2000) {
    return NextResponse.json({ error: 'text requerido (máx 2000)' }, { status: 400 });
  }

  const elevenKey = process.env.ELEVENLABS_API_KEY;
  if (elevenKey) {
    const voiceId = body.voiceId || DEFAULT_VOICE;
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
          'xi-api-key': elevenKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.42,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        return NextResponse.json(
          { error: 'elevenlabs_failed', status: res.status, detail: detail.slice(0, 200) },
          { status: 502 }
        );
      }
      const buf = await res.arrayBuffer();
      return new NextResponse(buf, {
        status: 200,
        headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
      });
    } catch {
      return NextResponse.json({ error: 'elevenlabs_unreachable' }, { status: 502 });
    }
  }

  const upstream = process.env.VOICE_CLONE_UPSTREAM;
  const key = process.env.VOICE_CLONE_API_KEY;
  if (upstream) {
    try {
      const res = await fetch(upstream, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(key ? { Authorization: `Bearer ${key}` } : {}),
        },
        body: JSON.stringify({
          text,
          lang: body.lang || 'es-ES',
          voiceId: body.voiceId || 'belentani-local',
        }),
      });
      if (!res.ok) {
        return NextResponse.json({ error: 'upstream_failed', status: res.status }, { status: 502 });
      }
      const contentType = res.headers.get('content-type') || 'application/octet-stream';
      if (contentType.includes('audio') || contentType.includes('octet-stream')) {
        const buf = await res.arrayBuffer();
        return new NextResponse(buf, {
          status: 200,
          headers: {
            'Content-Type': contentType.includes('audio') ? contentType : 'audio/mpeg',
            'Cache-Control': 'no-store',
          },
        });
      }
      return NextResponse.json(await res.json());
    } catch {
      return NextResponse.json({ error: 'upstream_unreachable' }, { status: 502 });
    }
  }

  return NextResponse.json(
    {
      error: 'voice_offline',
      message:
        'No hay ELEVENLABS_API_KEY en .env.local. Pega TU clave (no la de terceros). Sin Microsoft Speech.',
      hint: 'ELEVENLABS_API_KEY=... y NEXT_PUBLIC_VOICE_CLONE_ENDPOINT=/api/voice/speak',
    },
    { status: 501 }
  );
}
