'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Locale, LoggedMeal, NutrientValues, DailyIntake, NutrientKey,
  PRIORITY_NUTRIENTS, SECONDARY_NUTRIENTS, ALL_NUTRIENTS, emptyNutrients,
} from '@/types';
import { t } from '@/lib/i18n';
import Card from '@/components/Card';
import Btn from '@/components/Btn';
import NutrientBar from '@/components/NutrientBar';
import TrendsChart from '@/components/TrendsChart';
import EditMealDialog from '@/components/EditMealDialog';

type TrackerProps = {
  locale: Locale;
  deviceId: string;
  targets: NutrientValues;
  todayIntake: NutrientValues;
  todayMeals: LoggedMeal[];
  onMealsChanged: () => void;  // parent re-fetches today's meals/intake
  onResetDay: () => void;
  onBack: () => void;
};

type Mode = 'today' | 'week' | 'month';

function todayStr() { return new Date().toISOString().split('T')[0]; }

export default function Tracker({
  locale, deviceId, targets, todayIntake, todayMeals,
  onMealsChanged, onResetDay, onBack,
}: TrackerProps) {
  const [mode, setMode] = useState<Mode>('today');
  const [historicalMeals, setHistoricalMeals] = useState<LoggedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<LoggedMeal | null>(null);

  const fetchHistorical = useCallback(async (days: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meals?device_id=${deviceId}&days=${days}`);
      const data = await res.json();
      setHistoricalMeals(data.meals || []);
    } catch {
      setHistoricalMeals([]);
    }
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    if (mode === 'week') fetchHistorical(7);
    else if (mode === 'month') fetchHistorical(30);
  }, [mode, fetchHistorical]);

  // Aggregate historical meals → per-day intake
  const dailyIntakes: DailyIntake[] = (() => {
    if (mode === 'today') return [];
    const days = mode === 'week' ? 7 : 30;
    const byDate: Record<string, { nutrients: NutrientValues; count: number }> = {};

    // Seed with empty days (we want all days even if no meals)
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      byDate[d.toISOString().split('T')[0]] = { nutrients: emptyNutrients(), count: 0 };
    }

    for (const m of historicalMeals) {
      if (!byDate[m.date]) byDate[m.date] = { nutrients: emptyNutrients(), count: 0 };
      for (const n of ALL_NUTRIENTS) {
        byDate[m.date].nutrients[n] += m.nutrients?.[n] || 0;
      }
      byDate[m.date].count += 1;
    }

    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, nutrients: v.nutrients, meal_count: v.count }));
  })();

  // Group meals by date (newest first)
  const mealsByDate = (() => {
    const source = mode === 'today' ? todayMeals : historicalMeals;
    const grouped: Record<string, LoggedMeal[]> = {};
    for (const m of source) {
      const normalized: LoggedMeal = {
        id: m.id, name: m.name, meal_type: m.meal_type || 'lunch',
        nutrients: m.nutrients, foods: m.foods, time: m.time, date: m.date,
      };
      if (!grouped[m.date]) grouped[m.date] = [];
      grouped[m.date].push(normalized);
    }
    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  })();

  return (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">
        {t('tracker.title', locale)}
      </h2>

      {/* Mode selector */}
      <div className="flex gap-2" role="tablist" aria-label="Time range">
        {(['today', 'week', 'month'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            role="tab"
            aria-selected={mode === m}
            className={`flex-1 py-2 rounded-xl text-xs font-body font-semibold border-2 transition-all ${
              mode === m
                ? 'bg-terra-500 text-white border-terra-500'
                : 'bg-cream-200 dark:bg-bark-400 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
            }`}
          >
            {t(`tracker.${m}`, locale)}
          </button>
        ))}
      </div>

      {/* TODAY mode: nutrient bars */}
      {mode === 'today' && (
        <>
          <Card>
            <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-1">
              {t('tracker.priority', locale)}
            </h3>
            {PRIORITY_NUTRIENTS.map(n => (
              <NutrientBar key={n} nutrient={n} current={todayIntake[n]} target={targets[n]} locale={locale} />
            ))}
          </Card>
          <Card>
            <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-1">
              {t('tracker.all', locale)}
            </h3>
            {SECONDARY_NUTRIENTS.map(n => (
              <NutrientBar key={n} nutrient={n} current={todayIntake[n]} target={targets[n]} locale={locale} />
            ))}
          </Card>
        </>
      )}

      {/* TRENDS mode: charts */}
      {(mode === 'week' || mode === 'month') && (
        <>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-terra-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <>
              <Card>
                <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-3">
                  📈 {t('tracker.trends', locale)}
                </h3>
                <div className="flex flex-col gap-5">
                  {PRIORITY_NUTRIENTS.map(n => (
                    <TrendsChart
                      key={n}
                      locale={locale}
                      data={dailyIntakes}
                      nutrient={n}
                      target={targets[n]}
                    />
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-3">
                  {t('tracker.all', locale)}
                </h3>
                <div className="flex flex-col gap-5">
                  {SECONDARY_NUTRIENTS.map(n => (
                    <TrendsChart
                      key={n}
                      locale={locale}
                      data={dailyIntakes}
                      nutrient={n}
                      target={targets[n]}
                      height={120}
                    />
                  ))}
                </div>
              </Card>
            </>
          )}
        </>
      )}

      {/* Meal list — shows meals for selected period with edit/delete */}
      {mealsByDate.length > 0 && (
        <Card>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-3">
            {t('tracker.mealsLogged', locale)}
          </h3>
          {mealsByDate.map(([date, meals]) => (
            <div key={date} className="mb-3 last:mb-0">
              {mode !== 'today' && (
                <p className="font-body text-[11px] font-semibold text-bark-200 dark:text-bark-100 mb-1.5 uppercase tracking-wide">
                  {date === todayStr() ? t('tracker.today', locale) : date}
                </p>
              )}
              {meals.map(m => (
                <div
                  key={m.id}
                  className="py-2.5 border-b border-cream-300 dark:border-bark-400 last:border-0 cursor-pointer hover:bg-cream-100 dark:hover:bg-bark-500 rounded-lg px-2 -mx-2 transition-colors"
                  onClick={() => setEditing(m)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditing(m); }}
                  aria-label={`Edit ${m.name}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-body font-semibold text-sm text-bark-500 dark:text-cream-200">
                      {m.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs text-bark-200 dark:text-bark-100">{m.time}</span>
                      <span className="font-body text-[10px] text-terra-500">✏️</span>
                    </div>
                  </div>
                  <div className="font-body text-xs text-bark-200 dark:text-bark-100 mt-1">
                    {m.foods.map(f => `${f.label.split(',')[0]} ${f.grams}g`).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Card>
      )}

      {mode === 'today' && todayMeals.length > 0 && (
        <Btn variant="danger" onClick={onResetDay} className="w-full">
          🔄 {t('tracker.resetDay', locale)}
        </Btn>
      )}

      <Btn variant="ghost" onClick={onBack} className="mx-auto">
        ← {t('nav.home', locale)}
      </Btn>

      {editing && (
        <EditMealDialog
          locale={locale}
          deviceId={deviceId}
          meal={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { onMealsChanged(); if (mode !== 'today') fetchHistorical(mode === 'week' ? 7 : 30); }}
          onDeleted={() => { onMealsChanged(); if (mode !== 'today') fetchHistorical(mode === 'week' ? 7 : 30); }}
        />
      )}
    </div>
  );
}
