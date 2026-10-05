'use client';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'ghost' | 'chip';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', asChild = false, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-mono text-xs tracking-widest uppercase transition-all duration-base';
    const variants = {
      primary: 'border border-red text-red bg-red/6 hover:bg-red hover:text-void shadow-glowRed',
      gold: 'border border-gold/45 text-gold bg-gold/10 hover:bg-gold/20 hover:border-gold',
      ghost: 'border border-transparent text-mute hover:text-ink hover:bg-voidElevated',
      chip: 'border border-border bg-glass text-mute px-3 py-1.5 hover:border-red hover:text-red',
    };
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';