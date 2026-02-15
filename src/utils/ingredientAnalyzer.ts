import type { IngredientFlag, SodiumAnalysis, SodiumLevel, ScoreBreakdownItem } from '../types/product';
import { lookupIngredient } from '../data/ingredientIntel';

const ULTRA_PROCESSED_MARKERS: Array<{ pattern: RegExp; reason: string }> = [
  // Sweeteners
  { pattern: /high[- ]fructose corn syrup/, reason: 'Ultra-processed sweetener' },
  { pattern: /corn syrup/, reason: 'Refined sweetener' },
  { pattern: /aspartame|sucralose|acesulfame|saccharin|neotame/, reason: 'Artificial sweetener' },
  { pattern: /dextrose|maltodextrin/, reason: 'Highly refined carbohydrate' },

  // Preservatives
  { pattern: /sodium benzoate/, reason: 'Chemical preservative' },
  { pattern: /potassium sorbate/, reason: 'Chemical preservative' },
  { pattern: /bht|bha|tbhq/, reason: 'Synthetic antioxidant preservative' },
  { pattern: /sodium nitrite|sodium nitrate/, reason: 'Curing agent / preservative' },

  // Colors
  { pattern: /red\s*#?\d+|yellow\s*#?\d+|blue\s*#?\d+/, reason: 'Artificial color' },
  { pattern: /caramel color/, reason: 'Processed coloring' },
  { pattern: /titanium dioxide/, reason: 'Artificial whitening agent' },

  // Emulsifiers & thickeners
  { pattern: /polysorbate/, reason: 'Synthetic emulsifier' },
  { pattern: /carrageenan/, reason: 'Processed thickener (linked to inflammation)' },
  { pattern: /xanthan gum/, reason: 'Industrial thickener' },
  { pattern: /cellulose gum|carboxymethyl/, reason: 'Processed filler / thickener' },

  // Flavor enhancers
  { pattern: /monosodium glutamate|msg/, reason: 'Flavor enhancer' },
  { pattern: /artificial flavou?r/, reason: 'Artificial flavoring' },
  { pattern: /natural flavou?r/, reason: 'Processed flavor compound (often not truly natural)' },

  // Oils
  { pattern: /hydrogenated/, reason: 'Contains trans fats / hydrogenated oils' },
  { pattern: /interesterified/, reason: 'Chemically modified fat' },

  // Other
  { pattern: /soy protein isolate|whey protein isolate/, reason: 'Ultra-processed protein extract' },
  { pattern: /modified (corn |food )?starch/, reason: 'Chemically modified starch' },
  { pattern: /sodium phosphate|calcium phosphate/, reason: 'Industrial additive' },
];

export function analyzeIngredients(ingredients: string[]): IngredientFlag[] {
  const flags: IngredientFlag[] = [];
  const fullText = ingredients.join(', ');

  for (const marker of ULTRA_PROCESSED_MARKERS) {
    const match = fullText.match(marker.pattern);
    if (match) {
      flags.push({
        ingredient: match[0],
        reason: marker.reason,
        intel: lookupIngredient(match[0]),
      });
    }
  }

  return flags;
}

/** FDA Daily Value for sodium: 2300 mg */
const SODIUM_DV_MG = 2300;

/** Sodium thresholds per 100g (FDA guidance) */
const SODIUM_LOW_THRESHOLD = 140; // mg per serving — "low sodium"
const SODIUM_HIGH_THRESHOLD = 600; // mg per 100g — "high sodium"

export function analyzeSodium(sodiumMg: number | null): SodiumAnalysis | null {
  if (sodiumMg === null) return null;

  const percentDV = Math.round((sodiumMg / SODIUM_DV_MG) * 100);

  let level: SodiumLevel;
  if (sodiumMg <= SODIUM_LOW_THRESHOLD) {
    level = 'low';
  } else if (sodiumMg <= SODIUM_HIGH_THRESHOLD) {
    level = 'moderate';
  } else {
    level = 'high';
  }

  return { milligrams: sodiumMg, percentDV, level };
}

export function computeScore(
  flags: IngredientFlag[],
  novaGroup: number | undefined,
  sneakyCount: number,
  sodiumAnalysis: SodiumAnalysis | null,
): { score: 'good' | 'okay' | 'poor'; breakdown: ScoreBreakdownItem[] } {
  const breakdown: ScoreBreakdownItem[] = [];
  let penalty = 0;

  // Flag-based scoring
  if (flags.length === 0) {
    breakdown.push({ label: 'No flagged additives', impact: 'positive' });
  } else if (flags.length <= 2) {
    penalty += 1;
    breakdown.push({ label: `${flags.length} flagged additive${flags.length > 1 ? 's' : ''}`, impact: 'negative' });
  } else {
    penalty += 2;
    breakdown.push({ label: `${flags.length} flagged additives`, impact: 'negative' });
  }

  // NOVA group
  if (novaGroup === 4) {
    penalty += 2;
    breakdown.push({ label: 'NOVA 4 (ultra-processed)', impact: 'negative' });
  } else if (novaGroup === 3) {
    penalty += 1;
    breakdown.push({ label: 'NOVA 3 (processed)', impact: 'negative' });
  } else if (novaGroup === 1) {
    breakdown.push({ label: 'NOVA 1 (unprocessed)', impact: 'positive' });
  } else if (novaGroup === 2) {
    breakdown.push({ label: 'NOVA 2 (minimally processed)', impact: 'neutral' });
  }

  // Sneaky ingredients
  if (sneakyCount > 0) {
    penalty += 1;
    breakdown.push({ label: `${sneakyCount} sneaky ingredient${sneakyCount > 1 ? 's' : ''} detected`, impact: 'negative' });
  }

  // Sodium
  if (sodiumAnalysis) {
    if (sodiumAnalysis.level === 'high') {
      penalty += 1;
      breakdown.push({ label: 'High sodium content', impact: 'negative' });
    } else if (sodiumAnalysis.level === 'low') {
      breakdown.push({ label: 'Low sodium', impact: 'positive' });
    } else {
      breakdown.push({ label: 'Moderate sodium', impact: 'neutral' });
    }
  }

  // High-concern categories
  const hasArtificialSweetener = flags.some(f => /artificial sweetener/i.test(f.reason));
  const hasTransFat = flags.some(f => /trans fat|hydrogenated/i.test(f.reason));
  if (hasArtificialSweetener) {
    penalty += 1;
    breakdown.push({ label: 'Contains artificial sweeteners', impact: 'negative' });
  }
  if (hasTransFat) {
    penalty += 1;
    breakdown.push({ label: 'Contains hydrogenated oils', impact: 'negative' });
  }

  let score: 'good' | 'okay' | 'poor';
  if (penalty >= 3) {
    score = 'poor';
  } else if (penalty >= 1) {
    score = 'okay';
  } else {
    score = 'good';
  }

  return { score, breakdown };
}
