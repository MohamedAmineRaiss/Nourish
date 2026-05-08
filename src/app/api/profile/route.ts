import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { DEFAULT_TARGETS } from '@/types';

export const dynamic = 'force-dynamic';

function reshapeProfile(raw: any) {
  return {
    ...raw,
    body_metrics: {
      weight_kg: raw.weight_kg ?? undefined,
      height_cm: raw.height_cm ?? undefined,
      age: raw.age ?? undefined,
      sex: raw.sex ?? undefined,
      activity_level: raw.activity_level ?? undefined,
      goal: raw.goal ?? undefined,
    },
  };
}

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
          body_metrics: {},
        },
        isNew: true,
      });
    }
    return NextResponse.json({ profile: reshapeProfile(data), isNew: false });
  } catch (err: any) {
    console.error('Profile GET error:', err);
    return NextResponse.json({
      profile: {
        device_id: deviceId,
        name: 'Mama',
        language: 'en',
        targets: DEFAULT_TARGETS,
        dietary_prefs: [],
        body_metrics: {},
      },
      isNew: true,
    });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { device_id, name, language, targets, dietary_prefs, body_metrics } = body;
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

    if (Array.isArray(dietary_prefs)) payload.dietary_prefs = dietary_prefs;

    if (body_metrics && typeof body_metrics === 'object') {
      if ('weight_kg' in body_metrics) payload.weight_kg = body_metrics.weight_kg ?? null;
      if ('height_cm' in body_metrics) payload.height_cm = body_metrics.height_cm ?? null;
      if ('age' in body_metrics) payload.age = body_metrics.age ?? null;
      if ('sex' in body_metrics) payload.sex = body_metrics.sex ?? null;
      if ('activity_level' in body_metrics) payload.activity_level = body_metrics.activity_level ?? null;
      if ('goal' in body_metrics) payload.goal = body_metrics.goal ?? null;
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
    return NextResponse.json({ profile: reshapeProfile(data) });
  } catch (err: any) {
    console.error('Profile POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
