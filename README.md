# Olive Pick

**A Korean skincare routine builder powered by real Olive Young product data.**

Olive Pick lets you browse 266+ K-beauty products, drag and drop them into your AM / PM / Weekly routine slots, and get instant ingredient-compatibility analysis — all in a clean, minimal interface.

---

## Features

### Routine Builder
- **Three routine slots** — Morning (AM), Evening (PM), and Weekly — each with its own ordered product list
- **Drag & drop** products from the catalog directly into any slot
- **Click-to-reorder** with ← → arrow buttons on each product card, or drag within a slot to reposition
- **Drag to discard** — pick up a routine card and drop it on the catalog area to remove it (desktop only)
- **Clear slot** button to reset an individual routine in one click
- Routine is **persisted to localStorage** via Zustand, so it survives page refreshes

### Product Catalog
- **266+ Olive Young products** with brand, name, price, key ingredients, category, and product images
- **Search** by product name, brand, or ingredient
- **Parent category filter** (Moisturizers, Cleansers, Acne & Blemish, Sun Care, …)
- **Sub-category pills** that appear when a parent category is selected
- Product cards show an **olive-green ring** when the product is already in your routine

### Ingredient Analysis
- Real-time compatibility checks run every time your routine changes
- Warnings are color-coded by severity:
  - 🔴 **Error** — e.g. retinol in AM, benzoyl peroxide + retinol together
  - 🟡 **Warning** — e.g. multiple exfoliants, retinol + AHA/BHA in the same session
  - 🔵 **Tip** — e.g. no SPF in AM, Vitamin C better used in the morning
- **Skin type selector** (Normal / Dry / Oily / Combination / Sensitive) unlocks additional tailored rules
- Affected product cards are highlighted directly in the routine panel

### Smart Recommendations
- "Recommend" button opens a modal that suggests products to complement your existing routine
- Recommendations avoid ingredient conflicts with what you've already added

### Intro Screen
- Branded splash screen with *OLIVE 🫒 PICK* logo
- Olive-green watercolor "get started" button with a soft glow-pulse animation
- Slides up to reveal the app when dismissed

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, `'use client'` components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with custom `olive-*` and `cream-*` color palettes |
| State | [Zustand](https://zustand-demo.pmnd.rs) with `persist` middleware |
| Data | Static JSON (`src/data/products.json`) — 266 Olive Young products |
| Images | Next.js `<Image>` with remote Olive Young CDN URLs |
| Fonts | DM Sans, loaded via `next/font/google` |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, font loading
│   ├── page.tsx            # Main page — sidebar + catalog layout, drag state
│   └── globals.css         # Tailwind config, brand color tokens, keyframe animations
├── components/
│   ├── IntroScreen.tsx     # Splash screen with slide-up dismiss
│   ├── OlivePickLogo.tsx   # Nav logo — olive image + wordmark
│   ├── Catalog.tsx         # Product grid with search + category filters
│   ├── ProductCard.tsx     # Individual product card with add/remove dropdown
│   ├── RoutinePanel.tsx    # AM/PM/Weekly slots with drag-to-reorder
│   ├── AnalysisPanel.tsx   # Ingredient warnings display
│   ├── RecommendModal.tsx  # Product recommendation modal
│   └── Icons.tsx           # SVG icon components
├── lib/
│   ├── products.ts         # Product data helpers, image URL resolution
│   ├── rules.ts            # Ingredient compatibility rule engine
│   └── recommend.ts        # Recommendation logic
├── store/
│   └── routineStore.ts     # Zustand store — routine state, warnings, actions
├── types/
│   └── index.ts            # Shared TypeScript types
└── data/
    └── products.json       # 266 Olive Young products
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Data

Product data was sourced from [Olive Young](https://www.oliveyoung.com) and includes brand, product name, price (USD), category, key ingredients, formulation, skin type suitability, and product image paths.
