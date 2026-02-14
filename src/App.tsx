import { useState, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Scanner from './components/Scanner';
import Results from './components/Results';
import { fetchProduct } from './services/openFoodFacts';
import { analyzeIngredients, computeScore } from './utils/ingredientAnalyzer';
import { suggestAlternatives } from './utils/alternatives';
import type { AnalysisResult } from './types/product';

type AppState =
  | { view: 'scanner' }
  | { view: 'loading' }
  | { view: 'results'; result: AnalysisResult }
  | { view: 'error'; message: string };

export default function App() {
  const [state, setState] = useState<AppState>({ view: 'scanner' });

  const handleScan = useCallback(async (barcode: string) => {
    setState({ view: 'loading' });
    try {
      const product = await fetchProduct(barcode);
      const flags = analyzeIngredients(product.ingredientsList);
      const alternatives = suggestAlternatives(flags);
      const score = computeScore(flags, product.novaGroup);
      setState({
        view: 'results',
        result: { product, flags, alternatives, score },
      });
    } catch (err) {
      setState({
        view: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }, []);

  const handleReset = useCallback(() => {
    setState({ view: 'scanner' });
  }, []);

  return (
    <>
      <Header />
      <main className="app-main">
        {state.view === 'scanner' && (
          <Scanner onScan={handleScan} />
        )}

        {state.view === 'loading' && (
          <div className="loading">
            <div className="spinner" />
            <p>Looking up product...</p>
          </div>
        )}

        {state.view === 'results' && (
          <Results result={state.result} onScanAgain={handleReset} />
        )}

        {state.view === 'error' && (
          <div className="error-card">
            <p className="error-icon">!</p>
            <p className="error-message">{state.message}</p>
            <button className="btn" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </main>
    </>
  );
}
