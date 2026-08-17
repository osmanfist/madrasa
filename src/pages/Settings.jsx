import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useStudents } from '../context/StudentContext';
import { useLanguage } from '../context/LanguageContext';
import { loadSampleData } from '../utils/loadSampleData';
import { exportData, importData } from '../utils/dataBackup';
import './Settings.css';

function Settings() {
  const { settings, updateSettings } = useSettings();
  const { students } = useStudents();
  const { t } = useLanguage();
  
  const [tuitionFees, setTuitionFees] = useState(settings.tuitionFees);
  const [schoolYear, setSchoolYear] = useState(settings.schoolYear);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    setTuitionFees(settings.tuitionFees);
    setSchoolYear(settings.schoolYear);
  }, [settings]);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleSaveSettings = () => {
    updateSettings({
      tuitionFees,
      schoolYear,
    });
    showMessage(t('settingsSaved'), 'success');
  };

  const handleTuitionChange = (grade, value) => {
    setTuitionFees(prev => ({
      ...prev,
      [grade]: Number(value) || 0
    }));
  };

  const handleLoadSampleData = () => {
    if (window.confirm('⚠️ This will replace all existing data with sample data. Are you sure?')) {
      const result = loadSampleData();
      showMessage(`✅ Loaded ${result.students} sample students successfully!`, 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ This will delete ALL data from this browser. This cannot be undone. Are you sure?')) {
      if (window.confirm('Are you REALLY sure? All students and payments will be deleted.')) {
        localStorage.removeItem('madrasa-students');
        localStorage.removeItem('madrasa-settings');
        showMessage('🗑️ All data cleared successfully!', 'danger');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };

  const handleExportData = () => {
    exportData(students, settings);
    showMessage(t('dataExported'), 'success');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (window.confirm(t('confirmImport'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const success = importData(e.target.result);
          if (success) {
            showMessage(t('dataImported'), 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            showMessage(t('importError'), 'danger');
          }
        } catch (error) {
          showMessage(t('importError'), 'danger');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>{t('settings')}</h2>
      </div>

      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      {/* Tuition Fees Section */}
      <div className="settings-card">
        <h3 className="settings-title">💰 {t('tuitionFeesSettings')}</h3>
        <p className="settings-description">{t('tuitionFeesDescription')}</p>
        
        <div className="tuition-fees-form">
          <div className="fee-input-group">
            <label>{t('firstYear')}</label>
            <div className="fee-input-wrapper">
              <input
                type="number"
                value={tuitionFees['first-year'] || 0}
                onChange={(e) => handleTuitionChange('first-year', e.target.value)}
                min="0"
                step="0.01"
              />
              <span className="currency-label">{settings.currency}</span>
            </div>
          </div>

          <div className="fee-input-group">
            <label>{t('secondYear')}</label>
            <div className="fee-input-wrapper">
              <input
                type="number"
                value={tuitionFees['second-year'] || 0}
                onChange={(e) => handleTuitionChange('second-year', e.target.value)}
                min="0"
                step="0.01"
              />
              <span className="currency-label">{settings.currency}</span>
            </div>
          </div>

          <div className="fee-input-group">
            <label>{t('thirdYear')}</label>
            <div className="fee-input-wrapper">
              <input
                type="number"
                value={tuitionFees['third-year'] || 0}
                onChange={(e) => handleTuitionChange('third-year', e.target.value)}
                min="0"
                step="0.01"
              />
              <span className="currency-label">{settings.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* School Year Section */}
      <div className="settings-card">
        <h3 className="settings-title">📅 {t('schoolYearSettings')}</h3>
        <p className="settings-description">{t('schoolYearDescription')}</p>
        
        <div className="form-group">
          <label>{t('schoolYear')}</label>
          <input
            type="text"
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            placeholder="2024-2025"
            className="school-year-input"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="save-settings-section">
        <button className="btn-save-settings" onClick={handleSaveSettings}>
          💾 {t('saveSettings')}
        </button>
      </div>

      {/* Data Management Section */}
      <div className="settings-card">
        <h3 className="settings-title">📦 {t('dataManagement')}</h3>
        <p className="settings-description">{t('dataManagementDescription')}</p>
        
        <div className="data-management-buttons">
          <button className="btn-export" onClick={handleExportData}>
            📤 {t('exportData')}
          </button>
          
          <label className="btn-import">
            📥 {t('importData')}
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Testing Tools Section */}
      <div className="settings-card testing-tools">
        <h3 className="settings-title">🧪 {t('testingTools')}</h3>
        <p className="settings-description">{t('testingToolsDescription')}</p>
        
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
      </div>

      {/* System Info */}
      <div className="settings-card system-info">
        <h3 className="settings-title">ℹ️ {t('systemInfo')}</h3>
        <div className="info-list">
          <div className="info-row">
            <span>{t('totalStudents')}:</span>
            <strong>{students.length}</strong>
          </div>
          <div className="info-row">
            <span>{t('totalPayments')}:</span>
            <strong>
              {students.reduce((sum, s) => sum + s.payments.length, 0)}
            </strong>
          </div>
          <div className="info-row">
            <span>{t('version')}:</span>
            <strong>1.0.0</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;