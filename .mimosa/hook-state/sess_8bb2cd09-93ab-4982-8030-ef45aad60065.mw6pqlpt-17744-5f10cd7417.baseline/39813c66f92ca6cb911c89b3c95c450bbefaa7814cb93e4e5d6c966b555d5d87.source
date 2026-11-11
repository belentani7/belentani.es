'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Chapter } from '@/lib/galaxy-data';

export interface ScrollSectionProps {
  variant: 'hero' | 'journey';
  chapter?: Chapter;
  className?: string;
  children: ReactNode;
}

export function ScrollSection({ variant, chapter, className, children }: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const motion = reduced
    ? 'opacity-100 translate-y-0'
    : visible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-6';

  if (variant === 'journey') {
    return (
      <section
        ref={ref}
        aria-label={chapter ? `Capítulo ${chapter.name}` : undefined}
        className={cn(
          'transition-all duration-slow ease-spring',
          motion,
          className
        )}
      >
        {children}
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={cn(
        'relative flex items-center justify-center transition-all duration-slow ease-spring',
        motion,
        className
      )}
    >
      {children}
    </section>
  );
}
