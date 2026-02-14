import type { IngredientFlag } from '../types/product';

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
      });
    }
  }

  return flags;
}

export function computeScore(flags: IngredientFlag[], novaGroup?: number): 'good' | 'okay' | 'poor' {
  if (novaGroup === 4 || flags.length >= 4) return 'poor';
  if (novaGroup === 3 || flags.length >= 1) return 'okay';
  return 'good';
}
