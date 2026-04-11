// ─── Nutrient Keys ───
export type PriorityNutrient =
  | 'calories'
  | 'protein'
  | 'carbs'
  | 'fat'
  | 'iron'
  | 'vitaminC'
  | 'fiber';

export type SecondaryNutrient =
  | 'vitaminB12'
  | 'folate'
  | 'zinc'
  | 'iodine'
  | 'selenium';

export type NutrientKey = PriorityNutrient | SecondaryNutrient;

export const PRIORITY_NUTRIENTS: PriorityNutrient[] = [
  'calories',
  'protein',
  'carbs',
  'fat',
  'iron',
  'vitaminC',
  'fiber',
];

export const SECONDARY_NUTRIENTS: SecondaryNutrient[] = [
  'vitaminB12',
  'folate',
  'zinc',
  'iodine',
  'selenium',
];

export const ALL_NUTRIENTS: NutrientKey[] = [
  ...PRIORITY_NUTRIENTS,
  ...SECONDARY_NUTRIENTS,
];

// ─── Nutrient values map ───
export type NutrientValues = Record<NutrientKey, number>;

export function emptyNutrients(): NutrientValues {
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    iron: 0,
    vitaminC: 0,
    fiber: 0,
    vitaminB12: 0,
    folate: 0,
    zinc: 0,
    iodine: 0,
    selenium: 0,
  };
}

// ─── Food item (normalized from any provider) ───
export interface FoodItem {
  id: string;
  source: 'usda' | 'openfoodfacts' | 'mock';
  label: string;
  brand: string | null;
  category: string;
  nutrientsPer100g: NutrientValues;
}

// ─── Meal planning ───
export interface SelectedIngredient {
  food: FoodItem;
  grams: number;
}

export interface MealSuggestion {
  name: string;
  quantities: Record<string, number>; // foodId -> grams
  nutrients: NutrientValues;
  score: number;
  explanation: string;
  foods: FoodItem[];
}

export interface LoggedMeal {
  id: string;
  name: string;
  nutrients: NutrientValues;
  foods: { label: string; grams: number }[];
  time: string;
  date: string;
}

// ─── User profile ───
export interface UserProfile {
  id: string;
  name: string;
  language: 'en' | 'ar' | 'fr';
  targets: NutrientValues;
}

// ─── Nutrient display metadata ───
export interface NutrientMeta {
  label: string; // i18n key
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
  calories: 2000,
  protein: 50,
  carbs: 260,
  fat: 65,
  iron: 18,
  vitaminC: 75,
  fiber: 25,
  vitaminB12: 2.4,
  folate: 400,
  zinc: 8,
  iodine: 150,
  selenium: 55,
};
