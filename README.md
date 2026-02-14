# WholeFoodsOnly Scanner

A mobile-first web app that lets you scan product barcodes to check for ultra-processed ingredients and discover whole food alternatives.

## Features

- **Barcode scanning** via phone camera (ZXing library)
- **Product lookup** using the OpenFoodFacts API
- **Ingredient analysis** that flags ultra-processed additives
- **Whole food alternatives** suggested for each flagged ingredient
- **Nutrition facts** per 100g
- Manual barcode entry fallback

## Setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal. For camera scanning, use your phone on the same network or use HTTPS.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Deploy to Netlify

1. Push to GitHub
2. Connect the repo in [Netlify](https://app.netlify.com)
3. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy

Or use the Netlify CLI:

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

## Tech Stack

- React 18 + TypeScript
- Vite 6
- ZXing (barcode decoding)
- OpenFoodFacts API (no key required)
