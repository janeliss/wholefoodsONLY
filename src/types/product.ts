import type { SneakyMatch } from '../data/sneakyIngredients';
import type { IngredientIntel } from '../data/ingredientIntel';

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
  intel?: IngredientIntel | null;
}

export interface Alternative {
  name: string;
  why: string;
}

export type SodiumLevel = 'low' | 'moderate' | 'high';

export interface SodiumAnalysis {
  milligrams: number;
  percentDV: number;
  level: SodiumLevel;
}

export interface AnalysisResult {
  product: Product;
  flags: IngredientFlag[];
  alternatives: Alternative[];
  score: 'good' | 'okay' | 'poor';
  scoreBreakdown: ScoreBreakdownItem[];
  sneakyIngredients: SneakyMatch[];
  sodiumAnalysis: SodiumAnalysis | null;
}

export interface ScoreBreakdownItem {
  label: string;
  impact: 'positive' | 'neutral' | 'negative';
}
