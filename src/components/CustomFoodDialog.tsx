'use client';

import { useState } from 'react';
import {
  Locale, NutrientValues, DietaryPref, DIETARY_PREFS, DIETARY_PREF_META,
  NUTRIENT_META, ALL_NUTRIENTS, PRIORITY_NUTRIENTS, SECONDARY_NUTRIENTS,
  emptyNutrients, FoodItem,
} from '@/types';
import { t, isRTL } from '@/lib/i18n';
import Btn from '@/components/Btn';
import Card from '@/components/Card';

type Props = {
  locale: Locale;
  deviceId: string;
  onClose: () => void;
  onCreated: (food: FoodItem) => void;
};

const CATEGORIES = [
  'Meat', 'Fish', 'Vegetable', 'Fruit', 'Legume',
  'Dairy & Eggs', 'Grain', 'Nut', 'Other',
];

export default function CustomFoodDialog({ locale, deviceId, onClose, onCreated }: Props) {
  const [labelEn, setLabelEn] = useState('');
  const [labelFr, setLabelFr] = useState('');
  const [labelAr, setLabelAr] = useState('');
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState<DietaryPref[]>([]);
  const [nutrients, setNutrients] = useState<NutrientValues>(emptyNutrients());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleTag = (tag: DietaryPref) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const updateNutrient = (key: keyof NutrientValues, value: string) => {
    const parsed = parseFloat(value);
    setNutrients(prev => ({
      ...prev,
      [key]: isNaN(parsed) ? 0 : Math.max(0, parsed),
    }));
  };

  const save = async () => {
    if (!labelEn.trim() && !labelFr.trim() && !labelAr.trim()) {
      setError(t('custom.needLabel', locale));
      return;
    }
    const primaryLabel = labelEn.trim() || labelFr.trim() || labelAr.trim();

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/foods/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId,
          label_en: labelEn.trim() || primaryLabel,
          label_fr: labelFr.trim() || primaryLabel,
          label_ar: labelAr.trim() || primaryLabel,
          category,
          dietary_tags: tags,
          nutrientsPer100g: nutrients,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();

      if (data.food) {
        const createdFood: FoodItem = {
          id: `custom:${data.food.id}`,
          source: 'custom',
          label: locale === 'fr' ? data.food.label_fr : locale === 'ar' ? data.food.label_ar : data.food.label_en,
          brand: null,
          category: data.food.category,
          dietary_tags: data.food.dietary_tags,
          nutrientsPer100g: {
            calories: data.food.calories, protein: data.food.protein, fat: data.food.fat,
            carbs: data.food.carbs, fiber: data.food.fiber, iron: data.food.iron,
            zinc: data.food.zinc, vitaminC: data.food.vitamin_c, folate: data.food.folate,
            vitaminB12: data.food.vitamin_b12, selenium: data.food.selenium, iodine: data.food.iodine,
          },
        };
        onCreated(createdFood);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || t('toast.error', locale));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-toast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('custom.title', locale)}
      style={{ direction: isRTL(locale) ? 'rtl' : 'ltr' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-bark-600 rounded-t-3xl sm:rounded-3xl w-full max-w-[520px] max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-bark-600 border-b border-cream-300 dark:border-bark-400 px-5 py-4 flex justify-between items-center z-10">
          <h2 className="font-display text-[20px] text-bark-500 dark:text-cream-100">
            ✏️ {t('custom.title', locale)}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-200 dark:bg-bark-400 flex items-center justify-center text-bark-500 dark:text-cream-200"
            aria-label={t('common.close', locale)}
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <p className="font-body text-[13px] text-bark-200 dark:text-bark-100">
            {t('custom.subtitle', locale)}
          </p>

          {/* Names */}
          <Card>
            <h3 className="font-display text-[14px] text-bark-500 dark:text-cream-200 mb-2">
              {t('custom.names', locale)}
            </h3>
            <div className="flex flex-col gap-2">
              <div>
                <label className="font-body text-[11px] text-bark-200 block mb-1">English</label>
                <input
                  value={labelEn}
                  onChange={(e) => setLabelEn(e.target.value)}
                  placeholder={t('custom.labelEnPh', locale)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-500 font-body text-sm outline-none focus:border-terra-500"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="font-body text-[11px] text-bark-200 block mb-1">Français</label>
                <input
                  value={labelFr}
                  onChange={(e) => setLabelFr(e.target.value)}
                  placeholder={t('custom.labelFrPh', locale)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-500 font-body text-sm outline-none focus:border-terra-500"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="font-body text-[11px] text-bark-200 block mb-1">العربية</label>
                <input
                  value={labelAr}
                  onChange={(e) => setLabelAr(e.target.value)}
                  placeholder={t('custom.labelArPh', locale)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-500 font-body text-sm outline-none focus:border-terra-500"
                  dir="rtl"
                />
              </div>
            </div>
          </Card>

          {/* Category */}
          <Card>
            <h3 className="font-display text-[14px] text-bark-500 dark:text-cream-200 mb-2">
              {t('custom.category', locale)}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full font-body text-[12px] font-semibold border transition-all ${
                    category === c
                      ? 'bg-terra-500 text-white border-terra-500'
                      : 'bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Card>

          {/* Dietary tags */}
          <Card>
            <h3 className="font-display text-[14px] text-bark-500 dark:text-cream-200 mb-2">
              {t('custom.dietary', locale)}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {DIETARY_PREFS.map(tag => {
                const meta = DIETARY_PREF_META[tag];
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 rounded-full font-body text-[12px] font-semibold border transition-all ${
                      active
                        ? 'bg-terra-500 text-white border-terra-500'
                        : 'bg-cream-100 dark:bg-bark-500 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
                    }`}
                  >
                    {meta.icon} {t(meta.labelKey, locale)}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Priority nutrients */}
          <Card>
            <h3 className="font-display text-[14px] text-bark-500 dark:text-cream-200 mb-1">
              {t('custom.nutrientsPer100g', locale)}
            </h3>
            <p className="font-body text-[11px] text-bark-200 dark:text-bark-100 mb-3">
              {t('custom.nutrientsHint', locale)}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITY_NUTRIENTS.map(n => {
                const meta = NUTRIENT_META[n];
                return (
                  <div key={n}>
                    <label className="font-body text-[11px] text-bark-200 block mb-1">
                      {meta.icon} {t(meta.label, locale)} ({meta.unit})
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      value={nutrients[n] === 0 ? '' : nutrients[n]}
                      onChange={(e) => updateNutrient(n, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="w-full px-3 py-2 rounded-lg border border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-500 font-body text-sm outline-none focus:border-terra-500"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAdvanced(s => !s)}
              className="font-body text-xs text-terra-500 font-semibold mt-3 underline"
            >
              {showAdvanced ? `− ${t('custom.hideAdvanced', locale)}` : `+ ${t('custom.showAdvanced', locale)}`}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-cream-300 dark:border-bark-400">
                {SECONDARY_NUTRIENTS.map(n => {
                  const meta = NUTRIENT_META[n];
                  return (
                    <div key={n}>
                      <label className="font-body text-[11px] text-bark-200 block mb-1">
                        {meta.icon} {t(meta.label, locale)} ({meta.unit})
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="any"
                        value={nutrients[n] === 0 ? '' : nutrients[n]}
                        onChange={(e) => updateNutrient(n, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full px-3 py-2 rounded-lg border border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-500 font-body text-sm outline-none focus:border-terra-500"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 font-body text-sm text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-2 sticky bottom-0 bg-white dark:bg-bark-600 pt-2">
            <Btn variant="ghost" onClick={onClose} className="flex-1">
              {t('common.cancel', locale)}
            </Btn>
            <Btn onClick={save} disabled={saving} className="flex-1">
              {saving ? `${t('toast.saving', locale)}` : `💾 ${t('common.save', locale)}`}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
