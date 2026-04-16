'use client';

import { FoodItem, Locale, MealType, MEAL_TYPES } from '@/types';
import { t } from '@/lib/i18n';
import Card from '@/components/Card';
import Btn from '@/components/Btn';

type PlanMealProps = {
  locale: Locale;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searching: boolean;
  searchResults: FoodItem[];
  searchSource: string;
  selectedFoods: FoodItem[];
  addFood: (food: FoodItem) => void;
  removeFood: (id: string) => void;
  doGenerate: () => void;
  mealType: MealType;
  setMealType: (mt: MealType) => void;
};

const MEAL_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export default function PlanMeal({
  locale, searchQuery, setSearchQuery, searching, searchResults, searchSource,
  selectedFoods, addFood, removeFood, doGenerate, mealType, setMealType,
}: PlanMealProps) {
  return (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">{t('plan.title', locale)}</h2>
      <p className="font-body text-[13px] text-bark-200 dark:text-bark-100 -mt-2">{t('plan.subtitle', locale)}</p>

      {/* Meal type selector */}
      <div>
        <label className="font-body text-[13px] text-bark-200 dark:text-bark-100 block mb-1.5">
          {t('plan.mealType', locale)}
        </label>
        <div className="flex gap-2">
          {MEAL_TYPES.map(mt => (
            <button
              key={mt}
              onClick={() => setMealType(mt)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-body font-semibold transition-all border-2 ${
                mealType === mt
                  ? 'bg-terra-500 text-white border-terra-500 shadow-md shadow-terra-500/20'
                  : 'bg-cream-200 dark:bg-bark-400 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
              }`}
            >
              {MEAL_ICONS[mt]} {t(`meal.${mt}`, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`🔍 ${t('plan.searchPlaceholder', locale)}`}
          className="w-full px-4 py-3.5 rounded-2xl border-2 border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-600 font-body text-[15px] text-bark-500 dark:text-cream-200 outline-none transition-colors focus:border-terra-500 placeholder:text-bark-100"
          type="search"
          autoComplete="off"
        />

        {searching && (
          <div className="absolute end-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-terra-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="absolute top-full inset-x-0 z-10 mt-1.5 bg-white dark:bg-bark-600 rounded-2xl shadow-xl border border-cream-300 dark:border-bark-400 max-h-[280px] overflow-y-auto">
            {searchResults.map((food) => (
              <div
                key={food.id}
                onClick={() => addFood(food)}
                className="food-result px-4 py-3 flex justify-between items-center border-b border-cream-300/50 dark:border-bark-400/50 last:border-0 cursor-pointer hover:bg-cream-100 dark:hover:bg-bark-500 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-body font-semibold text-sm text-bark-500 dark:text-cream-200 truncate">{food.label}</div>
                  <div className="font-body text-[11px] text-bark-200 dark:text-bark-100">{food.category}</div>
                </div>
                <span className="text-lg text-terra-500 flex-shrink-0 ms-2">+</span>
              </div>
            ))}
          </div>
        )}

        {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
          <div className="absolute top-full inset-x-0 z-10 mt-1.5 bg-white dark:bg-bark-600 rounded-2xl shadow-lg border border-cream-300 dark:border-bark-400 p-4">
            <p className="font-body text-sm text-bark-200 dark:text-bark-100 text-center">{t('plan.noResults', locale)}</p>
          </div>
        )}
      </div>

      {/* Selected */}
      {selectedFoods.length > 0 && (
        <Card>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-3">
            {t('plan.selected', locale)} ({selectedFoods.length})
          </h3>
          <div className="flex flex-col gap-2">
            {selectedFoods.map((food) => (
              <div key={food.id} className="flex justify-between items-center px-3.5 py-2.5 rounded-xl bg-cream-200 dark:bg-bark-400">
                <div className="min-w-0 flex-1">
                  <span className="font-body font-semibold text-sm text-bark-500 dark:text-cream-200 truncate block">
                    {food.label.length > 40 ? `${food.label.substring(0, 40)}…` : food.label}
                  </span>
                  <span className="font-body text-[11px] text-bark-200 dark:text-bark-100">{food.category}</span>
                </div>
                <button onClick={() => removeFood(food.id)} className="bg-transparent border-none text-lg text-bark-200 dark:text-bark-100 p-1 ms-2 flex-shrink-0">✕</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Btn onClick={doGenerate} disabled={selectedFoods.length === 0} className="w-full !py-4 !text-base !rounded-2xl">
        ✨ {t('plan.generate', locale)}
      </Btn>
    </div>
  );
}
