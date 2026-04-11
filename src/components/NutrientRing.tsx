'use client';
import { NUTRIENT_META, NutrientKey } from '@/types';
import { t } from '@/lib/i18n';
import type { Locale } from '@/types';

interface Props {
  nutrient: NutrientKey;
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  locale: Locale;
}

export default function NutrientRing({ nutrient, current, target, size = 80, strokeWidth = 7, locale }: Props) {
  const meta = NUTRIENT_META[nutrient];
  const pct = Math.min((current / Math.max(target, 0.001)) * 100, 100);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-bg, #F0EBE3)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={meta.color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-body font-bold" style={{ fontSize: size > 70 ? 15 : 11, color: meta.color }}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-[11px] font-semibold text-bark-500 dark:text-cream-200 font-body">
          {meta.icon} {t(meta.label, locale)}
        </div>
        <div className="text-[10px] text-bark-200 dark:text-bark-100 font-body">
          {current.toFixed(1)}/{target}{meta.unit}
        </div>
      </div>
    </div>
  );
}
