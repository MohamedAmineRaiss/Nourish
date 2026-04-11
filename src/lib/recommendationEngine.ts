import {
  FoodItem, NutrientValues, MealSuggestion, NutrientKey,
  ALL_NUTRIENTS, PRIORITY_NUTRIENTS, SECONDARY_NUTRIENTS, emptyNutrients,
} from '@/types';

interface PortionProfile {
  name: string;
  nameKey: string; // i18n key
  strategy: 'balanced' | 'priority' | 'light';
  prioritize?: NutrientKey[];
  bias: number;
}

const PROFILES: PortionProfile[] = [
  { name: 'Balanced & moderate', nameKey: 'suggestion.balanced', strategy: 'balanced', bias: 1.0 },
  { name: 'Iron & B12 focused', nameKey: 'suggestion.ironB12', strategy: 'priority', prioritize: ['iron', 'vitaminB12'], bias: 1.2 },
  { name: 'Lighter portion', nameKey: 'suggestion.light', strategy: 'light', bias: 0.7 },
  { name: 'Iodine & selenium rich', nameKey: 'suggestion.iodineSe', strategy: 'priority', prioritize: ['iodine', 'selenium'], bias: 1.1 },
  { name: 'High protein', nameKey: 'suggestion.highProtein', strategy: 'priority', prioritize: ['protein'], bias: 1.15 },
];

const BASE_PORTIONS: Record<string, number> = {
  Meat: 150, Fish: 130, Vegetable: 150, Fruit: 120,
  Legume: 160, 'Dairy & Eggs': 120, Grain: 150, Nut: 30, Other: 100, Packaged: 100,
};

function calcMealNutrients(foods: FoodItem[], quantities: Record<string, number>): NutrientValues {
  const result = emptyNutrients();
  for (const food of foods) {
    const g = quantities[food.id] || 0;
    for (const n of ALL_NUTRIENTS) {
      result[n] += (food.nutrientsPer100g[n] || 0) * (g / 100);
    }
  }
  return result;
}

export function generateCombinations(
  selectedFoods: FoodItem[],
  targets: NutrientValues,
  dailyIntake: NutrientValues,
): MealSuggestion[] {
  if (selectedFoods.length === 0) return [];

  // Remaining needs
  const remaining: NutrientValues = emptyNutrients();
  for (const n of ALL_NUTRIENTS) {
    remaining[n] = Math.max(0, targets[n] - (dailyIntake[n] || 0));
  }

  const suggestions: MealSuggestion[] = PROFILES.map((profile) => {
    // Calculate quantities per food
    const quantities: Record<string, number> = {};

    for (const food of selectedFoods) {
      let base = BASE_PORTIONS[food.category] || 100;
      base *= profile.bias;

      // Boost foods that are relevant to the priority nutrients
      if (profile.strategy === 'priority' && profile.prioritize) {
        let relevance = 0;
        for (const n of profile.prioritize) {
          const need = remaining[n];
          const provides = food.nutrientsPer100g[n] || 0;
          if (need > 0) relevance += provides / need;
        }
        base *= 1 + Math.min(relevance * 0.3, 0.5);
      }

      if (profile.strategy === 'light') base *= 0.85;

      // Clamp to realistic range
      quantities[food.id] = Math.round(Math.max(20, Math.min(base, 350)));
    }

    // Calculate total nutrients for this combination
    const nutrients = calcMealNutrients(selectedFoods, quantities);

    // Score: priority nutrients weighted 3x, secondary 1x
    let score = 0;
    for (const n of PRIORITY_NUTRIENTS) {
      const pct = remaining[n] > 0 ? nutrients[n] / remaining[n] : 1;
      score += Math.min(pct, 1.5) * 3;
    }
    for (const n of SECONDARY_NUTRIENTS) {
      const pct = remaining[n] > 0 ? nutrients[n] / remaining[n] : 1;
      score += Math.min(pct, 1.5) * 1;
    }

    // Penalty for extremely large total weight
    const totalGrams = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (totalGrams > 800) score *= 0.85;

    // Generate explanation: top 3 nutrients this combo is strong in
    const bestNutrients = ALL_NUTRIENTS
      .filter((n) => remaining[n] > 0 && nutrients[n] > 0)
      .sort((a, b) => (nutrients[b] / remaining[b]) - (nutrients[a] / remaining[a]))
      .slice(0, 3);

    const explanation = bestNutrients.length > 0
      ? `Stronger for ${bestNutrients.map((n) => n).join(', ')}`
      : 'Well-rounded option';

    return {
      name: profile.name,
      quantities,
      nutrients,
      score: Math.round(score * 10) / 10,
      explanation,
      foods: selectedFoods,
    };
  });

  return suggestions.sort((a, b) => b.score - a.score);
}
