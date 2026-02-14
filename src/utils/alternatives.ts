import type { Alternative, IngredientFlag } from '../types/product';

interface AlternativeRule {
  trigger: RegExp;
  alternatives: Alternative[];
}

const RULES: AlternativeRule[] = [
  {
    trigger: /corn syrup|high[- ]fructose|dextrose|maltodextrin/,
    alternatives: [
      { name: 'Raw honey', why: 'Natural sweetener with enzymes and antioxidants' },
      { name: 'Maple syrup', why: 'Minimally processed, contains minerals' },
      { name: 'Dates or date paste', why: 'Whole fruit sweetener with fiber' },
    ],
  },
  {
    trigger: /aspartame|sucralose|acesulfame|saccharin/,
    alternatives: [
      { name: 'Stevia leaf', why: 'Plant-based zero-calorie sweetener' },
      { name: 'Monk fruit', why: 'Natural zero-calorie sweetener' },
    ],
  },
  {
    trigger: /hydrogenated|interesterified/,
    alternatives: [
      { name: 'Extra virgin olive oil', why: 'Heart-healthy unprocessed fat' },
      { name: 'Coconut oil', why: 'Minimally processed saturated fat' },
      { name: 'Grass-fed butter or ghee', why: 'Traditional whole-food fat' },
    ],
  },
  {
    trigger: /artificial flavou?r|natural flavou?r|msg|monosodium/,
    alternatives: [
      { name: 'Fresh herbs & spices', why: 'Real flavor without additives' },
      { name: 'Nutritional yeast', why: 'Natural umami flavor, rich in B vitamins' },
      { name: 'Tamari or coconut aminos', why: 'Fermented, less processed flavor' },
    ],
  },
  {
    trigger: /artificial color|red\s*#?\d|yellow\s*#?\d|blue\s*#?\d|caramel color|titanium dioxide/,
    alternatives: [
      { name: 'Beet powder', why: 'Natural red coloring from whole beets' },
      { name: 'Turmeric', why: 'Natural yellow coloring with anti-inflammatory benefits' },
      { name: 'Spirulina', why: 'Natural blue-green coloring from algae' },
    ],
  },
  {
    trigger: /sodium benzoate|potassium sorbate|bht|bha|tbhq|sodium nitrite/,
    alternatives: [
      { name: 'Vitamin E (tocopherols)', why: 'Natural antioxidant preservative' },
      { name: 'Rosemary extract', why: 'Natural preservation from herbs' },
      { name: 'Fermented or lacto-preserved foods', why: 'Preserved through natural fermentation' },
    ],
  },
  {
    trigger: /carrageenan|polysorbate|xanthan|cellulose gum/,
    alternatives: [
      { name: 'Agar-agar', why: 'Seaweed-based natural thickener' },
      { name: 'Arrowroot powder', why: 'Whole root starch thickener' },
      { name: 'Chia or flax gel', why: 'Whole seed-based thickener with omega-3s' },
    ],
  },
  {
    trigger: /soy protein isolate|whey protein isolate/,
    alternatives: [
      { name: 'Whole nuts & seeds', why: 'Complete protein with healthy fats and fiber' },
      { name: 'Organic tempeh', why: 'Fermented whole soy with probiotics' },
      { name: 'Pasture-raised eggs', why: 'Complete whole-food protein' },
    ],
  },
  {
    trigger: /modified.*starch/,
    alternatives: [
      { name: 'Tapioca starch', why: 'Naturally extracted root starch' },
      { name: 'Potato starch', why: 'Simple unmodified starch' },
    ],
  },
];

export function suggestAlternatives(flags: IngredientFlag[]): Alternative[] {
  const seen = new Set<string>();
  const results: Alternative[] = [];
  const flagText = flags.map(f => f.ingredient).join(', ');

  for (const rule of RULES) {
    if (rule.trigger.test(flagText)) {
      for (const alt of rule.alternatives) {
        if (!seen.has(alt.name)) {
          seen.add(alt.name);
          results.push(alt);
        }
      }
    }
  }

  return results;
}
