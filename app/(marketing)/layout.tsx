'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        mobileMenuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-void/80 backdrop-blur-sm sticky top-0 z-[10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-display font-black text-xl tracking-wider text-white" style={{ textShadow: '0 0 14px rgba(255,7,58,.9)' }}>
              BELENTANI<span className="text-red text-[0.72em] tracking-widest ml-2">THE EXPERIENCE</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/judas-era" className="font-mono text-xs tracking-widest uppercase text-mute hover:text-cyan transition-colors">Judas Era</Link>
              <Link href="/artista" className="font-mono text-xs tracking-widest uppercase text-mute hover:text-cyan transition-colors">Artista</Link>
              <Link href="/prensa" className="font-mono text-xs tracking-widest uppercase text-mute hover:text-cyan transition-colors">Prensa</Link>
              <Link href="/musica" className="font-mono text-xs tracking-widest uppercase text-mute hover:text-cyan transition-colors">Música</Link>
              <Link href="/galaxia" className="font-mono text-xs tracking-widest uppercase text-red hover:text-ink transition-colors">Galaxia</Link>
            </nav>
            <button
              ref={mobileMenuButton}
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-xs uppercase tracking-widest text-white hover:border-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red md:hidden"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              aria-controls="belentani-mobile-nav"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">{mobileMenuOpen ? '×' : '☰'}</span>
              Menú
            </button>
          </div>
          <nav
            id="belentani-mobile-nav"
            aria-label="Navegación móvil"
            hidden={!mobileMenuOpen}
            className={`${mobileMenuOpen ? 'flex' : 'hidden'} flex-col gap-1 border-t border-border pb-4 pt-3 md:hidden`}
          >
              <Link onClick={() => setMobileMenuOpen(false)} href="/judas-era" className="rounded-md px-3 py-3 font-mono text-sm uppercase tracking-widest text-mute hover:bg-white/5 hover:text-white focus-visible:outline-red">Judas Era</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/artista" className="rounded-md px-3 py-3 font-mono text-sm uppercase tracking-widest text-mute hover:bg-white/5 hover:text-white focus-visible:outline-red">Artista</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/prensa" className="rounded-md px-3 py-3 font-mono text-sm uppercase tracking-widest text-mute hover:bg-white/5 hover:text-white focus-visible:outline-red">Prensa</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/musica" className="rounded-md px-3 py-3 font-mono text-sm uppercase tracking-widest text-mute hover:bg-white/5 hover:text-white focus-visible:outline-red">Música</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/galaxia" className="rounded-md px-3 py-3 font-mono text-sm uppercase tracking-widest text-red hover:bg-white/5 hover:text-white focus-visible:outline-red">Galaxia</Link>
          </nav>
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
