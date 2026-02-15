import { useState } from 'react';
import './Results.css';
import type { AnalysisResult, IngredientFlag, SodiumAnalysis, ScoreBreakdownItem } from '../types/product';
import type { SneakyMatch } from '../data/sneakyIngredients';

interface ResultViewProps {
  result: AnalysisResult;
  onScanAgain: () => void;
}

const SkullIcon = () => (
  <svg className="skull-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 3.07 1.38 5.81 3.55 7.65L5 22h3.5l.5-2h6l.5 2H19l-.55-2.35C20.62 17.81 22 15.07 22 12c0-5.52-4.48-10-10-10zM8.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
  </svg>
);

const SCORE_CONFIG = {
  good: { label: 'Whole', icon: '\u2713' as string | null, badgeClass: 'badge badge-whole', percent: 95 },
  okay: { label: 'Questionable', icon: '!' as string | null, badgeClass: 'badge badge-questionable', percent: 55 },
  poor: { label: 'Slop', icon: null, badgeClass: 'badge badge-slop', percent: 20 },
};

const CONCERN_LABELS: Record<string, { text: string; className: string }> = {
  low: { text: 'Low concern', className: 'concern-low' },
  med: { text: 'Moderate concern', className: 'concern-med' },
  high: { text: 'High concern', className: 'concern-high' },
};

/* ========== Score Ring ========== */

function ScoreRing({ score }: { score: 'good' | 'okay' | 'poor' }) {
  const cfg = SCORE_CONFIG[score];
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (cfg.percent / 100) * circumference;

  return (
    <div className="score-ring-wrap">
      <svg className="score-ring-svg" viewBox="0 0 80 80">
        <circle className="score-ring-bg" cx="40" cy="40" r={r} />
        <circle
          className={`score-ring-fill ${score}`}
          cx="40" cy="40" r={r}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={`score-ring-label ${score}`}>
        {cfg.icon ? <span>{cfg.icon}</span> : <SkullIcon />}
      </div>
    </div>
  );
}

/* ========== Sodium Section ========== */

function SodiumSection({ analysis }: { analysis: SodiumAnalysis | null }) {
  if (!analysis) {
    return <p className="sodium-unavailable">Sodium data unavailable for this item.</p>;
  }

  const { milligrams, percentDV, level } = analysis;
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(percentDV, 100);
  const offset = circumference - (pct / 100) * circumference;

  const colors: Record<string, string> = {
    low: 'var(--green)',
    moderate: 'var(--yellow)',
    high: 'var(--red)',
  };

  const descriptions: Record<string, string> = {
    low: 'Low sodium — 140 mg or less per 100g. Generally heart-healthy.',
    moderate: 'Moderate sodium — between 140–600 mg per 100g. Watch total daily intake.',
    high: 'High sodium — over 600 mg per 100g. May contribute to elevated blood pressure.',
  };

  return (
    <>
      <div className="sodium-display">
        <div className="sodium-ring-wrap">
          <svg className="sodium-ring-svg" viewBox="0 0 56 56">
            <circle className="sodium-ring-bg" cx="28" cy="28" r={r} />
            <circle
              className="sodium-ring-fill"
              cx="28" cy="28" r={r}
              stroke={colors[level]}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
        </div>
        <div className="sodium-info">
          <div className="sodium-mg">{milligrams} mg <span className="sodium-per">per 100g</span></div>
          <div className="sodium-dv">{percentDV}% of Daily Value</div>
          <div className={`sodium-label ${level}`}>{level} sodium</div>
        </div>
      </div>
      <p className="sodium-note">{descriptions[level]} FDA recommended daily limit: 2,300 mg.</p>
    </>
  );
}

/* ========== Expandable Panel ========== */

function ExpandablePanel({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="expandable-panel">
      <button className="expandable-trigger" onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <svg className={`expandable-chevron ${open ? 'expanded' : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      <div className={`expandable-content ${open ? 'open' : ''}`}>
        <div className="expandable-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ========== Ingredient Intel ========== */

function IngredientIntelPanel({ flag }: { flag: IngredientFlag }) {
  const { intel } = flag;

  if (!intel) {
    return (
      <div className="flag-intel">
        <p className="intel-unknown">
          We're still learning about this ingredient. As a general rule, fewer processed additives means a cleaner product.
        </p>
      </div>
    );
  }

  const concern = CONCERN_LABELS[intel.concernLevel];

  return (
    <div className="flag-intel">
      <div className="intel-meta">
        <span className={`concern-badge ${concern.className}`}>{concern.text}</span>
        <span className="intel-category">{intel.category}</span>
      </div>

      <p className="intel-definition">{intel.definition}</p>

      <div className="intel-section">
        <div className="intel-section-label">Why it's used</div>
        <ul className="intel-bullets">
          {intel.whyUsed.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      <div className="intel-section">
        <div className="intel-section-label">Why it may be concerning</div>
        <ul className="intel-bullets">
          {intel.whyConcerned.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      <div className="intel-section">
        <div className="intel-section-label">Better options</div>
        <ul className="intel-bullets">
          {intel.betterAlternatives.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      {intel.citations.length > 0 && (
        <div className="intel-citations">
          {intel.citations.map((cite, i) => (
            <a key={i} className="intel-citation-link" href={cite.url} target="_blank" rel="noopener noreferrer">
              {cite.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========== Sneaky Ingredients Section ========== */

function SneakySection({ sneaky }: { sneaky: SneakyMatch[] }) {
  return (
    <ul className="sneaky-list">
      {sneaky.map((item, i) => (
        <li key={i} className="sneaky-item">
          <div className="sneaky-header">
            <span className="badge badge-sneaky">Sneaky</span>
            <span className="sneaky-term">{item.term}</span>
          </div>
          <ExpandablePanel label="Why it's sneaky">
            <div className="sneaky-detail">
              <p className="sneaky-explanation">{item.explanation}</p>
              <p className="sneaky-alt"><strong>Look for instead:</strong> {item.whatToLookFor}</p>
              {item.citations.length > 0 && (
                <div className="intel-citations">
                  {item.citations.map((cite, ci) => (
                    <a key={ci} className="intel-citation-link" href={cite.url} target="_blank" rel="noopener noreferrer">
                      {cite.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </ExpandablePanel>
        </li>
      ))}
    </ul>
  );
}

/* ========== Score Breakdown ========== */

function ScoreBreakdownSection({ breakdown }: { breakdown: ScoreBreakdownItem[] }) {
  return (
    <ul className="breakdown-list">
      {breakdown.map((item, i) => (
        <li key={i} className="breakdown-item">
          <span className={`breakdown-dot ${item.impact}`} />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

/* ========== Nutrition Row ========== */

function NutritionRow({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  if (value === null) return null;
  return (
    <div className="nutrition-row">
      <span>{label}</span>
      <span className="nutrition-value">{value}{unit}</span>
    </div>
  );
}

/* ========== Main Results View ========== */

export default function ResultView({ result, onScanAgain }: ResultViewProps) {
  const { product, flags, alternatives, score, scoreBreakdown, sneakyIngredients, sodiumAnalysis } = result;
  const scoreCfg = SCORE_CONFIG[score];

  return (
    <div className="results">
      {/* Score Header with Ring */}
      <div className="score-header stagger-1">
        <ScoreRing score={score} />
        <div className={`score-verdict ${score}`}>{scoreCfg.label}</div>
        <div className="score-badge-inline">
          <span className={scoreCfg.badgeClass}>{scoreCfg.label}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="result-card stagger-2">
        <div className="product-card">
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} className="product-image" />
          )}
          <div className="product-info">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-brand">{product.brand}</p>
          </div>
        </div>
      </div>

      {/* Why This Score */}
      {scoreBreakdown.length > 0 && (
        <div className="result-card stagger-3">
          <h3 className="result-card-title">Why this score</h3>
          <ScoreBreakdownSection breakdown={scoreBreakdown} />
        </div>
      )}

      {/* Flagged Ingredients with Intel */}
      {flags.length > 0 && (
        <div className="result-card stagger-4">
          <h3 className="result-card-title">Flagged Ingredients</h3>
          <ul className="flag-list">
            {flags.map((flag, i) => (
              <li key={i} className="flag-item">
                <div className="flag-header">
                  <span className="badge badge-slop">Flag</span>
                  <span className="flag-name">{flag.ingredient}</span>
                </div>
                <p className="flag-reason">{flag.reason}</p>
                <ExpandablePanel label="Learn more">
                  <IngredientIntelPanel flag={flag} />
                </ExpandablePanel>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sneaky Ingredients */}
      {sneakyIngredients.length > 0 && (
        <div className="result-card stagger-5">
          <h3 className="result-card-title">Sneaky Ingredients</h3>
          <SneakySection sneaky={sneakyIngredients} />
        </div>
      )}

      {/* Sodium Analysis */}
      <div className="result-card stagger-6">
        <h3 className="result-card-title">Sodium Analysis</h3>
        <SodiumSection analysis={sodiumAnalysis} />
      </div>

      {/* Full Ingredients */}
      <div className="result-card stagger-7">
        <h3 className="result-card-title">Ingredients</h3>
        <p className="ingredients-text">{product.ingredients}</p>
      </div>

      {/* Nutrition */}
      <div className="result-card stagger-7">
        <h3 className="result-card-title">Nutrition (per 100g)</h3>
        <div className="nutrition-grid">
          <NutritionRow label="Calories" value={product.nutrition.calories} unit=" kcal" />
          <NutritionRow label="Fat" value={product.nutrition.fat} unit="g" />
          <NutritionRow label="Sat. Fat" value={product.nutrition.saturatedFat} unit="g" />
          <NutritionRow label="Carbs" value={product.nutrition.carbs} unit="g" />
          <NutritionRow label="Sugars" value={product.nutrition.sugars} unit="g" />
          <NutritionRow label="Fiber" value={product.nutrition.fiber} unit="g" />
          <NutritionRow label="Protein" value={product.nutrition.protein} unit="g" />
          <NutritionRow label="Sodium" value={product.nutrition.sodium} unit=" mg" />
        </div>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="result-card stagger-8">
          <h3 className="result-card-title">Whole Food Alternatives</h3>
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

      <button className="btn btn-outline scan-again stagger-8" onClick={onScanAgain}>
        Scan Another Product
      </button>
    </div>
  );
}
