'use client';
import { Locale } from '@/types';
import { LOCALE_LABELS } from '@/lib/i18n';

interface Props {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LOCALES: Locale[] = ['en', 'ar', 'fr'];

export default function LanguageSwitcher({ locale, setLocale }: Props) {
  return (
    <div className="flex gap-2">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-4 py-2.5 rounded-xl text-sm font-body font-semibold transition-all duration-200 border
            ${l === locale
              ? 'bg-terra-500 text-white border-terra-500 shadow-md shadow-terra-500/20'
              : 'bg-cream-200 dark:bg-bark-400 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
            }`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
