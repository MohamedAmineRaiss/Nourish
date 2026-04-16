import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { FoodItem, NutrientValues, emptyNutrients } from '@/types';

export const dynamic = 'force-dynamic';

// Map a Supabase food row to a FoodItem
function rowToFoodItem(row: any, lang: string): FoodItem {
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

  // Pick the label and category for the user's language
  const label = lang === 'fr' ? row.label_fr
              : lang === 'ar' ? row.label_ar
              : row.label_en;

  const category = lang === 'fr' ? row.category_fr
                 : lang === 'ar' ? row.category_ar
                 : row.category;

  return {
    id: row.id,
    source: 'usda' as const, // keep 'usda' for UI compatibility
    label: label,
    brand: null,
    category: category,
    nutrientsPer100g: nutrients,
  };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const lang = request.nextUrl.searchParams.get('lang') || 'en';

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ foods: [], source: 'none' });
  }

  const query = q.trim().toLowerCase();

  try {
    const supabase = getServerSupabase();

    // Search across all three language columns using ILIKE
    // This gives us native multilingual search with no translation needed
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .or(`label_en.ilike.%${query}%,label_fr.ilike.%${query}%,label_ar.ilike.%${query}%,category.ilike.%${query}%,category_fr.ilike.%${query}%,category_ar.ilike.%${query}%`)
      .order('label_en')
      .limit(20);

    if (error) {
      console.error('Foods search error:', error);
      return NextResponse.json({ foods: [], source: 'error' });
    }

    if (data && data.length > 0) {
      const foods = data.map((row: any) => rowToFoodItem(row, lang));
      return NextResponse.json({ foods, source: 'nourish' });
    }

    return NextResponse.json({ foods: [], source: 'none' });
  } catch (err) {
    console.error('Foods search error:', err);
    return NextResponse.json({ foods: [], source: 'error' });
  }
}
