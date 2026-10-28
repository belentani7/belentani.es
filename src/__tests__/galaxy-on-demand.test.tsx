import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import GalaxyVoyage from '../components/voyage/GalaxyVoyage';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<{ href: string }>) =>
    React.createElement('a', { href, ...props }, children),
}));
vi.mock('next/dynamic', () => ({
  default: () => function MockVoyageMap() {
    return React.createElement('div', { 'data-testid': 'webgl-map-mounted' });
  },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('GPU-safe interactive galaxy homepage', () => {
  it('lets visitors navigate without WebGL and mounts the atlas only after opt-in', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation((kind) => kind === '2d' ? null : ({
        getExtension: () => ({ loseContext: () => undefined }),
      } as never));

    render(<GalaxyVoyage />);
    const toggle = screen.getByRole('button', { name: /explorar en 3d/i });
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(screen.queryByTestId('webgl-map-mounted')).toBeNull();

    const destinations = screen.getByRole('navigation', { name: /sistemas de la galaxia/i })
      .querySelectorAll('button');
    expect(destinations.length).toBeGreaterThan(1);
    fireEvent.click(destinations[1]);
    expect(destinations[1].getAttribute('aria-pressed')).toBe('true');
    expect(screen.queryByTestId('webgl-map-mounted')).toBeNull();

    fireEvent.click(toggle);
    expect(screen.getByTestId('webgl-map-mounted')).toBeTruthy();
    expect(screen.getByRole('button', { name: /volver a modo ligero/i }).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: /volver a modo ligero/i }));
    expect(screen.queryByTestId('webgl-map-mounted')).toBeNull();
  });

  it('keeps all destinations usable if WebGL is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    render(<GalaxyVoyage />);
    fireEvent.click(screen.getByRole('button', { name: /explorar en 3d/i }));
    expect(screen.getByText(/Este navegador no ofrece WebGL/)).toBeTruthy();
    expect(screen.queryByTestId('webgl-map-mounted')).toBeNull();
  });
});
