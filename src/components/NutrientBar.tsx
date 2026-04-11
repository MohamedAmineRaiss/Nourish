'use client';
import { NUTRIENT_META, NutrientKey } from '@/types';
import { t } from '@/lib/i18n';
import type { Locale } from '@/types';

interface Props {
  nutrient: NutrientKey;
  current: number;
  target: number;
  locale: Locale;
}

export default function NutrientBar({ nutrient, current, target, locale }: Props) {
  const meta = NUTRIENT_META[nutrient];
  const pct = Math.min((current / Math.max(target, 0.001)) * 100, 100);

  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="text-[15px] w-6 text-center flex-shrink-0">{meta.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-0.5">
          <span className="text-xs font-semibold text-bark-500 dark:text-cream-200 font-body truncate">
            {t(meta.label, locale)}
          </span>
          <span className="text-[11px] text-bark-200 dark:text-bark-100 font-body flex-shrink-0 ms-2">
            {current.toFixed(1)} / {target} {meta.unit}
          </span>
        </div>
        <div className="h-2 rounded-full bg-cream-300 dark:bg-bark-400 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
            }}
          />
        </div>
      </div>
      <span
        className="text-xs font-bold min-w-[36px] text-end font-body flex-shrink-0"
        style={{ color: meta.color }}
      >
        {Math.round(pct)}%
      </span>
    </div>
  );
}
