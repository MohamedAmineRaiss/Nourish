import {
  FoodItem, NutrientValues, MealSuggestion, NutrientKey, MealType,
  SuggestionContext,
  ALL_NUTRIENTS, PRIORITY_NUTRIENTS, SECONDARY_NUTRIENTS,
  MEAL_TYPE_SHARE, emptyNutrients,
} from '@/types';

// ─── Portion ranges per category (min, max grams) ───
const PORTION_RANGES: Record<string, [number, number]> = {
  'Meat': [80, 350], 'Fish': [80, 300], 'Vegetable': [50, 350],
  'Fruit': [50, 300], 'Legume': [80, 350], 'Dairy & Eggs': [30, 300],
  'Grain': [50, 350], 'Nut': [10, 80], 'Other': [5, 150],
  'Viande': [80, 350], 'Poisson': [80, 300], 'Légume': [50, 350],
  'Légumineuse': [80, 350], 'Céréale': [50, 350], 'Fruit à coque': [10, 80],
  'Produits laitiers & Œufs': [30, 300], 'Autre': [5, 150],
  'لحوم': [80, 350], 'أسماك': [80, 300], 'خضروات': [50, 350],
  'فواكه': [50, 300], 'بقوليات': [80, 350], 'ألبان وبيض': [30, 300],
  'حبوب': [50, 350], 'مكسرات': [10, 80], 'أخرى': [5, 150],
};

function getRange(cat: string): [number, number] {
  return PORTION_RANGES[cat] || [30, 250];
}

export function calcMealNutrients(foods: FoodItem[], quantities: Record<string, number>): NutrientValues {
  const result = emptyNutrients();
  for (const food of foods) {
    const g = quantities[food.id] || 0;
    for (const n of ALL_NUTRIENTS) {
      result[n] += (food.nutrientsPer100g[n] || 0) * (g / 100);
    }
  }
  return result;
}

function calcMealTarget(
  targets: NutrientValues,
  dailyIntake: NutrientValues,
  mealType: MealType,
  mealsEatenToday: { meal_type: MealType }[],
): NutrientValues {
  const remaining = emptyNutrients();
  for (const n of ALL_NUTRIENTS) {
    remaining[n] = Math.max(0, targets[n] - (dailyIntake[n] || 0));
  }

  const allMealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const eatenTypes = mealsEatenToday.map(m => m.meal_type);

  let remainingShare = MEAL_TYPE_SHARE[mealType];
  for (const mt of allMealTypes) {
    if (mt !== mealType && !eatenTypes.includes(mt)) {
      remainingShare += MEAL_TYPE_SHARE[mt];
    }
  }

  const thisMealFraction = remainingShare > 0 ? MEAL_TYPE_SHARE[mealType] / remainingShare : 1;

  const target = emptyNutrients();
  for (const n of ALL_NUTRIENTS) {
    target[n] = remaining[n] * thisMealFraction;
  }
  return target;
}

interface Profile {
  name: string;
  scale: number;
  prioritize?: NutrientKey[];
}

const PROFILES: Profile[] = [
  { name: 'Balanced',     scale: 1.0 },
  { name: 'Generous',     scale: 1.4 },
  { name: 'Light',        scale: 0.6 },
  { name: 'High Protein', scale: 1.1, prioritize: ['protein', 'iron'] },
  { name: 'Vitamin Rich', scale: 1.0, prioritize: ['vitaminC', 'folate', 'vitaminB12'] },
];

function solve(
  foods: FoodItem[],
  mealTarget: NutrientValues,
  scale: number,
  prioritize?: NutrientKey[],
): Record<string, number> {
  const quantities: Record<string, number> = {};

  for (const food of foods) {
    const [minG, maxG] = getRange(food.category);

    const relevant = prioritize?.filter(n => food.nutrientsPer100g[n] > 0 && mealTarget[n] > 0)
      || ALL_NUTRIENTS.filter(n => food.nutrientsPer100g[n] > 0 && mealTarget[n] > 0);

    if (relevant.length === 0) {
      quantities[food.id] = Math.round(minG);
      continue;
    }

    const candidates = relevant.map(n => {
      const per100 = food.nutrientsPer100g[n];
      if (per100 <= 0) return maxG;
      const perFoodTarget = (mealTarget[n] * scale) / foods.length;
      return (perFoodTarget / per100) * 100;
    });

    candidates.sort((a, b) => a - b);
    const idx = Math.min(
      Math.floor(candidates.length * (prioritize ? 0.65 : 0.5)),
      candidates.length - 1
    );
    const grams = Math.round(Math.max(minG, Math.min(candidates[idx], maxG)));
    quantities[food.id] = maxG <= 100 ? grams : Math.round(grams / 10) * 10;
  }

  return quantities;
}

function score(nutrients: NutrientValues, mealTarget: NutrientValues): number {
  let s = 0;
  for (const n of PRIORITY_NUTRIENTS) {
    if (mealTarget[n] <= 0) { s += 3; continue; }
    const pct = nutrients[n] / mealTarget[n];
    s += pct >= 0.7 && pct <= 1.3 ? 3 : Math.min(pct, 1.5) * 2;
  }
  for (const n of SECONDARY_NUTRIENTS) {
    if (mealTarget[n] <= 0) { s += 1; continue; }
    const pct = nutrients[n] / mealTarget[n];
    s += pct >= 0.7 && pct <= 1.3 ? 1 : Math.min(pct, 1.5) * 0.7;
  }
  return Math.round(s * 10) / 10;
}

// ─── Build rich context explaining WHY this suggestion matters ───
function buildContext(
  nutrients: NutrientValues,
  mealTarget: NutrientValues,
  targets: NutrientValues,
  dailyIntake: NutrientValues,
): SuggestionContext {
  const strongIn: NutrientKey[] = [];
  const helpsWith: NutrientKey[] = [];
  const balances: NutrientKey[] = [];

  for (const n of ALL_NUTRIENTS) {
    const mealCoverage = mealTarget[n] > 0 ? nutrients[n] / mealTarget[n] : 0;
    const dailyProgress = targets[n] > 0 ? dailyIntake[n] / targets[n] : 0;

    // Strong in: this meal covers ≥80% of what THIS meal should provide
    if (mealCoverage >= 0.8 && nutrients[n] > 0) {
      strongIn.push(n);
    }
    // Helps with: moderate contribution (30-80%) toward a nutrient still deficient
    else if (mealCoverage >= 0.3 && dailyProgress < 0.7 && nutrients[n] > 0) {
      helpsWith.push(n);
    }

    // Balances: user has overshot this nutrient today, and this meal is light on it
    if (dailyProgress > 1.15 && mealCoverage < 0.5) {
      balances.push(n);
    }
  }

  // Limit to top 3 of each so UI stays clean
  return {
    strongIn: strongIn.slice(0, 3),
    helpsWith: helpsWith.slice(0, 3),
    balances: balances.slice(0, 2),
  };
}

export function generateCombinations(
  selectedFoods: FoodItem[],
  targets: NutrientValues,
  dailyIntake: NutrientValues,
  mealType: MealType = 'lunch',
  mealsEatenToday: { meal_type: MealType }[] = [],
): MealSuggestion[] {
  if (selectedFoods.length === 0) return [];

  const mealTarget = calcMealTarget(targets, dailyIntake, mealType, mealsEatenToday);

  const suggestions: MealSuggestion[] = PROFILES.map(profile => {
    const quantities = solve(selectedFoods, mealTarget, profile.scale, profile.prioritize);
    const nutrients = calcMealNutrients(selectedFoods, quantities);
    const s = score(nutrients, mealTarget);
    const context = buildContext(nutrients, mealTarget, targets, dailyIntake);

    // Legacy explanation string (keep for backwards compat)
    const best = ALL_NUTRIENTS
      .filter(n => mealTarget[n] > 0 && nutrients[n] > 0)
      .sort((a, b) => (nutrients[b] / mealTarget[b]) - (nutrients[a] / mealTarget[a]))
      .slice(0, 3);

    return {
      name: profile.name,
      quantities,
      nutrients,
      score: s,
      explanation: best.length > 0 ? best.join(', ') : 'well-rounded',
      context,
      foods: selectedFoods,
    };
  });

  return suggestions.sort((a, b) => b.score - a.score);
}
