'use client';
import { useGalaxyMap } from '@/hooks/useGalaxyMap';
import { galaxySystems } from '@/lib/galaxy-data';
import { useJarvisStore } from '@/store/jarvis';
import { cn } from '@/lib/utils';

interface HUDProps {
  current: string;
  onJump: (id: string) => void;
  onNavigate: (dir: 'next' | 'prev') => void;
}

export function HUD({ current, onJump, onNavigate }: HUDProps) {
  const { allSystems, neighbors } = useGalaxyMap();

  const shortcuts = [
    { id: 'belentani', label: 'Núcleo' },
    { id: 'judas', label: 'Judas' },
    { id: 'experience', label: 'Experience' },
    { id: 'neon', label: 'Neon' },
  ];

  return (
    <div className="fixed inset-0 z-[10] pointer-events-none">
      {/* Top Bar */}
      <header className="absolute top-0 left-0 right-0 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/95 to-transparent border-b border-red/40">
        <div className="font-display font-black text-lg tracking-wider text-red" style={{ textShadow: '0 0 14px rgba(255,7,58,.9)' }}>
          BELENTANI<span className="text-red/80 text-[0.72em] tracking-widest ml-2">GALAXIA ÚNICA</span>
        </div>
        <nav className="flex flex-wrap gap-3" aria-label="Atajos de navegación">
          {shortcuts.map((s) => (
            <button
              key={s.id}
              onClick={() => onJump(s.id)}
              disabled={s.id === current}
              className="hud-glass px-3 py-1.5 text-xs tracking-widest uppercase text-red hover:text-white hover:bg-red/20 hover:shadow-[0_0_24px_rgba(255,7,58,.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      {/* JARVIS Summon Button */}
      <div className="absolute right-4 bottom-4 z-[20]">
        <button
          onClick={() => useJarvisStore.getState().toggle()}
          className={cn(
            'flex items-center justify-center gap-2 px-3 py-2',
            'hud-glass text-red','font-display font-bold text-xs tracking-widest uppercase',
            'hover:bg-red hover:text-black hover:shadow-[0_0_28px_rgba(255,7,58,.8)] transition-all',
            'group'
          )}
          aria-label="Summon JARVIS"
        >
          <span className="text-lg" style={{ textShadow: '0 0 8px #ff073a' }}>B</span>
          <span>Jarvis</span>
        </button>
      </div>

      {/* Keyboard Legend */}
      <div className="absolute left-4 bottom-4 z-[20] font-mono text-xs tracking-normal text-red/80 hud-glass p-3 rounded-lg">
        <strong className="text-white block mb-1">Teclado:</strong>
        <span>← →</span> navegar · <span>Enter</span> viajar · <span>Esc</span> volver al núcleo
      </div>

      {/* Universe Switch (mobile) */}
      <div className="fixed left-4 bottom-24 md:hidden z-[20] flex gap-2 p-2 hud-glass rounded-lg">
        {shortcuts.map((s) => (
          <button
            key={s.id}
            onClick={() => onJump(s.id)}
            className="hud-glass px-3 py-2 text-xs tracking-widest uppercase text-red hover:text-white hover:bg-red/20 transition-all"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
