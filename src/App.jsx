import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { StudentProvider } from './context/StudentContext';
import { migrateGradeLevels } from './utils/migrateData';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function App() {
  useEffect(() => {
    // Run migration for existing data
    const result = migrateGradeLevels();
    if (result.studentsMigrated || result.settingsMigrated) {
      console.log('Data migrated successfully:', result);
      // Reload the page to refresh all contexts with migrated data
      window.location.reload();
    }
  }, []);

  return (
    <LanguageProvider>
      <SettingsProvider>
        <StudentProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </StudentProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;