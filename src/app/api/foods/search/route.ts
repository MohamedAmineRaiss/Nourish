import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { FoodItem, NutrientValues } from '@/types';

export const dynamic = 'force-dynamic';

function rowToFoodItem(row: any, lang: string, source: 'moroccan' | 'custom' | 'off'): FoodItem {
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
    priority: row.priority,
    nutrientsPer100g: nutrients,
  };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const lang = request.nextUrl.searchParams.get('lang') || 'en';
  const deviceId = request.nextUrl.searchParams.get('device_id');
  const category = request.nextUrl.searchParams.get('category');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ foods: [], source: 'none' });
  }

  const query = q.trim().toLowerCase();

  try {
    const supabase = getServerSupabase();

    // Main foods: search across labels + synonyms
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
        `synonyms.cs.{${query}}`,
      ].join(','))
      .order('priority', { ascending: false })    // whole foods first!
      .order('label_en', { ascending: true })
      .limit(40);

    if (category) {
      mainQuery = mainQuery.or(`category.eq.${category},category_fr.eq.${category},category_ar.eq.${category}`);
    }

    const { data: mainData, error } = await mainQuery;

    if (error) console.error('Foods search error:', error);

    let results: FoodItem[] = (mainData || []).map(r => {
      const src = r.source === 'off' ? 'off' : 'moroccan';
      return rowToFoodItem(r, lang, src as 'moroccan' | 'off');
    });

    // Custom user foods — always shown first when matching
    if (deviceId) {
      const { data: customData } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('device_id', deviceId)
        .or([
          `label_en.ilike.%${query}%`,
          `label_fr.ilike.%${query}%`,
          `label_ar.ilike.%${query}%`,
        ].join(','))
        .limit(10);

      if (customData) {
        const customItems = customData.map(r => rowToFoodItem(r, lang, 'custom'));
        results = [...customItems, ...results];
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
