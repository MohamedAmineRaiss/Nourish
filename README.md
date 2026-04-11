# 🥗 Nourish — Mom Nutrition Planner

A mobile-first nutrition planning app that helps plan meals before cooking by suggesting ingredient quantities to meet daily nutrient targets.

## Features

- **Ingredient Search** — Live search against USDA FoodData Central (real API)
- **Smart Suggestions** — Generates 3–5 quantity combinations scored against daily nutrient gaps
- **Nutrient Tracking** — Visual rings + progress bars for 12 nutrients (iron, B12, iodine, selenium, protein, folate, vitamin C, zinc, fiber, calories, carbs, fat)
- **Daily Logging** — Add planned meals to the day, track cumulative progress
- **Online Persistence** — Supabase saves profile, targets, and meals across devices
- **Multilingual** — English, Arabic (RTL), French
- **PWA** — Installable on iPhone/Android home screen
- **No Login Required** — Device-ID based for MVP simplicity

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- USDA FoodData Central API
- Open Food Facts API (ready, not active yet)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd nourish
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
USDA_API_KEY=your-usda-key
```

### 3. Set up Supabase database

1. Go to your Supabase project dashboard
2. Open **SQL Editor**
3. Paste the contents of `supabase-schema.sql` and run it
4. This creates the `profiles`, `meals`, and `favorite_foods` tables with proper indexes and RLS policies

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

### 5. Test on iPhone

1. Make sure your computer and iPhone are on the same Wi-Fi network
2. Run `npm run dev -- -H 0.0.0.0` to expose on your local network
3. Find your computer's local IP (e.g., `192.168.1.50`)
4. On iPhone Safari, go to `http://192.168.1.50:3000`
5. Tap the Share button → "Add to Home Screen"
6. The app opens in standalone mode without Safari chrome

> **Note:** For HTTPS (needed for full PWA on iOS), deploy to Vercel first — it provides free HTTPS.

### 6. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard under Settings → Environment Variables.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── foods/search/route.ts    # Proxies USDA search (keeps API key server-side)
│   │   ├── meals/route.ts           # CRUD for daily meals via Supabase
│   │   └── profile/route.ts         # Profile + targets via Supabase
│   ├── globals.css                   # Tailwind + custom CSS + animations
│   ├── layout.tsx                    # Root layout with fonts, PWA meta
│   └── page.tsx                      # Main client app (all pages/state)
├── components/
│   ├── BottomNav.tsx                 # Tab navigation
│   ├── Btn.tsx                       # Button variants
│   ├── Card.tsx                      # Card container
│   ├── LanguageSwitcher.tsx          # EN/AR/FR toggle
│   ├── NutrientBar.tsx               # Horizontal progress bar
│   ├── NutrientRing.tsx              # Circular SVG ring
│   └── Toast.tsx                     # Notification popup
├── lib/
│   ├── foodProviders/
│   │   ├── index.ts                  # Mock fallback data
│   │   ├── openFoodFacts.ts          # OFF API adapter (barcode ready)
│   │   └── usda.ts                   # USDA FoodData Central adapter
│   ├── i18n.ts                       # Translation dictionaries (EN/AR/FR)
│   ├── recommendationEngine.ts       # Quantity suggestion + scoring
│   └── supabase.ts                   # Supabase client + device ID
├── types/
│   └── index.ts                      # All TypeScript types + constants
public/
├── manifest.json                     # PWA manifest
├── icon-192.svg                      # App icon
└── icon-512.svg                      # App icon large
```

## How the Architecture Works

### Food Search (Lightweight)

The app does **not** bundle a food database. All search hits the USDA API via a Next.js API route (`/api/foods/search`). The API key stays server-side. Results are normalized into a shared `FoodItem` format. If USDA is down, a tiny 8-item mock fallback is used.

### Recommendation Engine

When the user selects ingredients and taps "Generate", the engine:

1. Calculates remaining daily nutrient needs
2. Generates 5 portion profiles (balanced, iron-focused, light, iodine-focused, high-protein)
3. Adjusts grams per food based on category norms and nutrient relevance
4. Scores each combination: priority nutrients weighted 3×, secondary 1×
5. Returns top 5 sorted by score with explanations

### Online Persistence

All data lives in Supabase. Each device gets a stable UUID (`nourish_device_id` in localStorage). Profile, targets, and meals are synced via API routes. No login required for MVP.

### RTL Support

When Arabic is selected, `document.dir` is set to `rtl`. Tailwind logical properties (`ms-`, `me-`, `start`, `end`) handle spacing. The entire layout mirrors automatically.

## Wrap with Capacitor (Android)

When ready to ship an Android APK:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init Nourish com.nourish.app --web-dir=out

# Add to next.config.js:
# output: 'export'

npm run build
npx cap add android
npx cap sync
npx cap open android
```

Then build the APK from Android Studio.

## Future Features (Architecture Ready)

- Barcode scanner (Open Food Facts adapter already built)
- Natural language ingredient input
- Weekly meal planning
- Shopping list generation
- Recipe saving
- Clinician mode (custom priority weights)
- Supplement tracking
- Medication timing reminders
- Push notifications
- Auth (Supabase Auth — just swap device_id for user_id)
