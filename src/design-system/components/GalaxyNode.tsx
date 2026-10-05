'use client';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface GalaxyNodeProps extends HTMLAttributes<HTMLDivElement> {
  kind: 'artist' | 'era' | 'duck' | 'warp';
  active?: boolean;
  name: string;
  tag: string;
  color: string;
}

export const GalaxyNode = forwardRef<HTMLDivElement, GalaxyNodeProps>(
  ({ className, kind, active, name, tag, color, children, ...props }, ref) => {
    const base = 'relative group cursor-pointer transition-all duration-base';
    const kindStyles = {
      artist: 'border-gold/50 bg-gold/10',
      era: 'border-red/50 bg-red/10',
      duck: 'border-cyan/50 bg-cyan/10',
      warp: 'border-cyan/50 bg-cyan/10',
    };
    const size = kind === 'artist' ? 'w-20 h-20' : kind === 'era' ? 'w-16 h-16' : 'w-14 h-14';

    return (
      <div
        ref={ref}
        className={cn(base, size, 'rounded-full flex flex-col items-center justify-center border-2', kindStyles[kind], active && 'scale-110 ring-2 ring-inset', className)}
        style={{ '--node-color': color, borderColor: color } as React.CSSProperties}
        {...props}
      >
        <div className="absolute inset-0 rounded-full opacity-20 blur-xl" style={{ background: color }} aria-hidden="true" />
        <span className="relative font-display text-xs lg:text-sm tracking-wider text-ink">{name}</span>
        <span className="relative font-mono text-[8px] tracking-widest uppercase text-gold/80">{tag}</span>
        {active && <div className="absolute -inset-1 rounded-full border-2 animate-ping" style={{ borderColor: color }} aria-hidden="true" />}
        {children}
      </div>
    );
  }
);
GalaxyNode.displayName = 'GalaxyNode';