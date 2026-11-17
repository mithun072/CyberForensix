import { useState } from 'react';
import { ShieldAlert, Filter, Download, Crosshair, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import { liveAlerts } from '../data/mockData';
import { useSimulation } from '../context/SimulationContext';

export default function LiveAlerts({ searchQuery = '' }) {
  const { isRunning, simAlerts } = useSimulation();

  // Merge live simulation events on top of mock data
  const allAlerts = isRunning
    ? [...simAlerts, ...liveAlerts].slice(0, 80)
    : liveAlerts;

  // Filter list by global search
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

  const [selectedId, setSelectedId] = useState(allAlerts[0]?.id);
  const active = filteredAlerts.find(a => a.id === selectedId) || filteredAlerts[0] || null;

  return (
    <div className="animate-in stagger-1" style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>

      {/* ── Left: Alert List ─────────────────────────── */}
      <div className="card" style={{ width: '380px', display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <div className="card-header" style={{ marginBottom: '12px' }}>
          <div className="card-title">
            <ShieldAlert size={16} className="card-title-icon" style={{ color: 'var(--critical)' }} />
            Alert Stream&nbsp;
            <span className="live-pulse" style={{ marginLeft: '4px' }}>Live</span>
          </div>
          <div className="card-action"><Filter size={14} /></div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {/* Simulation banner */}
          {isRunning && (
            <div style={{
              padding: '8px 12px', marginBottom: '8px', borderRadius: '6px',
              background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)',
              fontSize: '11px', color: 'var(--critical)', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <Zap size={12} /> SIMULATION ACTIVE — live events streaming in
            </div>
          )}

          {filteredAlerts.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No alerts match "<strong>{searchQuery}</strong>"
            </div>
          )}

          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className="alert-item animate-in"
              style={{
                borderColor: alert.id === selectedId ? 'var(--accent-primary)' : alert.isSimulated ? 'rgba(255,45,85,0.3)' : 'var(--border-subtle)',
                background:  alert.id === selectedId ? 'rgba(99,122,255,0.08)' : 'var(--bg-tertiary)',
                marginBottom: '8px',
              }}
              onClick={() => setSelectedId(alert.id)}
            >
              <div className="alert-item-header">
                <div className="alert-item-title">
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block',
                    background: `var(--${alert.severity.toLowerCase()})`, marginRight: '6px',
                  }} />
                  {alert.type}
                </div>
                <div className="alert-item-time">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
              <div className="alert-item-desc" style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {alert.description}
              </div>
              <div className="alert-item-meta">
                <span className={`badge ${alert.severity.toLowerCase()}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                  {alert.severity}
                </span>
                <span className="alert-meta-tag">ML: {alert.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Detail Panel ──────────────────────── */}
      <div className="card" style={{ flex: 1, overflowY: 'auto' }}>
        {!active ? (
          <div className="empty-state" style={{ height: '100%' }}>
            <p className="empty-state-title">No alerts match your search</p>
            <p className="empty-state-desc">Try a different keyword</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{active.type}</h2>
                  <span className={`badge ${active.severity.toLowerCase()}`}>{active.severity}</span>
                  <span className="tag">{active.id}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{active.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
                <button className="btn btn-primary btn-sm"><Crosshair size={14} /> Triage</button>
              </div>
            </div>

            {/* Network + ML cards */}
            <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
              {/* Network Context */}
              <div className="card-glass" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>
                  Network Context
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Source</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>{active.source}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Internal Host</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Destination</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '14px', color: 'var(--critical)', marginBottom: '4px' }}>{active.destination}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>External IP</div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Protocol</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', marginTop: '4px' }}>{active.protocol}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status</div>
                    <div style={{ color: 'var(--high)', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>{active.status}</div>
                  </div>
                </div>
              </div>

              {/* ML Context */}
              <div className="card-glass" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BrainCircuit size={14} color="var(--accent-primary)" /> ML Analysis Context
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Detecting Model</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '13px', color: 'var(--accent-primary)' }}>{active.mlModel}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Confidence</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '16px', fontWeight: 800, color: active.confidence > 95 ? 'var(--critical)' : 'var(--high)' }}>
                      {active.confidence}%
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Trigger Features</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {active.features.map((f, i) => (
                      <span key={i} className="tag" style={{ background: 'rgba(99,122,255,0.1)', borderColor: 'rgba(99,122,255,0.2)', color: 'var(--accent-primary)' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Runbook */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} className="card-title-icon" /> Suggested Runbook Response
              </h3>
              <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(52,199,89,0.1)', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                  Auto-containment viable — confidence exceeds 95% threshold
                </div>
                <div style={{ padding: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                    Isolate Host ({active.source})
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                    Block Destination at Edge
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                    Capture Memory Dump
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
