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

// ─── Dietary Preferences ───
export type DietaryPref = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free';

export const DIETARY_PREFS: DietaryPref[] = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'];

export const DIETARY_PREF_META: Record<DietaryPref, { icon: string; labelKey: string }> = {
  'vegetarian': { icon: '🥬', labelKey: 'diet.vegetarian' },
  'vegan':      { icon: '🌱', labelKey: 'diet.vegan' },
  'gluten-free':{ icon: '🌾', labelKey: 'diet.glutenFree' },
  'dairy-free': { icon: '🥛', labelKey: 'diet.dairyFree' },
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

// ─── Food Item ───
export interface FoodItem {
  id: string;
  source: 'nourish' | 'custom' | 'usda' | 'openfoodfacts' | 'mock';
  label: string;
  localLabel?: string;
  brand: string | null;
  category: string;
  dietary_tags?: DietaryPref[];
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

// Rich explanation for suggestions
export interface SuggestionContext {
  strongIn: NutrientKey[];       // meal covers ≥80% of need
  helpsWith: NutrientKey[];      // meal provides meaningful (≥30%) but not enough
  balances: NutrientKey[];       // nutrient was previously over-consumed, this meal is lighter
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
  date: string;              // YYYY-MM-DD
  nutrients: NutrientValues;
  meal_count: number;
}

// ─── Custom food (user-created) ───
export interface CustomFoodInput {
  label_en: string;
  label_fr?: string;
  label_ar?: string;
  category: string;
  dietary_tags: DietaryPref[];
  nutrientsPer100g: NutrientValues;
}

// ─── User profile ───
export interface UserProfile {
  id: string;
  name: string;
  language: Locale;
  targets: NutrientValues;
  dietary_prefs?: DietaryPref[];
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
