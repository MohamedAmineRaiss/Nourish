import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { DEFAULT_TARGETS } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  if (!deviceId) return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({
        profile: {
          device_id: deviceId,
          name: 'Mama',
          language: 'en',
          targets: DEFAULT_TARGETS,
          dietary_prefs: [],
        },
        isNew: true,
      });
    }
    return NextResponse.json({ profile: data, isNew: false });
  } catch (err: any) {
    console.error('Profile GET error:', err);
    return NextResponse.json({
      profile: {
        device_id: deviceId,
        name: 'Mama',
        language: 'en',
        targets: DEFAULT_TARGETS,
        dietary_prefs: [],
      },
      isNew: true,
    });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { device_id, name, language, targets, dietary_prefs } = body;
  if (!device_id) return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });

  try {
    const supabase = getServerSupabase();
    const payload: any = {
      device_id,
      name,
      language,
      targets,
      updated_at: new Date().toISOString(),
    };
    // Only include dietary_prefs if provided (so we don't wipe it on partial saves)
    if (Array.isArray(dietary_prefs)) {
      payload.dietary_prefs = dietary_prefs;
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'device_id' })
      .select()
      .single();

    if (error) {
      console.error('Profile save error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ profile: data });
  } catch (err: any) {
    console.error('Profile POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
