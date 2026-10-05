'use server';
import { OpenRouter } from 'openrouter-client';
import { fallbacks } from '@/lib/ai-fallbacks';
import { rateLimit } from '@/lib/rate-limit';

export async function optimizePrompt(rawPrompt: string) {
  const ip = 'anonymous';
  if (!rateLimit(ip, 'prompt-opt')) {
    return new Response('Rate limited', { status: 429, headers: { 'Retry-After': '60' } });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY!;
    const model = 'cohere/north-mini-code:free';
    const openrouter = new OpenRouter(apiKey);
    const result = await openrouter.chat(
      [
        { role: 'system', content: 'Eres un optimizador de prompts para generación de imágenes (Stable Diffusion, Flux, SDXL). Convierte lenguaje cinematográfico en prompts técnicos optimizados. Incluye: subject, lighting, camera, lens, film stock, color palette, mood, quality tags. Formato: etiquetas separadas por comas.' },
        { role: 'user', content: rawPrompt },
      ],
      { model, max_tokens: 1024, temperature: 0.3 }
    );

    if (!result.success) throw new Error('errorCode' in result ? result.errorMessage || 'API error' : 'API error');

    return new Response(result.data.choices[0]?.message?.content || '', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new Response(fallbacks.promptOpt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}