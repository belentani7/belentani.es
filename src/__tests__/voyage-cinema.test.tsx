import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import VoyageCinema from '../components/voyage/VoyageCinema';

vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => false }));
vi.mock('@/hooks/useVoiceNarrator', () => ({
  useVoiceNarrator: () => ({ speak: vi.fn().mockResolvedValue(false), stop: vi.fn() }),
}));
afterEach(() => { cleanup(); vi.useRealTimers(); window.history.replaceState({}, '', '/'); });

test('starts inside the original world, with the console and navigation labels closed', () => {
  const { container } = render(<VoyageCinema />);
  expect(container.querySelector('iframe')?.getAttribute('src')).toContain('viaje3d');
  expect(screen.queryByRole('textbox')).toBeNull();
  expect(screen.queryByRole('log')).toBeNull();
  expect(screen.queryByText(/PAUSA/)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Máquina' }));
  expect(screen.getByRole('textbox', { name: 'Comando de la máquina' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Cerrar máquina' }));
  expect(screen.queryByRole('textbox')).toBeNull();
});

test('does not replace the world on a shell timer, and stops explicit orbit when interacting', () => {
  vi.useFakeTimers();
  const { container } = render(<VoyageCinema />);
  const initial = container.querySelector('iframe')?.getAttribute('src');
  act(() => vi.advanceTimersByTime(33000));
  expect(container.querySelector('iframe')?.getAttribute('src')).toBe(initial);
  fireEvent.click(screen.getByRole('button', { name: 'Máquina' }));
  fireEvent.click(screen.getByRole('button', { name: 'Continuar viaje' }));
  fireEvent.focus(container.querySelector('iframe')!);
  act(() => vi.advanceTimersByTime(33000));
  expect(container.querySelector('iframe')?.getAttribute('src')).toBe(initial);
});
