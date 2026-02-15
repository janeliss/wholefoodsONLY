import type { Product, NutritionData } from '../types/product';

const API_BASE = 'https://world.openfoodfacts.org/api/v2/product';
const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

/* ========== Error types ========== */

export type LookupErrorKind =
  | 'not_found'
  | 'rate_limited'
  | 'network'
  | 'server'
  | 'invalid_barcode'
  | 'unknown';

export class LookupError extends Error {
  kind: LookupErrorKind;
  statusCode?: number;

  constructor(kind: LookupErrorKind, message: string, statusCode?: number) {
    super(message);
    this.name = 'LookupError';
    this.kind = kind;
    this.statusCode = statusCode;
  }
}

/* ========== Barcode normalization ========== */

/**
 * Normalizes barcode input:
 * - Strips whitespace only (preserves leading zeros — they matter for EAN/UPC)
 * - Converts 12-digit UPC-A to 13-digit EAN-13 by prepending "0"
 * - Returns the cleaned barcode for API lookup
 */
export function normalizeBarcode(raw: string): string {
  // Only strip whitespace — never strip leading zeros, they're part of the barcode
  const code = raw.replace(/\s+/g, '');

  if (!/^\d+$/.test(code)) return code; // non-numeric, let validation catch it

  // UPC-A (12 digits) → EAN-13 (prepend 0) for OpenFoodFacts compatibility
  if (code.length === 12) {
    return '0' + code;
  }

  return code;
}

export function validateBarcode(code: string): boolean {
  return /^\d{8,14}$/.test(code);
}

/* ========== Logging ========== */

function log(level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>) {
  const prefix = `[NO-SLOP ${level.toUpperCase()}]`;
  const payload = data ? ` ${JSON.stringify(data)}` : '';
  if (level === 'error') {
    console.error(`${prefix} ${message}${payload}`);
  } else if (level === 'warn') {
    console.warn(`${prefix} ${message}${payload}`);
  } else {
    console.info(`${prefix} ${message}${payload}`);
  }
}

/* ========== Parsing helpers ========== */

interface OpenFoodFactsResponse {
  status: number;
  status_verbose?: string;
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

function parseProduct(barcode: string, data: OpenFoodFactsResponse): Product {
  const p = data.product!;
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

/* ========== Retry helper ========== */

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ========== Core fetch with retry ========== */

async function fetchWithRetry(url: string, attempt = 1): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    if (err instanceof LookupError) throw err;

    if (attempt <= MAX_RETRIES) {
      log('warn', `Network error, retrying`, { attempt, error: (err as Error).message });
      await delay(RETRY_DELAY_MS * attempt);
      return fetchWithRetry(url, attempt + 1);
    }

    throw new LookupError(
      'network',
      'Could not connect to the food database. Check your internet connection and try again.',
    );
  }

  if (res.status === 429) {
    if (attempt <= MAX_RETRIES) {
      const retryAfter = res.headers.get('Retry-After');
      const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_MS * attempt;
      log('warn', `Rate limited (429), retrying in ${waitMs}ms`, { attempt, url });
      await delay(waitMs);
      return fetchWithRetry(url, attempt + 1);
    }
    throw new LookupError('rate_limited', 'OpenFoodFacts is rate limiting requests. Please wait a moment and try again.', 429);
  }

  if (res.status >= 500) {
    if (attempt <= MAX_RETRIES) {
      log('warn', `Server error (${res.status}), retrying`, { attempt, url });
      await delay(RETRY_DELAY_MS * attempt);
      return fetchWithRetry(url, attempt + 1);
    }
    throw new LookupError('server', `OpenFoodFacts server error (HTTP ${res.status}). Try again shortly.`, res.status);
  }

  return res;
}

/* ========== Public API ========== */

/** Try a single barcode against the API, return Product or null */
async function tryLookup(code: string): Promise<Product | null> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/${code}.json`);

    // OpenFoodFacts returns 200 for everything — non-200 means something unexpected
    if (!res.ok) {
      log('warn', `Non-200 response for ${code}`, { status: res.status });
      return null;
    }

    const data: OpenFoodFactsResponse = await res.json();

    if (data.status === 0 || !data.product) {
      return null;
    }

    return parseProduct(code, data);
  } catch (err) {
    // Re-throw rate limit and network errors — those aren't barcode-specific
    if (err instanceof LookupError && (err.kind === 'rate_limited' || err.kind === 'network' || err.kind === 'server')) {
      throw err;
    }
    return null;
  }
}

export async function fetchProduct(rawBarcode: string): Promise<Product> {
  const normalized = normalizeBarcode(rawBarcode);
  const cleaned = rawBarcode.replace(/\s+/g, '');
  log('info', 'Looking up product', { rawBarcode, normalized });

  if (!validateBarcode(normalized)) {
    throw new LookupError(
      'invalid_barcode',
      `"${rawBarcode}" doesn't look like a valid barcode. Barcodes are typically 8-14 digits.`,
    );
  }

  // Build list of barcode variants to try (deduplicated, in priority order)
  const candidates = [normalized];
  if (cleaned !== normalized) candidates.push(cleaned);
  // If it's a 13-digit code starting with 0, also try without the leading 0 (EAN-13 → UPC-A)
  if (normalized.length === 13 && normalized.startsWith('0')) {
    candidates.push(normalized.slice(1));
  }

  for (const code of candidates) {
    log('info', `Trying barcode: ${code}`);
    const product = await tryLookup(code);
    if (product) {
      log('info', 'Product found', { code, name: product.name });
      return product;
    }
  }

  log('warn', 'Product not found after all attempts', { candidates });
  throw new LookupError(
    'not_found',
    `No product found for barcode ${rawBarcode}. This item may not be in the OpenFoodFacts database yet.`,
  );
}

/* ========== Search by name (fallback) ========== */

export interface SearchResult {
  code: string;
  name: string;
  brand: string;
  imageUrl?: string;
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  log('info', 'Searching products by name', { query });

  const params = new URLSearchParams({
    search_terms: query.trim(),
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '6',
    fields: 'code,product_name,brands,image_front_small_url',
  });

  const res = await fetchWithRetry(`${SEARCH_URL}?${params}`);
  if (!res.ok) return [];

  const data = await res.json();
  const products: SearchResult[] = (data.products || [])
    .filter((p: Record<string, string>) => p.product_name && p.code)
    .map((p: Record<string, string>) => ({
      code: p.code,
      name: p.product_name,
      brand: p.brands || 'Unknown Brand',
      imageUrl: p.image_front_small_url,
    }));

  log('info', `Search returned ${products.length} results`, { query });
  return products;
}
