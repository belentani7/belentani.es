'use client';
import { cn } from '@/lib/utils';

export interface GalaxyNodeProps {
  kind: 'artist' | 'era' | 'duck' | 'warp';
  active: boolean;
  name: string;
  tag: string;
  color: string;
  onClick: () => void;
}

const KIND_MARK: Record<GalaxyNodeProps['kind'], string> = {
  artist: '◆',
  era: '✦',
  duck: '◈',
  warp: '✧',
};

export function GalaxyNode({ kind, active, name, tag, color, onClick }: GalaxyNodeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${name} — ${tag}`}
      aria-pressed={active}
      className={cn(
        'group flex flex-col items-center gap-1 select-none whitespace-nowrap',
        'transition-transform duration-fast',
        active ? 'scale-110' : 'hover:scale-110'
      )}
      style={{ color }}
    >
      <span
        className="flex items-center justify-center font-display leading-none"
        style={{
          fontSize: active ? 22 : 16,
          textShadow: `0 0 ${active ? 18 : 10}px ${color}`,
        }}
      >
        {KIND_MARK[kind]}
      </span>
      <span
        className={cn(
          'font-display font-bold text-[10px] tracking-widest uppercase',
          active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
        )}
        style={{ textShadow: `0 0 10px ${color}` }}
      >
        {name}
      </span>
      <span className="font-mono text-[7px] tracking-widest uppercase opacity-60">{tag}</span>
      {active && (
        <span
          className="mt-0.5 h-px w-8"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          aria-hidden
        />
      )}
    </button>
  );
}
