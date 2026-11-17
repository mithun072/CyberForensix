import { useState, useEffect } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LiveAlerts from './pages/LiveAlerts';
import MLModelMonitor from './pages/MLModelMonitor';
import AnomalyDetection from './pages/AnomalyDetection';
import NetworkForensics from './pages/NetworkForensics';
import EvidenceManager from './pages/EvidenceManager';
import TimelineAnalysis from './pages/TimelineAnalysis';
import LogAnalyzer from './pages/LogAnalyzer';
import ThreatIntel from './pages/ThreatIntel';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AttackSimulator from './pages/AttackSimulator';
import Playbooks from './pages/Playbooks';
import './index.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply theme class to <html> so CSS variables switch
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard searchQuery={searchQuery} />;
      case 'alerts':       return <LiveAlerts searchQuery={searchQuery} />;
      case 'ml-model':     return <MLModelMonitor />;
      case 'anomaly':      return <AnomalyDetection />;
      case 'network':      return <NetworkForensics />;
      case 'evidence':     return <EvidenceManager />;
      case 'timeline':     return <TimelineAnalysis />;
      case 'logs':         return <LogAnalyzer searchQuery={searchQuery} />;
      case 'threat-intel': return <ThreatIntel />;
      case 'reports':      return <Reports />;
      case 'settings':     return <Settings isDark={isDark} onThemeToggle={() => setIsDark(d => !d)} />;
      case 'simulator':    return <AttackSimulator />;
      case 'playbooks':    return <Playbooks />;
      default:             return <Dashboard searchQuery={searchQuery} />;
    }
  };

  return (
    <SimulationProvider>
      <div className="app-layout">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="main-area">
          <Header
            activePage={activePage}
            isDark={isDark}
            onThemeToggle={() => setIsDark(d => !d)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <main className="main-content">
            {renderContent()}
          </main>
        </div>
      </div>
    </SimulationProvider>
  );
}
