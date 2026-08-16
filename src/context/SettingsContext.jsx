import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  schoolYear: '2025-2026',
  currency: 'SDG',
  tuitionFees: {
    'first-year': 800000,
    'second-year': 900000,
    'third-year': 1000000,
  }
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('madrasa-settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('madrasa-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const updateTuitionFee = (grade, amount) => {
    setSettings(prev => ({
      ...prev,
      tuitionFees: {
        ...prev.tuitionFees,
        [grade]: Number(amount) || 0
      }
    }));
  };

  const getTuitionFee = (grade) => {
    return settings.tuitionFees[grade] || 0;
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      updateTuitionFee,
      getTuitionFee 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}