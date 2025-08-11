import React from 'react'
import { cn } from '../../lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            'flex h-10 w-full appearance-none rounded-lg border border-gaming-border bg-gaming-card px-3 py-2 pr-10 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gaming-bg disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-gaming-card text-text-primary">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-text-secondary pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }