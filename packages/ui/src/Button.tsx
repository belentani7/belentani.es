import React from "react"
import { cn } from "@/lib/utils"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive"
export type ButtonSize = "sm" | "md" | "lg" | "icon"

const buttonVariants = [
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:{margin-inline-start:0.5em} [&_svg]:{height:1em} [&_svg]:{width:1em}",
]

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  const base = buttonVariants.join(" ")

  const variants: Record<ButtonVariant, string> = {
    primary: cn(
      "bg-green-core text-bg-void shadow-green hover:bg-green-glow hover:shadow-green-strong",
      "active:scale-95",
    ),
    secondary: cn(
      "bg-bg-elevated text-text-primary hover:bg-bg-panel",
    ),
    outline: cn(
      "border border-border text-text-primary bg-transparent",
      "hover:bg-green-core/10 hover:border-green-core",
    ),
    ghost: cn(
      "text-text-secondary hover:bg-green-core/10 hover:text-green-core",
    ),
    destructive: cn(
      "bg-error text-bg-void hover:bg-error/90",
    ),
  }

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 px-0",
  }

  return cn(base, variants[variant], sizes[size], className)
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      className={buttonClassName(variant, size, className)}
      ref={ref}
      {...props}
    />
  ),
)
Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
