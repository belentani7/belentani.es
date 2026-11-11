import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';


export const metadata: Metadata = {
  metadataBase: new URL('https://belentani.es'),
  title: 'BELENTANI | Música, arte y universo JUDAS',
  description: 'BELENTANI, artista y compositor de São Paulo afincado en Barcelona. Música, pop alternativo, R&B, electrónica experimental y el universo narrativo JUDAS.',
  authors: [{ name: 'Belentani' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Belentani: The Experience',
    description: 'Judas Era: musica, imagen y galaxias interactivas de Belentani.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Belentani: The Experience',
    images: [{ url: '/media/artist/pedro-2024-portrait.jpg', alt: 'Retrato artístico de BELENTANI' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/media/artist/pedro-2024-portrait.jpg'],
  },
};

const musicGroupSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Belentani',
  url: 'https://belentani.es',
  description: 'Artista y compositor de pop alternativo, R&B y electrónica experimental.',
  genre: ['Pop alternativo', 'R&B', 'Electrónica experimental'],
  image: 'https://belentani.es/media/artist/pedro-2024-portrait.jpg',
  sameAs: [
    'https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl',
    'https://www.youtube.com/@belentani',
    'https://www.instagram.com/belentani_/',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23000'/%3E%3Ctext x='32' y='43' font-size='30' text-anchor='middle' fill='%23ff073a' font-family='monospace'%3EB%3C/text%3E%3C/svg%3E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Keep the original three typefaces. Loading at runtime avoids a known intermittent next/font build failure. */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupSchema) }}
        />
      </head>
      <body className="font-body antialiased bg-void text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
