export interface SneakyIngredient {
  term: string;
  pattern: RegExp;
  explanation: string;
  whatToLookFor: string;
  citations: Array<{ label: string; url: string }>;
}

export const SNEAKY_INGREDIENTS: SneakyIngredient[] = [
  {
    term: 'Evaporated Cane Juice',
    pattern: /evaporated cane juice|cane juice crystals|crystallized cane juice/i,
    explanation:
      'Despite the wholesome-sounding name, this is essentially unrefined sugar. The FDA has warned that "evaporated cane juice" is misleading because the product is a sweetener, not a juice.',
    whatToLookFor: 'Products sweetened with whole fruit, raw honey, or pure maple syrup.',
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-labeling-nutrition/guidance-industry-ingredients-declared-evaporated-cane-juice' },
    ],
  },
  {
    term: 'Natural Flavors',
    pattern: /natural flavou?rs?|natural flavou?ring/i,
    explanation:
      'A catch-all term that can include hundreds of chemical compounds derived from natural sources. While not inherently harmful, it provides zero transparency about what you\'re actually consuming.',
    whatToLookFor: 'Products that list specific flavoring ingredients (e.g., "vanilla extract" instead of "natural flavors").',
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-terms' },
      { label: 'EWG', url: 'https://www.ewg.org/foodscores/content/natural-vs-artificial-flavors/' },
    ],
  },
  {
    term: 'Yeast Extract',
    pattern: /yeast extract|autolyzed yeast/i,
    explanation:
      'Contains naturally occurring glutamates (similar to MSG) that enhance umami flavor. It\'s technically natural but functions as a flavor enhancer and adds hidden sodium.',
    whatToLookFor: 'Products flavored with real herbs, spices, mushroom powder, or nutritional yeast.',
    citations: [
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/19389112/' },
    ],
  },
  {
    term: 'Maltodextrin',
    pattern: /maltodextrin/i,
    explanation:
      'A highly processed starch-derived powder with a glycemic index higher than table sugar (85–105 vs. 65). Often used as a cheap filler and thickener.',
    whatToLookFor: 'Products thickened with whole food starches like tapioca or arrowroot.',
    citations: [
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/25197735/' },
    ],
  },
  {
    term: 'Vegetable Oil (Unspecified)',
    pattern: /vegetable oil(?!\s*\()|vegetable oils/i,
    explanation:
      'When "vegetable oil" is listed without specifying the source, it\'s often a blend of the cheapest oils available (usually soybean, canola, or palm). These are typically refined using high heat and chemical solvents.',
    whatToLookFor: 'Products that name specific oils (extra virgin olive oil, avocado oil, coconut oil).',
    citations: [
      { label: 'AHA', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/fats/healthy-cooking-oils' },
    ],
  },
  {
    term: 'Fruit Juice Concentrate',
    pattern: /fruit juice concentrate|juice concentrate|concentrated juice|apple juice concentrate|grape juice concentrate|pear juice concentrate/i,
    explanation:
      'Sounds healthy but is essentially sugar water. The concentration process strips away fiber and most nutrients, leaving mainly fructose. Often used to sweeten products while claiming "no added sugar."',
    whatToLookFor: 'Products sweetened with whole fruit or small amounts of raw honey or dates.',
    citations: [
      { label: 'AHA', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sugar/added-sugars' },
      { label: 'USDA', url: 'https://fdc.nal.usda.gov/' },
    ],
  },
  {
    term: 'Dextrose',
    pattern: /\bdextrose\b/i,
    explanation:
      'Pure glucose derived from corn starch. Has a glycemic index of ~100 (same as pure glucose). Manufacturers use this name because it sounds more technical and less alarming than "corn sugar."',
    whatToLookFor: 'Products that use whole food sweeteners like dates, maple syrup, or raw honey.',
    citations: [
      { label: 'USDA', url: 'https://fdc.nal.usda.gov/' },
    ],
  },
  {
    term: 'Rice Syrup',
    pattern: /rice syrup|brown rice syrup|rice malt syrup/i,
    explanation:
      'Marketed as a "natural" sweetener, but it\'s highly refined with a very high glycemic index. It\'s essentially glucose with minimal nutritional value.',
    whatToLookFor: 'Raw honey, pure maple syrup, or whole-fruit sweeteners.',
    citations: [
      { label: 'USDA', url: 'https://fdc.nal.usda.gov/' },
    ],
  },
  {
    term: 'Glucose Syrup',
    pattern: /glucose syrup|glucose-fructose syrup|glucose solids/i,
    explanation:
      'Another name for a highly processed sugar derived from starch (usually corn or wheat). It\'s functionally similar to corn syrup but the name obscures its ultra-processed nature.',
    whatToLookFor: 'Products sweetened with whole fruit, raw honey, or maple syrup.',
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-terms' },
    ],
  },
  {
    term: '"Uncured" with Celery Powder',
    pattern: /celery powder|celery juice|celery extract/i,
    explanation:
      'Products labeled "uncured" or "no nitrates added" often use celery powder, which is naturally high in nitrates. Your body converts these to nitrites identically to synthetic sodium nitrite. The "uncured" label can be misleading.',
    whatToLookFor: 'Truly fresh, unprocessed meats without any curing agents, or understand that celery-powder curing is not meaningfully different from traditional curing.',
    citations: [
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/28487287/' },
      { label: 'USDA', url: 'https://www.ams.usda.gov/rules-regulations/organic/labeling' },
    ],
  },
  {
    term: 'Inulin / Chicory Root Fiber',
    pattern: /\binulin\b|chicory root fiber|chicory root extract/i,
    explanation:
      'Often added to boost "fiber" content on nutrition labels. While chicory root fiber is a real prebiotic, it\'s isolated and concentrated from its whole food source. Large amounts can cause significant digestive discomfort (bloating, gas).',
    whatToLookFor: 'Fiber from whole food sources like oats, flaxseed, chia seeds, or vegetables.',
    citations: [
      { label: 'NIH', url: 'https://pubmed.ncbi.nlm.nih.gov/28159043/' },
    ],
  },
  {
    term: 'Soy Lecithin',
    pattern: /soy lecithin|soya lecithin/i,
    explanation:
      'An emulsifier extracted from soybean oil processing. While generally considered safe, it\'s a byproduct of industrial oil refining and is ubiquitous in ultra-processed foods. Most is derived from genetically modified soy.',
    whatToLookFor: 'Products using sunflower lecithin or whole food emulsifiers like egg yolk.',
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/food-additive-status-list' },
    ],
  },
];

export interface SneakyMatch {
  term: string;
  matchedText: string;
  explanation: string;
  whatToLookFor: string;
  citations: Array<{ label: string; url: string }>;
}

export function detectSneakyIngredients(ingredientsList: string[]): SneakyMatch[] {
  const fullText = ingredientsList.join(', ').toLowerCase();
  const matches: SneakyMatch[] = [];
  const seen = new Set<string>();

  for (const sneaky of SNEAKY_INGREDIENTS) {
    const match = fullText.match(sneaky.pattern);
    if (match && !seen.has(sneaky.term)) {
      seen.add(sneaky.term);
      matches.push({
        term: sneaky.term,
        matchedText: match[0],
        explanation: sneaky.explanation,
        whatToLookFor: sneaky.whatToLookFor,
        citations: sneaky.citations,
      });
    }
  }

  return matches;
}
