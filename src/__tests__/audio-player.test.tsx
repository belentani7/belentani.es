import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { AudioPlayer } from '../design-system/components/AudioPlayer';

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

test('volume changes preserve the loaded track and playback position', () => {
  const { container, getByLabelText } = render(<AudioPlayer src="/audio-fixture" title="Judas" variant="ambient" />);
  const audio = container.querySelector('audio')!;
  audio.currentTime = 37;
  const calls = vi.mocked(audio.load).mock.calls.length;
  fireEvent.change(getByLabelText('Volumen'), { target: { value: '0.4' } });
  expect(audio.volume).toBe(0.4);
  expect(audio.currentTime).toBe(37);
  expect(audio.load).toHaveBeenCalledTimes(calls);
});

test('rejected playback keeps the player in the stopped state', async () => {
  vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new DOMException('Blocked', 'NotAllowedError'));
  const { getByLabelText, queryByLabelText } = render(<AudioPlayer src="/audio-fixture" title="Judas" variant="ambient" />);
  fireEvent.click(getByLabelText('Reproducir'));
  await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled());
  expect(queryByLabelText('Pausar')).toBeNull();
  expect(getByLabelText('Reproducir')).toBeTruthy();
});
