'use client';
import { Locale } from '@/types';
import { t } from '@/lib/i18n';

interface Props {
  page: string;
  setPage: (p: string) => void;
  locale: Locale;
}

const tabs = [
  { id: 'dashboard', icon: '🏠', labelKey: 'nav.home' },
  { id: 'plan', icon: '🍳', labelKey: 'nav.plan' },
  { id: 'stock', icon: '🛒', labelKey: 'nav.stock' },
  { id: 'suggest', icon: '✨', labelKey: 'nav.suggest' },
  { id: 'settings', icon: '⚙️', labelKey: 'nav.settings' },
];

export default function BottomNav({ page, setPage, locale }: Props) {
  // Map sub-pages to their parent tab
  const activeTab = ['suggestions', 'planned'].includes(page) ? 'plan'
    : ['tracker', 'weekly'].includes(page) ? 'dashboard'
    : page;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-bark-700/95 backdrop-blur-lg border-t border-cream-300 dark:border-bark-400 safe-area-bottom">
      <div className="max-w-[520px] mx-auto flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'text-terra-500 scale-105'
                : 'text-bark-200 dark:text-bark-100'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="font-body text-[10px] font-semibold">{t(tab.labelKey, locale)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
