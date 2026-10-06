import { NextRequest, NextResponse } from 'next/server';
import { OpenRouter, OpenRouterStream } from 'openrouter-client';
import { getSystemPrompt } from '@/lib/lore-prompts';
import { fallbacks } from '@/lib/ai-fallbacks';
import { rateLimit } from '@/lib/rate-limit';

const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
const MAX_TOKENS = 2048;
const TEMPERATURE = 0.7;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const CONFIG = {
  model: MODEL,
  max_tokens: MAX_TOKENS,
  temperature: TEMPERATURE,
  stream: true,
};

export async function POST(request: NextRequest) {
  const ip = 'anonymous';
  if (!rateLimit(ip, 'jarvis')) {
    return new NextResponse('Rate limited', { status: 429, headers: { 'Retry-After': '60' } });
  }

  let body: { messages: ChatMessage[]; context: 'judas' | 'biblia' | 'qwen' };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: 'messages array required' }, { status: 400 });
  }

  const context = body.context || 'judas';
  const systemPrompt = getSystemPrompt(context);

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    // No API key — return fallback immediately
    return new NextResponse(fallbacks.loreChat(context), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    // Check if client wants streaming (SSE)
    const accept = request.headers.get('accept') || '';
    const forceStream = accept.includes('text/event-stream') || accept.includes('text/stream');
    const wantsStream = forceStream || request.headers.get('content-type')?.includes('text/event-stream');

    if (wantsStream) {
      return await streamResponse(apiKey, systemPrompt, body.messages, context);
    }

    // Non-streaming response
    const openrouter = new OpenRouter(apiKey);
    const result = await openrouter.chat(
      [{ role: 'system', content: systemPrompt }, ...body.messages],
      { model: MODEL, max_tokens: MAX_TOKENS, temperature: TEMPERATURE }
    );

    if (!result.success) {
      const msg = 'errorMessage' in result ? result.errorMessage : 'API error';
      throw new Error(msg);
    }

    const content = result.data.choices[0]?.message?.content || '';
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new NextResponse(fallbacks.loreChat(context), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

/**
 * Stream a response from OpenRouter using SSE.
 *
 * Uses OpenRouterStream (EventEmitter-based) which emits "data" events
 * with delta chunks, an "error" event on failure, and an "end" event
 * when the stream completes.
 */
async function streamResponse(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[],
  fallbackContext: 'judas' | 'biblia' | 'qwen'
): Promise<NextResponse> {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const openrouterStream = new OpenRouterStream(apiKey);

  let isClosed = false;

  const safeWrite = (text: string) => {
    if (isClosed) return;
    writer.write(encoder.encode(text)).catch(() => {});
  };

  const safeClose = () => {
    if (isClosed) return;
    isClosed = true;
    writer.close().catch(() => {});
  };

  openrouterStream.on('data', (chunk: any) => {
    const delta = chunk?.choices?.[0]?.delta?.content || '';
    if (delta) {
      safeWrite(delta);
    }
  });

  openrouterStream.on('error', () => {
    safeWrite(fallbacks.loreChat(fallbackContext));
    safeClose();
  });

  openrouterStream.on('end', () => {
    safeClose();
  });

  // Kick off the streaming request
  openrouterStream.chatStreamChunk(
    [{ role: 'system', content: systemPrompt }, ...messages],
    { model: MODEL, max_tokens: MAX_TOKENS, temperature: TEMPERATURE }
  ).catch(() => {
    safeWrite(fallbacks.loreChat(fallbackContext));
    safeClose();
  });

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
