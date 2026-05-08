'use client';

import {
  Locale,
  NutrientValues,
  ALL_NUTRIENTS,
  NUTRIENT_META,
  NutritionFilter,
  NUTRITION_FILTERS,
  NUTRITION_FILTER_META,
  BodyMetrics,
} from '@/types';
import { t } from '@/lib/i18n';
import Card from '@/components/Card';
import Btn from '@/components/Btn';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import BodyMetricsForm from '@/components/BodyMetricsForm';

type SettingsProps = {
  locale: Locale;
  profileName: string;
  setProfileName: React.Dispatch<React.SetStateAction<string>>;
  setLocale: (l: Locale) => void;
  editTargets: NutrientValues;
  setEditTargets: React.Dispatch<React.SetStateAction<NutrientValues>>;
  nutritionFilters: NutritionFilter[];
  setNutritionFilters: React.Dispatch<React.SetStateAction<NutritionFilter[]>>;
  bodyMetrics: BodyMetrics;
  setBodyMetrics: React.Dispatch<React.SetStateAction<BodyMetrics>>;
  applyComputedTargets: () => void;
  saveSettings: () => void;
};

export default function Settings({
  locale,
  profileName,
  setProfileName,
  setLocale,
  editTargets,
  setEditTargets,
  nutritionFilters,
  setNutritionFilters,
  bodyMetrics,
  setBodyMetrics,
  applyComputedTargets,
  saveSettings,
}: SettingsProps) {

  const toggleFilter = (f: NutritionFilter) => {
    setNutritionFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  return (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">
        {t('settings.title', locale)}
      </h2>

      <Card>
        <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-3">
          {t('settings.profile', locale)}
        </h3>
        <label className="font-body text-[13px] text-bark-200 dark:text-bark-100 block mb-1.5">
          {t('settings.yourName', locale)}
        </label>
        <input
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-600 font-body text-[15px] text-bark-500 dark:text-cream-200 outline-none focus:border-terra-500"
        />
      </Card>

      <Card>
        <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-3">
          {t('settings.language', locale)}
        </h3>
        <LanguageSwitcher locale={locale} setLocale={setLocale} />
      </Card>

      {/* Body metrics calculator */}
      <Card>
        <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-1">
          🧮 {t('body.title', locale)}
        </h3>
        <p className="font-body text-[11px] text-bark-200 dark:text-bark-100 mb-3">
          {t('body.subtitle', locale)}
        </p>
        <BodyMetricsForm
          locale={locale}
          metrics={bodyMetrics}
          setMetrics={setBodyMetrics}
          onApply={applyComputedTargets}
        />
      </Card>

      {/* Nutrition filter prefs */}
      <Card>
        <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-1">
          {t('settings.filters', locale)}
        </h3>
        <p className="font-body text-[11px] text-bark-200 dark:text-bark-100 mb-3">
          {t('settings.filtersHint', locale)}
        </p>
        <div className="flex flex-wrap gap-2">
          {NUTRITION_FILTERS.map(f => {
            const meta = NUTRITION_FILTER_META[f];
            const active = nutritionFilters.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                aria-pressed={active}
                title={t(meta.descKey, locale)}
                className={`px-3.5 py-2 rounded-full font-body text-[13px] font-semibold border transition-all ${
                  active
                    ? 'bg-terra-500 text-white border-terra-500 shadow-md shadow-terra-500/20'
                    : 'bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
                }`}
              >
                {meta.icon} {t(meta.labelKey, locale)}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-1">
          {t('settings.targets', locale)}
        </h3>
        <p className="font-body text-[11px] text-bark-200 dark:text-bark-100 mb-3">
          {t('settings.targetsNote', locale)}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {ALL_NUTRIENTS.map((n) => {
            const meta = NUTRIENT_META[n];
            return (
              <div key={n}>
                <label className="font-body text-[12px] text-bark-200 dark:text-bark-100 block mb-1">
                  {meta.icon} {t(meta.label, locale)} ({meta.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={editTargets[n] === 0 ? '' : editTargets[n]}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setEditTargets((prev) => ({ ...prev, [n]: 0 }));
                      return;
                    }
                    const parsed = parseFloat(value);
                    setEditTargets((prev) => ({
                      ...prev,
                      [n]: Number.isNaN(parsed) ? 0 : Math.max(0, parsed),
                    }));
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-600 font-body text-sm text-bark-500 dark:text-cream-200 outline-none focus:border-terra-500"
                />
              </div>
            );
          })}
        </div>
      </Card>

      <Card highlight>
        <p className="font-body text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          ⚕️ <strong>{t('settings.healthNote', locale)}</strong>
        </p>
      </Card>

      <Btn
        variant="ghost"
        onClick={() => {
          localStorage.removeItem('nourish_onboarded');
          localStorage.removeItem('nourish_version_seen_v22');
          window.location.reload();
        }}
        className="w-full"
      >
        📖 {t('settings.resetOnboarding', locale)}
      </Btn>

      <Btn onClick={saveSettings} className="w-full">
        💾 {t('settings.save', locale)}
      </Btn>
    </div>
  );
}
