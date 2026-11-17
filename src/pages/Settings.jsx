import { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Cpu, Bell, Shield, Key, Save, CheckCircle2, Server, Activity, Database, RefreshCw } from 'lucide-react';
import { systemHealth } from '../data/mockData';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('ml');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [mlSettings, setMlSettings] = useState({
    contamination: 0.1,
    confidenceThreshold: 85,
    autoRetrainHours: 12,
    algorithm: 'IsolationForest + Autoencoder',
  });

  const [soarSettings, setSoarSettings] = useState({
    autoBlockIp: true,
    autoIsolateHost: true,
    criticalThreshold: 90,
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 'KEY-001', name: 'SIEM Integration', key: 'cfx_live_98a7f6e5d4c3b2a1...', created: '2026-01-15' },
    { id: 'KEY-002', name: 'Python SDK Worker', key: 'cfx_live_1234567890abcdef...', created: '2026-03-01' },
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="animate-in stagger-1">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>System & Engine Configuration</h2>
          <p>ML hyperparameters, SOAR response thresholds, notification channels & API keys</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} style={{ marginRight: '6px' }} />
          Save Configuration
        </button>
      </div>

      {savedSuccess && (
        <div style={{ padding: '12px 16px', background: 'var(--low-bg)', border: '1px solid var(--low-border)', borderRadius: 'var(--radius-md)', marginBottom: '20px', color: 'var(--low)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <CheckCircle2 size={16} /> Configuration saved and applied to active forensic engine instance.
        </div>
      )}

      {/* System Diagnostics Card */}
      <div className="card animate-in stagger-2" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title">
            <Server size={16} className="card-title-icon" />
            SOC Node Diagnostics & Resource Metrics
          </div>
          <span className="badge green">Uptime: {systemHealth.uptime}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>CPU Load</div>
            <div className="progress-bar">
              <div className="progress-bar-fill blue" style={{ width: `${systemHealth.cpu}%` }}></div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px', fontFamily: 'JetBrains Mono' }}>{systemHealth.cpu}%</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>RAM Usage</div>
            <div className="progress-bar">
              <div className="progress-bar-fill yellow" style={{ width: `${systemHealth.memory}%` }}></div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px', fontFamily: 'JetBrains Mono' }}>{systemHealth.memory}%</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>GPU Acceleration</div>
            <div className="progress-bar">
              <div className="progress-bar-fill cyan" style={{ width: `${systemHealth.gpuUtil}%` }}></div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px', fontFamily: 'JetBrains Mono' }}>{systemHealth.gpuUtil}%</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Model Inference Latency</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'JetBrains Mono' }}>
              {systemHealth.modelLatency} ms
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        {[
          { id: 'ml', label: 'ML Forensic Engine', icon: Cpu },
          { id: 'soar', label: 'SOAR & Playbooks', icon: Shield },
          { id: 'keys', label: 'API Keys & Access', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} style={{ marginRight: '6px' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: ML Settings */}
      {activeTab === 'ml' && (
        <div className="card animate-in">
          <div className="card-header">
            <div className="card-title">
              <Sliders size={16} className="card-title-icon" />
              Machine Learning Hyperparameter Tuning
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Primary Detection Algorithm
              </label>
              <select
                className="form-input"
                value={mlSettings.algorithm}
                onChange={(e) => setMlSettings({ ...mlSettings, algorithm: e.target.value })}
                style={{ width: '100%', maxWidth: '400px' }}
              >
                <option value="IsolationForest + Autoencoder">Isolation Forest + Deep Autoencoder (Ensemble)</option>
                <option value="RandomForest + XGBoost">Random Forest + XGBoost Supervised Classifier</option>
                <option value="LSTM Network">LSTM Sequence Model (For Time-Series Anomaly)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Contamination Factor (Sensitivity): {mlSettings.contamination}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.25"
                step="0.01"
                value={mlSettings.contamination}
                onChange={(e) => setMlSettings({ ...mlSettings, contamination: parseFloat(e.target.value) })}
                style={{ width: '100%', maxWidth: '400px', accentColor: 'var(--accent-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Auto-Retraining Interval
              </label>
              <select
                className="form-input"
                value={mlSettings.autoRetrainHours}
                onChange={(e) => setMlSettings({ ...mlSettings, autoRetrainHours: parseInt(e.target.value) })}
                style={{ width: '100%', maxWidth: '400px' }}
              >
                <option value={6}>Every 6 Hours</option>
                <option value={12}>Every 12 Hours</option>
                <option value={24}>Every 24 Hours</option>
                <option value={0}>Manual Only</option>
              </select>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: SOAR Automation */}
      {activeTab === 'soar' && (
        <div className="card animate-in">
          <div className="card-header">
            <div className="card-title">
              <Shield size={16} className="card-title-icon" />
              Automated Response (SOAR) Policies
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={soarSettings.autoBlockIp}
                onChange={(e) => setSoarSettings({ ...soarSettings, autoBlockIp: e.target.checked })}
                style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
              />
              <div>
                <strong style={{ display: 'block' }}>Auto-block Malicious Source IPs</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Automatically inject firewall drop rules when ML confidence exceeds 85%</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={soarSettings.autoIsolateHost}
                onChange={(e) => setSoarSettings({ ...soarSettings, autoIsolateHost: e.target.checked })}
                style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
              />
              <div>
                <strong style={{ display: 'block' }}>Auto-Isolate Host on Ransomware / Exfiltration</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Isolate target VLAN automatically to prevent lateral movement</span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: API Keys */}
      {activeTab === 'keys' && (
        <div className="card animate-in">
          <div className="card-header">
            <div className="card-title">
              <Key size={16} className="card-title-icon" />
              API Key Management
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Key ID</th>
                <th>Application Name</th>
                <th>API Token Key</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((k) => (
                <tr key={k.id}>
                  <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-primary)' }}>{k.id}</td>
                  <td style={{ fontWeight: 600 }}>{k.name}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-muted)' }}>{k.key}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}>{k.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
