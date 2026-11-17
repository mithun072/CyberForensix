import { ShieldAlert, Activity, Network, ShieldCheck, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';
import {
  dashboardStats,
  liveAlerts,
  modelPerformanceHistory,
  attackVectors,
} from '../data/mockData';
import { useSimulation } from '../context/SimulationContext';

export default function Dashboard({ searchQuery = '' }) {
  const { isRunning, simAlerts, stats, scenarioId } = useSimulation();

  // Merge live simulation alerts on top when simulation is running
  const allAlerts = isRunning ? [...simAlerts, ...liveAlerts] : liveAlerts;

  // Global search — filter the alerts table
  const q = searchQuery.trim().toLowerCase();
  const filteredAlerts = q
    ? allAlerts.filter(a =>
        a.type.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.destination.toLowerCase().includes(q) ||
        a.severity.toLowerCase().includes(q) ||
        (a.protocol || '').toLowerCase().includes(q)
      )
    : allAlerts;

  const totalEventsCount = dashboardStats.totalEvents + (stats?.packets || 0);
  const totalThreatsCount = dashboardStats.threatsDetected + (simAlerts?.length || 0);

  return (
    <div className="animate-in stagger-1">
      <div className="page-header">
        <h2>Security Operations Dashboard</h2>
        <p>Real-time overview of forensic analysis and threat landscape</p>
      </div>

      {/* ── Active Simulation Banner ─────────────────────── */}
      {isRunning && (
        <div style={{
          padding: '12px 18px', marginBottom: '20px', borderRadius: '8px',
          background: 'rgba(255,45,85,0.09)', border: '1px solid rgba(255,45,85,0.3)',
          fontSize: '12px', color: 'var(--critical)', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={15} />
            <span>ATTACK SIMULATION LIVE: <strong>{scenarioId?.toUpperCase()}</strong> — {stats.packets.toLocaleString()} packets injected | {simAlerts.length} anomalies flagged in real time</span>
          </div>
          <span className="live-pulse">STREAMING</span>
        </div>
      )}

      {/* ── Stat Cards ─────────────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon blue"><Activity size={20} /></div>
          <div className="stat-card-value">{totalEventsCount.toLocaleString()}</div>
          <div className="stat-card-label">Events Processed (24h)</div>
          <div className="stat-card-trend up">
            <TrendingUp size={12} /> {isRunning ? `+${stats?.packets || 0} sim pkts` : '+12.4% vs yesterday'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon red"><ShieldAlert size={20} /></div>
          <div className="stat-card-value">{totalThreatsCount.toLocaleString()}</div>
          <div className="stat-card-label">Threats Detected</div>
          <div className="stat-card-trend down">
            <AlertTriangle size={12} /> {isRunning ? `${simAlerts.length} live from sim` : 'Isolation Forest Active'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon emerald"><ShieldCheck size={20} /></div>
          <div className="stat-card-value">{dashboardStats.modelAccuracy}%</div>
          <div className="stat-card-label">ML Model Accuracy</div>
          <div className="stat-card-trend up">
            <TrendingUp size={12} /> +0.4% from last epoch
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon cyan"><Network size={20} /></div>
          <div className="stat-card-value">{dashboardStats.dataProcessed}</div>
          <div className="stat-card-label">Forensic Data Processed</div>
        </div>
      </div>

      {/* ── Charts Row ─────────────────────────────────── */}
      <div className="dashboard-grid">
        {/* ML Confidence trend */}
        <div className="card animate-in stagger-2">
          <div className="card-header">
            <div className="card-title">
              <Activity size={16} className="card-title-icon" />
              ML Prediction Confidence Trend
            </div>
            <div className="card-action">View details</div>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={modelPerformanceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--accent-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="accuracy"  stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" name="Accuracy" />
                <Area type="monotone" dataKey="precision" stroke="var(--accent-emerald)" strokeWidth={2} fill="none" name="Precision" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Vectors */}
        <div className="card animate-in stagger-3">
          <div className="card-header">
            <div className="card-title">
              <ShieldAlert size={16} className="card-title-icon" />
              Top Attack Vectors
            </div>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackVectors} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} name="Incidents">
                  {attackVectors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Alerts Table ───────────────────────────────── */}
      <div className="dashboard-full">
        <div className="card animate-in stagger-4">
          <div className="card-header">
            <div className="card-title">
              <AlertTriangle size={16} className="card-title-icon" />
              Critical Live Alerts
              {q && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '8px' }}>
                  — {filteredAlerts.length} result{filteredAlerts.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>
            <div className="card-action">View all alerts</div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Severity</th>
                <th>Alert Type</th>
                <th>Source IP</th>
                <th>Target</th>
                <th>ML Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No alerts match &ldquo;<strong>{searchQuery}</strong>&rdquo;
                  </td>
                </tr>
              )}
              {filteredAlerts.map(alert => (
                <tr key={alert.id}>
                  <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td>
                    <span className={`badge ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{alert.type}</td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{alert.source}</td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{alert.destination}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ width: '60px' }}>
                        <div
                          className={`progress-bar-fill ${alert.confidence > 95 ? 'red' : alert.confidence > 90 ? 'yellow' : 'cyan'}`}
                          style={{ width: `${alert.confidence}%` }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}>{alert.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="custom-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="custom-tooltip-item">
          <div className="custom-tooltip-dot" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}: {entry.value}</span>
        </div>
      ))}
    </div>
  );
}
