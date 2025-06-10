

import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'px-4 py-2 rounded-xl font-semibold transition-colors duration-200',
        variant === 'primary'
          ? 'bg-primary text-white hover:bg-orange-500'
          : 'bg-secondary text-white hover:bg-blue-700',
        className
      )}
    />
  );
}
