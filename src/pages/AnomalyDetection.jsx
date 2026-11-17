import { useState } from 'react';
import { Activity, AlertTriangle, Cpu, Sliders, Filter, ShieldAlert, CheckCircle2, Zap, TrendingUp, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { anomalyTypes as defaultAnomalyTypes, networkTrafficData, modelMetrics } from '../data/mockData';
import { useSimulation } from '../context/SimulationContext';

export default function AnomalyDetection() {
  const { isRunning, simAlerts, scenarioId } = useSimulation();
  const [contamination, setContamination] = useState(0.1);
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);

  const anomalyData = defaultAnomalyTypes;

  const filteredAnomalies = anomalyData.filter(item => {
    const matchesSeverity = selectedSeverity === 'All' || item.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const totalAnomalyCount = anomalyData.reduce((acc, curr) => acc + curr.count, 0) + (isRunning ? simAlerts.length : 0);

  return (
    <div className="animate-in stagger-1">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Unsupervised Anomaly Detection</h2>
          <p>Isolation Forest &amp; Deep Autoencoder real-time outlier feature analysis</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="badge cyan" style={{ padding: '6px 12px', fontSize: '12px' }}>
            <Cpu size={14} style={{ marginRight: '6px' }} />
            Engine: IsolationForest + Autoencoder v3.7
          </span>
        </div>
      </div>

      {/* Simulation Banner */}
      {isRunning && (
        <div style={{
          padding: '10px 16px', marginBottom: '16px', borderRadius: '8px',
          background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.3)',
          fontSize: '12px', color: 'var(--critical)', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Zap size={14} /> LIVE ATTACK TELEMETRY DETECTED — Unsupervised models analyzing dynamic outlier clusters for <strong>{scenarioId?.toUpperCase()}</strong> ({simAlerts.length} live anomalies)
        </div>
      )}

      {/* Top Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon red">
            <Activity size={20} />
          </div>
          <div className="stat-card-value">{totalAnomalyCount}</div>
          <div className="stat-card-label">Anomalies Flagged</div>
          <div className="stat-card-trend up">
            <TrendingUp size={12} /> +8.3% over 24h baseline
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon blue">
            <Cpu size={20} />
          </div>
          <div className="stat-card-value">{(contamination * 100).toFixed(1)}%</div>
          <div className="stat-card-label">Isolation Forest Contamination</div>
          <div className="stat-card-trend">Sensitivity Rate</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon emerald">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-card-value">{modelMetrics.auc}</div>
          <div className="stat-card-label">ROC-AUC Score</div>
          <div className="stat-card-trend up">
            <TrendingUp size={12} /> Optimal separation score
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon cyan">
            <Zap size={20} />
          </div>
          <div className="stat-card-value">{modelMetrics.precision}%</div>
          <div className="stat-card-label">Outlier Precision</div>
          <div className="stat-card-trend up">High confidence threshold</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid">
        {/* Anomaly Distribution Chart */}
        <div className="card animate-in stagger-2">
          <div className="card-header">
            <div className="card-title">
              <ShieldAlert size={16} className="card-title-icon" />
              Detected Anomaly Categories
            </div>
            <div className="card-action">{anomalyData.length} Types Identified</div>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomalyData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} width={130} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)' }} />
                <Bar dataKey="count" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} barSize={16}>
                  {anomalyData.map((entry, index) => {
                    const colors = { Critical: '#ff2d55', High: '#ff6b35', Medium: '#ffcc00', Low: '#34c759' };
                    return <Cell key={`cell-${index}`} fill={colors[entry.severity] || 'var(--accent-primary)'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Outlier Score Stream */}
        <div className="card animate-in stagger-3">
          <div className="card-header">
            <div className="card-title">
              <Activity size={16} className="card-title-icon" />
              Telemetry Outlier Score Stream
            </div>
            <div className="card-action">Live Stream</div>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkTrafficData.slice(0, 25)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--critical)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--critical)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="malicious" name="Malicious Anomaly Index" stroke="var(--critical)" strokeWidth={2} fillOpacity={1} fill="url(#colorMalicious)" />
                <Area type="monotone" dataKey="blocked" name="Blocked Threshold" stroke="var(--accent-cyan)" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Contamination Slider & Table */}
      <div className="card animate-in stagger-4" style={{ marginTop: '20px' }}>
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
          <div className="card-title">
            <Sliders size={16} className="card-title-icon" />
            Anomaly Investigation Table
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Contamination Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Sensitivity (Contamination):</span>
              <input
                type="range"
                min="0.01"
                max="0.25"
                step="0.01"
                value={contamination}
                onChange={(e) => setContamination(parseFloat(e.target.value))}
                style={{ width: '100px', accentColor: 'var(--accent-primary)' }}
              />
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{(contamination * 100).toFixed(0)}%</span>
            </div>

            {/* Severity Filter */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Filter size={14} color="var(--text-muted)" />
              {['All', 'Critical', 'High', 'Medium'].map((sev) => (
                <button
                  key={sev}
                  className={`btn ${selectedSeverity === sev ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                  onClick={() => setSelectedSeverity(sev)}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '30px', paddingRight: '10px', paddingTop: '4px', paddingBottom: '4px', fontSize: '12px', width: '180px' }}
              />
            </div>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Anomaly Category</th>
              <th>Flagged Count</th>
              <th>Severity Grade</th>
              <th>Isolation Score Range</th>
              <th>Detection Algorithm</th>
              <th>Action Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnomalies.map((item, idx) => {
              return (
                <tr key={item.name} style={{ cursor: 'pointer' }} onClick={() => setSelectedAnomaly(item)}>
                  <td style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={14} className={item.severity.toLowerCase()} />
                    {item.name}
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{item.count} events</td>
                  <td>
                    <span className={`badge ${item.severity.toLowerCase()}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>
                    -0.{Math.floor(80 - idx * 7)} to -0.{Math.floor(95 - idx * 5)}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {idx % 2 === 0 ? 'Isolation Forest (iTree-40)' : 'Autoencoder Latent Distance'}
                  </td>
                  <td>
                    <span className="badge green" style={{ fontSize: '11px' }}>
                      Auto-flagged
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Anomaly Details Modal */}
      {selectedAnomaly && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90vw', padding: '24px' }}>
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <div className="card-title" style={{ fontSize: '16px' }}>
                <AlertTriangle size={18} className={selectedAnomaly.severity.toLowerCase()} />
                {selectedAnomaly.name} — Detailed Inspection
              </div>
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><strong>Severity:</strong> <span className={`badge ${selectedAnomaly.severity.toLowerCase()}`}>{selectedAnomaly.severity}</span></div>
              <div><strong>Total Flagged Events:</strong> {selectedAnomaly.count}</div>
              <div><strong>Feature Vectors Evaluated:</strong> Packet Length Variance, Request Entropy, Port Hop Speed, Payload Base64 Ratio</div>
              <div><strong>Isolation Forest Decision Score:</strong> -0.842 (High Deviation from Baseline)</div>
              <div><strong>Recommended SOC Response:</strong> Initiate deep PCAP capture, isolate source VLAN if score exceeds threshold.</div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedAnomaly(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="custom-tooltip-item">
            <div className="custom-tooltip-dot" style={{ backgroundColor: entry.color }}></div>
            <span>{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
