/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';
import MarketingLayout from '../app/(marketing)/layout';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) =>
    <a href={href} {...rest}>{children}</a>,
}));

afterEach(cleanup);

describe('cabecera de la web del artista en móvil', () => {
  it('abre un menú navegable, mantiene las rutas correctas y se cierra al elegir una', () => {
    render(<MarketingLayout><p>Contenido de prueba</p></MarketingLayout>);
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Cerrar menú' }).getAttribute('aria-expanded')).toBe('true');

    const nav = screen.getByRole('navigation', { name: 'Navegación móvil' });
    const expected = [
      ['Judas Era', '/judas-era'],
      ['Artista', '/artista'],
      ['Prensa', '/prensa'],
      ['Música', '/musica'],
      ['Galaxia', '/galaxia'],
    ] as const;
    for (const [label, destination] of expected) {
      expect(within(nav).getByRole('link', { name: label }).getAttribute('href')).toBe(destination);
    }

    fireEvent.click(within(nav).getByRole('link', { name: 'Música' }));
    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Abrir menú' }).getAttribute('aria-expanded')).toBe('false');
  });
  it('cierra con Escape y devuelve el foco al botón del menú', () => {
    render(<MarketingLayout><p>Contenido de prueba</p></MarketingLayout>);
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    toggle.focus();
    fireEvent.click(toggle);
    expect(screen.getByRole('navigation', { name: 'Navegación móvil' })).not.toBeNull();

    const currentToggle = screen.getByRole('button', { name: 'Cerrar menú' });
    currentToggle.blur();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

});
