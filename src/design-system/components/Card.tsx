'use client';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'redglass' | 'goldglass' | 'plain';
}

const VARIANTS: Record<NonNullable<CardProps['variant']>, string> = {
  redglass: 'border ng-redglass',
  goldglass: 'border ng-goldglass',
  plain: 'border border-border bg-voidElevated/60',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({ variant = 'redglass', className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-lg', VARIANTS[variant], className)} {...props} />
));
Card.displayName = 'Card';
