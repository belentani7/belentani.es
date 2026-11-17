import type { Metadata } from 'next';
import HomeClient from '../home-client';

export const metadata: Metadata = {
  title: 'BELENTANI — Atlas original',
  description: 'La experiencia galáctica original sigue disponible en su propia ruta.',
  alternates: { canonical: '/atlas' },
};

export default function AtlasPage() {
  return <HomeClient />;
}
