'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { PLATFORM_NAVIGATION, PLATFORM_NAV_UTILITY } from '@/lib/platform-navigation';

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

  // A same-route navigation can leave keyboard focus inside a now-hidden menu.
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    mobileMenuButton.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-black focus:outline focus:outline-offset-2 focus:outline-red"
      >
        Saltar al contenido
      </a>
      <header className="border-b border-border bg-void/80 backdrop-blur-sm sticky top-0 z-[10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            <Link href="/" className="font-serif text-xl font-semibold tracking-[-.04em] text-[#f2eee8]">
              BELENTANI<span className="ml-2 align-middle font-mono text-[.55em] font-medium tracking-[.13em] text-[#c6a789]">THE EXPERIENCE</span>
            </Link>
            <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-4 xl:gap-6">
              {PLATFORM_NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex flex-col leading-none transition-colors ${item.href === '/galaxia' ? 'text-red hover:text-ink' : 'text-mute hover:text-cyan'}`}
                >
                  <span aria-hidden="true" className="font-mono text-[.5rem] tracking-[.2em] opacity-60 group-hover:opacity-100">
                    {item.index}
                  </span>
                  <span className="mt-1 font-mono text-xs uppercase tracking-widest">{item.label}</span>
                </Link>
              ))}
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
          <nav aria-label="Satélites del universo" className="hidden lg:flex items-center justify-end gap-5 border-t border-border/60 py-2">
            {PLATFORM_NAV_UTILITY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[.58rem] uppercase tracking-[.22em] text-mute/70 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <nav
            id="belentani-mobile-nav"
            aria-label="Navegación móvil"
            hidden={!mobileMenuOpen}
            className={`${mobileMenuOpen ? 'flex' : 'hidden'} flex-col gap-1 border-t border-border pb-4 pt-3 md:hidden`}
          >
            {PLATFORM_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                onClick={closeMobileMenu}
                href={item.href}
                className={`flex items-baseline gap-3 rounded-md px-3 py-3 font-mono text-sm uppercase tracking-widest hover:bg-white/5 hover:text-white focus-visible:outline-red ${item.href === '/galaxia' ? 'text-red' : 'text-mute'}`}
              >
                <span aria-hidden="true" className="text-[.6rem] opacity-60">{item.index}</span>
                {item.label}
              </Link>
            ))}
            <p className="mt-3 px-3 font-mono text-[.55rem] uppercase tracking-[.28em] text-mute/60">Satélites</p>
            {PLATFORM_NAV_UTILITY.map((item) => (
              <Link
                key={item.href}
                onClick={closeMobileMenu}
                href={item.href}
                className="rounded-md px-3 py-2 font-mono text-[.7rem] uppercase tracking-[.2em] text-mute/80 hover:bg-white/5 hover:text-white focus-visible:outline-red"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div id="contenido" tabIndex={-1} className="flex-1">{children}</div>
      <footer className="border-t border-border py-10 px-4 text-center text-mute font-mono text-xs tracking-wider">
        <nav aria-label="Enlaces rápidos" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {PLATFORM_NAVIGATION.filter((item) => item.href !== '/').map((item) => (
            <Link key={item.href} href={item.href} className="uppercase tracking-[.2em] hover:text-red">
              {item.label}
            </Link>
          ))}
          <Link href="/studio-creativo" className="uppercase tracking-[.2em] hover:text-red">Estudio ↗</Link>
        </nav>
        <p className="mt-6">Belentani — São Paulo → Barcelona. Dark pop, R&amp;B, electrónica experimental.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://github.com/belentani7" target="_blank" rel="noopener noreferrer" className="hover:text-red">GitHub</a>
          <a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer" className="hover:text-red">Spotify</a>
          <a href="https://www.youtube.com/@belentani" target="_blank" rel="noopener noreferrer" className="hover:text-red">YouTube</a>
          <a href="https://www.instagram.com/belentani_/" target="_blank" rel="noopener noreferrer" className="hover:text-red">Instagram</a>
        </div>
      </footer>
    </div>
  );
}
