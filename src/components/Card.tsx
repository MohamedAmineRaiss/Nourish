'use client';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  highlight?: boolean;
}

export default function Card({ children, className = '', onClick, highlight }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl px-5 py-5
        border transition-all duration-200
        ${highlight
          ? 'bg-amber-50/60 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-800/30'
          : 'bg-white dark:bg-bark-600 border-cream-300 dark:border-bark-400'
        }
        shadow-sm hover:shadow-md
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
