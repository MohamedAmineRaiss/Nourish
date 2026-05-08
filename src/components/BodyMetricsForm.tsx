'use client';

import { useMemo } from 'react';
import {
  Locale, BodyMetrics, Sex, ActivityLevel, Goal,
  ACTIVITY_LEVELS, GOALS, NUTRIENT_META, PRIORITY_NUTRIENTS,
} from '@/types';
import { t } from '@/lib/i18n';
import { bmr, tdee, computeTargets, hasCompleteMetrics } from '@/lib/nutritionCalculator';
import Btn from '@/components/Btn';

type Props = {
  locale: Locale;
  metrics: BodyMetrics;
  setMetrics: (m: BodyMetrics) => void;
  onApply: () => void;
};

export default function BodyMetricsForm({ locale, metrics, setMetrics, onApply }: Props) {
  const calc = useMemo(() => {
    if (!hasCompleteMetrics(metrics)) return null;
    return {
      bmr: bmr(metrics),
      tdee: tdee(metrics),
      targets: computeTargets(metrics),
    };
  }, [metrics]);

  const update = <K extends keyof BodyMetrics>(key: K, val: BodyMetrics[K]) => {
    setMetrics({ ...metrics, [key]: val });
  };

  const numInput = (key: 'weight_kg' | 'height_cm' | 'age', label: string, step: string = '1') => (
    <div>
      <label className="font-body text-[12px] text-bark-200 dark:text-bark-100 block mb-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step={step}
        value={metrics[key] ?? ''}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '') { update(key, undefined); return; }
          const n = parseFloat(v);
          update(key, isNaN(n) ? undefined : Math.max(0, n));
        }}
        className="w-full px-3 py-2.5 rounded-lg border-2 border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-600 font-body text-sm text-bark-500 dark:text-cream-200 outline-none focus:border-terra-500"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Numeric inputs */}
      <div className="grid grid-cols-3 gap-2">
        {numInput('weight_kg', t('body.weight', locale), '0.1')}
        {numInput('height_cm', t('body.height', locale), '1')}
        {numInput('age', t('body.age', locale), '1')}
      </div>

      {/* Sex */}
      <div>
        <label className="font-body text-[12px] text-bark-200 dark:text-bark-100 block mb-1.5">
          {t('body.sex', locale)}
        </label>
        <div className="flex gap-2">
          {(['female', 'male'] as Sex[]).map(s => (
            <button
              key={s}
              onClick={() => update('sex', s)}
              aria-pressed={metrics.sex === s}
              className={`flex-1 py-2 rounded-xl font-body text-sm font-semibold border-2 transition-all ${
                metrics.sex === s
                  ? 'bg-terra-500 text-white border-terra-500'
                  : 'bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
              }`}
            >
              {t(`body.${s}`, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div>
        <label className="font-body text-[12px] text-bark-200 dark:text-bark-100 block mb-1.5">
          {t('body.activity', locale)}
        </label>
        <div className="flex flex-col gap-1.5">
          {ACTIVITY_LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => update('activity_level', lvl)}
              aria-pressed={metrics.activity_level === lvl}
              className={`text-start px-3 py-2 rounded-lg font-body border transition-all ${
                metrics.activity_level === lvl
                  ? 'bg-terra-500 text-white border-terra-500'
                  : 'bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
              }`}
            >
              <div className="text-sm font-semibold">{t(`activity.${lvl}`, locale)}</div>
              <div className={`text-[11px] ${metrics.activity_level === lvl ? 'text-white/80' : 'text-bark-200 dark:text-bark-100'}`}>
                {t(`activity.${lvl}Desc`, locale)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <label className="font-body text-[12px] text-bark-200 dark:text-bark-100 block mb-1.5">
          {t('body.goal', locale)}
        </label>
        <div className="flex gap-2">
          {GOALS.map(g => (
            <button
              key={g}
              onClick={() => update('goal', g)}
              aria-pressed={metrics.goal === g}
              className={`flex-1 px-2 py-2.5 rounded-xl font-body border-2 transition-all ${
                metrics.goal === g
                  ? 'bg-terra-500 text-white border-terra-500'
                  : 'bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
              }`}
            >
              <div className="text-xs font-semibold">{t(`goal.${g}`, locale)}</div>
              <div className={`text-[10px] ${metrics.goal === g ? 'text-white/80' : 'text-bark-200 dark:text-bark-100'}`}>
                {t(`goal.${g}Desc`, locale)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live preview */}
      {!calc && (
        <p className="font-body text-[12px] text-bark-200 dark:text-bark-100 text-center py-2 italic">
          {t('body.incomplete', locale)}
        </p>
      )}

      {calc && calc.targets && (
        <div className="mt-2 p-3 rounded-xl bg-terra-500/10 border border-terra-500/20">
          <div className="flex justify-between mb-2">
            <span className="font-body text-[11px] text-bark-200 dark:text-bark-100">{t('body.bmr', locale)}</span>
            <span className="font-body text-[12px] font-semibold text-bark-500 dark:text-cream-200">
              {calc.bmr} kcal
            </span>
          </div>
          <div className="flex justify-between mb-3 pb-3 border-b border-terra-500/20">
            <span className="font-body text-[11px] text-bark-200 dark:text-bark-100">{t('body.tdee', locale)}</span>
            <span className="font-body text-[12px] font-semibold text-bark-500 dark:text-cream-200">
              {calc.tdee} kcal
            </span>
          </div>

          <h4 className="font-display text-[13px] text-bark-500 dark:text-cream-200 mb-2">
            🎯 {t('body.calculated', locale)}
          </h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
            {PRIORITY_NUTRIENTS.map(n => {
              const meta = NUTRIENT_META[n];
              return (
                <div key={n} className="flex justify-between text-[12px] font-body">
                  <span className="text-bark-200 dark:text-bark-100">{meta.icon} {t(meta.label, locale)}</span>
                  <span className="font-semibold text-bark-500 dark:text-cream-200">
                    {Math.round(calc.targets![n])}{meta.unit}
                  </span>
                </div>
              );
            })}
          </div>

          <Btn onClick={onApply} className="w-full !py-2.5 !text-sm">
            ✓ {t('body.apply', locale)}
          </Btn>
        </div>
      )}
    </div>
  );
}
