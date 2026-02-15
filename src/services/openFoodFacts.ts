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
 * - Strips whitespace and leading zeros beyond valid length
 * - Converts 12-digit UPC-A to 13-digit EAN-13 by prepending "0"
 * - Validates the result is numeric and a reasonable length (8–14 digits)
 */
export function normalizeBarcode(raw: string): string {
  const stripped = raw.replace(/\s+/g, '').replace(/^0+/, '') || '0';

  // Re-pad: UPC-A (12 digits) → EAN-13 (prepend 0)
  // EAN-8 is 8 digits, EAN-13 is 13, UPC-A is 12
  let code = stripped;

  if (/^\d+$/.test(code)) {
    if (code.length < 8) {
      code = code.padStart(8, '0'); // pad short codes to EAN-8
    } else if (code.length === 12) {
      code = '0' + code; // UPC-A → EAN-13
    } else if (code.length > 8 && code.length < 13) {
      code = code.padStart(13, '0'); // pad to EAN-13
    }
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
  try {
    const res = await fetch(url);

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
}

/* ========== Public API ========== */

export async function fetchProduct(rawBarcode: string): Promise<Product> {
  const barcode = normalizeBarcode(rawBarcode);
  log('info', 'Looking up product', { rawBarcode, normalizedBarcode: barcode });

  if (!validateBarcode(barcode)) {
    throw new LookupError(
      'invalid_barcode',
      `"${rawBarcode}" doesn't look like a valid barcode. Barcodes are typically 8-14 digits.`,
    );
  }

  const res = await fetchWithRetry(`${API_BASE}/${barcode}.json`);

  if (!res.ok) {
    log('error', 'Unexpected HTTP status', { status: res.status, barcode });
    throw new LookupError('server', `Unexpected response from food database (HTTP ${res.status}).`, res.status);
  }

  const data: OpenFoodFactsResponse = await res.json();

  if (data.status === 0 || !data.product) {
    // If we padded a UPC-A to EAN-13, try the original 12-digit code too
    if (barcode !== rawBarcode.trim() && rawBarcode.trim().length >= 8) {
      const altCode = rawBarcode.trim();
      log('info', 'Primary lookup missed, trying original code', { altCode });

      try {
        const altRes = await fetchWithRetry(`${API_BASE}/${altCode}.json`);
        if (altRes.ok) {
          const altData: OpenFoodFactsResponse = await altRes.json();
          if (altData.status !== 0 && altData.product) {
            log('info', 'Found product with original barcode', { altCode });
            return parseProduct(altCode, altData);
          }
        }
      } catch {
        // Fall through to not_found
      }
    }

    log('warn', 'Product not found', { barcode, status_verbose: data.status_verbose });
    throw new LookupError(
      'not_found',
      `No product found for barcode ${rawBarcode}. This item may not be in the OpenFoodFacts database yet.`,
    );
  }

  log('info', 'Product found', { barcode, name: data.product.product_name });
  return parseProduct(barcode, data);
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
