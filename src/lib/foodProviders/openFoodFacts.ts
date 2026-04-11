import { FoodItem, emptyNutrients, NutrientValues } from '@/types';

// Open Food Facts - ready for packaged food / barcode support
// Free API, no key needed: https://world.openfoodfacts.org/data

function parseOFFNutrients(nutriments: any): NutrientValues {
  const r = emptyNutrients();
  if (!nutriments) return r;
  r.calories   = nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal'] ?? 0;
  r.protein    = nutriments['proteins_100g'] ?? 0;
  r.fat        = nutriments['fat_100g'] ?? 0;
  r.carbs      = nutriments['carbohydrates_100g'] ?? 0;
  r.fiber      = nutriments['fiber_100g'] ?? 0;
  r.iron       = nutriments['iron_100g'] ? nutriments['iron_100g'] * 1000 : 0; // g -> mg
  r.zinc       = nutriments['zinc_100g'] ? nutriments['zinc_100g'] * 1000 : 0;
  r.vitaminC   = nutriments['vitamin-c_100g'] ? nutriments['vitamin-c_100g'] * 1000 : 0;
  r.folate     = nutriments['folates_100g'] ? nutriments['folates_100g'] * 1e6 : 0; // g -> μg
  r.vitaminB12 = nutriments['vitamin-b12_100g'] ? nutriments['vitamin-b12_100g'] * 1e6 : 0;
  r.selenium   = nutriments['selenium_100g'] ? nutriments['selenium_100g'] * 1e6 : 0;
  r.iodine     = nutriments['iodine_100g'] ? nutriments['iodine_100g'] * 1e6 : 0;
  return r;
}

export async function searchOpenFoodFacts(query: string, pageSize = 10): Promise<FoodItem[]> {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OFF API error: ${res.status}`);
  const data = await res.json();
  if (!data.products) return [];

  return data.products
    .filter((p: any) => p.product_name && p.nutriments)
    .map((p: any) => ({
      id: `off-${p.code || p._id}`,
      source: 'openfoodfacts' as const,
      label: p.product_name,
      brand: p.brands || null,
      category: p.categories_tags?.[0]?.replace('en:', '') || 'Packaged',
      nutrientsPer100g: parseOFFNutrients(p.nutriments),
    }));
}

export async function lookupBarcode(barcode: string): Promise<FoodItem | null> {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 1 || !data.product) return null;
  const p = data.product;
  return {
    id: `off-${barcode}`,
    source: 'openfoodfacts',
    label: p.product_name || 'Unknown',
    brand: p.brands || null,
    category: p.categories_tags?.[0]?.replace('en:', '') || 'Packaged',
    nutrientsPer100g: parseOFFNutrients(p.nutriments),
  };
}
