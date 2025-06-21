//src/components/Card.tsx

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn('p-6 bg-white rounded-2xl shadow-md cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
