'use client';

import { useState } from 'react';
import { Locale } from '@/types';
import { t, isRTL, LOCALE_LABELS } from '@/lib/i18n';
import Btn from '@/components/Btn';

interface OnboardingProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
  onComplete: () => void;
}

interface Step {
  emoji: string;
  titleKey: string;
  descKey: string;
  highlightColor: string;
}

const STEPS: Step[] = [
  {
    emoji: '🥗',
    titleKey: 'onboarding.welcome.title',
    descKey: 'onboarding.welcome.desc',
    highlightColor: '#D4785C',
  },
  {
    emoji: '🍳',
    titleKey: 'onboarding.plan.title',
    descKey: 'onboarding.plan.desc',
    highlightColor: '#8E44AD',
  },
  {
    emoji: '🛒',
    titleKey: 'onboarding.stock.title',
    descKey: 'onboarding.stock.desc',
    highlightColor: '#4CAF50',
  },
  {
    emoji: '✨',
    titleKey: 'onboarding.suggest.title',
    descKey: 'onboarding.suggest.desc',
    highlightColor: '#FF9800',
  },
];

const LOCALES: Locale[] = ['en', 'fr', 'ar'];
const LOCALE_SHORT: Record<Locale, string> = { en: 'EN', fr: 'FR', ar: 'ع' };

export default function Onboarding({ locale, setLocale, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      localStorage.setItem('nourish_onboarded', '1');
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  const skip = () => {
    localStorage.setItem('nourish_onboarded', '1');
    onComplete();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 relative"
      style={{ background: 'var(--page-bg)', direction: isRTL(locale) ? 'rtl' : 'ltr' }}
      role="dialog"
      aria-label={t('onboarding.welcome.title', locale)}
    >
      {/* ─── Language Selector (top-start) ─── */}
      <div
        className="absolute top-6 start-6 flex gap-1.5 z-10"
        role="group"
        aria-label="Choose language"
      >
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            aria-label={LOCALE_LABELS[l]}
            className={`px-3 py-1.5 rounded-full font-body text-xs font-semibold transition-all border-2 ${
              locale === l
                ? 'bg-terra-500 text-white border-terra-500 shadow-md shadow-terra-500/20'
                : 'bg-transparent text-bark-300 dark:text-bark-100 border-cream-300 dark:border-bark-400 hover:border-terra-500/50'
            }`}
          >
            {LOCALE_SHORT[l]}
          </button>
        ))}
      </div>

      {/* Skip button (top-end) */}
      <button
        onClick={skip}
        className="absolute top-6 end-6 font-body text-sm text-bark-200 dark:text-bark-100 hover:text-terra-500 transition-colors z-10"
        aria-label={t('onboarding.skip', locale)}
      >
        {t('onboarding.skip', locale)}
      </button>

      {/* Content area — re-animates on step OR locale change */}
      <div
        key={`${step}-${locale}`}
        className="flex flex-col items-center text-center max-w-[340px] animate-page"
      >
        {/* Emoji with colored glow */}
        <div
          className="text-7xl mb-6 relative"
          style={{
            filter: `drop-shadow(0 0 30px ${current.highlightColor}33)`,
          }}
        >
          <span className="block" style={{ animation: 'float 3s ease-in-out infinite' }}>
            {current.emoji}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display text-[28px] mb-3 leading-tight"
          style={{ color: current.highlightColor }}
        >
          {t(current.titleKey, locale)}
        </h1>

        {/* Description */}
        <p className="font-body text-[15px] text-bark-300 dark:text-bark-100 leading-relaxed mb-8">
          {t(current.descKey, locale)}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2.5 mb-8" role="tablist" aria-label="Progress">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              role="tab"
              aria-selected={i === step}
              aria-label={`Step ${i + 1}`}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === step ? 28 : 8,
                height: 8,
                background: i === step ? current.highlightColor : '#E0D8CC',
              }}
            />
          ))}
        </div>

        {/* Action button */}
        <Btn onClick={next} className="w-full !py-4 !text-base !rounded-2xl">
          {isLast ? t('onboarding.start', locale) : t('onboarding.next', locale)}
        </Btn>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

/** Check if user has completed onboarding */
export function hasOnboarded(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('nourish_onboarded') === '1';
}
