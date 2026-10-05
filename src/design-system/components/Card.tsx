'use client';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'redglass' | 'panel' | 'record';
}

const validHtmlProps = ['id', 'className', 'style', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'data-testid', 'onClick', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyUp', 'tabIndex'];

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', children, ...props }, ref) => {
    const variants = {
      glass: 'border border-border bg-glass backdrop-blur-sm',
      redglass: 'ng-redglass',
      panel: 'border border-border bg-voidElevated/80 backdrop-blur-md',
      record: 'aspect-square border border-border bg-glass backdrop-blur-sm overflow-hidden',
    };

    // Filter out Tailwind class props that aren't valid HTML attributes
    const htmlProps: Record<string, any> = {};
    for (const key of Object.keys(props)) {
      if (validHtmlProps.includes(key) || key.startsWith('data-') || key.startsWith('aria-')) {
        htmlProps[key] = props[key as keyof typeof props];
      }
    }

    return (
      <div ref={ref} className={cn('rounded-lg', variants[variant], className)} {...htmlProps}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';