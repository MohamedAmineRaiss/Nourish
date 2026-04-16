# page.tsx — Changes Required

## Overview
These changes add:
1. A "meals remaining" selector on the Plan page
2. Pass `mealsRemaining` to the recommendation engine
3. Replace the inline PlannedMeal with the new component
4. Wire editable quantities back into the meal logging flow

---

## Change 1: Add import for PlannedMeal component

At the top of the file, add this import:
```typescript
import PlannedMeal from '@/components/PlannedMeal';
```

## Change 2: Add mealsRemaining state

After the existing state declarations (around line 57), add:
```typescript
const [mealsRemaining, setMealsRemaining] = useState(3);
```

## Change 3: Pass mealsRemaining to generateCombinations

Find the `doGenerate` function (around line 165):
```typescript
// BEFORE:
const doGenerate = () => {
    const combos = generateCombinations(selectedFoods, targets, dailyIntake);

// AFTER:
const doGenerate = () => {
    const combos = generateCombinations(selectedFoods, targets, dailyIntake, mealsRemaining);
```

## Change 4: Rewrite addMealToDay to accept custom quantities

Replace the `addMealToDay` function with this version that accepts quantities and nutrients from the PlannedMeal component:
```typescript
const addMealToDay = async (customQuantities?: Record<string, number>, customNutrients?: NutrientValues) => {
    if (!chosenSuggestion) return;
    const finalQuantities = customQuantities || chosenSuggestion.quantities;
    const finalNutrients = customNutrients || chosenSuggestion.nutrients;

    const newMeal: LoggedMeal = {
      id: crypto.randomUUID(),
      name: chosenSuggestion.name,
      nutrients: { ...finalNutrients },
      foods: chosenSuggestion.foods.map((f) => ({
        label: f.label,
        grams: finalQuantities[f.id],
      })),
      time: timeStr(),
      date: todayStr(),
    };

    const newIntake = { ...dailyIntake };
    for (const n of ALL_NUTRIENTS) {
      newIntake[n] += finalNutrients[n] || 0;
    }
    setDailyIntake(newIntake);
    setMeals((prev) => [...prev, newMeal]);
    setSelectedFoods([]);
    setSuggestions([]);
    setChosenSuggestion(null);
    setMealsRemaining(prev => Math.max(1, prev - 1)); // decrement meals remaining
    showToast('toast.mealAdded');
    setPage('dashboard');

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
```

## Change 5: Add meals remaining selector to the Plan page

In the `pages` map, update the `plan` entry to include `mealsRemaining`:
```typescript
plan: (
  <>
    {/* Meals remaining selector */}
    <div className="px-1 mb-2">
      <label className="font-body text-[13px] text-bark-200 dark:text-bark-100 block mb-1.5">
        {t('plan.mealsRemaining', locale)}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setMealsRemaining(n)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-body font-semibold transition-all border-2
              ${n === mealsRemaining
                ? 'bg-terra-500 text-white border-terra-500 shadow-md shadow-terra-500/20'
                : 'bg-cream-200 dark:bg-bark-400 text-bark-500 dark:text-cream-200 border-cream-300 dark:border-bark-400'
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="font-body text-[11px] text-bark-200 dark:text-bark-100 mt-1">
        {t('plan.mealsHint', locale)}
      </p>
    </div>
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
  </>
),
```

## Change 6: Replace inline PlannedMeal with the component

In the `pages` map, replace the `planned` entry:
```typescript
// BEFORE:
planned: <PlannedMeal />,

// AFTER:
planned: chosenSuggestion ? (
  <PlannedMeal
    locale={locale}
    suggestion={chosenSuggestion}
    targets={targets}
    dailyIntake={dailyIntake}
    onConfirm={(quantities, nutrients) => addMealToDay(quantities, nutrients)}
    onBack={() => setPage('suggestions')}
  />
) : null,
```

## Change 7: Delete the old inline PlannedMeal component

Remove the entire `const PlannedMeal = () => { ... }` function definition
from page.tsx (the one starting around line 418). It's replaced by the
imported component.
