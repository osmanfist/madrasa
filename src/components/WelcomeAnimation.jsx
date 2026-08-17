import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WelcomeAnimation.css';

function WelcomeAnimation({ onComplete }) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade out after 6 seconds (shorter for better UX)
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 6000);

    // Complete after fade out
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 7500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`welcome-overlay ${isFading ? 'fade-out' : ''}`}>
      {/* Animated background particles */}
      <div className="particles-container">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>

      {/* Glowing orb background */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>

      <div className="welcome-content">
        <div className="welcome-icon-wrapper">
          <div className="icon-ring"></div>
          <img 
            src="/madrasa-icon.svg" 
            alt="Madrasa" 
            className="welcome-icon"
          />
          <div className="icon-sparkle"></div>
        </div>
        
        <h1 className="welcome-title">
          
          <span className="title-char" style={{ animationDelay: '0.2s' }}>نظام محاسبة مدرسة المثاني والمعارج الثانوية</span>
        </h1>
        
        <div className="welcome-subtitle-wrapper">
          <span className="welcome-subtitle">{t('welcomeMessage')}</span>
          <div className="subtitle-underline"></div>
        </div>
        
        <div className="loading-bar">
          <div className="loading-progress"></div>
          <div className="loading-glow"></div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeAnimation;