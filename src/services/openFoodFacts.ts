import type { Product, NutritionData } from '../types/product';

const API_BASE = 'https://world.openfoodfacts.org/api/v2/product';

interface OpenFoodFactsResponse {
  status: number;
  product?: {
    product_name?: string;
    brands?: string;
    ingredients_text?: string;
    ingredients?: Array<{ text: string }>;
    nutriments?: Record<string, number>;
    image_front_url?: string;
    nova_group?: number;
  };
}

function parseNutrition(nutriments?: Record<string, number>): NutritionData {
  if (!nutriments) {
    return {
      calories: null, fat: null, saturatedFat: null,
      carbs: null, sugars: null, fiber: null,
      protein: null, sodium: null,
    };
  }

  return {
    calories: nutriments['energy-kcal_100g'] ?? null,
    fat: nutriments['fat_100g'] ?? null,
    saturatedFat: nutriments['saturated-fat_100g'] ?? null,
    carbs: nutriments['carbohydrates_100g'] ?? null,
    sugars: nutriments['sugars_100g'] ?? null,
    fiber: nutriments['fiber_100g'] ?? null,
    protein: nutriments['proteins_100g'] ?? null,
    sodium: nutriments['sodium_100g'] != null
      ? Math.round(nutriments['sodium_100g'] * 1000)
      : null,
  };
}

function parseIngredientsList(raw?: string, structured?: Array<{ text: string }>): string[] {
  if (structured && structured.length > 0) {
    return structured.map(i => i.text.toLowerCase().trim());
  }
  if (!raw) return [];
  return raw
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .split(/,|;/)
    .map(s => s.trim())
    .filter(Boolean);
}

export async function fetchProduct(barcode: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/${barcode}.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch product (HTTP ${res.status})`);
  }

  const data: OpenFoodFactsResponse = await res.json();
  if (data.status === 0 || !data.product) {
    throw new Error('Product not found in OpenFoodFacts database');
  }

  const p = data.product;

  return {
    code: barcode,
    name: p.product_name || 'Unknown Product',
    brand: p.brands || 'Unknown Brand',
    ingredients: p.ingredients_text || 'No ingredients listed',
    ingredientsList: parseIngredientsList(p.ingredients_text, p.ingredients),
    nutrition: parseNutrition(p.nutriments),
    imageUrl: p.image_front_url,
    novaGroup: p.nova_group,
  };
}
