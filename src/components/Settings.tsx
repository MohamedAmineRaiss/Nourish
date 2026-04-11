'use client';

import {
  Locale,
  NutrientValues,
  ALL_NUTRIENTS,
  NUTRIENT_META,
} from '@/types';
import { t } from '@/lib/i18n';
import Card from '@/components/Card';
import Btn from '@/components/Btn';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type SettingsProps = {
  locale: Locale;
  profileName: string;
  setProfileName: React.Dispatch<React.SetStateAction<string>>;
  setLocale: (l: Locale) => void;
  editTargets: NutrientValues;
  setEditTargets: React.Dispatch<React.SetStateAction<NutrientValues>>;
  saveSettings: () => void;
};

export default function Settings({
  locale,
  profileName,
  setProfileName,
  setLocale,
  editTargets,
  setEditTargets,
  saveSettings,
}: SettingsProps) {
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
                      setEditTargets((prev) => ({
                        ...prev,
                        [n]: 0,
                      }));
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

      <Btn onClick={saveSettings} className="w-full">
        💾 {t('settings.save', locale)}
      </Btn>
    </div>
  );
}
