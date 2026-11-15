import { render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import HomeClient from './home-client';

vi.mock('@/components/voyage/GalaxyVoyage', () => ({
  default: () => <div>Galaxia</div>,
}));
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(cleanup);

test('el manifiesto lleva de la galaxia al lore, la música y el artista', () => {
  render(<HomeClient />);
  expect(screen.getByRole('heading', { name: /human becoming/i })).toBeTruthy();
  expect(screen.getByRole('link', { name: /entrar en el lore/i }).getAttribute('href')).toBe('/lore');
  expect(screen.getByRole('link', { name: /escuchar la obra/i }).getAttribute('href')).toBe('/musica');
  expect(screen.getByRole('link', { name: /conocer al artista/i }).getAttribute('href')).toBe('/artista');
  expect(screen.getByRole('link', { name: /entrar en omega living/i }).getAttribute('href')).toBe('/omega-living.html');
  expect(screen.getByText('Espejo')).toBeTruthy();
  expect(screen.getByText('Llave')).toBeTruthy();
  expect(screen.getByText('Diamante')).toBeTruthy();
});
