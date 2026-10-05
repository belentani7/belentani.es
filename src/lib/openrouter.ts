import { OpenRouter } from 'openrouter-client';

export function createOpenRouter() {
  return new OpenRouter(process.env.OPENROUTER_API_KEY!);
}