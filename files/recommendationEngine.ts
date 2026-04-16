import {
  FoodItem, NutrientValues, MealSuggestion, NutrientKey,
  ALL_NUTRIENTS, PRIORITY_NUTRIENTS, SECONDARY_NUTRIENTS, emptyNutrients,
} from '@/types';

// ─── Portion profiles ───
// Each profile is a strategy for how to distribute nutrients across the meal.
// The engine adjusts quantities based on how many meals are left in the day.

interface PortionProfile {
  name: string;
  nameKey: string;
  strategy: 'fill' | 'balanced' | 'light';
  prioritize?: NutrientKey[];
  fillFactor: number; // 0.0–1.0: how aggressively to fill remaining needs
}

const PROFILES: PortionProfile[] = [
  { name: 'Full meal', nameKey: 'suggestion.full', strategy: 'fill', fillFactor: 1.0 },
  { name: 'Balanced', nameKey: 'suggestion.balanced', strategy: 'balanced', fillFactor: 0.8 },
  { name: 'Iron & B12 focused', nameKey: 'suggestion.ironB12', strategy: 'fill', prioritize: ['iron', 'vitaminB12'], fillFactor: 0.9 },
  { name: 'Light portion', nameKey: 'suggestion.light', strategy: 'light', fillFactor: 0.5 },
  { name: 'High protein', nameKey: 'suggestion.highProtein', strategy: 'fill', prioritize: ['protein', 'calories'], fillFactor: 0.9 },
];

// Realistic portion ranges per category (min, max grams)
const PORTION_RANGES: Record<string, [number, number]> = {
  'Meat':          [80, 300],
  'Fish':          [80, 250],
  'Vegetable':     [50, 300],
  'Fruit':         [50, 250],
  'Legume':        [80, 300],
  'Dairy & Eggs':  [30, 250],
  'Grain':         [50, 300],
  'Nut':           [10, 60],
  'Other':         [5, 100],
  // Localized category names (FR/AR) map to same ranges
  'Viande':        [80, 300],
  'Poisson':       [80, 250],
  'Légume':        [50, 300],
  'Légumineuse':   [50, 300],
  'Céréale':       [50, 300],
  'Fruit à coque': [10, 60],
  'Produits laitiers & Œufs': [30, 250],
  'Autre':         [5, 100],
  'لحوم':          [80, 300],
  'أسماك':         [80, 250],
  'خضروات':        [50, 300],
  'فواكه':         [50, 250],
  'بقوليات':       [80, 300],
  'ألبان وبيض':    [30, 250],
  'حبوب':          [50, 300],
  'مكسرات':        [10, 60],
  'أخرى':          [5, 100],
};

function getPortionRange(category: string): [number, number] {
  return PORTION_RANGES[category] || [30, 200];
}

// ─── Nutrient calculation ───
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

// ─── Smart quantity solver ───
// Instead of using fixed base portions, this works backwards from
// "how much of remaining daily needs should this meal cover?"
// and solves for the grams that get closest to that target.

function solveQuantities(
  foods: FoodItem[],
  remaining: NutrientValues,
  mealShare: number,          // fraction of remaining this meal should cover (e.g. 0.5 for half)
  fillFactor: number,         // profile aggressiveness
  prioritize?: NutrientKey[], // nutrients to optimize for
): Record<string, number> {
  const quantities: Record<string, number> = {};
  const targetThisMeal = emptyNutrients();

  // How much this meal should aim for
  for (const n of ALL_NUTRIENTS) {
    targetThisMeal[n] = remaining[n] * mealShare * fillFactor;
  }

  // For each food, figure out how many grams best contribute to the target
  for (const food of foods) {
    const [minG, maxG] = getPortionRange(food.category);

    // Which nutrients matter? Use prioritize list if given, else all with remaining need
    const relevantNutrients = prioritize && prioritize.length > 0
      ? prioritize.filter(n => remaining[n] > 0)
      : ALL_NUTRIENTS.filter(n => remaining[n] > 0 && food.nutrientsPer100g[n] > 0);

    if (relevantNutrients.length === 0) {
      quantities[food.id] = Math.round(minG + (maxG - minG) * 0.3);
      continue;
    }

    // For each relevant nutrient, compute the grams needed to hit the per-meal target
    const gramsPerNutrient: number[] = relevantNutrients.map(n => {
      const per100g = food.nutrientsPer100g[n] || 0;
      if (per100g <= 0) return maxG;
      // Divide target among foods (roughly equal)
      const sharePerFood = targetThisMeal[n] / foods.length;
      return (sharePerFood / per100g) * 100;
    });

    // Use the median to avoid extremes
    gramsPerNutrient.sort((a, b) => a - b);
    const median = gramsPerNutrient[Math.floor(gramsPerNutrient.length / 2)];

    // Clamp to realistic range
    quantities[food.id] = Math.round(Math.max(minG, Math.min(median, maxG)));
  }

  return quantities;
}

// ─── Score a suggestion ───
function scoreSuggestion(
  nutrients: NutrientValues,
  remaining: NutrientValues,
  mealShare: number,
): number {
  let score = 0;

  for (const n of PRIORITY_NUTRIENTS) {
    if (remaining[n] <= 0) { score += 3; continue; }
    const target = remaining[n] * mealShare;
    const pct = nutrients[n] / target;
    // Sweet spot: 80%–120% of per-meal target = full marks
    // Below 50% or above 200% = diminishing returns
    if (pct >= 0.8 && pct <= 1.2) score += 3;
    else if (pct >= 0.5) score += 2 * pct;
    else score += pct * 1.5;
  }

  for (const n of SECONDARY_NUTRIENTS) {
    if (remaining[n] <= 0) { score += 1; continue; }
    const target = remaining[n] * mealShare;
    const pct = nutrients[n] / target;
    if (pct >= 0.8 && pct <= 1.2) score += 1;
    else score += Math.min(pct, 1.5) * 0.7;
  }

  return Math.round(score * 10) / 10;
}

// ─── Main export ───
export function generateCombinations(
  selectedFoods: FoodItem[],
  targets: NutrientValues,
  dailyIntake: NutrientValues,
  mealsRemaining: number = 3, // how many meals left in the day (user configurable)
): MealSuggestion[] {
  if (selectedFoods.length === 0) return [];

  // Remaining daily needs
  const remaining: NutrientValues = emptyNutrients();
  for (const n of ALL_NUTRIENTS) {
    remaining[n] = Math.max(0, targets[n] - (dailyIntake[n] || 0));
  }

  // This meal's share of remaining needs
  // If 3 meals remain, this meal should cover ~1/3.
  // But we use a slightly higher fraction because not every meal is perfectly planned.
  const mealShare = Math.min(1.0, 1.0 / Math.max(mealsRemaining, 1));

  const suggestions: MealSuggestion[] = PROFILES.map((profile) => {
    const quantities = solveQuantities(
      selectedFoods,
      remaining,
      mealShare,
      profile.fillFactor,
      profile.prioritize,
    );

    const nutrients = calcMealNutrients(selectedFoods, quantities);
    const score = scoreSuggestion(nutrients, remaining, mealShare);

    // Generate explanation: top 3 nutrients this combo covers well
    const bestNutrients = ALL_NUTRIENTS
      .filter(n => remaining[n] > 0 && nutrients[n] > 0)
      .sort((a, b) => (nutrients[b] / remaining[b]) - (nutrients[a] / remaining[a]))
      .slice(0, 3);

    const explanation = bestNutrients.length > 0
      ? `Stronger for ${bestNutrients.join(', ')}`
      : 'Well-rounded option';

    return {
      name: profile.name,
      quantities,
      nutrients,
      score,
      explanation,
      foods: selectedFoods,
    };
  });

  return suggestions.sort((a, b) => b.score - a.score);
}
