 // src/components/Button.tsx

import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large'; // ← ADD THIS
};

export default function Button({
  className,
  variant = 'primary',
  size = 'medium', // ← ADD DEFAULT
  ...props
}: ButtonProps) {
  // Choose padding/text size based on "size" prop
  const sizeClass =
    size === 'small'
      ? 'px-3 py-1 text-sm'
      : size === 'large'
      ? 'px-6 py-3 text-lg'
      : 'px-4 py-2';

  return (
    <button
      {...props}
      className={cn(
        sizeClass,
        'rounded-xl font-semibold transition-colors duration-200',
        variant === 'primary'
          ? 'bg-primary text-white hover:bg-orange-500'
          : 'bg-secondary text-white hover:bg-blue-700',
        className
      )}
    />
  );
}
