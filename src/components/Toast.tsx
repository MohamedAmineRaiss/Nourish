'use client';

interface Props {
  message: string | null;
}

export default function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-bark-600 px-6 py-3 rounded-2xl shadow-xl border border-cream-300 dark:border-bark-400 font-body text-sm font-semibold text-bark-500 dark:text-cream-200 animate-toast">
      {message}
    </div>
  );
}
