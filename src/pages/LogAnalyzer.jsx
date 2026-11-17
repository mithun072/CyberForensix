import { useState } from 'react';
import { ScrollText, Terminal, Filter, Zap } from 'lucide-react';
import { liveAlerts } from '../data/mockData';
import { useSimulation } from '../context/SimulationContext';

// Build log entries from liveAlerts mock data
const STATIC_LOG_ENTRIES = liveAlerts.map((a, i) => ({
  id: `EVT-${String(a.id).padStart(4, '0')}`,
  timestamp: a.timestamp,
  level: a.severity.toUpperCase(),
  severity: a.severity,
  category: i % 3 === 0 ? 'Application & Host' : 'Network & Access',
  type: a.type,
  source: a.source,
  destination: a.destination,
  message: a.description || a.log || `${a.type} detected from ${a.source}`,
  log: a.log || `[${a.severity.toUpperCase()}] ${a.type} | src=${a.source} dst=${a.destination} | confidence=${a.confidence}%`,
}));

export default function LogAnalyzer({ searchQuery = '' }) {
  const { isRunning, simAlerts, scenarioId } = useSimulation();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  // Convert real-time sim alerts to log entries
  const simLogEntries = isRunning ? simAlerts.map(a => ({
    id: a.id,
    timestamp: a.timestamp,
    level: a.severity.toUpperCase(),
    severity: a.severity,
    category: a.category || 'Network & Access',
    type: a.type,
    source: a.source,
    destination: a.destination,
    message: a.description || `${a.type} detected from ${a.source}`,
    log: a.log || `[SIM] ${a.type} src=${a.source} dst=${a.destination} conf=${a.confidence}%`,
    isSimulated: true,
  })) : [];

  const allLogEntries = [...simLogEntries, ...STATIC_LOG_ENTRIES];

  const q = searchQuery.trim().toLowerCase();
  const filtered = allLogEntries.filter(log => {
    const matchSearch = !q ||
      log.message.toLowerCase().includes(q) ||
      log.source.toLowerCase().includes(q) ||
      log.destination.toLowerCase().includes(q) ||
      log.type.toLowerCase().includes(q) ||
      log.level.toLowerCase().includes(q);
    const matchSev = severityFilter === 'ALL' || log.level === severityFilter;
    const matchCat = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchSearch && matchSev && matchCat;
  });

  return (
    <div className="animate-in stagger-1">
      <div className="page-header">
        <h2>Live Log Analyzer &amp; Inspector</h2>
        <p>Real-time telemetry event stream with severity filtering and forensic inspection</p>
      </div>

      {/* Simulation Banner */}
      {isRunning && (
        <div style={{
          padding: '10px 16px', marginBottom: '16px', borderRadius: '8px',
          background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.3)',
          fontSize: '12px', color: 'var(--critical)', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Zap size={14} /> LIVE TELEMETRY INGEST ACTIVE — Ingesting event logs for <strong>{scenarioId?.toUpperCase()}</strong> in real time ({simLogEntries.length} new events)
        </div>
      )}

      {/* Filters */}
      <div className="card animate-in stagger-2" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
              <button
                key={s}
                className={`btn ${severityFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '11px' }}
                onClick={() => setSeverityFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
            {['ALL', 'Network & Access', 'Application & Host'].map(c => (
              <button
                key={c}
                className={`btn ${categoryFilter === c ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '11px' }}
                onClick={() => setCategoryFilter(c)}
              >
                {c === 'ALL' ? 'All' : c}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            {filtered.length} / {allLogEntries.length} events
          </span>
        </div>
      </div>

      {/* Log Table */}
      <div className="card animate-in stagger-3">
        <div className="card-header">
          <div className="card-title">
            <Terminal size={16} className="card-title-icon" />
            Telemetry Event Buffer
            {q && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '8px' }}>
                — filtering for &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ScrollText size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0 }}>No log entries match the current filters</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Time</th>
                <th>Severity</th>
                <th>Category</th>
                <th>Type</th>
                <th>Source IP</th>
                <th>Target IP</th>
                <th>Raw Payload</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedLog(item)}
                >
                  <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', fontSize: '11px' }}>{item.id}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', fontSize: '11px' }}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                  <td>
                    <span className={`badge ${item.severity.toLowerCase()}`}>{item.severity}</span>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.category}</td>
                  <td style={{ fontWeight: 600, fontSize: '12px' }}>{item.type}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--high)', fontSize: '12px' }}>{item.source}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)', fontSize: '12px' }}>{item.destination}</td>
                  <td style={{
                    fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-secondary)',
                    maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{item.log}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998,
        }}>
          <div className="card" style={{ width: '560px', maxWidth: '90vw', padding: '24px' }}>
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <div className="card-title">
                <Terminal size={16} className="card-title-icon" />
                {selectedLog.id} — Forensic Detail
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedLog(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              {[
                ['Event ID', selectedLog.id],
                ['Severity', <span className={`badge ${selectedLog.severity.toLowerCase()}`}>{selectedLog.severity}</span>],
                ['Category', selectedLog.category],
                ['Type', selectedLog.type],
                ['Source IP', selectedLog.source],
                ['Target IP', selectedLog.destination],
                ['Timestamp', new Date(selectedLog.timestamp).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ color: 'var(--text-muted)', width: '100px', flexShrink: 0 }}>{label}:</span>
                  <span style={{ fontFamily: typeof value === 'string' ? 'JetBrains Mono' : 'inherit', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Raw Log Payload:</div>
                <div style={{ background: '#090d16', padding: '10px 14px', borderRadius: '6px', fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#a5b4fc', lineHeight: 1.6 }}>
                  {selectedLog.log}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
