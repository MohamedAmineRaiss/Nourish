'use client';
import { ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  className?: string;
}

export default function Btn({ children, onClick, variant = 'primary', disabled, className = '' }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl font-body font-semibold text-sm transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variants: Record<string, string> = {
    primary: 'bg-terra-500 text-white shadow-md shadow-terra-500/30 hover:bg-terra-600 px-6 py-3',
    secondary: 'bg-cream-200 dark:bg-bark-400 text-bark-500 dark:text-cream-200 shadow-sm px-6 py-3',
    ghost: 'bg-transparent text-terra-500 px-4 py-2',
    danger: 'bg-red-500 text-white shadow-md shadow-red-500/30 hover:bg-red-600 px-6 py-3',
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
