import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { loadSampleData } from '../utils/loadSampleData';
import './Settings.css';

function Settings() {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleLoadSampleData = () => {
    if (confirm('⚠️ This will replace all existing data with sample data. Are you sure?')) {
      const result = loadSampleData();
      setMessage(`✅ Loaded ${result.students} sample students successfully!`);
      setMessageType('success');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleClearAllData = () => {
    if (confirm('⚠️ This will delete ALL data from this browser. This cannot be undone. Are you sure?')) {
      if (confirm('Are you REALLY sure? All students and payments will be deleted.')) {
        localStorage.removeItem('madrasa-students');
        localStorage.removeItem('madrasa-settings');
        setMessage('🗑️ All data cleared successfully!');
        setMessageType('danger');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>{t('settings')}</h2>
      </div>

      {/* Testing Tools Section */}
      <div className="testing-tools">
        <h3>🧪 {t('testingTools')}</h3>
        <p>{t('testingToolsDescription')}</p>
        
        <div className="testing-buttons">
          <button 
            className="btn-sample"
            onClick={handleLoadSampleData}
          >
            📊 {t('loadSampleData')}
          </button>
          
          <button 
            className="btn-danger"
            onClick={handleClearAllData}
          >
            🗑️ {t('clearAllData')}
          </button>
        </div>
        
        {message && (
          <div className={`message message-${messageType}`}>
            {message}
          </div>
        )}
      </div>

      {/* Coming Soon Section */}
      <div className="coming-soon">
        <h3>🔧 {t('settingsComingSoon')}</h3>
        <p>{t('settingsComingSoonDescription')}</p>
        <ul>
          <li>💰 {t('tuitionFeesSettings')}</li>
          <li>📅 {t('schoolYearSettings')}</li>
          <li>💱 {t('currencySettings')}</li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;