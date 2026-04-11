-- ============================================
-- Nourish App — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Profiles: one per device (no-login MVP)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT 'Mama',
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ar', 'fr')),
  targets JSONB DEFAULT '{
    "iron": 18, "protein": 50, "iodine": 150, "selenium": 55, "vitaminB12": 2.4,
    "folate": 400, "vitaminC": 75, "zinc": 8, "fiber": 25, "calories": 2000, "carbs": 260, "fat": 65
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Meals: each logged meal with full nutrient snapshot
CREATE TABLE IF NOT EXISTS meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  date TEXT NOT NULL,           -- 'YYYY-MM-DD'
  name TEXT,
  nutrients JSONB NOT NULL,     -- full NutrientValues snapshot
  foods JSONB NOT NULL,         -- [{label, grams}]
  time TEXT,                    -- 'HH:MM AM' display string
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by device + date
CREATE INDEX IF NOT EXISTS idx_meals_device_date ON meals (device_id, date);
CREATE INDEX IF NOT EXISTS idx_profiles_device ON profiles (device_id);

-- Favorite foods (for future use)
CREATE TABLE IF NOT EXISTS favorite_foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  food_id TEXT NOT NULL,
  food_label TEXT NOT NULL,
  food_source TEXT NOT NULL,
  food_category TEXT,
  nutrients_per_100g JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(device_id, food_id)
);

-- Row Level Security: allow all for anon key in MVP
-- In production, replace with auth-based policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_foods ENABLE ROW LEVEL SECURITY;

-- Permissive policies for anon access (no-login MVP)
CREATE POLICY "Allow all on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on meals" ON meals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on favorite_foods" ON favorite_foods FOR ALL USING (true) WITH CHECK (true);
