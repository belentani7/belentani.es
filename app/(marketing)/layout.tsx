'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/design-system/components/Button';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-void/80 backdrop-blur-sm sticky top-0 z-[10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-display font-black text-xl tracking-wider text-white" style={{ textShadow: '0 0 14px rgba(255,7,58,.9)' }}>
              BELENTANI<span className="text-red text-[0.72em] tracking-widest ml-2">Ω</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/artista" className="font-mono text-xs tracking-widest uppercase text-mute hover:text-cyan transition-colors">Artista</Link>
              <Link href="/prensa" className="font-mono text-xs tracking-widest uppercase text-mute hover:text-cyan transition-colors">Prensa</Link>
              <Link href="/musica" className="font-mono text-xs tracking-widest uppercase text-mute hover:text-cyan transition-colors">Música</Link>
              <Link href="/galaxia" className="font-mono text-xs tracking-widest uppercase text-red hover:text-ink transition-colors">Galaxia</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8 px-4 text-center text-mute font-mono text-xs tracking-wider">
        <p>Belentani — São Paulo → Barcelona. Dark pop, R&B, electrónica experimental.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://github.com/belentani7" target="_blank" rel="noopener noreferrer" className="hover:text-red">GitHub</a>
          <a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer" className="hover:text-red">Spotify</a>
          <a href="https://www.youtube.com/@belentani" target="_blank" rel="noopener noreferrer" className="hover:text-red">YouTube</a>
        </div>
      </footer>
    </div>
  );
}