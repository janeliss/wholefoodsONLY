export interface Product {
  code: string;
  name: string;
  brand: string;
  ingredients: string;
  ingredientsList: string[];
  nutrition: NutritionData;
  imageUrl?: string;
  novaGroup?: number;
}

export interface NutritionData {
  calories: number | null;
  fat: number | null;
  saturatedFat: number | null;
  carbs: number | null;
  sugars: number | null;
  fiber: number | null;
  protein: number | null;
  sodium: number | null;
}

export interface IngredientFlag {
  ingredient: string;
  reason: string;
}

export interface Alternative {
  name: string;
  why: string;
}

export interface AnalysisResult {
  product: Product;
  flags: IngredientFlag[];
  alternatives: Alternative[];
  score: 'good' | 'okay' | 'poor';
}
