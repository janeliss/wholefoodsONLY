# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — start Vite dev server (port 5173, network-accessible)
- `npm run build` — TypeScript check + production build to `dist/`
- `npm run preview` — serve production build locally
- `npm run lint` — ESLint with flat config (eslint.config.js)
- `npm run typecheck` — `tsc --noEmit` type checking only

## Architecture

React 18 + TypeScript + Vite. Mobile-first single-page app with no router — state machine in `App.tsx` controls four views: `scanner`, `loading`, `results`, `error`.

### Data Flow

1. `Scanner` component uses ZXing `BrowserMultiFormatReader` to decode barcodes from camera or accepts manual entry
2. `App.handleScan(barcode)` triggers the pipeline: fetch → analyze → suggest → display
3. `openFoodFacts.ts` fetches product data from `world.openfoodfacts.org/api/v2/product/{barcode}.json` (no API key needed)
4. `ingredientAnalyzer.ts` matches ingredient text against regex patterns in `ULTRA_PROCESSED_MARKERS` and scores as good/okay/poor using flag count + NOVA group
5. `alternatives.ts` maps flagged ingredient patterns to whole-food replacement suggestions
6. `Results` component renders the full analysis

### Key Files

- `src/types/product.ts` — all TypeScript interfaces (`Product`, `AnalysisResult`, `IngredientFlag`, `Alternative`)
- `src/services/openFoodFacts.ts` — API client; parses nutrition and ingredients from OFF response
- `src/utils/ingredientAnalyzer.ts` — regex-based ingredient flagging + scoring logic
- `src/utils/alternatives.ts` — rule-based whole-food alternative suggestions
- `src/components/Scanner.tsx` — camera barcode scanning with ZXing + manual fallback
- `src/components/Results.tsx` — product info, flags, nutrition, alternatives display

### Adding New Ingredient Rules

Add to `ULTRA_PROCESSED_MARKERS` in `ingredientAnalyzer.ts` (regex pattern + reason string). If a new category of alternatives is needed, add a matching rule in `alternatives.ts` `RULES` array.

## External Dependencies

- **OpenFoodFacts API** — free, no auth, rate-limited. Product data varies in completeness.
- **ZXing** — `@zxing/library` for decoding, `@zxing/browser` for camera access. Camera requires HTTPS in production.
