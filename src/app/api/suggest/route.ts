import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { callGeminiJSON } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { device_id, lang, mode, ingredients, meal_type, daily_intake, targets } = body;
  // mode: 'stock' (use available stock) or 'custom' (user provided ingredients)

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  const langName = lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English';
  let availableIngredients = ingredients || [];

  // If mode is 'stock', fetch available stock
  if (mode === 'stock' && device_id) {
    const supabase = getServerSupabase();
    const { data: stock } = await supabase
      .from('stock')
      .select('food_label, quantity_grams, category')
      .eq('device_id', device_id)
      .gt('quantity_grams', 10); // only items with meaningful stock

    if (stock && stock.length > 0) {
      availableIngredients = stock.map((s: any) => `${s.food_label} (${Math.round(s.quantity_grams)}g available)`);
    } else {
      return NextResponse.json({
        suggestions: [],
        message: lang === 'ar' ? 'لا يوجد مخزون كافي. أضف مواد من صفحة المخزون أولاً.' :
                 lang === 'fr' ? 'Stock insuffisant. Ajoutez des ingrédients depuis la page stock.' :
                 'Not enough stock. Add ingredients from the Stock page first.',
      });
    }
  }

  if (availableIngredients.length === 0) {
    return NextResponse.json({ suggestions: [], message: 'No ingredients provided' });
  }

  const mealTypeLabel = meal_type || 'lunch';
  const intakeStr = daily_intake ? `Already eaten today: ${JSON.stringify(daily_intake)}` : '';
  const targetsStr = targets ? `Daily targets: ${JSON.stringify(targets)}` : '';

  const prompt = `You are a Moroccan family meal planner. Suggest 3 simple, practical ${mealTypeLabel} meals using ONLY these available ingredients:

${availableIngredients.join('\n')}

${intakeStr}
${targetsStr}

Context: Moroccan family of 4 (father 56, mother 49, daughters 31 and 13). Meals should be practical, nutritious, and culturally appropriate, also make sure to specifically tell the mother how much her portion should be as she is usually low in iron.

Respond in ${langName}. Return ONLY valid JSON:
{
  "meals": [
    {
      "name": "meal name",
      "description": "1-2 sentence description",
      "ingredients": [{"name": "ingredient", "grams": 200}],
      "cooking_tip": "brief cooking instruction"
    }
  ]
}`;

  const result = await callGeminiJSON(prompt, geminiKey, 1200);

  if (result?.meals) {
    return NextResponse.json({ suggestions: result.meals });
  }

  return NextResponse.json({ suggestions: [], message: 'Unable to generate suggestions' });
}
