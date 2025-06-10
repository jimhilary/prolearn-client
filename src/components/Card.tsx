//src/components/Card.tsx

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn('p-6 bg-white rounded-2xl shadow-md', className)}>
      {children}
    </div>
  );
}
