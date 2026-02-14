import './Results.css';
import type { AnalysisResult } from '../types/product';

interface ResultsProps {
  result: AnalysisResult;
  onScanAgain: () => void;
}

const SCORE_CONFIG = {
  good: { label: 'Clean', emoji: '\u2705', className: 'score-good' },
  okay: { label: 'Caution', emoji: '\u26a0\ufe0f', className: 'score-okay' },
  poor: { label: 'Ultra-Processed', emoji: '\ud83d\udeab', className: 'score-poor' },
} as const;

function NutritionRow({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  if (value === null) return null;
  return (
    <div className="nutrition-row">
      <span>{label}</span>
      <span className="nutrition-value">{value}{unit}</span>
    </div>
  );
}

export default function Results({ result, onScanAgain }: ResultsProps) {
  const { product, flags, alternatives, score } = result;
  const scoreInfo = SCORE_CONFIG[score];

  return (
    <div className="results">
      {/* Score badge */}
      <div className={`score-badge ${scoreInfo.className}`}>
        <span className="score-emoji">{scoreInfo.emoji}</span>
        <span className="score-label">{scoreInfo.label}</span>
      </div>

      {/* Product info */}
      <div className="card">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        )}
        <h2 className="product-name">{product.name}</h2>
        <p className="product-brand">{product.brand}</p>
      </div>

      {/* Flagged ingredients */}
      {flags.length > 0 && (
        <div className="card">
          <h3 className="card-title">Flagged Ingredients</h3>
          <ul className="flag-list">
            {flags.map((flag, i) => (
              <li key={i} className="flag-item">
                <span className="flag-name">{flag.ingredient}</span>
                <span className="flag-reason">{flag.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ingredients */}
      <div className="card">
        <h3 className="card-title">Ingredients</h3>
        <p className="ingredients-text">{product.ingredients}</p>
      </div>

      {/* Nutrition */}
      <div className="card">
        <h3 className="card-title">Nutrition (per 100g)</h3>
        <div className="nutrition-grid">
          <NutritionRow label="Calories" value={product.nutrition.calories} unit=" kcal" />
          <NutritionRow label="Fat" value={product.nutrition.fat} unit="g" />
          <NutritionRow label="Sat. Fat" value={product.nutrition.saturatedFat} unit="g" />
          <NutritionRow label="Carbs" value={product.nutrition.carbs} unit="g" />
          <NutritionRow label="Sugars" value={product.nutrition.sugars} unit="g" />
          <NutritionRow label="Fiber" value={product.nutrition.fiber} unit="g" />
          <NutritionRow label="Protein" value={product.nutrition.protein} unit="g" />
          <NutritionRow label="Sodium" value={product.nutrition.sodium} unit="mg" />
        </div>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="card">
          <h3 className="card-title">Whole Food Alternatives</h3>
          <ul className="alt-list">
            {alternatives.map((alt, i) => (
              <li key={i} className="alt-item">
                <span className="alt-name">{alt.name}</span>
                <span className="alt-why">{alt.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-outline scan-again" onClick={onScanAgain}>
        Scan Another Product
      </button>
    </div>
  );
}
