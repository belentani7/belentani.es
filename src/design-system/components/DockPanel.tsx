'use client';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { galaxySystems } from '@/lib/galaxy-data';

interface DockPanelProps {
  systemId: string;
  onAction: (action: string, url?: string) => void;
  onClose: () => void;
}

const PANELS: Record<string, { html: string; actions: { label: string; action: string; variant: 'primary' | 'gold'; external?: boolean }[] }> = {
  nucleo: {
    html: `<p>Esta galaxia es el mapa navegable de Belentani: The Experience. Cada punto es un sistema con funcion propia: obra, era, startup, educacion, consultoria o archivo.</p><p>No son apps rivales. Son orbitas de una trayectoria profesional y artistica curada.</p><blockquote class="my-4 border-l-2 border-red pl-4 italic text-ink">Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en la arena.</blockquote>`,
    actions: [{ label: 'Entrar a Obra', action: 'navigate', variant: 'gold' }],
  },
  judas: {
    html: `<p><b>ERA JUDAS</b> — La obra narrativa central. 6 capítulos: génesis, traición, deuda, redención, biblia música, cognición Qwen.</p><p>Master streaming: −14.0 LUFS · true peak −3.3 dBTP. Stems reales en archivo.</p>`,
    actions: [
      { label: 'Génesis', action: 'chapter', variant: 'primary' },
      { label: 'Traición', action: 'chapter', variant: 'primary' },
      { label: 'Deuda', action: 'chapter', variant: 'primary' },
      { label: 'Redención', action: 'chapter', variant: 'primary' },
      { label: 'Biblia Música', action: 'chapter', variant: 'primary' },
      { label: 'Cognición', action: 'chapter', variant: 'primary' },
    ],
  },
  experience: {
    html: `<p><b>BELENTANI: THE EXPERIENCE</b> — Galaxias, portfolio, Judas Era, mundos 3D y fuentes visuales. La web es exposicion curada, no archivo bruto.</p>`,
    actions: [{ label: 'Saltar al uplink ↗', action: 'external', variant: 'primary', external: true }],
  },
  neon: {
    html: `<p><b>VISUAL RED — JUDAS ERA</b> — Portfolio visual estático: dark pop, R&B, neon. Identidad visual de la era Judas.</p>`,
    actions: [{ label: 'Saltar al uplink ↗', action: 'external', variant: 'primary', external: true }],
  },
  duck: {
    html: `<p><b>ARTISTA DUCK</b> — Productor musical (Aracaju, Brasil). Beats, catálogo, reproductor, Studio OS. Ecosistema separado.</p>`,
    actions: [{ label: 'Saltar al uplink ↗', action: 'external', variant: 'primary', external: true }],
  },
};

export function DockPanel({ systemId, onAction, onClose }: DockPanelProps) {
  const system = galaxySystems.find((s) => s.id === systemId);
  const panel = system ? PANELS[system.panel] : null;
  if (!system || !panel) return null;

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 h-full w-full md:w-[420px] bg-voidElevated/95 backdrop-blur-2xl border-l border-border',
        'z-[20] flex flex-col overflow-hidden transition-transform duration-base',
        'ng-redglass'
      )}
      role="complementary"
      aria-label={`Panel ${system.name}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-1">{system.kind.toUpperCase()} · {system.tag}</p>
          <h2 className="font-display text-xl tracking-tight text-ink">{system.name}</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 border border-border text-red hover:bg-red hover:text-void transition-all" aria-label="Cerrar panel">×</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-mute font-mono text-sm leading-relaxed">{system.blurb}</p>
        <div dangerouslySetInnerHTML={{ __html: panel.html }} />
        <div className="flex flex-wrap gap-2 pt-2">
          {panel.actions.map((a, i) => (
            <Button
              key={i}
              variant={a.variant}
              onClick={() => onAction(a.action, system.url)}
              className="w-full md:w-auto"
            >
              {a.label}
            </Button>
          ))}
        </div>
        {system.kind !== 'artist' && system.kind !== 'duck' && (
          <div className="pt-4 border-t border-border">
            <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">Sistemas cercanos</p>
            <div className="flex flex-wrap gap-2">
              {galaxySystems
                .filter((s) => s.id !== systemId)
                .slice(0, 4)
                .map((n) => (
                  <Button key={n.id} variant="ghost" onClick={() => onAction('navigate', n.id)} className="text-xs">
                    → {n.name}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
