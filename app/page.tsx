import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'BELENTANI OS — El universo tiene una puerta',
  description: 'Entra en el ordenador retrofuturista de BELENTANI. Música, mundos, arte y el archivo del artista.',
  alternates: { canonical: '/' },
};

export default function Home() {
  redirect('/artist-os/index.html');
}
