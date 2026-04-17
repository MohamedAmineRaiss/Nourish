'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FoodItem, NutrientValues, MealSuggestion, LoggedMeal, MealType,
  NutrientKey, Locale, DietaryPref,
  PRIORITY_NUTRIENTS, SECONDARY_NUTRIENTS, ALL_NUTRIENTS,
  NUTRIENT_META, DEFAULT_TARGETS, emptyNutrients,
} from '@/types';
import { t, isRTL } from '@/lib/i18n';
import { getDeviceId } from '@/lib/supabase';
import { generateCombinations } from '@/lib/recommendationEngine';

import Onboarding, { hasOnboarded } from '@/components/Onboarding';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import NutrientRing from '@/components/NutrientRing';
import NutrientBar from '@/components/NutrientBar';
import Card from '@/components/Card';
import Btn from '@/components/Btn';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import PlanMeal from '@/components/PlanMeal';
import PlannedMeal from '@/components/PlannedMeal';
import Settings from '@/components/Settings';
import StockManager from '@/components/StockManager';
import MealSuggester from '@/components/MealSuggester';
import WeeklyReport from '@/components/WeeklyReport';
import Tracker from '@/components/Tracker';

function todayStr() { return new Date().toISOString().split('T')[0]; }
function timeStr() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
function greetingKey(): string {
  const h = new Date().getHours();
  return h < 12 ? 'greeting.morning' : h < 17 ? 'greeting.afternoon' : 'greeting.evening';
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [locale, setLocaleState] = useState<Locale>('en');
  const [profileName, setProfileName] = useState('Mama');
  const [targets, setTargets] = useState<NutrientValues>({ ...DEFAULT_TARGETS });
  const [editTargets, setEditTargets] = useState<NutrientValues>({ ...DEFAULT_TARGETS });
  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryPref[]>([]);
  const [dailyIntake, setDailyIntake] = useState<NutrientValues>(emptyNutrients());
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchSource, setSearchSource] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [dietaryFilters, setDietaryFilters] = useState<DietaryPref[]>([]);
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [chosenSuggestion, setChosenSuggestion] = useState<MealSuggestion | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initError, setInitError] = useState('');
  const searchTimer = useRef<any>(null);
  const deviceId = useRef<string>('');

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    const dir = isRTL(locale) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => { setLocaleState(l); }, []);

  // ─── Load today's meals ───
  const refreshTodayMeals = useCallback(async () => {
    try {
      const res = await fetch(`/api/meals?device_id=${deviceId.current}&date=${todayStr()}`);
      if (!res.ok) return;
      const data = await res.json();
      const loaded: LoggedMeal[] = (data.meals || []).map((m: any) => ({
        id: m.id, name: m.name, meal_type: m.meal_type || 'lunch',
        nutrients: m.nutrients, foods: m.foods, time: m.time, date: m.date,
      }));
      setMeals(loaded);
      const intake = emptyNutrients();
      for (const meal of loaded) {
        for (const n of ALL_NUTRIENTS) intake[n] += meal.nutrients?.[n] || 0;
      }
      setDailyIntake(intake);
    } catch (err) { console.error('Refresh meals error:', err); }
  }, []);

  // ─── Init ───
  useEffect(() => {
    async function init() {
      deviceId.current = getDeviceId();
      if (!hasOnboarded()) setShowOnboarding(true);

      try {
        const profRes = await fetch(`/api/profile?device_id=${deviceId.current}`);
        if (!profRes.ok) throw new Error(`Profile: ${profRes.status}`);
        const profData = await profRes.json();
        if (profData.profile) {
          setProfileName(profData.profile.name || 'Mama');
          setLocaleState(profData.profile.language || 'en');
          if (profData.profile.targets) {
            setTargets({ ...DEFAULT_TARGETS, ...profData.profile.targets });
            setEditTargets({ ...DEFAULT_TARGETS, ...profData.profile.targets });
          }
          if (Array.isArray(profData.profile.dietary_prefs)) {
            setDietaryPrefs(profData.profile.dietary_prefs);
          }
        }
        await refreshTodayMeals();
      } catch (err: any) {
        console.error('Init error:', err);
        setInitError(err.message || 'Failed to load');
      }
      setLoaded(true);
    }
    init();
  }, [refreshTodayMeals]);

  // ─── Search (with dietary filter) ───
  const doSearch = useCallback((q: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.trim().length < 2) { setSearchResults([]); setSearching(false); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q, lang: locale,
          device_id: deviceId.current,
        });
        if (dietaryFilters.length > 0) {
          params.set('dietary', dietaryFilters.join(','));
        }
        const res = await fetch(`/api/foods/search?${params.toString()}`);
        const data = await res.json();
        setSearchResults(data.foods || []);
        setSearchSource(data.source || '');
      } catch { setSearchResults([]); }
      setSearching(false);
    }, 350);
  }, [locale, dietaryFilters]);

  useEffect(() => { doSearch(searchQuery); }, [searchQuery, doSearch]);

  // ─── Actions ───
  const addFood = (food: FoodItem) => {
    if (!selectedFoods.find(f => f.id === food.id)) setSelectedFoods(prev => [...prev, food]);
    setSearchQuery(''); setSearchResults([]);
  };
  const removeFood = (id: string) => setSelectedFoods(prev => prev.filter(f => f.id !== id));

  const doGenerate = () => {
    const mealsEaten = meals.map(m => ({ meal_type: m.meal_type }));
    const combos = generateCombinations(selectedFoods, targets, dailyIntake, mealType, mealsEaten);
    setSuggestions(combos);
    setPage('suggestions');
  };

  const applySuggestion = (s: MealSuggestion) => { setChosenSuggestion(s); setPage('planned'); };

  const addMealToDay = async (quantities: Record<string, number>, nutrients: NutrientValues) => {
    if (!chosenSuggestion) return;
    const newMeal: LoggedMeal = {
      id: crypto.randomUUID(),
      name: t(`meal.${mealType}`, locale),
      meal_type: mealType,
      nutrients: { ...nutrients },
      foods: chosenSuggestion.foods.map(f => ({
        label: f.label, grams: quantities[f.id], food_id: f.id,
      })),
      time: timeStr(),
      date: todayStr(),
    };

    const newIntake = { ...dailyIntake };
    for (const n of ALL_NUTRIENTS) newIntake[n] += nutrients[n] || 0;
    setDailyIntake(newIntake);
    setMeals(prev => [...prev, newMeal]);
    setSelectedFoods([]); setSuggestions([]); setChosenSuggestion(null);
    showToast(t('toast.mealAdded', locale));
    setPage('dashboard');

    try {
      await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId.current, date: todayStr(), name: newMeal.name,
          meal_type: mealType, nutrients: newMeal.nutrients, foods: newMeal.foods, time: newMeal.time,
        }),
      });
    } catch (err) { console.error('Save meal error:', err); }
  };

  const resetDay = async () => {
    setDailyIntake(emptyNutrients()); setMeals([]);
    showToast(t('toast.dayReset', locale));
    try {
      await fetch(`/api/meals?device_id=${deviceId.current}&date=${todayStr()}`, { method: 'DELETE' });
    } catch { }
  };

  const saveSettings = async () => {
    setTargets({ ...editTargets });
    showToast(t('toast.settingsSaved', locale));
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
          dietary_prefs: dietaryPrefs,
        }),
      });
    } catch { }
  };

  const nutrientLabel = (key: NutrientKey): string => t(NUTRIENT_META[key].label, locale);

  // ═══ DASHBOARD ═══
  const Dashboard = () => {
    const topMissing = ALL_NUTRIENTS
      .filter(n => targets[n] > 0 && (dailyIntake[n] / targets[n]) < 0.7)
      .sort((a, b) => (dailyIntake[a] / targets[a]) - (dailyIntake[b] / targets[b]))
      .slice(0, 5);

    return (
      <div className="flex flex-col gap-5 animate-page">
        <div>
          <h2 className="font-display text-2xl text-bark-500 dark:text-cream-100">
            {t(greetingKey(), locale)}, {profileName} 👋
          </h2>
          <p className="font-body text-sm text-bark-200 dark:text-bark-100 mt-0.5">
            {new Date().toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card>
          <h3 className="font-display text-[17px] text-bark-500 dark:text-cream-200 mb-4">{t('dashboard.keyNutrients', locale)}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {PRIORITY_NUTRIENTS.map(n => (
              <NutrientRing key={n} nutrient={n} current={dailyIntake[n]} target={targets[n]} locale={locale} />
            ))}
          </div>
        </Card>

        {topMissing.length > 0 && (
          <Card highlight>
            <h3 className="font-display text-[17px] text-bark-500 dark:text-cream-200 mb-1">{t('dashboard.stillNeeded', locale)}</h3>
            <p className="font-body text-xs text-bark-200 dark:text-bark-100 mb-3">{t('dashboard.stillNeededDesc', locale)}</p>
            {topMissing.map(n => <NutrientBar key={n} nutrient={n} current={dailyIntake[n]} target={targets[n]} locale={locale} />)}
          </Card>
        )}

        {meals.length > 0 ? (
          <Card>
            <h3 className="font-display text-[17px] text-bark-500 dark:text-cream-200 mb-3">{t('dashboard.todaysMeals', locale)}</h3>
            {meals.map(m => (
              <div key={m.id} className="py-2.5 border-b border-cream-300 dark:border-bark-400 last:border-0">
                <div className="flex justify-between">
                  <span className="font-body font-semibold text-sm text-bark-500 dark:text-cream-200">{m.name}</span>
                  <span className="font-body text-xs text-bark-200 dark:text-bark-100">{m.time}</span>
                </div>
                <div className="font-body text-xs text-bark-200 dark:text-bark-100 mt-1">
                  {m.foods.map(f => `${f.label.split(',')[0]} ${f.grams}g`).join(' · ')}
                </div>
              </div>
            ))}
          </Card>
        ) : (
          <Card><p className="font-body text-sm text-bark-200 dark:text-bark-100 text-center py-4">{t('dashboard.noMeals', locale)}</p></Card>
        )}

        <div className="flex gap-2">
          <Btn onClick={() => { setSelectedFoods([]); setSuggestions([]); setChosenSuggestion(null); setSearchQuery(''); setPage('plan'); }} className="flex-1 !py-4 !text-base !rounded-2xl">
            🍳 {t('dashboard.planNext', locale)}
          </Btn>
          <Btn variant="secondary" onClick={() => setPage('weekly')} className="!py-4 !px-4 !rounded-2xl" aria-label={t('dashboard.weeklyReport', locale)}>
            📊
          </Btn>
        </div>

        {meals.length > 0 && (
          <Btn variant="ghost" onClick={() => setPage('tracker')} className="mx-auto">
            {t('nav.track', locale)} →
          </Btn>
        )}
      </div>
    );
  };

  // ═══ SUGGESTIONS (enhanced with context) ═══
  const Suggestions = () => (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">{t('suggestions.title', locale)}</h2>
      <p className="font-body text-[13px] text-bark-200 dark:text-bark-100 -mt-2">{t('suggestions.subtitle', locale)}</p>

      {suggestions.map((s, i) => {
        const ctx = s.context;
        const strongIn = ctx?.strongIn || [];
        const helpsWith = ctx?.helpsWith || [];
        const balances = ctx?.balances || [];

        return (
          <Card key={i} onClick={() => applySuggestion(s)} className="cursor-pointer">
            <div className="flex justify-between items-start mb-2.5">
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-[16px] text-bark-500 dark:text-cream-200">
                  {t('suggestions.option', locale)} {i + 1}
                </h4>

                {/* Rich context badges */}
                <div className="flex flex-col gap-1 mt-1.5">
                  {strongIn.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="font-body text-[11px] text-terra-500 font-bold">
                        ↑ {t('suggestions.strongIn', locale)}:
                      </span>
                      {strongIn.map(n => (
                        <span
                          key={n}
                          className="font-body text-[11px] font-semibold rounded px-1.5 py-0.5"
                          style={{ background: `${NUTRIENT_META[n].color}22`, color: NUTRIENT_META[n].color }}
                        >
                          {NUTRIENT_META[n].icon} {nutrientLabel(n)}
                        </span>
                      ))}
                    </div>
                  )}
                  {helpsWith.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="font-body text-[11px] text-bark-200 dark:text-bark-100 font-semibold">
                        + {t('suggestions.helpsWith', locale)}:
                      </span>
                      {helpsWith.map(n => (
                        <span key={n} className="font-body text-[11px] text-bark-500 dark:text-cream-200">
                          {NUTRIENT_META[n].icon} {nutrientLabel(n)}
                        </span>
                      ))}
                    </div>
                  )}
                  {balances.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="font-body text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                        ⚖ {t('suggestions.balances', locale)}:
                      </span>
                      {balances.map(n => (
                        <span key={n} className="font-body text-[11px] text-amber-700 dark:text-amber-400">
                          {nutrientLabel(n)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="bg-terra-500 text-white rounded-xl px-2.5 py-1 font-body font-bold text-xs flex-shrink-0 ms-2">
                {Math.round(s.score)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {s.foods.map(f => (
                <span key={f.id} className="bg-cream-200 dark:bg-bark-400 rounded-lg px-3 py-1.5 font-body text-[13px] font-semibold text-bark-500 dark:text-cream-200">
                  {f.label.split(',')[0]} <span className="text-terra-500">{s.quantities[f.id]}g</span>
                </span>
              ))}
            </div>

            <Btn variant="secondary" className="w-full mt-1">{t('suggestions.choose', locale)} →</Btn>
          </Card>
        );
      })}

      <Btn variant="ghost" onClick={() => setPage('plan')} className="mx-auto">← {t('suggestions.back', locale)}</Btn>
    </div>
  );

  // ═══ PAGE MAP ═══
  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    plan: (
      <PlanMeal
        locale={locale}
        deviceId={deviceId.current}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        searching={searching} searchResults={searchResults} searchSource={searchSource}
        selectedFoods={selectedFoods} addFood={addFood} removeFood={removeFood}
        doGenerate={doGenerate} mealType={mealType} setMealType={setMealType}
        dietaryFilters={dietaryFilters} setDietaryFilters={setDietaryFilters}
      />
    ),
    suggestions: <Suggestions />,
    planned: chosenSuggestion ? (
      <PlannedMeal
        locale={locale} suggestion={chosenSuggestion} targets={targets}
        dailyIntake={dailyIntake} onConfirm={addMealToDay}
        onBack={() => setPage('suggestions')}
      />
    ) : null,
    tracker: (
      <Tracker
        locale={locale}
        deviceId={deviceId.current}
        targets={targets}
        todayIntake={dailyIntake}
        todayMeals={meals}
        onMealsChanged={refreshTodayMeals}
        onResetDay={resetDay}
        onBack={() => setPage('dashboard')}
      />
    ),
    stock: <StockManager locale={locale} deviceId={deviceId.current} />,
    suggest: (
      <MealSuggester
        locale={locale} deviceId={deviceId.current}
        dailyIntake={dailyIntake} targets={targets}
        dietaryPrefs={dietaryPrefs}
      />
    ),
    weekly: <WeeklyReport locale={locale} deviceId={deviceId.current} targets={targets} onBack={() => setPage('dashboard')} />,
    settings: (
      <Settings
        locale={locale} profileName={profileName} setProfileName={setProfileName}
        setLocale={setLocale} editTargets={editTargets} setEditTargets={setEditTargets}
        dietaryPrefs={dietaryPrefs} setDietaryPrefs={setDietaryPrefs}
        saveSettings={saveSettings}
      />
    ),
  };

  // ─── Onboarding ───
  if (showOnboarding) {
    return (
      <Onboarding
        locale={locale}
        setLocale={setLocale}
        onComplete={() => setShowOnboarding(false)}
      />
    );
  }

  // ─── Loading ───
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

  // ─── Error ───
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ background: 'var(--page-bg)' }}>
        <div className="text-center max-w-[300px]" role="alert">
          <span className="text-5xl block mb-4">📡</span>
          <h2 className="font-display text-xl text-bark-500 dark:text-cream-100 mb-2">
            {t('error.loadFailed', locale)}
          </h2>
          <p className="font-body text-sm text-bark-200 dark:text-bark-100 mb-6">
            {t('error.network', locale)}
          </p>
          <Btn onClick={() => window.location.reload()} className="w-full">
            🔄 {t('error.retry', locale)}
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen max-w-[520px] mx-auto pb-24 relative" style={{ background: 'var(--page-bg)' }}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <header className="flex justify-between items-center px-5 pt-5 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[28px]">🥗</span>
            <span className="font-display text-xl text-bark-500 dark:text-cream-100">{t('app.name', locale)}</span>
          </div>
          <div className="font-body text-xs text-bark-200 dark:text-bark-100 bg-cream-200 dark:bg-bark-400 px-3 py-1.5 rounded-lg">
            {new Date().toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}
          </div>
        </header>
        <Toast message={toast} />
        <main id="main-content" className="px-4 pt-2 pb-4" key={page} role="main">
          {pages[page] || <Dashboard />}
        </main>
        <BottomNav page={page} setPage={setPage} locale={locale} />
      </div>
    </ErrorBoundary>
  );
}
