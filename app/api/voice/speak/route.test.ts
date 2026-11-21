// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

beforeEach(() => {
  vi.stubEnv('ELEVENLABS_API_KEY', '');
  vi.stubEnv('VOICE_CLONE_UPSTREAM', '');
  vi.stubEnv('VOICE_CLONE_API_KEY', '');
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
const request = (body: unknown) => new NextRequest('http://localhost/api/voice/speak', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

test.each([null, [], 12, 'hello', { text: 42 }, { text: {} }, { text: ' ' }, { text: 'x'.repeat(2001) }])(
  'malformed input returns 400 instead of crashing: %j', async (body) => {
    expect((await POST(request(body))).status).toBe(400);
  }
);
test('voice identifiers and language cannot inject provider paths', async () => {
  expect((await POST(request({ text: 'Hello', voiceId: '../another/path' }))).status).toBe(400);
  expect((await POST(request({ text: 'Hello', lang: {} }))).status).toBe(400);
});
test('readiness is false without a provider, and does not make an upstream request', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  expect(await (await GET()).json()).toEqual({ available: false });
  expect((await POST(request({ text: 'Hello' }))).status).toBe(501);
  expect(fetch).not.toHaveBeenCalled();
});
test('JSON from a voice upstream is rejected instead of being delivered as audio', async () => {
  vi.stubEnv('VOICE_CLONE_UPSTREAM', 'http://localhost:9999/voice');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"ok":true}', { headers: { 'Content-Type': 'application/json' } })));
  const result = await POST(request({ text: 'Hello', lang: 'es-ES' }));
  expect(result.status).toBe(502);
  expect(await result.json()).toEqual({ error: 'upstream_audio_required' });
});
