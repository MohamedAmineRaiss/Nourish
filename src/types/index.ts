// ─── Locale ───
export type Locale = 'en' | 'ar' | 'fr';

// ─── Meal Types ───
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const MEAL_TYPE_SHARE: Record<MealType, number> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.30,
  snack: 0.10,
};

// ─── Nutrient Keys ───
export type PriorityNutrient =
  | 'calories' | 'protein' | 'carbs' | 'fat' | 'iron' | 'vitaminC' | 'fiber';

export type SecondaryNutrient =
  | 'vitaminB12' | 'folate' | 'zinc' | 'iodine' | 'selenium';

export type NutrientKey = PriorityNutrient | SecondaryNutrient;

export const PRIORITY_NUTRIENTS: PriorityNutrient[] = [
  'calories', 'protein', 'carbs', 'fat', 'iron', 'vitaminC', 'fiber',
];

export const SECONDARY_NUTRIENTS: SecondaryNutrient[] = [
  'vitaminB12', 'folate', 'zinc', 'iodine', 'selenium',
];

export const ALL_NUTRIENTS: NutrientKey[] = [...PRIORITY_NUTRIENTS, ...SECONDARY_NUTRIENTS];

export type NutrientValues = Record<NutrientKey, number>;

export function emptyNutrients(): NutrientValues {
  return {
    calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, vitaminC: 0, fiber: 0,
    vitaminB12: 0, folate: 0, zinc: 0, iodine: 0, selenium: 0,
  };
}

// ─── Nutrition Filters (COMPUTED from macros, not tagged) ───
// These replace the old vegan/vegetarian/gluten-free/dairy-free system.
// Advantage: always accurate, no manual tagging or classification bugs.
export type NutritionFilter =
  | 'high-protein'   // ≥ 20g protein / 100g
  | 'low-carb'       // ≤ 10g carbs / 100g (keto-friendly)
  | 'high-iron'      // ≥ 3mg iron / 100g
  | 'low-calorie'    // ≤ 100 kcal / 100g
  | 'high-fiber';    // ≥ 5g fiber / 100g

export const NUTRITION_FILTERS: NutritionFilter[] = [
  'high-protein', 'low-carb', 'high-iron', 'low-calorie', 'high-fiber',
];

export interface NutritionFilterMeta {
  icon: string;
  labelKey: string;
  descKey: string;
  test: (n: NutrientValues) => boolean;
}

export const NUTRITION_FILTER_META: Record<NutritionFilter, NutritionFilterMeta> = {
  'high-protein': {
    icon: '💪', labelKey: 'filter.highProtein', descKey: 'filter.highProteinDesc',
    test: (n) => (n.protein || 0) >= 20,
  },
  'low-carb': {
    icon: '🥑', labelKey: 'filter.lowCarb', descKey: 'filter.lowCarbDesc',
    test: (n) => (n.carbs || 0) <= 10,
  },
  'high-iron': {
    icon: '🩸', labelKey: 'filter.highIron', descKey: 'filter.highIronDesc',
    test: (n) => (n.iron || 0) >= 3,
  },
  'low-calorie': {
    icon: '🪶', labelKey: 'filter.lowCalorie', descKey: 'filter.lowCalorieDesc',
    test: (n) => (n.calories || 0) <= 100,
  },
  'high-fiber': {
    icon: '🌾', labelKey: 'filter.highFiber', descKey: 'filter.highFiberDesc',
    test: (n) => (n.fiber || 0) >= 5,
  },
};

/** Returns which filters a food satisfies. Used for client-side matching & badges. */
export function filtersForFood(nutrients: NutrientValues): NutritionFilter[] {
  return NUTRITION_FILTERS.filter(f => NUTRITION_FILTER_META[f].test(nutrients));
}

/** @deprecated — alias kept so old code doesn't break during migration */
export type DietaryPref = NutritionFilter;
/** @deprecated */
export const DIETARY_PREFS = NUTRITION_FILTERS;
/** @deprecated */
export const DIETARY_PREF_META = NUTRITION_FILTER_META;

// ─── Body Metrics & Goals ───
export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';

export const ACTIVITY_LEVELS: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
export const GOALS: Goal[] = ['lose', 'maintain', 'gain'];

export interface BodyMetrics {
  weight_kg?: number;
  height_cm?: number;
  age?: number;
  sex?: Sex;
  activity_level?: ActivityLevel;
  goal?: Goal;
}

export const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,       // desk job, no exercise
  light: 1.375,         // light exercise 1-3 days/week
  moderate: 1.55,       // moderate exercise 3-5 days/week
  active: 1.725,        // hard exercise 6-7 days/week
  very_active: 1.9,     // very hard + physical job
};

export const GOAL_CALORIE_ADJUSTMENT: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
};

// ─── Food Item ───
export interface FoodItem {
  id: string;
  source: 'moroccan' | 'custom' | 'off' | 'nourish' | 'usda' | 'mock';
  label: string;
  localLabel?: string;
  brand: string | null;
  category: string;
  priority?: number;
  nutrientsPer100g: NutrientValues;
}

export function displayLabel(food: FoodItem): string {
  return food.localLabel || food.label;
}

// ─── Meal planning ───
export interface SelectedIngredient {
  food: FoodItem;
  grams: number;
}

export interface SuggestionContext {
  strongIn: NutrientKey[];
  helpsWith: NutrientKey[];
  balances: NutrientKey[];
}

export interface MealSuggestion {
  name: string;
  quantities: Record<string, number>;
  nutrients: NutrientValues;
  score: number;
  explanation: string;
  context?: SuggestionContext;
  foods: FoodItem[];
}

export interface LoggedMeal {
  id: string;
  name: string;
  meal_type: MealType;
  nutrients: NutrientValues;
  foods: { label: string; grams: number; food_id?: string }[];
  time: string;
  date: string;
}

// ─── Stock ───
export interface StockItem {
  id: string;
  food_id: string;
  food_label: string;
  quantity_grams: number;
  initial_grams: number;
  unit: string;
  category: string;
  updated_at: string;
}

// ─── Family ───
export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  is_primary: boolean;
}

// ─── Weekly Report ───
export interface WeeklyReport {
  week_start: string;
  week_end: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  daily_averages: NutrientValues;
  days_tracked: number;
}

// ─── Trend data ───
export interface DailyIntake {
  date: string;
  nutrients: NutrientValues;
  meal_count: number;
}

// ─── Custom food ───
export interface CustomFoodInput {
  label_en: string;
  label_fr?: string;
  label_ar?: string;
  category: string;
  nutrientsPer100g: NutrientValues;
}

// ─── User profile ───
export interface UserProfile {
  id: string;
  name: string;
  language: Locale;
  targets: NutrientValues;
  dietary_prefs?: NutritionFilter[];  // DB column still named dietary_prefs; now holds NutritionFilter values
  body_metrics?: BodyMetrics;
}

// ─── Nutrient display metadata ───
export interface NutrientMeta {
  label: string;
  unit: string;
  color: string;
  icon: string;
  ring?: boolean;
}

export const NUTRIENT_META: Record<NutrientKey, NutrientMeta> = {
  calories:   { label: 'nutrient.calories',   unit: 'kcal', color: '#FF5722', icon: '🔥', ring: true },
  protein:    { label: 'nutrient.protein',    unit: 'g',    color: '#8E44AD', icon: '💪', ring: true },
  carbs:      { label: 'nutrient.carbs',      unit: 'g',    color: '#9C27B0', icon: '🍞', ring: true },
  fat:        { label: 'nutrient.fat',        unit: 'g',    color: '#FFC107', icon: '🫒', ring: true },
  iron:       { label: 'nutrient.iron',       unit: 'mg',   color: '#E74C3C', icon: '🩸', ring: true },
  vitaminC:   { label: 'nutrient.vitaminC',   unit: 'mg',   color: '#FF9800', icon: '🍊', ring: true },
  fiber:      { label: 'nutrient.fiber',      unit: 'g',    color: '#4CAF50', icon: '🌾', ring: true },
  vitaminB12: { label: 'nutrient.vitaminB12', unit: 'μg',   color: '#E91E63', icon: '🧬' },
  folate:     { label: 'nutrient.folate',     unit: 'μg',   color: '#27AE60', icon: '🌿' },
  zinc:       { label: 'nutrient.zinc',       unit: 'mg',   color: '#795548', icon: '⚡' },
  iodine:     { label: 'nutrient.iodine',     unit: 'μg',   color: '#2980B9', icon: '🌊' },
  selenium:   { label: 'nutrient.selenium',   unit: 'μg',   color: '#F39C12', icon: '✨' },
};

export const DEFAULT_TARGETS: NutrientValues = {
  calories: 2000, protein: 50, carbs: 260, fat: 65, iron: 18, vitaminC: 75, fiber: 25,
  vitaminB12: 2.4, folate: 400, zinc: 8, iodine: 150, selenium: 55,
};
