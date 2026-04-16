import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  const date = request.nextUrl.searchParams.get('date');
  // If date is provided, get meals for that day
  // If range=week, get last 7 days
  const range = request.nextUrl.searchParams.get('range');

  if (!deviceId) return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });

  const supabase = getServerSupabase();

  let query = supabase.from('meals').select('*').eq('device_id', deviceId);

  if (range === 'week') {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    query = query.gte('date', weekAgo.toISOString().split('T')[0]);
  } else if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) return NextResponse.json({ meals: [] });
  return NextResponse.json({ meals: data || [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { device_id, date, name, meal_type, nutrients, foods, time } = body;
  if (!device_id || !date) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = getServerSupabase();

  // 1. Save the meal
  const { data, error } = await supabase
    .from('meals')
    .insert({
      device_id,
      date,
      name: name || meal_type || 'Meal',
      meal_type: meal_type || 'lunch',
      nutrients,
      foods,
      time,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 2. Deduct from stock (if foods have food_id)
  if (foods && Array.isArray(foods)) {
    for (const food of foods) {
      if (food.food_id && food.grams > 0) {
        const { data: stockItem } = await supabase
          .from('stock')
          .select('quantity_grams')
          .eq('device_id', device_id)
          .eq('food_id', food.food_id)
          .maybeSingle();

        if (stockItem) {
          const newQty = Math.max(0, stockItem.quantity_grams - food.grams);
          await supabase
            .from('stock')
            .update({ quantity_grams: newQty, updated_at: new Date().toISOString() })
            .eq('device_id', device_id)
            .eq('food_id', food.food_id);
        }
      }
    }
  }

  return NextResponse.json({ meal: data });
}

export async function DELETE(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  const date = request.nextUrl.searchParams.get('date');
  const mealId = request.nextUrl.searchParams.get('meal_id');

  if (!deviceId) return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });

  const supabase = getServerSupabase();

  if (mealId) {
    // Delete specific meal
    await supabase.from('meals').delete().eq('id', mealId).eq('device_id', deviceId);
  } else if (date) {
    // Delete all meals for a date (reset day)
    await supabase.from('meals').delete().eq('device_id', deviceId).eq('date', date);
  }

  return NextResponse.json({ ok: true });
}
