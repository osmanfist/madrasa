import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { StudentProvider } from './context/StudentContext';
import Layout from './components/Layout/Layout';
import WelcomeAnimation from './components/WelcomeAnimation';
import PageTransition from './components/PageTransition';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}
      <BrowserRouter>
        <Layout>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </PageTransition>
        </Layout>
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <StudentProvider>
          <AppContent />
        </StudentProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;