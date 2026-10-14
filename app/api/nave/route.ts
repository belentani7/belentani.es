import { NextRequest, NextResponse } from 'next/server';
import { answerFromCanon } from '@/lib/nave-knowledge';

export const runtime = 'nodejs';

const modelReady = () => Boolean(process.env.NAVE_MODEL_URL && process.env.NAVE_MODEL_KEY && process.env.NAVE_MODEL_ID);

export async function GET() {
  return NextResponse.json({ mode: modelReady() ? 'ia' : 'archivo' }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  if (Number(request.headers.get('content-length') || 0) > 2048) return NextResponse.json({ error: 'entrada_demasiado_larga' }, { status: 413 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'json_invalido' }, { status: 400 }); }
  const question = body && typeof body === 'object' && 'question' in body ? (body as { question: unknown }).question : null;
  if (typeof question !== 'string' || question.trim().length < 2 || question.length > 280) {
    return NextResponse.json({ error: 'pregunta_invalida' }, { status: 400 });
  }
  const canonical = answerFromCanon(question);
  const url = process.env.NAVE_MODEL_URL;
  const key = process.env.NAVE_MODEL_KEY;
  const model = process.env.NAVE_MODEL_ID;
  if (url && key && model && /^https:\/\//.test(url)) {
    try {
      const result = await fetch(url, {
        method: 'POST', signal: AbortSignal.timeout(9000),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, max_tokens: 135, temperature: .3, messages: [
          { role: 'system', content: `Eres NAVE, una memoria dañada del universo ficticio JUDAS de Pedro Belentani. Habla en español, en una o dos frases breves. Responde solo con el fragmento verificado que sigue. Si no sirve para la pregunta, di que no tienes señal. Nunca presentes ficción como biografía ni inventes hechos. Fragmento: ${canonical.text}` },
          { role: 'user', content: question.trim() },
        ] }),
      });
      if (result.ok) {
        const data = await result.json();
        const candidate = data?.choices?.[0]?.message?.content;
        if (typeof candidate === 'string' && candidate.trim()) {
          return NextResponse.json({ ...canonical, text: candidate.trim().slice(0, 420), mode: 'ia' }, { headers: { 'Cache-Control': 'no-store' } });
        }
      }
    } catch { /* La memoria local responde si el proveedor no está disponible. */ }
  }
  return NextResponse.json({ ...canonical, mode: 'archivo' }, { headers: { 'Cache-Control': 'no-store' } });
}
