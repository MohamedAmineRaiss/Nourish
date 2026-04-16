'use client';

import { useState, useMemo } from 'react';
import {
  FoodItem, NutrientValues, MealSuggestion, NutrientKey,
  ALL_NUTRIENTS, NUTRIENT_META, Locale, emptyNutrients,
} from '@/types';
import { t } from '@/lib/i18n';
import { calcMealNutrients } from '@/lib/recommendationEngine';
import Card from '@/components/Card';
import Btn from '@/components/Btn';
import NutrientBar from '@/components/NutrientBar';

type PlannedMealProps = {
  locale: Locale;
  suggestion: MealSuggestion;
  targets: NutrientValues;
  dailyIntake: NutrientValues;
  onConfirm: (quantities: Record<string, number>, nutrients: NutrientValues) => void;
  onBack: () => void;
};

export default function PlannedMeal({ locale, suggestion, targets, dailyIntake, onConfirm, onBack }: PlannedMealProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => ({ ...suggestion.quantities }));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const nutrients = useMemo(() => calcMealNutrients(suggestion.foods, quantities), [suggestion.foods, quantities]);
  const totalGrams = Object.values(quantities).reduce((a, b) => a + b, 0);

  const updateQuantity = (foodId: string, grams: number) => {
    setQuantities(prev => ({ ...prev, [foodId]: Math.max(0, Math.round(grams)) })); // FIX: never negative
  };

  const startEditing = (foodId: string) => {
    setEditingId(foodId);
    setEditValue(String(quantities[foodId]));
  };

  const finishEditing = () => {
    if (editingId) {
      const parsed = parseInt(editValue);
      if (!isNaN(parsed)) updateQuantity(editingId, parsed); // Math.max(0) handled in updateQuantity
      setEditingId(null);
    }
  };

  const isModified = (foodId: string) => quantities[foodId] !== suggestion.quantities[foodId];

  // Translate the explanation nutrients
  const localizedExplanation = useMemo(() => {
    const parts = suggestion.explanation.split(', ');
    return parts.map(key => {
      const meta = NUTRIENT_META[key as NutrientKey];
      return meta ? t(meta.label, locale) : key;
    }).join(', ');
  }, [suggestion.explanation, locale]);

  return (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">{t('planned.title', locale)}</h2>

      {/* Explanation badge */}
      <div className="font-body text-xs text-terra-500 font-semibold bg-terra-500/10 rounded-xl px-3 py-2">
        ↑ {localizedExplanation}
      </div>

      {/* Editable ingredients */}
      <Card>
        <h3 className="font-display text-[16px] text-bark-500 dark:text-cream-200 mb-1">{t('planned.ingredients', locale)}</h3>
        <p className="font-body text-[11px] text-bark-200 dark:text-bark-100 mb-3">{t('planned.editHint', locale)}</p>

        {suggestion.foods.map((food) => {
          const isEditing = editingId === food.id;
          const modified = isModified(food.id);

          return (
            <div key={food.id} className="flex items-center justify-between py-2.5 border-b border-cream-300 dark:border-bark-400 last:border-0 gap-2">
              <span className="font-body text-sm text-bark-500 dark:text-cream-200 truncate flex-1 min-w-0">
                {food.label.length > 30 ? food.label.substring(0, 30) + '…' : food.label}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isEditing ? (
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={editValue}
                    onChange={(e) => {
                      // FIX: prevent negative input
                      const val = e.target.value;
                      if (val === '' || parseInt(val) >= 0 || val === '0') setEditValue(val);
                    }}
                    onBlur={finishEditing}
                    onKeyDown={(e) => { if (e.key === 'Enter') finishEditing(); }}
                    autoFocus
                    className="w-16 px-2 py-1 rounded-lg border-2 border-terra-500 bg-cream-50 dark:bg-bark-600 font-body text-sm font-bold text-terra-500 text-center outline-none"
                  />
                ) : (
                  <button
                    onClick={() => startEditing(food.id)}
                    className={`px-3 py-1.5 rounded-lg font-body text-sm font-bold transition-all border-2 ${
                      modified
                        ? 'border-terra-500 bg-terra-500/10 text-terra-500'
                        : 'border-cream-300 dark:border-bark-400 bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200'
                    }`}
                  >
                    {quantities[food.id]}g
                  </button>
                )}
                {modified && !isEditing && (
                  <button
                    onClick={() => setQuantities(prev => ({ ...prev, [food.id]: suggestion.quantities[food.id] }))}
                    className="text-[11px] font-body text-bark-200 dark:text-bark-100 underline"
                  >↩</button>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex justify-between pt-2 mt-1">
          <span className="font-body text-xs text-bark-200 dark:text-bark-100">{t('planned.totalWeight', locale)}</span>
          <span className="font-body text-xs font-bold text-bark-500 dark:text-cream-200">{totalGrams}g</span>
        </div>
      </Card>

      {/* Live nutrient preview */}
      <Card>
        <h3 className="font-display text-[16px] text-bark-500 dark:text-cream-200 mb-3">{t('planned.provides', locale)}</h3>
        {ALL_NUTRIENTS.map(n => {
          const val = nutrients[n] || 0;
          const remaining = Math.max(targets[n] - dailyIntake[n], 0);
          if (val < 0.01 && remaining <= 0) return null;
          return <NutrientBar key={n} nutrient={n} current={val} target={remaining > 0 ? remaining : targets[n]} locale={locale} />;
        })}
      </Card>

      <Btn onClick={() => onConfirm(quantities, nutrients)} className="w-full !py-4 !text-base !rounded-2xl">
        ✅ {t('planned.addToDay', locale)}
      </Btn>
      <Btn variant="ghost" onClick={onBack} className="mx-auto">← {t('planned.backSuggestions', locale)}</Btn>
    </div>
  );
}
