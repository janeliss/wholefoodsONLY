import { useState, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import ScannerCard from './components/Scanner';
import LoadingSkeleton from './components/LoadingSkeleton';
import ResultView from './components/Results';
import Toast from './components/Toast';
import { fetchProduct, searchProducts, LookupError } from './services/openFoodFacts';
import type { LookupErrorKind, SearchResult } from './services/openFoodFacts';
import { analyzeIngredients, analyzeSodium, computeScore } from './utils/ingredientAnalyzer';
import { suggestAlternatives } from './utils/alternatives';
import { detectSneakyIngredients } from './data/sneakyIngredients';
import type { AnalysisResult } from './types/product';
import { useI18n } from './i18n';
import type { Lang } from './i18n';

/* ========== Error config ========== */

interface ErrorConfig {
  title: Record<Lang, string>;
  icon: 'not-found' | 'network' | 'warning';
  showSearch: boolean;
}

const ERROR_CONFIG: Record<LookupErrorKind, ErrorConfig> = {
  not_found:       { title: { en: 'Product Not Found',    es: 'Producto No Encontrado' },     icon: 'not-found', showSearch: true },
  invalid_barcode: { title: { en: 'Invalid Barcode',      es: 'Codigo de Barras Invalido' },   icon: 'warning',   showSearch: false },
  rate_limited:    { title: { en: 'Too Many Requests',    es: 'Demasiadas Solicitudes' },      icon: 'warning',   showSearch: false },
  network:         { title: { en: 'Connection Error',     es: 'Error de Conexion' },           icon: 'network',   showSearch: false },
  server:          { title: { en: 'Server Error',         es: 'Error del Servidor' },          icon: 'warning',   showSearch: false },
  unknown:         { title: { en: 'Something Went Wrong', es: 'Algo Salio Mal' },              icon: 'warning',   showSearch: true },
};

const ERROR_ICONS = {
  'not-found': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  network: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/>
      <path d="M5 12.55a10.94 10.94 0 015.17-2.39"/>
      <path d="M10.71 5.05A16 16 0 0122.56 9"/>
      <path d="M1.42 9a15.91 15.91 0 014.7-2.88"/>
      <path d="M8.53 16.11a6 6 0 016.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  warning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

/* ========== App state ========== */

type AppState =
  | { view: 'scanner' }
  | { view: 'loading'; barcode: string }
  | { view: 'results'; result: AnalysisResult }
  | { view: 'error'; message: string; errorKind: LookupErrorKind; barcode: string };

export default function App() {
  const [state, setState] = useState<AppState>({ view: 'scanner' });
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const { lang, t } = useI18n();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const runPipeline = useCallback(async (barcode: string) => {
    setState({ view: 'loading', barcode });
    try {
      const product = await fetchProduct(barcode);
      const flags = analyzeIngredients(product.ingredientsList);
      const alternatives = suggestAlternatives(flags);
      const sneakyIngredients = detectSneakyIngredients(product.ingredientsList);
      const sodiumAnalysis = analyzeSodium(product.nutrition.sodium);
      const { score, breakdown } = computeScore(
        flags,
        product.novaGroup,
        sneakyIngredients.length,
        sodiumAnalysis,
      );
      setState({
        view: 'results',
        result: {
          product,
          flags,
          alternatives,
          score,
          scoreBreakdown: breakdown,
          sneakyIngredients,
          sodiumAnalysis,
        },
      });
    } catch (err) {
      const kind: LookupErrorKind = err instanceof LookupError ? err.kind : 'unknown';
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setState({ view: 'error', message, errorKind: kind, barcode });
    }
  }, []);

  const handleScan = useCallback(async (barcode: string) => {
    showToast(`${t('barcodeDetected')}: ${barcode}`);
    runPipeline(barcode);
  }, [showToast, runPipeline, t]);

  const handleReset = useCallback(() => {
    setState({ view: 'scanner' });
    setSearchResults([]);
    setSearchQuery('');
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchProducts(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  const handlePickSearchResult = useCallback((code: string) => {
    setSearchResults([]);
    setSearchQuery('');
    showToast(`${t('lookingUp')}: ${code}`);
    runPipeline(code);
  }, [showToast, runPipeline, t]);

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="app-container">
          {state.view === 'scanner' && (
            <ScannerCard onScan={handleScan} />
          )}

          {state.view === 'loading' && (
            <LoadingSkeleton barcode={state.barcode} />
          )}

          {state.view === 'results' && (
            <ResultView result={state.result} onScanAgain={handleReset} />
          )}

          {state.view === 'error' && (() => {
            const cfg = ERROR_CONFIG[state.errorKind];
            return (
              <div className="error-card">
                <div className={`error-icon-wrap error-icon-${cfg.icon}`}>
                  {ERROR_ICONS[cfg.icon]}
                </div>
                <h3 className="error-title">{cfg.title[lang]}</h3>
                <p className="error-message">{state.message}</p>

                {cfg.showSearch && (
                  <div className="error-search">
                    <p className="error-search-label">{t('searchFallbackLabel')}</p>
                    <form className="error-search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                      <input
                        type="text"
                        className="manual-input"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button type="submit" className="btn" disabled={!searchQuery.trim() || searching}>
                        {searching ? t('searching') : t('search')}
                      </button>
                    </form>

                    {searchResults.length > 0 && (
                      <ul className="search-results">
                        {searchResults.map((r) => (
                          <li key={r.code}>
                            <button className="search-result-btn" onClick={() => handlePickSearchResult(r.code)}>
                              {r.imageUrl && <img src={r.imageUrl} alt="" className="search-result-img" />}
                              <div className="search-result-info">
                                <span className="search-result-name">{r.name}</span>
                                <span className="search-result-brand">{r.brand}</span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {searchResults.length === 0 && searchQuery && !searching && (
                      <p className="search-empty">{t('noResults')}</p>
                    )}
                  </div>
                )}

                <button className="btn btn-outline" onClick={handleReset}>
                  {t('scanAnotherBtn')}
                </button>
              </div>
            );
          })()}
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
