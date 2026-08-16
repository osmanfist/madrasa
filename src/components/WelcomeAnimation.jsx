import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WelcomeAnimation.css';

function WelcomeAnimation({ onComplete }) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Complete after fade out
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`welcome-overlay ${isFading ? 'fade-out' : ''}`}>
      <div className="welcome-content">
        <div className="welcome-icon-wrapper">
          <img 
            src="/madrasa-icon.svg" 
            alt="Madrasa" 
            className="welcome-icon"
          />
        </div>
        <h1 className="welcome-title">{t('appName')}</h1>
        <div className="welcome-subtitle">{t('welcomeMessage')}</div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeAnimation;