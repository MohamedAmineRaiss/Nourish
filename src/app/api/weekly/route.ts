import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';
import { callGeminiJSON } from '@/lib/gemini';
import { ALL_NUTRIENTS, emptyNutrients, DEFAULT_TARGETS } from '@/types';

export const dynamic = 'force-dynamic';

function getWeekBounds(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('device_id');
  const lang = request.nextUrl.searchParams.get('lang') || 'en';
  if (!deviceId) return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });

  const geminiKey = process.env.GEMINI_API_KEY;
  const supabase = getServerSupabase();
  const { start, end } = getWeekBounds();

  // Check cache first
  const { data: cached } = await supabase
    .from('weekly_reports')
    .select('report_json')
    .eq('device_id', deviceId)
    .eq('week_start', start)
    .maybeSingle();

  if (cached?.report_json) {
    return NextResponse.json({ report: cached.report_json, cached: true });
  }

  // Fetch all meals this week
  const { data: meals } = await supabase
    .from('meals')
    .select('*')
    .eq('device_id', deviceId)
    .gte('date', start)
    .lte('date', end)
    .order('date');

  if (!meals || meals.length === 0) {
    return NextResponse.json({ report: null, message: 'No meals this week yet' });
  }

  // Calculate daily averages
  const dailyTotals: Record<string, any> = {};
  for (const meal of meals) {
    if (!dailyTotals[meal.date]) dailyTotals[meal.date] = emptyNutrients();
    const nutrients = meal.nutrients || {};
    for (const n of ALL_NUTRIENTS) {
      dailyTotals[meal.date][n] += nutrients[n] || 0;
    }
  }

  const days = Object.keys(dailyTotals);
  const avgNutrients = emptyNutrients();
  for (const day of days) {
    for (const n of ALL_NUTRIENTS) {
      avgNutrients[n] += dailyTotals[day][n] / days.length;
    }
  }

  // Round averages
  for (const n of ALL_NUTRIENTS) {
    avgNutrients[n] = Math.round(avgNutrients[n] * 10) / 10;
  }

  // If no Gemini key, return just the raw data
  if (!geminiKey) {
    const fallback = {
      week_start: start,
      week_end: end,
      days_tracked: days.length,
      daily_averages: avgNutrients,
      summary: 'Weekly report (no AI analysis — add GEMINI_API_KEY for insights)',
      strengths: [],
      gaps: [],
      suggestions: [],
    };
    return NextResponse.json({ report: fallback });
  }

  // Call Gemini for analysis
  const langName = lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English';
  const prompt = `You are a nutrition advisor for a Moroccan family. Analyze this week's nutrition data and provide a helpful weekly report.

Family: father (56, male), mother (49, female, primary user), daughter (31, female), daughter (13, female).

Daily targets: ${JSON.stringify(DEFAULT_TARGETS)}
Daily averages this week (${days.length} days tracked): ${JSON.stringify(avgNutrients)}

Respond in ${langName}. Return ONLY valid JSON with this exact structure:
{
  "summary": "2-3 sentence overview of the week",
  "strengths": ["nutrient/habit they did well", "another strength"],
  "gaps": ["nutrient gap or concern", "another gap"],
  "suggestions": ["specific actionable tip", "another tip", "another tip"]
}`;

  const report = await callGeminiJSON(prompt, geminiKey, 800);

  if (report) {
    const fullReport = {
      week_start: start,
      week_end: end,
      days_tracked: days.length,
      daily_averages: avgNutrients,
      ...report,
    };

    // Cache the report
    await supabase.from('weekly_reports').upsert({
      device_id: deviceId,
      week_start: start,
      week_end: end,
      report_json: fullReport,
    }, { onConflict: 'device_id,week_start' });

    return NextResponse.json({ report: fullReport });
  }

  return NextResponse.json({ report: { week_start: start, week_end: end, days_tracked: days.length, daily_averages: avgNutrients, summary: 'Unable to generate AI analysis', strengths: [], gaps: [], suggestions: [] } });
}
