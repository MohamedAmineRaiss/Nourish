import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

// GET: list all stock for a device
export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  if (!deviceId) return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('stock')
    .select('*')
    .eq('device_id', deviceId)
    .order('category', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Check for low-stock items (≤10% of initial)
  const lowStock = (data || []).filter(item => 
    item.initial_grams > 0 && item.quantity_grams <= item.initial_grams * 0.10 && item.quantity_grams > 0
  );

  return NextResponse.json({ stock: data || [], lowStock });
}

// POST: add or update stock item
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { device_id, food_id, food_label, quantity_grams, category } = body;
  if (!device_id || !food_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('stock')
    .upsert({
      device_id,
      food_id,
      food_label,
      quantity_grams: Math.max(0, quantity_grams),
      initial_grams: quantity_grams,
      category: category || 'Other',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'device_id,food_id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

// PATCH: deduct from stock (when meal is logged)
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { device_id, deductions } = body;
  // deductions: [{ food_id, grams }]
  if (!device_id || !deductions) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = getServerSupabase();
  const results = [];

  for (const { food_id, grams } of deductions) {
    // Get current stock
    const { data: current } = await supabase
      .from('stock')
      .select('quantity_grams')
      .eq('device_id', device_id)
      .eq('food_id', food_id)
      .maybeSingle();

    if (current) {
      const newQty = Math.max(0, current.quantity_grams - grams); // never negative
      const { data } = await supabase
        .from('stock')
        .update({ quantity_grams: newQty, updated_at: new Date().toISOString() })
        .eq('device_id', device_id)
        .eq('food_id', food_id)
        .select()
        .single();
      results.push(data);
    }
  }

  return NextResponse.json({ updated: results });
}

// DELETE: remove stock item
export async function DELETE(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  const foodId = request.nextUrl.searchParams.get('food_id');
  if (!deviceId || !foodId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = getServerSupabase();
  await supabase.from('stock').delete().eq('device_id', deviceId).eq('food_id', foodId);
  return NextResponse.json({ ok: true });
}
