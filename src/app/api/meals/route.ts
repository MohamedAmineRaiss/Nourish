import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  const date = request.nextUrl.searchParams.get('date');
  if (!deviceId || !date) {
    return NextResponse.json({ error: 'Missing device_id or date' }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('device_id', deviceId)
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Meals fetch error:', error);
      return NextResponse.json({ meals: [] });
    }
    return NextResponse.json({ meals: data || [] });
  } catch (err: any) {
    console.error('Meals GET error:', err);
    return NextResponse.json({ meals: [] });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { device_id, date, name, nutrients, foods, time } = body;
  if (!device_id || !date) {
    return NextResponse.json({ error: 'Missing device_id or date' }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('meals')
      .insert({ device_id, date, name, nutrients, foods, time, created_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      console.error('Meal save error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ meal: data });
  } catch (err: any) {
    console.error('Meal POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  const date = request.nextUrl.searchParams.get('date');
  if (!deviceId || !date) {
    return NextResponse.json({ error: 'Missing device_id or date' }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('device_id', deviceId)
      .eq('date', date);

    if (error) {
      console.error('Meals delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Meals DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
