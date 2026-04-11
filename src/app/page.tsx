'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  FoodItem, NutrientValues, MealSuggestion, LoggedMeal,
  NutrientKey, Locale, PRIORITY_NUTRIENTS, SECONDARY_NUTRIENTS, ALL_NUTRIENTS,
  NUTRIENT_META, DEFAULT_TARGETS, emptyNutrients,
} from '@/types';
import { t, isRTL, LOCALE_LABELS } from '@/lib/i18n';
import { getDeviceId } from '@/lib/supabase';
import { generateCombinations } from '@/lib/recommendationEngine';

import NutrientRing from '@/components/NutrientRing';
import NutrientBar from '@/components/NutrientBar';
import Card from '@/components/Card';
import Btn from '@/components/Btn';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import PlanMeal from '@/components/PlanMeal';
import Settings from '@/components/Settings';

// ─── Helpers ───
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function timeStr() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function greetingKey(): string {
  const h = new Date().getHours();
  if (h < 12) return 'greeting.morning';
  if (h < 17) return 'greeting.afternoon';
  return 'greeting.evening';
}

// ─── Main App Component ───
export default function App() {
  // State
  const [page, setPage] = useState('dashboard');
  const [locale, setLocaleState] = useState<Locale>('en');
  const [profileName, setProfileName] = useState('Mama');
  const [targets, setTargets] = useState<NutrientValues>({ ...DEFAULT_TARGETS });
  const [editTargets, setEditTargets] = useState<NutrientValues>({ ...DEFAULT_TARGETS });
  const [dailyIntake, setDailyIntake] = useState<NutrientValues>(emptyNutrients());
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchSource, setSearchSource] = useState('');
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [chosenSuggestion, setChosenSuggestion] = useState<MealSuggestion | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const searchTimer = useRef<any>(null);
  const deviceId = useRef<string>('');

  // ─── Toast helper ───
  const showToast = useCallback((key: string) => {
    setToast(t(key, locale));
    setTimeout(() => setToast(null), 2500);
  }, [locale]);

  // ─── RTL support ───
  useEffect(() => {
    const dir = isRTL(locale) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  // ─── Set locale with persistence ───
  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  // ─── Load profile & meals from Supabase on mount ───
  useEffect(() => {
    async function init() {
      deviceId.current = getDeviceId();
      try {
        // Load profile
        const profRes = await fetch(`/api/profile?device_id=${deviceId.current}`);
        const profData = await profRes.json();
        if (profData.profile) {
          setProfileName(profData.profile.name || 'Mama');
          setLocaleState(profData.profile.language || 'en');
          if (profData.profile.targets) {
            const t = profData.profile.targets;
            setTargets({ ...DEFAULT_TARGETS, ...t });
            setEditTargets({ ...DEFAULT_TARGETS, ...t });
          }
        }
        // Load today's meals
        const mealsRes = await fetch(`/api/meals?device_id=${deviceId.current}&date=${todayStr()}`);
        const mealsData = await mealsRes.json();
        if (mealsData.meals && mealsData.meals.length > 0) {
          const loaded: LoggedMeal[] = mealsData.meals.map((m: any) => ({
            id: m.id,
            name: m.name,
            nutrients: m.nutrients,
            foods: m.foods,
            time: m.time,
            date: m.date,
          }));
          setMeals(loaded);
          // Recalculate daily intake
          const intake = emptyNutrients();
          for (const meal of loaded) {
            for (const n of ALL_NUTRIENTS) {
              intake[n] += meal.nutrients?.[n] || 0;
            }
          }
          setDailyIntake(intake);
        }
      } catch (err) {
        console.error('Init error:', err);
      }
      setLoaded(true);
    }
    init();
  }, []);

  // ─── Search foods via API (debounced) ───
  const doSearch = useCallback((q: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/foods/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResults(data.foods || []);
        setSearchSource(data.source || '');
      } catch {
        setSearchResults([]);
      }
      setSearching(false);
    }, 350);
  }, []);

  useEffect(() => {
    doSearch(searchQuery);
  }, [searchQuery, doSearch]);

  // ─── Actions ───
  const addFood = (food: FoodItem) => {
    if (!selectedFoods.find((f) => f.id === food.id)) {
      setSelectedFoods((prev) => [...prev, food]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFood = (id: string) => {
    setSelectedFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const doGenerate = () => {
    const combos = generateCombinations(selectedFoods, targets, dailyIntake);
    setSuggestions(combos);
    setPage('suggestions');
  };

  const applySuggestion = (s: MealSuggestion) => {
    setChosenSuggestion(s);
    setPage('planned');
  };

  const addMealToDay = async () => {
    if (!chosenSuggestion) return;
    const newMeal: LoggedMeal = {
      id: crypto.randomUUID(),
      name: chosenSuggestion.name,
      nutrients: { ...chosenSuggestion.nutrients },
      foods: chosenSuggestion.foods.map((f) => ({
        label: f.label,
        grams: chosenSuggestion.quantities[f.id],
      })),
      time: timeStr(),
      date: todayStr(),
    };

    // Update local state
    const newIntake = { ...dailyIntake };
    for (const n of ALL_NUTRIENTS) {
      newIntake[n] += chosenSuggestion.nutrients[n] || 0;
    }
    setDailyIntake(newIntake);
    setMeals((prev) => [...prev, newMeal]);
    setSelectedFoods([]);
    setSuggestions([]);
    setChosenSuggestion(null);
    showToast('toast.mealAdded');
    setPage('dashboard');

    // Persist to Supabase
    try {
      await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId.current,
          date: todayStr(),
          name: newMeal.name,
          nutrients: newMeal.nutrients,
          foods: newMeal.foods,
          time: newMeal.time,
        }),
      });
    } catch (err) {
      console.error('Save meal error:', err);
    }
  };

  const resetDay = async () => {
    setDailyIntake(emptyNutrients());
    setMeals([]);
    showToast('toast.dayReset');
    try {
      await fetch(`/api/meals?device_id=${deviceId.current}&date=${todayStr()}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const saveSettings = async () => {
    setTargets({ ...editTargets });
    showToast('toast.settingsSaved');
    setPage('dashboard');
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId.current,
          name: profileName,
          language: locale,
          targets: editTargets,
        }),
      });
    } catch (err) {
      console.error('Save settings error:', err);
    }
  };

  // Nutrient label helper for suggestions
  const nutrientLabel = (key: NutrientKey): string => t(NUTRIENT_META[key].label, locale);

  // ═══════════════════════════════════════════════
  // PAGES
  // ═══════════════════════════════════════════════

  // ─── DASHBOARD ───
  const Dashboard = () => {
    const topMissing = ALL_NUTRIENTS
      .filter((n) => targets[n] > 0 && (dailyIntake[n] / targets[n]) < 0.7)
      .sort((a, b) => (dailyIntake[a] / targets[a]) - (dailyIntake[b] / targets[b]))
      .slice(0, 5);

    return (
      <div className="flex flex-col gap-5 animate-page">
        <div className="text-center pt-1">
          <h2 className="font-display text-2xl text-bark-500 dark:text-cream-100">
            {t(greetingKey(), locale)}, {profileName} 👋
          </h2>
          <p className="font-body text-sm text-bark-200 dark:text-bark-100 mt-1">
            {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </p>
        </div>

        <Card>
          <h3 className="font-display text-[17px] text-bark-500 dark:text-cream-200 mb-4">
            {t('dashboard.keyNutrients', locale)}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {PRIORITY_NUTRIENTS.map((n) => (
              <NutrientRing key={n} nutrient={n} current={dailyIntake[n]} target={targets[n]} locale={locale} />
            ))}
          </div>
        </Card>

        {topMissing.length > 0 && (
          <Card highlight>
            <h3 className="font-display text-[17px] text-bark-500 dark:text-cream-200 mb-1">
              {t('dashboard.stillNeeded', locale)}
            </h3>
            <p className="font-body text-xs text-bark-200 dark:text-bark-100 mb-3">
              {t('dashboard.stillNeededDesc', locale)}
            </p>
            {topMissing.map((n) => (
              <NutrientBar key={n} nutrient={n} current={dailyIntake[n]} target={targets[n]} locale={locale} />
            ))}
          </Card>
        )}

        {meals.length > 0 ? (
          <Card>
            <h3 className="font-display text-[17px] text-bark-500 dark:text-cream-200 mb-3">
              {t('dashboard.todaysMeals', locale)}
            </h3>
            {meals.map((m) => (
              <div key={m.id} className="py-2.5 border-b border-cream-300 dark:border-bark-400 last:border-0">
                <div className="flex justify-between items-center">
                  <span className="font-body font-semibold text-sm text-bark-500 dark:text-cream-200">{m.name}</span>
                  <span className="font-body text-xs text-bark-200 dark:text-bark-100">{m.time}</span>
                </div>
                <div className="font-body text-xs text-bark-200 dark:text-bark-100 mt-1">
                  {m.foods.map((f) => `${f.label.split(',')[0]} ${f.grams}g`).join(' · ')}
                </div>
              </div>
            ))}
          </Card>
        ) : (
          <Card>
            <p className="font-body text-sm text-bark-200 dark:text-bark-100 text-center py-4">
              {t('dashboard.noMeals', locale)}
            </p>
          </Card>
        )}

        <Btn
          onClick={() => { setSelectedFoods([]); setSuggestions([]); setChosenSuggestion(null); setSearchQuery(''); setPage('plan'); }}
          className="w-full !py-4 !text-base !rounded-2xl"
        >
          🍳 {t('dashboard.planNext', locale)}
        </Btn>
      </div>
    );
  };

 //  ─── PLAN MEAL ───

  // ─── SUGGESTIONS ───
  const Suggestions = () => (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">{t('suggestions.title', locale)}</h2>
      <p className="font-body text-[13px] text-bark-200 dark:text-bark-100 -mt-2">{t('suggestions.subtitle', locale)}</p>

      {suggestions.map((s, i) => {
        // Build a localized explanation
        const bestKeys = ALL_NUTRIENTS
          .filter((n) => targets[n] > 0 && s.nutrients[n] > 0)
          .sort((a, b) => {
            const remA = Math.max(targets[a] - dailyIntake[a], 0.001);
            const remB = Math.max(targets[b] - dailyIntake[b], 0.001);
            return (s.nutrients[b] / remB) - (s.nutrients[a] / remA);
          })
          .slice(0, 3);
        const localExplanation = bestKeys.length > 0
          ? `${bestKeys.map((k) => nutrientLabel(k)).join(', ')}`
          : s.explanation;

        return (
          <Card key={i} onClick={() => applySuggestion(s)} className="cursor-pointer">
            <div className="flex justify-between items-start mb-2.5">
              <div>
                <h4 className="font-display text-[16px] text-bark-500 dark:text-cream-200">
                  {t('suggestions.option', locale)} {i + 1}
                </h4>
                <p className="font-body text-xs text-terra-500 font-semibold mt-1">
                  ↑ {localExplanation}
                </p>
              </div>
              <span className="bg-terra-500 text-white rounded-xl px-2.5 py-1 font-body font-bold text-xs flex-shrink-0">
                {Math.round(s.score)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {s.foods.map((f) => (
                <span key={f.id} className="bg-cream-200 dark:bg-bark-400 rounded-lg px-3 py-1.5 font-body text-[13px] font-semibold text-bark-500 dark:text-cream-200">
                  {f.label.split(',')[0]} <span className="text-terra-500">{s.quantities[f.id]}g</span>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRIORITY_NUTRIENTS.map((n) => {
                const rem = Math.max(targets[n] - dailyIntake[n], 0.001);
                const pct = Math.round((s.nutrients[n] / rem) * 100);
                return (
                  <span
                    key={n}
                    className="text-[11px] font-body font-semibold px-2 py-1 rounded-lg"
                    style={{
                      background: pct > 50 ? `${NUTRIENT_META[n].color}22` : undefined,
                      color: pct > 50 ? NUTRIENT_META[n].color : undefined,
                    }}
                  >
                    {NUTRIENT_META[n].icon} {nutrientLabel(n)} +{Math.min(pct, 999)}%
                  </span>
                );
              })}
            </div>

            <Btn variant="secondary" className="w-full mt-3">
              {t('suggestions.choose', locale)} →
            </Btn>
          </Card>
        );
      })}

      <Btn variant="ghost" onClick={() => setPage('plan')} className="mx-auto">
        ← {t('suggestions.back', locale)}
      </Btn>
    </div>
  );

  // ─── PLANNED MEAL ───
  const PlannedMeal = () => {
    if (!chosenSuggestion) return null;
    return (
      <div className="flex flex-col gap-4 animate-page">
        <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">{t('planned.title', locale)}</h2>

        <Card>
          <h3 className="font-display text-[16px] text-bark-500 dark:text-cream-200 mb-3">{chosenSuggestion.name}</h3>
          {chosenSuggestion.foods.map((f) => (
            <div key={f.id} className="flex justify-between py-2 border-b border-cream-300 dark:border-bark-400 last:border-0">
              <span className="font-body text-sm text-bark-500 dark:text-cream-200 truncate flex-1">
                {f.label.length > 35 ? f.label.substring(0, 35) + '…' : f.label}
              </span>
              <span className="font-body text-sm font-bold text-terra-500 flex-shrink-0 ms-2">
                {chosenSuggestion.quantities[f.id]}g
              </span>
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="font-display text-[16px] text-bark-500 dark:text-cream-200 mb-3">
            {t('planned.provides', locale)}
          </h3>
          {ALL_NUTRIENTS.map((n) => {
            const val = chosenSuggestion.nutrients[n] || 0;
            if (val < 0.01) return null;
            return <NutrientBar key={n} nutrient={n} current={val} target={targets[n]} locale={locale} />;
          })}
        </Card>

        <Btn onClick={addMealToDay} className="w-full !py-4 !text-base !rounded-2xl">
          ✅ {t('planned.addToDay', locale)}
        </Btn>
        <Btn variant="ghost" onClick={() => setPage('suggestions')} className="mx-auto">
          ← {t('planned.backSuggestions', locale)}
        </Btn>
      </div>
    );
  };

  // ─── TRACKER ───
  const Tracker = () => (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">{t('tracker.title', locale)}</h2>

      <Card>
        <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-1">{t('tracker.priority', locale)}</h3>
        {PRIORITY_NUTRIENTS.map((n) => (
          <NutrientBar key={n} nutrient={n} current={dailyIntake[n]} target={targets[n]} locale={locale} />
        ))}
      </Card>

      <Card>
        <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-1">{t('tracker.all', locale)}</h3>
        {SECONDARY_NUTRIENTS.map((n) => (
          <NutrientBar key={n} nutrient={n} current={dailyIntake[n]} target={targets[n]} locale={locale} />
        ))}
      </Card>

      {meals.length > 0 ? (
        <Card>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-3">{t('tracker.mealsLogged', locale)}</h3>
          {meals.map((m) => (
            <div key={m.id} className="py-2.5 border-b border-cream-300 dark:border-bark-400 last:border-0">
              <div className="flex justify-between">
                <span className="font-body font-semibold text-sm text-bark-500 dark:text-cream-200">{m.name}</span>
                <span className="font-body text-xs text-bark-200 dark:text-bark-100">{m.time}</span>
              </div>
              <div className="font-body text-xs text-bark-200 dark:text-bark-100 mt-1">
                {m.foods.map((f) => `${f.label.split(',')[0]} ${f.grams}g`).join(' · ')}
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <Card>
          <p className="font-body text-sm text-bark-200 dark:text-bark-100 text-center py-4">
            {t('tracker.noMeals', locale)}
          </p>
        </Card>
      )}

      <Btn variant="danger" onClick={resetDay} className="w-full">
        🔄 {t('tracker.resetDay', locale)}
      </Btn>
    </div>
  );

    // ─── SETTINGS ───

  // ─── Page map ───
    const pages: Record<string, React.ReactNode> = {
      dashboard: <Dashboard />,
      plan: (
        <PlanMeal
          locale={locale}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searching={searching}
          searchResults={searchResults}
          searchSource={searchSource}
          selectedFoods={selectedFoods}
          addFood={addFood}
          removeFood={removeFood}
          doGenerate={doGenerate}
        />
      ),
      suggestions: <Suggestions />,
      planned: <PlannedMeal />,
      tracker: <Tracker />,
      settings: (<Settings
                     locale={locale}
                         profileName={profileName}
                         setProfileName={setProfileName}
                         setLocale={setLocale}
                         editTargets={editTargets}
                         setEditTargets={setEditTargets}
                         saveSettings={saveSettings}
                 />,
                ),
    };

  // ─── Loading state ───
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--page-bg)' }}>
        <div className="text-center">
          <span className="text-4xl block mb-3">🥗</span>
          <div className="w-8 h-8 border-3 border-terra-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // ─── RENDER ───
  return (
    <div className="min-h-screen max-w-[520px] mx-auto pb-24 relative" style={{ background: 'var(--page-bg)' }}>
      {/* Header */}
      <header className="flex justify-between items-center px-5 pt-5 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-[28px]">🥗</span>
          <span className="font-display text-xl text-bark-500 dark:text-cream-100">{t('app.name', locale)}</span>
        </div>
        <div className="font-body text-xs text-bark-200 dark:text-bark-100 bg-cream-200 dark:bg-bark-400 px-3 py-1.5 rounded-lg">
          {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US', {
            month: 'short', day: 'numeric',
          })}
        </div>
      </header>

      {/* Toast */}
      <Toast message={toast} />

      {/* Page content */}
      <main className="px-4 pt-2 pb-4" key={page}>
        {pages[page] || <Dashboard />}
      </main>

      {/* Bottom nav */}
      <BottomNav page={page} setPage={setPage} locale={locale} />
    </div>
  );
}
