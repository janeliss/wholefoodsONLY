export interface Citation {
  label: string;
  url: string;
}

export interface IngredientIntel {
  name: string;
  definition: string;
  synonyms: string[];
  category: 'additive' | 'sweetener' | 'oil' | 'emulsifier' | 'preservative' | 'flavoring' | 'coloring';
  concernLevel: 'low' | 'med' | 'high';
  whyUsed: string[];
  whyConcerned: string[];
  betterAlternatives: string[];
  citations: Citation[];
}

export const INGREDIENT_INTEL: Record<string, IngredientIntel> = {
  'high fructose corn syrup': {
    name: 'High Fructose Corn Syrup',
    definition: 'A liquid sweetener made by converting glucose in corn syrup into fructose using enzymes.',
    synonyms: ['hfcs', 'high-fructose corn syrup', 'glucose-fructose syrup', 'isoglucose'],
    category: 'sweetener',
    concernLevel: 'high',
    whyUsed: [
      'Cheaper than cane sugar for food manufacturers',
      'Extends shelf life and improves texture in processed foods',
    ],
    whyConcerned: [
      'Linked to increased risk of obesity and metabolic syndrome in high-consumption studies',
      'May contribute to non-alcoholic fatty liver disease due to high fructose load',
      'Associated with increased uric acid levels and inflammation markers',
    ],
    betterAlternatives: ['Raw honey', 'Pure maple syrup', 'Date paste', 'Whole fruit'],
    citations: [
      { label: 'NIH', url: 'https://pubmed.ncbi.nlm.nih.gov/23594708/' },
      { label: 'AHA', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sugar/added-sugars' },
    ],
  },
  'corn syrup': {
    name: 'Corn Syrup',
    definition: 'A thick, sweet syrup produced by breaking down corn starch into glucose molecules.',
    synonyms: ['glucose syrup', 'corn syrup solids'],
    category: 'sweetener',
    concernLevel: 'med',
    whyUsed: [
      'Adds sweetness and prevents crystallization in confections',
      'Controls moisture and improves texture',
    ],
    whyConcerned: [
      'Highly refined carbohydrate with no nutritional value',
      'Rapid blood sugar spikes due to high glycemic index',
      'Frequent indicator of ultra-processed food formulation',
    ],
    betterAlternatives: ['Brown rice syrup', 'Maple syrup', 'Raw honey'],
    citations: [
      { label: 'USDA', url: 'https://fdc.nal.usda.gov/' },
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/additional-information-about-high-intensity-sweeteners' },
    ],
  },
  aspartame: {
    name: 'Aspartame',
    definition: 'A synthetic zero-calorie sweetener composed of two amino acids (aspartic acid and phenylalanine).',
    synonyms: ['e951', 'equal', 'nutrasweet'],
    category: 'sweetener',
    concernLevel: 'high',
    whyUsed: [
      'Zero-calorie sweetener ~200x sweeter than sugar',
      'Used in diet sodas, sugar-free products, and tabletop sweeteners',
    ],
    whyConcerned: [
      'IARC classified as "possibly carcinogenic to humans" (Group 2B) in 2023',
      'Some individuals report headaches and digestive discomfort',
      'Breaks down into phenylalanine, which is dangerous for people with PKU',
    ],
    betterAlternatives: ['Stevia leaf extract', 'Monk fruit sweetener', 'Allulose'],
    citations: [
      { label: 'WHO/IARC', url: 'https://www.iarc.who.int/news-events/aspartame-hazard-and-risk-assessment-results-released/' },
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/aspartame-and-other-sweeteners-food' },
    ],
  },
  sucralose: {
    name: 'Sucralose',
    definition: 'An artificial sweetener made by chemically modifying sugar molecules with chlorine atoms.',
    synonyms: ['e955', 'splenda'],
    category: 'sweetener',
    concernLevel: 'med',
    whyUsed: [
      'Zero-calorie sweetener ~600x sweeter than sugar',
      'Heat-stable, used in baking and cooking applications',
    ],
    whyConcerned: [
      'May reduce beneficial gut bacteria populations according to animal studies',
      'When heated above 120°C, may produce potentially harmful chlorinated compounds',
      'Some research suggests it may affect glucose and insulin responses',
    ],
    betterAlternatives: ['Stevia leaf extract', 'Monk fruit sweetener'],
    citations: [
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/31227734/' },
      { label: 'NIH', url: 'https://pubmed.ncbi.nlm.nih.gov/33577100/' },
    ],
  },
  'sodium benzoate': {
    name: 'Sodium Benzoate',
    definition: 'The sodium salt of benzoic acid, used as a chemical preservative in acidic foods and beverages.',
    synonyms: ['e211', 'benzoate of soda'],
    category: 'preservative',
    concernLevel: 'med',
    whyUsed: [
      'Prevents microbial growth in acidic foods',
      'Extends shelf life in beverages, sauces, and condiments',
    ],
    whyConcerned: [
      'When combined with ascorbic acid (vitamin C), can form benzene, a known carcinogen',
      'Some studies associate it with hyperactivity in children',
      'May increase oxidative stress at high concentrations',
    ],
    betterAlternatives: ['Citric acid', 'Rosemary extract', 'Vitamin E (tocopherols)'],
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/chemicals/questions-and-answers-occurrence-benzene-soft-drinks-and-other-beverages' },
      { label: 'EFSA', url: 'https://www.efsa.europa.eu/en/efsajournal/pub/4210' },
    ],
  },
  'potassium sorbate': {
    name: 'Potassium Sorbate',
    definition: 'The potassium salt of sorbic acid, a widely used preservative that inhibits mold and yeast.',
    synonyms: ['e202', 'sorbate'],
    category: 'preservative',
    concernLevel: 'low',
    whyUsed: [
      'Inhibits mold and yeast growth',
      'One of the most widely used preservatives globally',
    ],
    whyConcerned: [
      'Generally recognized as safe (GRAS) by FDA in typical amounts',
      'High concentrations in lab studies showed genotoxic potential, though dietary levels are far lower',
      'Indicates product is industrially formulated rather than fresh',
    ],
    betterAlternatives: ['Fermentation-based preservation', 'Refrigeration', 'Vitamin E'],
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-terms' },
      { label: 'EFSA', url: 'https://www.efsa.europa.eu/en/efsajournal/pub/4144' },
    ],
  },
  bht: {
    name: 'BHT (Butylated Hydroxytoluene)',
    definition: 'A synthetic antioxidant added to fats and oils to prevent them from going rancid.',
    synonyms: ['e321', 'butylated hydroxytoluene', 'bha', 'tbhq'],
    category: 'preservative',
    concernLevel: 'high',
    whyUsed: [
      'Prevents oxidation and rancidity in fats and oils',
      'Extends shelf life of cereals, snack foods, and packaging',
    ],
    whyConcerned: [
      'BHA is classified as "reasonably anticipated to be a human carcinogen" by NTP',
      'Some countries restrict or ban BHT in food products',
      'May act as an endocrine disruptor at high doses',
    ],
    betterAlternatives: ['Vitamin E (mixed tocopherols)', 'Rosemary extract', 'Green tea extract'],
    citations: [
      { label: 'NIH/NTP', url: 'https://ntp.niehs.nih.gov/ntp/roc/content/profiles/butylatedhydroxyanisole.pdf' },
      { label: 'EFSA', url: 'https://www.efsa.europa.eu/en/efsajournal/pub/4580' },
    ],
  },
  'sodium nitrite': {
    name: 'Sodium Nitrite',
    definition: 'An inorganic compound used to cure meats, prevent botulism, and maintain pink color.',
    synonyms: ['e250', 'sodium nitrate', 'nitrite', 'nitrate'],
    category: 'preservative',
    concernLevel: 'high',
    whyUsed: [
      'Prevents botulism in cured meats',
      'Gives cured meats their characteristic pink color and flavor',
    ],
    whyConcerned: [
      'Can form nitrosamines (carcinogens) when exposed to high heat',
      'WHO/IARC classifies processed meat (often nitrite-cured) as Group 1 carcinogen',
      'Linked to increased colorectal cancer risk in large epidemiological studies',
    ],
    betterAlternatives: ['Celery-powder–cured (still contains nitrates, but from natural source)', 'Fresh, uncured meats', 'Sea salt preservation'],
    citations: [
      { label: 'WHO/IARC', url: 'https://www.iarc.who.int/wp-content/uploads/2018/07/pr240_E.pdf' },
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/28487287/' },
    ],
  },
  'caramel color': {
    name: 'Caramel Color',
    definition: 'A dark brown food coloring produced by heating sugar compounds, often with ammonia or sulfites.',
    synonyms: ['e150', 'e150a', 'e150b', 'e150c', 'e150d', 'caramel coloring'],
    category: 'coloring',
    concernLevel: 'med',
    whyUsed: [
      'Most widely used food coloring globally',
      'Gives brown color to colas, soy sauce, baked goods, and beer',
    ],
    whyConcerned: [
      'Class III and IV caramel colors contain 4-MEI, classified as possibly carcinogenic',
      'California Prop 65 requires warning labels for products with significant 4-MEI levels',
      'No nutritional benefit; purely cosmetic',
    ],
    betterAlternatives: ['Cocoa powder', 'Molasses', 'Date syrup'],
    citations: [
      { label: 'NIH', url: 'https://pubmed.ncbi.nlm.nih.gov/22189572/' },
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/food-additive-status-list' },
    ],
  },
  'titanium dioxide': {
    name: 'Titanium Dioxide',
    definition: 'A white mineral pigment used to brighten and whiten foods, banned in the EU since 2022.',
    synonyms: ['e171', 'tio2'],
    category: 'coloring',
    concernLevel: 'high',
    whyUsed: [
      'Makes foods appear brighter white or more opaque',
      'Used in candies, chewing gum, coffee creamer, and icing',
    ],
    whyConcerned: [
      'Banned as a food additive in the EU since 2022 due to genotoxicity concerns',
      'EFSA concluded it could no longer be considered safe as a food additive',
      'Nanoparticle form may accumulate in tissues',
    ],
    betterAlternatives: ['Rice starch', 'Calcium carbonate', 'No whitener needed'],
    citations: [
      { label: 'EFSA', url: 'https://www.efsa.europa.eu/en/efsajournal/pub/6585' },
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/color-additive-status-list' },
    ],
  },
  carrageenan: {
    name: 'Carrageenan',
    definition: 'A gel-forming polysaccharide extracted from red seaweed, used as a thickener and stabilizer.',
    synonyms: ['e407', 'irish moss extract'],
    category: 'emulsifier',
    concernLevel: 'med',
    whyUsed: [
      'Natural seaweed-derived thickener and stabilizer',
      'Prevents ingredient separation in dairy alternatives and deli meats',
    ],
    whyConcerned: [
      'Degraded carrageenan (poligeenan) is a known inflammatory agent in lab studies',
      'Some research suggests even food-grade carrageenan may trigger GI inflammation',
      'National Organic Standards Board removed it from allowed organic ingredients',
    ],
    betterAlternatives: ['Gellan gum', 'Agar-agar', 'Sunflower lecithin'],
    citations: [
      { label: 'NIH', url: 'https://pubmed.ncbi.nlm.nih.gov/28268093/' },
      { label: 'USDA/NOP', url: 'https://www.ams.usda.gov/rules-regulations/organic/national-list' },
    ],
  },
  polysorbate: {
    name: 'Polysorbate 80',
    definition: 'A synthetic emulsifier derived from sorbitol and oleic acid, used to blend oil and water.',
    synonyms: ['e433', 'polysorbate 60', 'polysorbate 20', 'tween 80'],
    category: 'emulsifier',
    concernLevel: 'med',
    whyUsed: [
      'Keeps water and oil from separating in foods',
      'Used in ice cream, sauces, and baked goods for smooth texture',
    ],
    whyConcerned: [
      'Animal studies suggest it may promote gut inflammation and alter microbiome',
      'Research indicates it may impair the intestinal mucus barrier',
      'Associated with metabolic syndrome markers in mouse models',
    ],
    betterAlternatives: ['Sunflower lecithin', 'Egg yolk (natural emulsifier)', 'Gum arabic'],
    citations: [
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/25731162/' },
      { label: 'NIH', url: 'https://pubmed.ncbi.nlm.nih.gov/33051211/' },
    ],
  },
  'xanthan gum': {
    name: 'Xanthan Gum',
    definition: 'A polysaccharide produced by bacterial fermentation, used as a thickener and stabilizer.',
    synonyms: ['e415'],
    category: 'emulsifier',
    concernLevel: 'low',
    whyUsed: [
      'Thickens and stabilizes sauces, dressings, and gluten-free baked goods',
      'Created by bacterial fermentation of sugar',
    ],
    whyConcerned: [
      'Generally recognized as safe (GRAS) by FDA',
      'In large amounts may cause bloating or digestive discomfort',
      'Presence indicates industrial food processing',
    ],
    betterAlternatives: ['Ground flaxseed', 'Chia seeds', 'Psyllium husk', 'Arrowroot'],
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/food-additive-status-list' },
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/28622286/' },
    ],
  },
  'monosodium glutamate': {
    name: 'Monosodium Glutamate (MSG)',
    definition: 'The sodium salt of glutamic acid, an amino acid that activates umami taste receptors.',
    synonyms: ['e621', 'msg', 'glutamic acid', 'glutamate'],
    category: 'flavoring',
    concernLevel: 'low',
    whyUsed: [
      'Enhances savory (umami) flavor in foods',
      'Reduces need for salt while boosting taste perception',
    ],
    whyConcerned: [
      'FDA classifies as GRAS; extensive research has not confirmed "Chinese restaurant syndrome"',
      'A small percentage of people report sensitivity (headaches, flushing)',
      'Often signals highly engineered flavor profiles in ultra-processed foods',
    ],
    betterAlternatives: ['Mushroom powder', 'Nutritional yeast', 'Seaweed/kombu', 'Tomato paste'],
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/questions-and-answers-monosodium-glutamate-msg' },
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/19389112/' },
    ],
  },
  'natural flavor': {
    name: 'Natural Flavors',
    definition: 'A catch-all FDA term for flavor compounds derived from plant or animal sources through various processes.',
    synonyms: ['natural flavors', 'natural flavoring', 'natural flavour', 'natural flavouring'],
    category: 'flavoring',
    concernLevel: 'med',
    whyUsed: [
      'Catch-all term for flavor compounds derived from natural sources',
      'Can involve extensive chemical processing of originally natural materials',
    ],
    whyConcerned: [
      'Label provides no transparency about specific ingredients',
      'May contain incidental additives like solvents and preservatives',
      'Some "natural" flavors are chemically identical to artificial counterparts',
    ],
    betterAlternatives: ['Whole spices and herbs', 'Citrus zest', 'Vanilla bean', 'Real fruit extracts'],
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-terms' },
      { label: 'EWG', url: 'https://www.ewg.org/foodscores/content/natural-vs-artificial-flavors/' },
    ],
  },
  'artificial flavor': {
    name: 'Artificial Flavors',
    definition: 'Synthetic chemical compounds manufactured in a lab to mimic natural flavors.',
    synonyms: ['artificial flavoring', 'artificial flavour'],
    category: 'flavoring',
    concernLevel: 'high',
    whyUsed: [
      'Cheaper and more consistent than natural flavor sources',
      'Can replicate virtually any taste profile',
    ],
    whyConcerned: [
      'Synthesized from petroleum or chemical precursors',
      'No nutritional value; designed to make ultra-processed food hyper-palatable',
      'Some individuals report sensitivities or allergic reactions',
    ],
    betterAlternatives: ['Real vanilla', 'Fresh fruit', 'Whole spices', 'Herb infusions'],
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-terms' },
      { label: 'Mayo Clinic', url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/artificial-sweeteners/art-20046936' },
    ],
  },
  hydrogenated: {
    name: 'Hydrogenated Oils',
    definition: 'Vegetable oils that have been chemically altered by adding hydrogen to make them solid at room temperature.',
    synonyms: ['partially hydrogenated', 'fully hydrogenated', 'hydrogenated vegetable oil', 'hydrogenated soybean oil'],
    category: 'oil',
    concernLevel: 'high',
    whyUsed: [
      'Converts liquid oils to solid fats for texture and shelf life',
      'Cheaper than butter or animal fats for industrial food production',
    ],
    whyConcerned: [
      'Partially hydrogenated oils are the primary source of artificial trans fats',
      'FDA determined PHOs are not GRAS and banned them from food supply (2018)',
      'Trans fats strongly linked to heart disease, LDL increase, and HDL decrease',
    ],
    betterAlternatives: ['Extra virgin olive oil', 'Avocado oil', 'Coconut oil', 'Grass-fed butter'],
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/trans-fat' },
      { label: 'AHA', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/fats/trans-fat' },
    ],
  },
  maltodextrin: {
    name: 'Maltodextrin',
    definition: 'A white powder made from corn, rice, or potato starch, used as a filler, thickener, and preservative.',
    synonyms: ['dextrin', 'modified food starch'],
    category: 'additive',
    concernLevel: 'med',
    whyUsed: [
      'Cheap filler and thickener in processed foods',
      'Used as a binding agent in spice mixes and supplements',
    ],
    whyConcerned: [
      'Glycemic index of 85–105 (higher than table sugar)',
      'May alter gut bacteria composition, potentially promoting harmful bacteria',
      'Often made from genetically modified corn',
    ],
    betterAlternatives: ['Tapioca starch', 'Arrowroot powder', 'Whole food thickeners'],
    citations: [
      { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/25197735/' },
      { label: 'NIH', url: 'https://pubmed.ncbi.nlm.nih.gov/22450869/' },
    ],
  },
  dextrose: {
    name: 'Dextrose',
    definition: 'Pure glucose (simple sugar) typically derived from corn starch through enzymatic hydrolysis.',
    synonyms: ['d-glucose', 'grape sugar', 'corn sugar'],
    category: 'sweetener',
    concernLevel: 'med',
    whyUsed: [
      'Quick-absorbing simple sugar used for sweetness and browning',
      'Common in IV solutions, sports drinks, and baked goods',
    ],
    whyConcerned: [
      'Essentially pure glucose with a very high glycemic index',
      'Rapid blood sugar spikes can stress insulin response',
      'No nutritional benefit beyond calories',
    ],
    betterAlternatives: ['Coconut sugar', 'Raw honey', 'Whole fruit'],
    citations: [
      { label: 'USDA', url: 'https://fdc.nal.usda.gov/' },
    ],
  },
  'modified starch': {
    name: 'Modified Starch',
    definition: 'Starch that has been chemically, physically, or enzymatically treated to change its properties.',
    synonyms: ['modified corn starch', 'modified food starch', 'modified tapioca starch'],
    category: 'additive',
    concernLevel: 'low',
    whyUsed: [
      'Improved thickening, stability, and texture in processed foods',
      'Resists breakdown during heating, freezing, and acidic conditions',
    ],
    whyConcerned: [
      'Chemically or enzymatically altered from natural starch',
      'May be cross-linked with compounds like phosphorus oxychloride',
      'Indicates industrial-level processing of the food product',
    ],
    betterAlternatives: ['Arrowroot powder', 'Tapioca flour', 'Potato starch', 'Cornstarch'],
    citations: [
      { label: 'FDA', url: 'https://www.fda.gov/food/food-additives-petitions/food-additive-status-list' },
    ],
  },
  'soy protein isolate': {
    name: 'Soy Protein Isolate',
    definition: 'A highly refined protein powder extracted from defatted soy flour using chemical solvents.',
    synonyms: ['isolated soy protein', 'whey protein isolate', 'protein isolate'],
    category: 'additive',
    concernLevel: 'med',
    whyUsed: [
      'Cheap way to boost protein content on nutrition labels',
      'Used as a meat extender and texture modifier',
    ],
    whyConcerned: [
      'Heavily processed using hexane solvent extraction',
      'Phytoestrogen content may affect hormone-sensitive individuals at high intake',
      'Often made from genetically modified soybeans',
    ],
    betterAlternatives: ['Whole soybeans or tempeh', 'Nuts and seeds', 'Pasture-raised eggs', 'Legumes'],
    citations: [
      { label: 'NIH', url: 'https://pubmed.ncbi.nlm.nih.gov/19524224/' },
      { label: 'USDA', url: 'https://fdc.nal.usda.gov/' },
    ],
  },
};

export function lookupIngredient(ingredientName: string): IngredientIntel | null {
  const normalized = ingredientName.toLowerCase().trim();

  // Direct match
  if (INGREDIENT_INTEL[normalized]) {
    return INGREDIENT_INTEL[normalized];
  }

  // Synonym match
  for (const intel of Object.values(INGREDIENT_INTEL)) {
    if (intel.synonyms.some(syn => normalized.includes(syn) || syn.includes(normalized))) {
      return intel;
    }
  }

  // Partial key match
  for (const [key, intel] of Object.entries(INGREDIENT_INTEL)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return intel;
    }
  }

  return null;
}
