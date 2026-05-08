import {
  BodyMetrics, NutrientValues, Sex, Goal, ActivityLevel,
  ACTIVITY_MULTIPLIER, GOAL_CALORIE_ADJUSTMENT, DEFAULT_TARGETS,
} from '@/types';

/**
 * Mifflin-St Jeor BMR formula (most accurate modern equation).
 * Men:   10*kg + 6.25*cm − 5*age + 5
 * Women: 10*kg + 6.25*cm − 5*age − 161
 */
export function bmr(metrics: BodyMetrics): number | null {
  const { weight_kg, height_cm, age, sex } = metrics;
  if (!weight_kg || !height_cm || !age || !sex) return null;
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  return Math.round(sex === 'male' ? base + 5 : base - 161);
}

/** Total Daily Energy Expenditure = BMR × activity multiplier */
export function tdee(metrics: BodyMetrics): number | null {
  const basal = bmr(metrics);
  if (!basal || !metrics.activity_level) return null;
  return Math.round(basal * ACTIVITY_MULTIPLIER[metrics.activity_level]);
}

/** Goal-adjusted calorie target, floored at safe minimum */
export function targetCalories(metrics: BodyMetrics): number | null {
  const maintenance = tdee(metrics);
  if (!maintenance || !metrics.goal) return null;
  const adjusted = maintenance + GOAL_CALORIE_ADJUSTMENT[metrics.goal];
  // Safety floor — never recommend dangerous deficits
  const floor = metrics.sex === 'male' ? 1500 : 1200;
  return Math.max(floor, Math.round(adjusted));
}

/**
 * Protein grams/day based on goal:
 * - Lose:     2.0 g/kg (preserve muscle in deficit)
 * - Maintain: 1.6 g/kg
 * - Gain:     1.8 g/kg
 */
function proteinGrams(metrics: BodyMetrics): number | null {
  if (!metrics.weight_kg || !metrics.goal) return null;
  const perKg = metrics.goal === 'lose' ? 2.0 : metrics.goal === 'gain' ? 1.8 : 1.6;
  return Math.round(metrics.weight_kg * perKg);
}

/** Micronutrient RDAs based on age & sex (NIH / EFSA reference intakes) */
function microTargets(age: number | undefined, sex: Sex | undefined): Partial<NutrientValues> {
  if (!age || !sex) return {};
  const result: Partial<NutrientValues> = {};

  // Iron — much higher for menstruating women (19-50)
  if (sex === 'female' && age >= 19 && age <= 50) result.iron = 18;
  else result.iron = 8;

  result.vitaminC = sex === 'male' ? 90 : 75;

  // Fiber (AI; drops slightly after 50)
  if (age >= 51) result.fiber = sex === 'male' ? 30 : 21;
  else result.fiber = sex === 'male' ? 38 : 25;

  result.vitaminB12 = 2.4;
  result.folate = 400;
  result.zinc = sex === 'male' ? 11 : 8;
  result.iodine = 150;
  result.selenium = 55;

  return result;
}

/**
 * Compute full NutrientValues targets from body metrics.
 * Returns null if required inputs missing.
 * Fat: 25% of cal | Carbs: remainder, floored at 50g
 */
export function computeTargets(metrics: BodyMetrics): NutrientValues | null {
  const cals = targetCalories(metrics);
  const protein = proteinGrams(metrics);
  if (!cals || !protein) return null;

  const fatGrams = Math.round((cals * 0.25) / 9);
  const carbCalories = cals - (protein * 4) - (fatGrams * 9);
  const carbGrams = Math.max(50, Math.round(carbCalories / 4));

  return {
    ...DEFAULT_TARGETS,
    calories: cals,
    protein,
    fat: fatGrams,
    carbs: carbGrams,
    ...microTargets(metrics.age, metrics.sex),
  };
}

export function hasCompleteMetrics(m?: BodyMetrics): boolean {
  if (!m) return false;
  return !!(m.weight_kg && m.height_cm && m.age && m.sex && m.activity_level && m.goal);
}
