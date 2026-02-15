import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <div className="header-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="header-title">NO-SLOP</h1>
            <p className="header-tagline">Whole foods only. No slop.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
