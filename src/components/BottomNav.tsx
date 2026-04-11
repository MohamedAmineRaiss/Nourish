'use client';
import { t } from '@/lib/i18n';
import type { Locale } from '@/types';

interface Props {
  page: string;
  setPage: (p: string) => void;
  locale: Locale;
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', labelKey: 'nav.home' },
  { id: 'plan', icon: '🍳', labelKey: 'nav.plan', aliases: ['suggestions', 'planned'] },
  { id: 'tracker', icon: '📊', labelKey: 'nav.track' },
  { id: 'settings', icon: '⚙️', labelKey: 'nav.settings' },
];

export default function BottomNav({ page, setPage, locale }: Props) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-bark-700 border-t border-cream-300 dark:border-bark-400 flex justify-around items-end pb-5 pt-2 max-w-[520px] mx-auto safe-area-bottom">
      {NAV_ITEMS.map((item) => {
        const isActive = page === item.id || (item.aliases?.includes(page));
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className="flex flex-col items-center gap-0.5 px-4 py-1 bg-transparent border-none"
          >
            <span
              className="text-[22px] transition-all duration-200"
              style={{ filter: isActive ? 'none' : 'grayscale(0.8) opacity(0.45)' }}
            >
              {item.icon}
            </span>
            <span className={`text-[11px] font-body transition-colors duration-200 ${
              isActive ? 'font-bold text-terra-500 dark:text-terra-400' : 'font-medium text-bark-100 dark:text-bark-100'
            }`}>
              {t(item.labelKey, locale)}
            </span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-terra-500 dark:bg-terra-400 mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
