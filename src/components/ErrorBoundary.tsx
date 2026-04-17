'use client';

import { Component, ReactNode } from 'react';
import Btn from '@/components/Btn';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-8" style={{ background: 'var(--page-bg)' }}>
          <div className="text-center max-w-[300px]" role="alert">
            <span className="text-5xl block mb-4">😥</span>
            <h2 className="font-display text-xl text-bark-500 dark:text-cream-100 mb-2">
              Something went wrong
            </h2>
            <p className="font-body text-sm text-bark-200 dark:text-bark-100 mb-6">
              {this.props.fallbackMessage || "Don't worry — your data is safe. Try refreshing."}
            </p>
            <Btn onClick={() => window.location.reload()} className="w-full">
              🔄 Refresh
            </Btn>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Wrapper for fetch calls that provides better error messages
 * instead of silent failures or infinite spinners.
 */
export async function safeFetch<T = any>(
  url: string,
  options?: RequestInit,
  defaultValue?: T,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        data: defaultValue || null,
        error: `Server error (${res.status})`,
      };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { data: defaultValue || null, error: 'Request timed out. Check your connection.' };
    }
    return { data: defaultValue || null, error: 'Network error. Are you online?' };
  }
}
