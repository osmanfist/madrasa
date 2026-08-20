import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Layout.css';

function Layout({ children }) {
  const { language, toggleLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('dashboard'), icon: '📊' },
    { path: '/students', label: t('students'), icon: '👨‍🎓' },
    { path: '/payments', label: t('payments'), icon: '💰' },
    { path: '/reports', label: t('reports'), icon: '📈' },
    { path: '/settings', label: t('settings'), icon: '⚙️' },
  ];

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <div className="app-title-container">
            <img 
              src="/madrasa-icon.svg" 
              alt="Madrasa Icon" 
              className="app-icon"
              onError={(e) => {
                // Fallback if SVG fails to load
                e.target.style.display = 'none';
              }}
            />
            <h1 className="app-title">{t('appName')}</h1>
          </div>
          <button 
            className="language-toggle"
            onClick={toggleLanguage}
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <div className="main-container">
        <nav className={`sidebar ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <main className="content">
          {children}
        </main>
      </div>
      {/* Footer */}
<footer className="footer">
  <div className="footer-content">
    <div className="footer-section">
      <h4 className="footer-title">{t('contactUs')}</h4>
      <div className="contact-item">
        <span className="contact-label">{t('leadProgrammer')}:</span>
        <a 
          href="https://wa.me/249126726239" 
          target="_blank" 
          rel="noopener noreferrer"
          className="contact-link"
        >
          <span className="contact-icon">💻</span>
          <span className="contact-number">+249 126 7262 39</span>
        </a>
      </div>
      <div className="contact-item">
        <span className="contact-label">{t('ceo')}:</span>
        <a 
          href="https://wa.me/249111233014" 
          target="_blank" 
          rel="noopener noreferrer"
          className="contact-link"
        >
          <span className="contact-icon">👨‍💼</span>
          <span className="contact-number">+249 111 23 3014</span>
        </a>
      </div>
    </div>
    <div className="footer-section">
      <p className="footer-copyright">
        © {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved')}
      </p>
      <p className="footer-version">{t('version')} 1.0.0</p>
    </div>
  </div>
</footer>
    </div>
  );
}

export default Layout;