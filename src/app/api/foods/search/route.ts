import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { FoodItem, NutrientValues, DietaryPref } from '@/types';

export const dynamic = 'force-dynamic';

function rowToFoodItem(row: any, lang: string, source: 'nourish' | 'custom'): FoodItem {
  const nutrients: NutrientValues = {
    calories: row.calories || 0,
    protein: row.protein || 0,
    fat: row.fat || 0,
    carbs: row.carbs || 0,
    fiber: row.fiber || 0,
    iron: row.iron || 0,
    zinc: row.zinc || 0,
    vitaminC: row.vitamin_c || 0,
    folate: row.folate || 0,
    vitaminB12: row.vitamin_b12 || 0,
    selenium: row.selenium || 0,
    iodine: row.iodine || 0,
  };

  const label = lang === 'fr' ? (row.label_fr || row.label_en)
              : lang === 'ar' ? (row.label_ar || row.label_en)
              : row.label_en;

  const category = lang === 'fr' ? (row.category_fr || row.category)
                 : lang === 'ar' ? (row.category_ar || row.category)
                 : row.category;

  return {
    id: source === 'custom' ? `custom:${row.id}` : row.id,
    source,
    label,
    brand: null,
    category: category || 'Other',
    dietary_tags: (row.dietary_tags || []) as DietaryPref[],
    nutrientsPer100g: nutrients,
  };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const lang = request.nextUrl.searchParams.get('lang') || 'en';
  const deviceId = request.nextUrl.searchParams.get('device_id');
  // dietary: comma-separated list e.g. "vegetarian,gluten-free"
  const dietary = request.nextUrl.searchParams.get('dietary');
  const category = request.nextUrl.searchParams.get('category');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ foods: [], source: 'none' });
  }

  const query = q.trim().toLowerCase();
  const dietaryFilters = dietary ? dietary.split(',').filter(Boolean) : [];

  try {
    const supabase = getServerSupabase();

    // ─── Main food DB search ───
    let mainQuery = supabase
      .from('foods')
      .select('*')
      .or([
        `label_en.ilike.%${query}%`,
        `label_fr.ilike.%${query}%`,
        `label_ar.ilike.%${query}%`,
        `category.ilike.%${query}%`,
        `category_fr.ilike.%${query}%`,
        `category_ar.ilike.%${query}%`,
        `synonyms.cs.{${query}}`,  // contains-string array match on synonyms
      ].join(','))
      .limit(30);

    // Apply dietary filter (food must contain ALL selected tags)
    if (dietaryFilters.length > 0) {
      mainQuery = mainQuery.contains('dietary_tags', dietaryFilters);
    }

    // Category filter
    if (category) {
      mainQuery = mainQuery.or(`category.eq.${category},category_fr.eq.${category},category_ar.eq.${category}`);
    }

    const { data: mainData, error } = await mainQuery.order('label_en');

    if (error) {
      console.error('Foods search error:', error);
      // Keep going — still try custom
    }

    let results: FoodItem[] = (mainData || []).map(r => rowToFoodItem(r, lang, 'nourish'));

    // ─── Custom foods (device-owned) ───
    if (deviceId) {
      let customQuery = supabase
        .from('custom_foods')
        .select('*')
        .eq('device_id', deviceId)
        .or([
          `label_en.ilike.%${query}%`,
          `label_fr.ilike.%${query}%`,
          `label_ar.ilike.%${query}%`,
        ].join(','))
        .limit(10);

      if (dietaryFilters.length > 0) {
        customQuery = customQuery.contains('dietary_tags', dietaryFilters);
      }

      const { data: customData } = await customQuery;
      if (customData) {
        const customItems = customData.map(r => rowToFoodItem(r, lang, 'custom'));
        results = [...customItems, ...results]; // customs first
      }
    }

    return NextResponse.json({
      foods: results.slice(0, 30),
      source: results.length > 0 ? 'nourish' : 'none',
    });
  } catch (err) {
    console.error('Foods search error:', err);
    return NextResponse.json({ foods: [], source: 'error' });
  }
}
