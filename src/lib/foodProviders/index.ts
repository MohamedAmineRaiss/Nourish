import { FoodItem, emptyNutrients } from '@/types';

// Tiny mock fallback for dev/offline mode only
export const MOCK_FOODS: FoodItem[] = [
  { id: 'mock-1', source: 'mock', label: 'Beef, ground, 85% lean', brand: null, category: 'Meat',
    nutrientsPer100g: { ...emptyNutrients(), iron: 2.6, protein: 26, iodine: 0.6, selenium: 18, vitaminB12: 2.6, folate: 7, zinc: 5.5, calories: 215, fat: 15 }},
  { id: 'mock-2', source: 'mock', label: 'Spinach, raw', brand: null, category: 'Vegetable',
    nutrientsPer100g: { ...emptyNutrients(), iron: 2.7, protein: 2.9, iodine: 0.3, selenium: 1, folate: 194, vitaminC: 28, zinc: 0.5, fiber: 2.2, calories: 23, carbs: 3.6, fat: 0.4 }},
  { id: 'mock-3', source: 'mock', label: 'Lentils, cooked', brand: null, category: 'Legume',
    nutrientsPer100g: { ...emptyNutrients(), iron: 3.3, protein: 9, selenium: 2.8, folate: 181, vitaminC: 1.5, zinc: 1.3, fiber: 7.9, calories: 116, carbs: 20, fat: 0.4 }},
  { id: 'mock-4', source: 'mock', label: 'Sardines, canned', brand: null, category: 'Fish',
    nutrientsPer100g: { ...emptyNutrients(), iron: 2.9, protein: 25, iodine: 35, selenium: 52.7, vitaminB12: 8.9, folate: 10, zinc: 1.3, calories: 208, fat: 11.5 }},
  { id: 'mock-5', source: 'mock', label: 'Eggs, whole, cooked', brand: null, category: 'Dairy & Eggs',
    nutrientsPer100g: { ...emptyNutrients(), iron: 1.8, protein: 13, iodine: 24, selenium: 30.8, vitaminB12: 1.1, folate: 44, zinc: 1.3, calories: 155, carbs: 1.1, fat: 11 }},
  { id: 'mock-6', source: 'mock', label: 'Chicken breast, cooked', brand: null, category: 'Meat',
    nutrientsPer100g: { ...emptyNutrients(), iron: 1.0, protein: 31, iodine: 1.4, selenium: 27.6, vitaminB12: 0.3, folate: 4, zinc: 1, calories: 165, fat: 3.6 }},
  { id: 'mock-7', source: 'mock', label: 'Salmon, cooked', brand: null, category: 'Fish',
    nutrientsPer100g: { ...emptyNutrients(), iron: 0.8, protein: 25, iodine: 14, selenium: 41.4, vitaminB12: 3.2, folate: 26, zinc: 0.6, calories: 208, fat: 13 }},
  { id: 'mock-8', source: 'mock', label: 'Brown rice, cooked', brand: null, category: 'Grain',
    nutrientsPer100g: { ...emptyNutrients(), iron: 0.5, protein: 2.6, selenium: 9.8, folate: 4, zinc: 0.6, fiber: 1.8, calories: 123, carbs: 26, fat: 0.9 }},
];

export function searchMock(query: string): FoodItem[] {
  const q = query.toLowerCase();
  return MOCK_FOODS.filter(f => f.label.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
}
