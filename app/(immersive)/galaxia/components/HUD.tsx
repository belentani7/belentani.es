'use client';
import { useGalaxyMap } from '@/hooks/useGalaxyMap';
import { galaxySystems } from '@/lib/galaxy-data';

interface HUDProps {
  current: string;
  onJump: (id: string) => void;
  onNavigate: (dir: 'next' | 'prev') => void;
}

export function HUD({ current, onJump, onNavigate }: HUDProps) {
  const { allSystems, neighbors } = useGalaxyMap();

  const shortcuts = [
    { id: 'nucleo', label: 'Núcleo' },
    { id: 'judas', label: 'Judas' },
    { id: 'omega', label: 'Omega' },
    { id: 'neon', label: 'Neon' },
    { id: 'duck', label: 'Duck' },
  ];

  return (
    <div className="fixed inset-0 z-[10] pointer-events-none">
      {/* Top Bar */}
      <header className="absolute top-0 left-0 right-0 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-void/92 to-transparent border-b border-border">
        <div className="font-display font-black text-lg tracking-wider text-red" style={{ textShadow: '0 0 14px rgba(255,7,58,.9)' }}>
          BELENTANI<span className="text-red text-[0.72em] tracking-widest ml-2">GALAXIA ÚNICA</span>
        </div>
        <nav className="flex flex-wrap gap-3" aria-label="Atajos de navegación">
          {shortcuts.map((s) => (
            <button
              key={s.id}
              onClick={() => onJump(s.id)}
              disabled={s.id === current}
              className="px-3 py-1.5 border border-border bg-voidElevated/80 text-xs tracking-widest uppercase text-mute hover:text-cyan hover:border-cyan/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Keyboard Legend */}
      <div className="absolute left-4 bottom-4 z-[20] font-mono text-xs tracking-normal text-mute/70 bg-void/55 border border-red/15 p-3 rounded-lg">
        <strong className="text-white block mb-1">Teclado:</strong>
        <span>← →</span> navegar · <span>Enter</span> viajar · <span>Esc</span> volver al núcleo
      </div>

      {/* Universe Switch (mobile) */}
      <div className="fixed left-4 bottom-24 md:hidden z-[20] flex gap-2 p-2 bg-voidElevated/9 border border-border rounded-lg">
        {shortcuts.map((s) => (
          <button
            key={s.id}
            onClick={() => onJump(s.id)}
            className="px-3 py-2 border border-border bg-voidElevated text-xs tracking-widest uppercase text-mute hover:text-white hover:border-red transition-all"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}