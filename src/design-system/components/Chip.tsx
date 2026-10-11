'use client';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'soft' | 'solid' | 'outline';
}

const VARIANTS: Record<NonNullable<ChipProps['variant']>, string> = {
  soft: 'bg-red/12 text-red border border-red/30',
  solid: 'bg-red text-void border border-red',
  outline: 'bg-transparent text-mute border border-border',
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(({ variant = 'soft', className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 rounded-full font-mono uppercase tracking-widest leading-none',
      VARIANTS[variant],
      className
    )}
    {...props}
  />
));
Chip.displayName = 'Chip';
