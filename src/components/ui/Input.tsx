'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const inputId = id || props.name

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500',
                        error
                            ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                            : 'border-gray-200 dark:border-gray-700',
                        className
                    )}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
