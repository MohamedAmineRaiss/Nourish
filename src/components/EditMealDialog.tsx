'use client';

import { useState, useMemo } from 'react';
import { LoggedMeal, NutrientValues, NutrientKey, Locale, ALL_NUTRIENTS, NUTRIENT_META, emptyNutrients, MEAL_TYPES, MealType } from '@/types';
import { t, isRTL } from '@/lib/i18n';
import Btn from '@/components/Btn';
import Card from '@/components/Card';

type Props = {
  locale: Locale;
  deviceId: string;
  meal: LoggedMeal;
  onClose: () => void;
  onSaved: (updated: LoggedMeal) => void;
  onDeleted: (mealId: string) => void;
};

const MEAL_ICONS: Record<MealType, string> = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎',
};

export default function EditMealDialog({ locale, deviceId, meal, onClose, onSaved, onDeleted }: Props) {
  const [foods, setFoods] = useState(() => meal.foods.map(f => ({ ...f })));
  const [mealType, setMealType] = useState<MealType>(meal.meal_type);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Recalculate nutrients based on ratio (we don't have original per-food nutrient data,
  // so we scale proportionally from original grams → new grams)
  const updatedNutrients = useMemo(() => {
    const orig = meal.nutrients || emptyNutrients();
    const origTotal = meal.foods.reduce((a, f) => a + (f.grams || 0), 0);
    const newTotal = foods.reduce((a, f) => a + (f.grams || 0), 0);

    if (origTotal === 0) return orig;
    const ratio = newTotal / origTotal;

    const scaled = emptyNutrients();
    for (const n of ALL_NUTRIENTS) {
      scaled[n] = Math.round(((orig[n] || 0) * ratio) * 10) / 10;
    }
    return scaled;
  }, [foods, meal.foods, meal.nutrients]);

  const updateGrams = (idx: number, grams: number) => {
    setFoods(prev => prev.map((f, i) => i === idx ? { ...f, grams: Math.max(0, Math.round(grams)) } : f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/meals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_id: meal.id,
          device_id: deviceId,
          name: t(`meal.${mealType}`, locale),
          meal_type: mealType,
          nutrients: updatedNutrients,
          foods,
        }),
      });
      if (res.ok) {
        onSaved({ ...meal, meal_type: mealType, name: t(`meal.${mealType}`, locale), nutrients: updatedNutrients, foods });
        onClose();
      }
    } catch {}
    setSaving(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await fetch(`/api/meals?device_id=${deviceId}&meal_id=${meal.id}`, { method: 'DELETE' });
      onDeleted(meal.id);
      onClose();
    } catch {}
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-toast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('edit.title', locale)}
      style={{ direction: isRTL(locale) ? 'rtl' : 'ltr' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-bark-600 rounded-t-3xl sm:rounded-3xl w-full max-w-[520px] max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-bark-600 border-b border-cream-300 dark:border-bark-400 px-5 py-4 flex justify-between items-center z-10">
          <h2 className="font-display text-[20px] text-bark-500 dark:text-cream-100">
            ✏️ {t('edit.title', locale)}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-200 dark:bg-bark-400 flex items-center justify-center" aria-label="Close">✕</button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          <p className="font-body text-[12px] text-bark-200 dark:text-bark-100">
            {meal.date} · {meal.time}
          </p>

          {/* Meal type */}
          <Card>
            <h3 className="font-display text-[14px] text-bark-500 dark:text-cream-200 mb-2">{t('plan.mealType', locale)}</h3>
            <div className="flex gap-1.5">
              {MEAL_TYPES.map(mt => (
                <button
                  key={mt}
                  onClick={() => setMealType(mt)}
                  className={`flex-1 py-2 rounded-xl text-xs font-body font-semibold border-2 transition-all ${
                    mealType === mt
                      ? 'bg-terra-500 text-white border-terra-500'
                      : 'bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
                  }`}
                >
                  {MEAL_ICONS[mt]} {t(`meal.${mt}`, locale)}
                </button>
              ))}
            </div>
          </Card>

          {/* Foods */}
          <Card>
            <h3 className="font-display text-[14px] text-bark-500 dark:text-cream-200 mb-2">{t('planned.ingredients', locale)}</h3>
            {foods.map((food, idx) => {
              const isEditing = editingIdx === idx;
              return (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-cream-300 dark:border-bark-400 last:border-0 gap-2">
                  <span className="font-body text-sm text-bark-500 dark:text-cream-200 truncate flex-1 min-w-0">
                    {food.label}
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={editValue}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === '' || parseInt(v) >= 0) setEditValue(v);
                      }}
                      onBlur={() => {
                        const parsed = parseInt(editValue);
                        if (!isNaN(parsed)) updateGrams(idx, parsed);
                        setEditingIdx(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const parsed = parseInt(editValue);
                          if (!isNaN(parsed)) updateGrams(idx, parsed);
                          setEditingIdx(null);
                        }
                      }}
                      autoFocus
                      className="w-16 px-2 py-1 rounded-lg border-2 border-terra-500 bg-cream-50 dark:bg-bark-600 font-body text-sm font-bold text-terra-500 text-center outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => { setEditingIdx(idx); setEditValue(String(food.grams)); }}
                      className="px-3 py-1.5 rounded-lg font-body text-sm font-bold border-2 border-cream-300 dark:border-bark-400 bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200"
                    >
                      {food.grams}g
                    </button>
                  )}
                </div>
              );
            })}
          </Card>

          {/* Preview */}
          <Card>
            <h3 className="font-display text-[14px] text-bark-500 dark:text-cream-200 mb-2">{t('planned.provides', locale)}</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] font-body">
              {ALL_NUTRIENTS.filter(n => updatedNutrients[n] > 0.5).slice(0, 8).map(n => {
                const meta = NUTRIENT_META[n];
                return (
                  <div key={n} className="flex justify-between">
                    <span className="text-bark-200 dark:text-bark-100">{meta.icon} {t(meta.label, locale)}</span>
                    <span className="font-semibold text-bark-500 dark:text-cream-200">
                      {updatedNutrients[n].toFixed(1)}{meta.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Delete confirmation */}
          {confirmDelete && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="font-body text-sm text-bark-500 dark:text-cream-200 mb-2">
                {t('edit.confirmDelete', locale)}
              </p>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => setConfirmDelete(false)} className="flex-1">
                  {t('common.cancel', locale)}
                </Btn>
                <Btn variant="danger" onClick={handleDelete} disabled={saving} className="flex-1">
                  {t('edit.deleteConfirm', locale)}
                </Btn>
              </div>
            </div>
          )}

          <div className="flex gap-2 sticky bottom-0 bg-white dark:bg-bark-600 pt-2">
            <Btn variant="danger" onClick={() => setConfirmDelete(true)} disabled={saving} className="!px-4">
              🗑️
            </Btn>
            <Btn variant="ghost" onClick={onClose} className="flex-1">
              {t('common.cancel', locale)}
            </Btn>
            <Btn onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? t('toast.saving', locale) : `💾 ${t('common.save', locale)}`}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
