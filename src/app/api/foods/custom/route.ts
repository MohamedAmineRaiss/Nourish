import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  if (!deviceId) return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('custom_foods')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ foods: [] });
  return NextResponse.json({ foods: data || [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    device_id,
    label_en, label_fr, label_ar,
    category,
    dietary_tags,
    nutrientsPer100g,
  } = body;

  if (!device_id || !label_en) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const n = nutrientsPer100g || {};

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('custom_foods')
    .insert({
      device_id,
      label_en,
      label_fr: label_fr || label_en,
      label_ar: label_ar || label_en,
      category: category || 'Other',
      dietary_tags: dietary_tags || [],
      calories: n.calories || 0,
      protein: n.protein || 0,
      fat: n.fat || 0,
      carbs: n.carbs || 0,
      fiber: n.fiber || 0,
      iron: n.iron || 0,
      zinc: n.zinc || 0,
      vitamin_c: n.vitaminC || 0,
      folate: n.folate || 0,
      vitamin_b12: n.vitaminB12 || 0,
      selenium: n.selenium || 0,
      iodine: n.iodine || 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ food: data });
}

export async function DELETE(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  const id = request.nextUrl.searchParams.get('id');
  if (!deviceId || !id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = getServerSupabase();
  await supabase.from('custom_foods').delete().eq('id', id).eq('device_id', deviceId);
  return NextResponse.json({ ok: true });
}
