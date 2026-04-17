'use client';

import { useState } from 'react';
import { Locale, MealType, NutrientValues, MEAL_TYPES, DietaryPref } from '@/types';
import { t } from '@/lib/i18n';
import Card from '@/components/Card';
import Btn from '@/components/Btn';

type MealSuggesterProps = {
  locale: Locale;
  deviceId: string;
  dailyIntake: NutrientValues;
  targets: NutrientValues;
  dietaryPrefs: DietaryPref[];
};

interface SuggestedMeal {
  name: string;
  description: string;
  ingredients: { name: string; grams: number }[];
  cooking_tip: string;
  prep_minutes?: number;
  simplicity?: number;
  nutrition_note?: string;
}

export default function MealSuggester({ locale, deviceId, dailyIntake, targets, dietaryPrefs }: MealSuggesterProps) {
  const [mode, setMode] = useState<'stock' | 'custom'>('stock');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [customIngredients, setCustomIngredients] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generate = async () => {
    setLoading(true);
    setMessage('');
    setSuggestions([]);

    try {
      const ingredients = mode === 'custom'
        ? customIngredients.split(/[,،\n]+/).map(s => s.trim()).filter(Boolean)
        : undefined;

      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId,
          lang: locale,
          mode,
          ingredients,
          meal_type: mealType,
          daily_intake: dailyIntake,
          targets,
          dietary_prefs: dietaryPrefs,
        }),
      });

      const data = await res.json();
      if (data.suggestions?.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setMessage(data.message || t('suggest.noResults', locale));
      }
    } catch {
      setMessage(t('toast.error', locale));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">
        {t('suggest.title', locale)}
      </h2>
      <p className="font-body text-[13px] text-bark-200 dark:text-bark-100 -mt-2">
        {t('suggest.subtitle', locale)}
      </p>

      {/* Dietary pref hint */}
      {dietaryPrefs.length > 0 && (
        <p className="font-body text-[11px] text-terra-500 font-semibold -mt-2">
          ✓ {t('suggest.respectingDiet', locale)}: {dietaryPrefs.join(', ')}
        </p>
      )}

      {/* Mode */}
      <div className="flex gap-2">
        {(['stock', 'custom'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-body font-semibold transition-all border-2 ${
              mode === m
                ? 'bg-terra-500 text-white border-terra-500'
                : 'bg-cream-200 dark:bg-bark-400 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
            }`}
          >
            {m === 'stock' ? t('suggest.fromStock', locale) : t('suggest.fromCustom', locale)}
          </button>
        ))}
      </div>

      {/* Meal type */}
      <div className="flex gap-2">
        {MEAL_TYPES.map(mt => (
          <button
            key={mt}
            onClick={() => setMealType(mt)}
            className={`flex-1 py-2 rounded-xl text-xs font-body font-semibold transition-all border ${
              mealType === mt
                ? 'bg-terra-500 text-white border-terra-500'
                : 'bg-cream-200 dark:bg-bark-400 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
            }`}
          >
            {t(`meal.${mt}`, locale)}
          </button>
        ))}
      </div>

      {mode === 'custom' && (
        <textarea
          value={customIngredients}
          onChange={(e) => setCustomIngredients(e.target.value)}
          placeholder={t('suggest.ingredientsPlaceholder', locale)}
          className="w-full px-4 py-3 rounded-2xl border-2 border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-600 font-body text-[15px] text-bark-500 dark:text-cream-200 outline-none focus:border-terra-500 placeholder:text-bark-100 min-h-[80px] resize-none"
        />
      )}

      <Btn onClick={generate} disabled={loading || (mode === 'custom' && !customIngredients.trim())} className="w-full !py-3.5 !rounded-2xl">
        {loading ? t('suggest.generating', locale) : `✨ ${t('suggest.generate', locale)}`}
      </Btn>

      {message && (
        <Card>
          <p className="font-body text-sm text-bark-200 dark:text-bark-100 text-center py-2">{message}</p>
        </Card>
      )}

      {suggestions.map((meal, i) => (
        <Card key={i}>
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="font-display text-[16px] text-bark-500 dark:text-cream-200">{meal.name}</h3>
            {/* Quick badges: prep time + simplicity */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {typeof meal.prep_minutes === 'number' && (
                <span className="bg-cream-200 dark:bg-bark-400 rounded-lg px-2 py-0.5 font-body text-[11px] font-semibold text-bark-500 dark:text-cream-200">
                  ⏱ {meal.prep_minutes}m
                </span>
              )}
              {typeof meal.simplicity === 'number' && (
                <span className="bg-cream-200 dark:bg-bark-400 rounded-lg px-2 py-0.5 font-body text-[11px] font-semibold text-terra-500">
                  {'★'.repeat(Math.max(1, Math.min(5, meal.simplicity)))}
                </span>
              )}
            </div>
          </div>

          <p className="font-body text-[13px] text-bark-200 dark:text-bark-100 mb-2.5">
            {meal.description}
          </p>

          {meal.nutrition_note && (
            <p className="font-body text-[12px] text-terra-500 font-semibold mb-3 bg-terra-500/10 rounded-lg px-2.5 py-1.5">
              📊 {meal.nutrition_note}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-2">
            {meal.ingredients.map((ing, j) => (
              <span key={j} className="bg-cream-200 dark:bg-bark-400 rounded-lg px-3 py-1.5 font-body text-[13px] font-semibold text-bark-500 dark:text-cream-200">
                {ing.name} <span className="text-terra-500">{ing.grams}g</span>
              </span>
            ))}
          </div>

          {meal.cooking_tip && (
            <p className="font-body text-xs text-bark-200 dark:text-bark-100 italic mt-2">
              💡 {meal.cooking_tip}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
