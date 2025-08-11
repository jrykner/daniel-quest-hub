import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-gaming font-medium ring-offset-gaming-bg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-gradient-cyan text-gaming-bg hover:shadow-lg hover:shadow-primary-400/25 hover:animate-glow active:scale-95',
        secondary: 'bg-gaming-card text-text-primary border border-gaming-border hover:bg-gaming-border hover:shadow-lg hover:shadow-primary-400/10 active:scale-95',
        destructive: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 active:scale-95',
        outline: 'border border-primary-400 text-primary-400 bg-transparent hover:bg-primary-400 hover:text-gaming-bg hover:shadow-lg hover:shadow-primary-400/25 active:scale-95',
        ghost: 'text-text-primary hover:bg-gaming-card hover:text-primary-400 active:scale-95',
        link: 'text-primary-400 underline-offset-4 hover:underline active:scale-95',
        gaming: 'bg-gradient-accent text-white hover:shadow-lg hover:shadow-accent-400/25 hover:animate-glow active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full hover:before:animate-pulse',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 rounded-lg px-8',
        xl: 'h-14 rounded-xl px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }