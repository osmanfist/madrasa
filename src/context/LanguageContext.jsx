import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/ar';
import { translations as enTranslations } from '../translations/en';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Try to get saved language from localStorage
    const saved = localStorage.getItem('madrasa-language');
    return saved || 'ar'; // Default to Arabic
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem('madrasa-language', language);
    
    // Set document direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add a class to body for additional styling if needed
    document.body.className = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key) => {
    const currentTranslations = language === 'ar' ? translations : enTranslations;
    return currentTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}