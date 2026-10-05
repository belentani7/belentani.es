'use client';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ScrollSectionProps extends HTMLAttributes<HTMLElement> {
  chapter?: { id: string; name: string; lore: string; symbol: string };
  variant?: 'hero' | 'journey' | 'catalog' | 'lore';
}

export const ScrollSection = forwardRef<HTMLElement, ScrollSectionProps>(
  ({ className, chapter, variant = 'journey', children, ...props }, ref) => {
    const variants = {
      hero: 'py-12 lg:py-20 text-center',
      journey: 'max-w-[1120px] mx-auto px-4 py-12 lg:py-20',
      catalog: 'max-w-[1000px] mx-auto px-4 py-10',
      lore: 'max-w-[820px] mx-auto px-4 py-8',
    };

    if (!chapter && !children) return null;

    return (
      <section ref={ref} className={cn(variants[variant], className)} {...props}>
        {chapter && (
          <div className="mb-8">
            <p className="text-gold font-mono text-xs tracking-widest uppercase mb-2">{chapter.symbol} {chapter.id.toUpperCase()}</p>
            <h2 className="font-display text-3xl lg:text-4xl tracking-tight text-ink mb-4">{chapter.name}</h2>
            <p className="text-mute font-mono text-base leading-relaxed max-w-3xl mx-auto">{chapter.lore}</p>
          </div>
        )}
        {children}
      </section>
    );
  }
);
ScrollSection.displayName = 'ScrollSection';