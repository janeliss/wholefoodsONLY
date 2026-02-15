import './Header.css';
import { useI18n } from '../i18n';

export default function Header() {
  const { lang, toggleLang, t } = useI18n();

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
            <p className="header-tagline">{t('tagline')}</p>
          </div>
        </div>

        <button className="lang-toggle" onClick={toggleLang} aria-label="Toggle language">
          <span className={`lang-option ${lang === 'en' ? 'active' : ''}`}>EN</span>
          <span className="lang-divider">/</span>
          <span className={`lang-option ${lang === 'es' ? 'active' : ''}`}>ES</span>
        </button>
      </div>
    </header>
  );
}
