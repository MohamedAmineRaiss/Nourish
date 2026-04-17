'use client';

import { useMemo } from 'react';
import { DailyIntake, NutrientKey, NUTRIENT_META, Locale } from '@/types';
import { t } from '@/lib/i18n';

type TrendsChartProps = {
  locale: Locale;
  data: DailyIntake[];       // ordered earliest → latest
  nutrient: NutrientKey;
  target: number;
  height?: number;
};

const PAD_L = 36;   // left padding for y-axis labels
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 22;

export default function TrendsChart({ locale, data, nutrient, target, height = 160 }: TrendsChartProps) {
  const meta = NUTRIENT_META[nutrient];
  const width = 320;

  const { points, values, yMax } = useMemo(() => {
    const values = data.map(d => d.nutrients[nutrient] || 0);
    const yMax = Math.max(target * 1.2, ...values, 1);
    const innerW = width - PAD_L - PAD_R;
    const innerH = height - PAD_T - PAD_B;

    const points = values.map((v, i) => {
      const x = PAD_L + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2);
      const y = PAD_T + innerH - (v / yMax) * innerH;
      return { x, y, v, date: data[i].date };
    });

    return { points, values, yMax };
  }, [data, nutrient, target, height]);

  if (data.length === 0) {
    return (
      <div className="font-body text-xs text-bark-200 dark:text-bark-100 text-center py-6">
        {t('trends.empty', locale)}
      </div>
    );
  }

  // Target line y-position
  const innerH = height - PAD_T - PAD_B;
  const targetY = PAD_T + innerH - (target / yMax) * innerH;

  // Build polyline + area path
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M ${points[0].x},${height - PAD_B} ` +
    points.map(p => `L ${p.x},${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x},${height - PAD_B} Z`;

  // Human-readable summary for screen readers
  const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10 : 0;
  const a11yLabel = `${t(meta.label, locale)} ${t('trends.overDays', locale).replace('{n}', String(data.length))}: ${t('trends.avg', locale)} ${avg} ${meta.unit}, ${t('trends.target', locale)} ${target} ${meta.unit}`;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-body text-[13px] font-semibold text-bark-500 dark:text-cream-200">
          {meta.icon} {t(meta.label, locale)}
        </span>
        <span className="font-body text-[11px] text-bark-200 dark:text-bark-100">
          {t('trends.avg', locale)}: <strong style={{ color: meta.color }}>{avg} {meta.unit}</strong>
          {' · '}
          {t('trends.target', locale)}: {target} {meta.unit}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={a11yLabel}
        style={{ overflow: 'visible' }}
      >
        {/* Grid lines */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={height - PAD_B} stroke="currentColor" strokeOpacity="0.15" />
        <line x1={PAD_L} y1={height - PAD_B} x2={width - PAD_R} y2={height - PAD_B} stroke="currentColor" strokeOpacity="0.15" />

        {/* Target reference line */}
        {targetY > PAD_T && targetY < height - PAD_B && (
          <>
            <line
              x1={PAD_L} y1={targetY} x2={width - PAD_R} y2={targetY}
              stroke={meta.color} strokeOpacity="0.4" strokeDasharray="4 3"
            />
            <text
              x={width - PAD_R} y={targetY - 3}
              fontSize="9"
              textAnchor="end"
              fill={meta.color}
              fillOpacity="0.7"
            >
              {target}
            </text>
          </>
        )}

        {/* Area fill */}
        <path d={areaPath} fill={meta.color} fillOpacity="0.15" />

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke={meta.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill={meta.color} />
            {/* Date labels for first, last, middle */}
            {(i === 0 || i === points.length - 1 || (data.length > 7 && i === Math.floor(points.length / 2))) && (
              <text
                x={p.x}
                y={height - 6}
                fontSize="9"
                textAnchor="middle"
                fill="currentColor"
                fillOpacity="0.6"
              >
                {p.date.slice(5)}
              </text>
            )}
          </g>
        ))}

        {/* Y-axis labels (max and 0) */}
        <text x={PAD_L - 4} y={PAD_T + 4} fontSize="9" textAnchor="end" fill="currentColor" fillOpacity="0.6">
          {Math.round(yMax)}
        </text>
        <text x={PAD_L - 4} y={height - PAD_B + 3} fontSize="9" textAnchor="end" fill="currentColor" fillOpacity="0.6">
          0
        </text>
      </svg>
    </div>
  );
}
