# Nourish v2.2 — Moroccan Foods DB + Smart Macros

Four big improvements in this release:

1. **Moroccan foods database (386 curated items)** replaces the old messy dataset
2. **Nutrition filters** replace dietary restrictions (keto / high-protein / iron-rich / high-fiber / low-calorie — all computed from macros)
3. **Body metrics calculator** in Settings auto-computes daily targets from weight/height/age/sex/activity/goal
4. **Update notice** shown once after onboarding to explain the new features

---

## Deployment steps

### Step 1 — Run the Moroccan foods seed
Open Supabase SQL Editor and paste **`moroccan-foods-seed.sql`**.

This **drops and recreates** the `foods` table with:
- 386 real foods across 16 categories (Vegetables, Fruits, Fish & Seafood, Herbs & Spices, Meat & Poultry, Dairy & Eggs, Prepared Dishes like tajine and couscous, Grains, Beverages, Packaged Foods like Jaouda/Activia/Nido, Nuts, Breads, Sweets, Condiments, Legumes, Oils)
- Accurate macros (verified against USDA SR Legacy + CIQUAL)
- Native trilingual labels (en/fr/ar) with zero duplicates
- Moroccan dialect synonyms (letchine, hamed, kebda, lham bgri, kamoun, tahina, etc.)
- A **`priority` column** so basic whole foods rank first in search:
  - Whole foods (meat, fish, veg, fruit, legumes, grains, nuts, dairy): **100**
  - Herbs & spices, oils: **90**
  - Beverages: **80**
  - Breads, sweets: **70**
  - Condiments: **60**
  - Prepared dishes (tajines, couscous, harira): **50**
  - Packaged foods: **30**
- A **`source` column** (`'moroccan'` | `'off'`) so Open Food Facts data can be re-added later for packaged/prepared foods — the schema supports both sources side-by-side

### Step 2 — Run the body metrics migration
Then paste **`supabase-v2.2-migration.sql`**.

This adds columns to `profiles`: `weight_kg`, `height_cm`, `age`, `sex`, `activity_level`, `goal`.

### Step 3 — Drop in the files
Replace these in your repo (mirror the `src/` structure):

**New files (add):**
- `src/components/BodyMetricsForm.tsx`
- `src/components/UpdateNotice.tsx`
- `src/lib/nutritionCalculator.ts`

**Replaced files (overwrite):**
- `src/app/page.tsx`
- `src/app/api/foods/search/route.ts`
- `src/app/api/foods/custom/route.ts`
- `src/app/api/profile/route.ts`
- `src/app/api/suggest/route.ts`
- `src/components/Settings.tsx`
- `src/components/PlanMeal.tsx`
- `src/components/MealSuggester.tsx`
- `src/components/CustomFoodDialog.tsx`
- `src/lib/i18n.ts`
- `src/types/index.ts`

**Files untouched from v2.1:**
- `Onboarding.tsx`, `ErrorBoundary.tsx`, `PlannedMeal.tsx`, `StockManager.tsx`, `WeeklyReport.tsx`, `Tracker.tsx`, `TrendsChart.tsx`, `EditMealDialog.tsx`, `BottomNav.tsx`, `NutrientBar.tsx`, `NutrientRing.tsx`, `Card.tsx`, `Btn.tsx`, `Toast.tsx`, `LanguageSwitcher.tsx`
- All of `lib/`: `gemini.ts`, `supabase.ts`, `supabaseServer.ts`, `recommendationEngine.ts`
- `app/layout.tsx`, `globals.css`

### Step 4 — Build & test
```bash
npm run build
npm run dev
```

---

## What changed in detail

### 1. Search results now make sense
Before: typing "meat" in English would surface cassoulet and onglet before basic options. The DB had poor Arabic translations and missing macros.

Now: the search API orders by `priority DESC` first, then alphabetically. Whole foods always appear first. Try searching "meat", "لحم", "viande" — you'll get Ground Beef, Beef Steak, Lamb Leg, Chicken Breast, Chicken Thigh, etc. at the top. Prepared tajines and packaged products sink to the bottom.

The new database also has **proper raw/cooked semantics**. Eggs, yogurt, milk, cheese, oils, fruit — these don't have cooked variants because the macros don't meaningfully change. Only items where cooking actually shifts macros (rice, pasta, legumes, meat cuts) have both variants.

### 2. New nutrition filters
Old filters (vegetarian / vegan / gluten-free / dairy-free) are gone. Replaced with **computed** filters that derive from each food's macros on the fly — so they're always accurate, zero manual tagging:

| Filter | Criterion |
|---|---|
| 🔥 **Keto-friendly** | ≤10g carbs / 100g |
| 💪 **High-protein** | ≥20g protein / 100g |
| 🌾 **High-fiber** | ≥5g fiber / 100g |
| 🩸 **Iron-rich** | ≥3mg iron / 100g |
| ⚡ **Low-calorie** | ≤100 kcal / 100g |

These work on the Plan page (filter search results), on the Suggest page (AI respects them), and in Settings (stored as your preferences).

**One-time cleanup:** the loader strips any legacy `vegetarian` / `vegan` / `gluten-free` / `dairy-free` values from your saved profile on next load, so nothing breaks.

### 3. Body metrics calculator
Open **Settings → Body Metrics**. Fill in weight, height, age, sex, activity level, goal. As you type, you'll see a live preview of:

- **BMR** (Mifflin-St Jeor)
- **TDEE** (BMR × activity multiplier)
- Target calories (TDEE − 500 for lose / +300 for gain / no change for maintain)
- Protein target (2.0 g/kg for cut, 1.6 g/kg for maintain, 1.8 g/kg for bulk)
- Fat target (25% of calories)
- Carbs target (remainder, floor 50g)
- Micronutrients (age/sex-adjusted RDAs — iron is 18mg for women under 50, 8mg otherwise)

Tap **Apply Calculated Targets** to push those values into your daily goals.

**Example for your mother** (65kg, 165cm, 49yr female, moderate activity, maintain weight):
- BMR ≈ 1275 kcal
- TDEE ≈ 1976 kcal
- 104g protein / 55g fat / 266g carbs
- Iron: 18mg (premenopausal default — adjust to 8mg if postmenopausal)

### 4. Update notice
On first launch after this release, anyone who's already completed onboarding will see a one-time modal explaining the three new features. Dismissed via a single tap, keyed by `localStorage['nourish_version_seen_v22']`. Anyone going through onboarding fresh will see it right after they finish the tour.

---

## Known things to be aware of

### Packaged foods from OFF
The `source` column on the `foods` table supports both `'moroccan'` (the 386 curated items) and `'off'` (Open Food Facts packaged products). Nothing is using `'off'` right now — the schema is ready for you to re-add OFF packaged-food integration later, and they'll automatically rank below whole foods thanks to the priority column.

The current Moroccan CSV already has 17 **Packaged Foods** items (Jaouda, Moufid, Activia, Nutella, Nido, etc.) plus 28 **Prepared Dishes** (tajines, couscous, harira, pastilla, rfissa), so a lot of what you'd use OFF for is already covered.

### Micronutrient targets for women over 50
The iron target automatically drops from 18mg to 8mg when age ≥ 50. If your mother is 49 right now, it'll flip next year — no manual action needed, the calculator handles it.

### Goal descriptions in the calculator
- **Lose**: 500 kcal/day deficit (~0.5 kg/week). Protein stays high at 2.0 g/kg to preserve muscle.
- **Maintain**: TDEE exactly. Protein at 1.6 g/kg.
- **Gain**: 300 kcal/day surplus (~0.25 kg/week lean gain). Protein at 1.8 g/kg.

These are general evidence-based defaults — your mother's doctor or a dietitian can adjust.

### Custom foods now simpler
The Custom Food dialog no longer asks for dietary tags — the nutrition filters are all computed from the macros you enter. Less fiddly.

---

## Version: 2.2.0

**Files changed:** 18 total (3 new + 11 replaced + 2 SQL files + 2 untouched helpers)
**DB changes:** `foods` table completely replaced, `custom_foods.dietary_tags` dropped, `profiles` gets 6 new body metrics columns
**Dependencies:** no new npm packages

If you hit any issues, check the browser console — every API route logs structured errors.
