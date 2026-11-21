'use client';
import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode, isValidElement, cloneElement } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'gold';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant;
  asChild?: boolean;
  children?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-red text-void border border-red font-display font-bold tracking-widest uppercase hover:shadow-glowRed hover:brightness-110',
  gold: 'bg-transparent text-gold border border-gold/60 font-display font-bold tracking-widest uppercase hover:bg-gold hover:text-void hover:shadow-glowGold',
  ghost:
    'bg-transparent text-mute border border-border font-mono tracking-wider hover:text-red hover:border-red/60',
};

const BASE =
  'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm transition-all duration-fast disabled:opacity-50 disabled:pointer-events-none';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', asChild = false, className, children, disabled, onClick, type, ...rest }, ref) => {
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<
        ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
      >;
      const childClass = child.props?.className ?? '';
      return cloneElement(child, {
        ...rest,
        className: cn(BASE, VARIANTS[variant], className, childClass),
      });
    }

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        disabled={disabled}
        onClick={onClick}
        className={cn(BASE, VARIANTS[variant], className)}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
