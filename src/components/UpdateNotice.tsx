'use client';

import { useEffect, useState } from 'react';
import { Locale } from '@/types';
import { t, isRTL } from '@/lib/i18n';
import Btn from '@/components/Btn';

const STORAGE_KEY = 'nourish_version_seen_v22';

export function shouldShowUpdateNotice(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) !== '1';
}

export function markUpdateNoticeSeen() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, '1');
}

type Props = {
  locale: Locale;
  onDismiss: () => void;
};

export default function UpdateNotice({ locale, onDismiss }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleDismiss = () => {
    markUpdateNoticeSeen();
    onDismiss();
  };

  const items = [
    { icon: '🇲🇦', titleKey: 'update.foodsTitle', descKey: 'update.foodsDesc' },
    { icon: '🎯', titleKey: 'update.filtersTitle', descKey: 'update.filtersDesc' },
    { icon: '🧮', titleKey: 'update.calculatorTitle', descKey: 'update.calculatorDesc' },
  ];

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-toast"
      role="dialog"
      aria-modal="true"
      aria-label={t('update.title', locale)}
      style={{ direction: isRTL(locale) ? 'rtl' : 'ltr' }}
    >
      <div className="bg-white dark:bg-bark-600 rounded-t-3xl sm:rounded-3xl w-full max-w-[520px] max-h-[92vh] overflow-y-auto">
        <div className="px-5 py-5">
          <div className="text-center mb-4">
            <span className="text-4xl block mb-2">✨</span>
            <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">
              {t('update.title', locale)}
            </h2>
            <p className="font-body text-[13px] text-bark-200 dark:text-bark-100 mt-1.5">
              {t('update.intro', locale)}
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-5">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-2xl bg-cream-100 dark:bg-bark-500 border border-cream-300 dark:border-bark-400"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-0.5">
                    {t(item.titleKey, locale)}
                  </h3>
                  <p className="font-body text-[12px] text-bark-200 dark:text-bark-100 leading-relaxed">
                    {t(item.descKey, locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Btn onClick={handleDismiss} className="w-full !py-3.5 !text-base !rounded-2xl">
            {t('update.gotIt', locale)}
          </Btn>
        </div>
      </div>
    </div>
  );
}
