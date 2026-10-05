import { Orbitron, Rajdhani, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['500', '700', '900'], variable: '--font-orbitron', display: 'swap', preload: true });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-rajdhani', display: 'swap', preload: true });
const shareTechMono = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--font-share-tech-mono', display: 'swap', preload: true });

export const metadata = {
  title: 'Belentani — artista alternativo | música, imagen y universos',
  description: 'Belentani — artista alternativo brasileño-español. Música, imagen y universos interactivos entre dark pop, R&B y electrónica experimental.',
  openGraph: {
    title: 'Belentani — artista alternativo',
    description: 'Música, imagen y mundos interactivos. Una obra alternativa entre dark pop, R&B y electrónica experimental.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Belentani — artista alternativo',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23000'/%3E%3Ctext x='32' y='46' font-size='40' text-anchor='middle' fill='%23ff073a' font-family='monospace'%3E%CE%A9%3C/text%3E%3C/svg%3E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased bg-void text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}