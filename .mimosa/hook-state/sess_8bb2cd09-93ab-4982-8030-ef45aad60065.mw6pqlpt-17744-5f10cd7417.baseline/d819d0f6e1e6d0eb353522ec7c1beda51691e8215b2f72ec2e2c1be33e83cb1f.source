'use server';
import { OpenRouter } from 'openrouter-client';
import { getSystemPrompt } from '@/lib/lore-prompts';
import { fallbacks } from '@/lib/ai-fallbacks';
import { rateLimit } from '@/lib/rate-limit';

export async function analyzeLyrics(lyrics: string, context: 'biblia' | 'qwen' = 'biblia') {
  const ip = 'anonymous';
  if (!rateLimit(ip, 'lyric-analysis')) {
    return new Response('Rate limited', { status: 429, headers: { 'Retry-After': '60' } });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY!;
    const model = 'nvidia/nemotron-3-ultra-550b-a55b:free';
    const openrouter = new OpenRouter(apiKey);
    const result = await openrouter.chat(
      [{ role: 'system', content: getSystemPrompt(context) }, { role: 'user', content: `Analiza esta letra:\n${lyrics}` }],
      { model, max_tokens: 2048, temperature: 0.5 }
    );

    if (!result.success) throw new Error('errorCode' in result ? result.errorMessage || 'API error' : 'API error');

    return new Response(result.data.choices[0]?.message?.content || '', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new Response(fallbacks.lyricAnalysis(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}