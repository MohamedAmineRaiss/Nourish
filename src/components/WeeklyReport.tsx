'use client';

import { useState, useEffect } from 'react';
import { Locale, WeeklyReport as WeeklyReportType, ALL_NUTRIENTS, NUTRIENT_META } from '@/types';
import { t } from '@/lib/i18n';
import Card from '@/components/Card';
import Btn from '@/components/Btn';
import NutrientBar from '@/components/NutrientBar';

type WeeklyReportProps = {
  locale: Locale;
  deviceId: string;
  targets: any;
  onBack: () => void;
};

export default function WeeklyReport({ locale, deviceId, targets, onBack }: WeeklyReportProps) {
  const [report, setReport] = useState<WeeklyReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetch_report() {
      try {
        const res = await fetch(`/api/weekly?device_id=${deviceId}&lang=${locale}`);
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
        } else {
          setError(data.message || t('weekly.noData', locale));
        }
      } catch {
        setError(t('toast.error', locale));
      }
      setLoading(false);
    }
    fetch_report();
  }, [deviceId, locale]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-page">
        <div className="w-8 h-8 border-3 border-terra-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-body text-sm text-bark-200 dark:text-bark-100">{t('weekly.loading', locale)}</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col gap-4 animate-page">
        <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">{t('weekly.title', locale)}</h2>
        <Card>
          <p className="font-body text-sm text-bark-200 dark:text-bark-100 text-center py-4">{error || t('weekly.noData', locale)}</p>
        </Card>
        <Btn variant="ghost" onClick={onBack} className="mx-auto">← {t('nav.home', locale)}</Btn>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">{t('weekly.title', locale)}</h2>
      <p className="font-body text-[12px] text-bark-200 dark:text-bark-100 -mt-2">
        {report.week_start} → {report.week_end} · {report.days_tracked} {t('weekly.daysTracked', locale)}
      </p>

      {/* Summary */}
      {report.summary && (
        <Card>
          <p className="font-body text-sm text-bark-500 dark:text-cream-200 leading-relaxed">{report.summary}</p>
        </Card>
      )}

      {/* Strengths */}
      {report.strengths?.length > 0 && (
        <Card>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-2">💪 {t('weekly.strengths', locale)}</h3>
          {report.strengths.map((s, i) => (
            <p key={i} className="font-body text-sm text-bark-500 dark:text-cream-200 py-1 border-b border-cream-300/50 dark:border-bark-400/50 last:border-0">✓ {s}</p>
          ))}
        </Card>
      )}

      {/* Gaps */}
      {report.gaps?.length > 0 && (
        <Card highlight>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-2">⚠️ {t('weekly.gaps', locale)}</h3>
          {report.gaps.map((g, i) => (
            <p key={i} className="font-body text-sm text-bark-500 dark:text-cream-200 py-1 border-b border-cream-300/50 dark:border-bark-400/50 last:border-0">• {g}</p>
          ))}
        </Card>
      )}

      {/* Suggestions */}
      {report.suggestions?.length > 0 && (
        <Card>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-2">💡 {t('weekly.suggestions', locale)}</h3>
          {report.suggestions.map((s, i) => (
            <p key={i} className="font-body text-sm text-bark-500 dark:text-cream-200 py-1 border-b border-cream-300/50 dark:border-bark-400/50 last:border-0">→ {s}</p>
          ))}
        </Card>
      )}

      {/* Daily averages */}
      {report.daily_averages && (
        <Card>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-2">📊 {t('weekly.dailyAvg', locale)}</h3>
          {ALL_NUTRIENTS.map(n => {
            const val = report.daily_averages[n] || 0;
            if (val < 0.01) return null;
            return <NutrientBar key={n} nutrient={n} current={val} target={targets[n]} locale={locale} />;
          })}
        </Card>
      )}

      <Btn variant="ghost" onClick={onBack} className="mx-auto">← {t('nav.home', locale)}</Btn>
    </div>
  );
}
