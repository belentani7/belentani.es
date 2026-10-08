import { Orbitron, Rajdhani, Share_Tech_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['500', '700', '900'], variable: '--font-orbitron', display: 'swap', preload: true });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-rajdhani', display: 'swap', preload: true });
const shareTechMono = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--font-share-tech-mono', display: 'swap', preload: true });

export const metadata: Metadata = {
  metadataBase: new URL('https://belentani.es'),
  title: 'Belentani: The Experience | musica, imagen, galaxias y sistemas',
  description: 'Belentani: The Experience. Judas Era, musica, narrativa y galaxias interactivas. Artista y compositor de Sao Paulo, basado en Barcelona.',
  alternates: { canonical: '/' },
  authors: [{ name: 'Belentani' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Belentani: The Experience',
    description: 'Judas Era: musica, imagen y galaxias interactivas de Belentani.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Belentani: The Experience',
    url: 'https://belentani.es',
  },
};

const musicGroupSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Belentani',
  url: 'https://belentani.es',
  description: 'Artista y compositor de pop alternativo, R&B y electrónica experimental.',
  genre: ['Pop alternativo', 'R&B', 'Electrónica experimental'],
  sameAs: [
    'https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl',
    'https://www.youtube.com/@belentani',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23000'/%3E%3Ctext x='32' y='43' font-size='30' text-anchor='middle' fill='%23ff073a' font-family='monospace'%3EB%3C/text%3E%3C/svg%3E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
