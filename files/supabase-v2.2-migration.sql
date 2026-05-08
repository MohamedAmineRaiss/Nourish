-- ============================================
-- Nourish v2.2 — Body Metrics & Filter Rework
-- Run AFTER moroccan-foods-seed.sql
-- ============================================

-- Body metrics on profiles (for auto-macro calculation)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight_kg REAL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height_cm REAL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sex TEXT CHECK (sex IN ('male', 'female'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activity_level TEXT
  CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goal TEXT
  CHECK (goal IN ('lose', 'maintain', 'gain'));

-- Filters are now computed from nutrients at query time, not tagged.
-- Safe to drop these columns: nothing reads them anymore.
ALTER TABLE custom_foods DROP COLUMN IF EXISTS dietary_tags;

-- Note: dietary_prefs column on profiles is KEPT (same name, different semantics).
-- Old stored values ('vegetarian', etc.) become inert — the client ignores unknown filter IDs.
-- New values: 'high-protein' | 'low-carb' | 'high-iron' | 'low-calorie' | 'high-fiber'
