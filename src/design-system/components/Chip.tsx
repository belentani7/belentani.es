'use client';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'action' | 'soft' | 'progress';
  progress?: number;
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant = 'default', progress, children, ...props }, ref) => {
    const base = 'inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase';
    const variants = {
      default: 'border border-border bg-glass px-3 py-1 text-mute',
      action: 'border-0 border-b border-cyan/35 bg-transparent text-cyan px-1 pb-0.5',
      soft: 'border border-gold/22 bg-gold/5 text-mute px-2.5 py-1',
      progress: 'relative border border-border bg-voidElevated px-3 py-1 text-mute overflow-hidden',
    };
    return (
      <span ref={ref} className={cn(base, variants[variant], className)} {...props}>
        {children}
        {variant === 'progress' && progress !== undefined && (
          <span className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blood to-red" style={{ width: `${progress}%` }} />
        )}
      </span>
    );
  }
);
Chip.displayName = 'Chip';