import { useState, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import ScannerCard from './components/Scanner';
import LoadingSkeleton from './components/LoadingSkeleton';
import ResultView from './components/Results';
import Toast from './components/Toast';
import { fetchProduct } from './services/openFoodFacts';
import { analyzeIngredients, analyzeSodium, computeScore } from './utils/ingredientAnalyzer';
import { suggestAlternatives } from './utils/alternatives';
import { detectSneakyIngredients } from './data/sneakyIngredients';
import type { AnalysisResult } from './types/product';

type AppState =
  | { view: 'scanner' }
  | { view: 'loading'; barcode: string }
  | { view: 'results'; result: AnalysisResult }
  | { view: 'error'; message: string };

export default function App() {
  const [state, setState] = useState<AppState>({ view: 'scanner' });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleScan = useCallback(async (barcode: string) => {
    showToast(`Barcode detected: ${barcode}`);
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
      setState({
        view: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }, [showToast]);

  const handleReset = useCallback(() => {
    setState({ view: 'scanner' });
  }, []);

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

          {state.view === 'error' && (
            <div className="error-card">
              <div className="error-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <h3 className="error-title">Lookup Failed</h3>
              <p className="error-message">{state.message}</p>
              <button className="btn" onClick={handleReset}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
