import React from 'react'
import { cn } from '../../lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-gaming-border bg-gaming-card px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gaming-bg disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }