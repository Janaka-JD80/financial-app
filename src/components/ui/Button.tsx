import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../Layout';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500': variant === 'primary',
            'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500': variant === 'secondary',
            'border border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-900 focus:ring-zinc-500': variant === 'outline',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
