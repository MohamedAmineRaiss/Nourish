import { FoodItem, NutrientValues, emptyNutrients } from '@/types';

// USDA FoodData Central nutrient IDs
// https://fdc.nal.usda.gov/api-guide.html
const NUTRIENT_MAP: Record<number, keyof NutrientValues> = {
  1008: 'calories',    // Energy (kcal)
  1003: 'protein',     // Protein
  1004: 'fat',         // Total lipid (fat)
  1005: 'carbs',       // Carbohydrate, by difference
  1079: 'fiber',       // Fiber, total dietary
  1089: 'iron',        // Iron, Fe
  1090: 'zinc',        // Zinc, Zn
  1162: 'vitaminC',    // Vitamin C
  1177: 'folate',      // Folate, total
  1178: 'vitaminB12',  // Vitamin B-12
  1103: 'selenium',    // Selenium, Se
  1100: 'iodine',      // Iodine, I (rarely available in USDA, but we try)
};

// Backup mappings using nutrient names (for when IDs differ between food types)
const NUTRIENT_NAME_MAP: Record<string, keyof NutrientValues> = {
  'energy': 'calories',
  'protein': 'protein',
  'total lipid (fat)': 'fat',
  'carbohydrate, by difference': 'carbs',
  'fiber, total dietary': 'fiber',
  'iron, fe': 'iron',
  'zinc, zn': 'zinc',
  'vitamin c, total ascorbic acid': 'vitaminC',
  'folate, total': 'folate',
  'vitamin b-12': 'vitaminB12',
  'selenium, se': 'selenium',
  'iodine, i': 'iodine',
};

function extractCategory(foodCategory: string | undefined): string {
  if (!foodCategory) return 'Other';
  const cat = foodCategory.toLowerCase();
  if (cat.includes('beef') || cat.includes('pork') || cat.includes('lamb') || cat.includes('poultry') || cat.includes('chicken') || cat.includes('meat')) return 'Meat';
  if (cat.includes('fish') || cat.includes('seafood') || cat.includes('shellfish')) return 'Fish';
  if (cat.includes('vegetable') || cat.includes('greens')) return 'Vegetable';
  if (cat.includes('fruit')) return 'Fruit';
  if (cat.includes('legume') || cat.includes('bean') || cat.includes('lentil') || cat.includes('soy') || cat.includes('tofu')) return 'Legume';
  if (cat.includes('dairy') || cat.includes('milk') || cat.includes('cheese') || cat.includes('egg') || cat.includes('yogurt')) return 'Dairy & Eggs';
  if (cat.includes('grain') || cat.includes('cereal') || cat.includes('bread') || cat.includes('rice') || cat.includes('pasta')) return 'Grain';
  if (cat.includes('nut') || cat.includes('seed')) return 'Nut';
  return 'Other';
}

function parseNutrients(foodNutrients: any[]): NutrientValues {
  const result = emptyNutrients();
  if (!foodNutrients) return result;

  for (const n of foodNutrients) {
    // Try by nutrient ID first
    const nutrientId = n.nutrientId || n.nutrient?.id;
    if (nutrientId && NUTRIENT_MAP[nutrientId]) {
      result[NUTRIENT_MAP[nutrientId]] = n.value ?? n.amount ?? 0;
      continue;
    }
    // Fall back to name matching
    const name = (n.nutrientName || n.nutrient?.name || '').toLowerCase();
    if (NUTRIENT_NAME_MAP[name]) {
      result[NUTRIENT_NAME_MAP[name]] = n.value ?? n.amount ?? 0;
    }
  }
  return result;
}

export async function searchUSDA(query: string, apiKey: string, pageSize = 15): Promise<FoodItem[]> {
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=Foundation,SR Legacy`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`USDA API error: ${res.status}`);

  const data = await res.json();
  if (!data.foods || !Array.isArray(data.foods)) return [];

  return data.foods.map((food: any) => ({
    id: `usda-${food.fdcId}`,
    source: 'usda' as const,
    label: food.description || 'Unknown',
    brand: food.brandName || food.brandOwner || null,
    category: extractCategory(food.foodCategory),
    nutrientsPer100g: parseNutrients(food.foodNutrients),
  }));
}
