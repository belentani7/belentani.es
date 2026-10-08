import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useVoiceNarrator } from '../hooks/useVoiceNarrator';

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_VOICE_CLONE_ENDPOINT', '');
  vi.stubGlobal('speechSynthesis', {
    cancel: vi.fn(), getVoices: () => [], addEventListener: vi.fn(), removeEventListener: vi.fn(),
  });
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

test('offline narration is not reported as ready or successful', async () => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation((_url, options) => Promise.resolve(
    options?.method === 'POST'
      ? new Response('offline', { status: 501 })
      : new Response('{"available":false}', { headers: { 'Content-Type': 'application/json' } })
  )));
  const { result, unmount } = renderHook(() => useVoiceNarrator());
  let played: boolean | undefined;
  await act(async () => { played = await result.current.speak('Hello'); });
  expect(played).toBe(false);
  expect(result.current.naturalReady).toBe(false);
  expect(result.current.speaking).toBe(false);
  unmount();
});

test('STOP aborts a pending voice request and resolves without stale playback', async () => {
  let signal: AbortSignal | undefined;
  vi.stubGlobal('fetch', vi.fn().mockImplementation((_url, options) => {
    if (options?.method !== 'POST') return Promise.resolve(new Response('{"available":true}', { headers: { 'Content-Type': 'application/json' } }));
    signal = options.signal;
    return new Promise((_resolve, reject) => signal!.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
  }));
  const { result, unmount } = renderHook(() => useVoiceNarrator());
  await waitFor(() => expect(result.current.naturalReady).toBe(true));
  let pending: Promise<boolean>;
  act(() => { pending = result.current.speak('Hello'); });
  act(() => result.current.stop());
  let played: boolean | undefined;
  await act(async () => { played = await pending!; });
  expect(signal?.aborted).toBe(true);
  expect(played).toBe(false);
  expect(result.current.speaking).toBe(false);
  unmount();
});
