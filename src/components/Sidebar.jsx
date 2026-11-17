import { useState } from 'react';
import { 
  LayoutDashboard, Brain, ShieldAlert, Network, FileSearch, 
  Clock, ScrollText, Globe, FileBarChart, Settings, 
  Fingerprint, Activity, Zap, Lock 
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const navItems = [
  { section: 'Overview' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'simulator', label: 'Attack Simulator', icon: Zap, badge: 'LAB' },
  { id: 'alerts', label: 'Live Alerts', icon: ShieldAlert, badge: 4 },
  { id: 'playbooks', label: 'Automated Response', icon: Lock },
  { section: 'Analysis' },
  { id: 'ml-model', label: 'ML Model Monitor', icon: Brain },
  { id: 'anomaly', label: 'Anomaly Detection', icon: Activity },
  { id: 'network', label: 'Network Forensics', icon: Network },
  { section: 'Investigation' },
  { id: 'evidence', label: 'Evidence Manager', icon: Fingerprint },
  { id: 'timeline', label: 'Timeline Analysis', icon: Clock },
  { id: 'logs', label: 'Log Analyzer', icon: ScrollText },
  { section: 'Intelligence' },
  { id: 'threat-intel', label: 'Threat Intelligence', icon: Globe },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { section: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { isRunning, simAlerts, playbookLog, scenarioId, stats } = useSimulation();

  return (
    <aside className="sidebar" id="main-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FileSearch size={20} color="white" />
        </div>
        <div>
          <h1>CyberForensix</h1>
          <span>ML Forensic Engine</span>
        </div>
      </div>

      <nav className="sidebar-nav" id="sidebar-navigation">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div key={`section-${idx}`} className="sidebar-section-label">
                {item.section}
              </div>
            );
          }
          const Icon = item.icon;

          // Compute dynamic badges
          let badgeText = item.badge;
          let badgeClass = 'sidebar-badge';

          if (isRunning) {
            if (item.id === 'simulator') {
              badgeText = 'LIVE';
              badgeClass = 'sidebar-badge pulse';
            } else if (item.id === 'alerts') {
              badgeText = 4 + simAlerts.length;
              badgeClass = 'sidebar-badge pulse';
            } else if (item.id === 'playbooks' && playbookLog.length > 0) {
              badgeText = playbookLog.length;
            }
          }

          return (
            <div
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={18} className="sidebar-link-icon" />
              {item.label}
              {badgeText && (
                <span 
                  className={badgeClass}
                  style={isRunning && (item.id === 'simulator' || item.id === 'alerts') ? { background: 'var(--critical)', color: '#fff' } : {}}
                >
                  {badgeText}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span 
            className="status-dot" 
            style={isRunning ? { background: 'var(--critical)', boxShadow: '0 0 8px var(--critical)' } : {}}
          />
          <span>{isRunning ? `SIM: ${scenarioId.toUpperCase()} (T+${stats.elapsed}s)` : 'ML Engine Active — v3.7.1'}</span>
        </div>
      </div>
    </aside>
  );
}
