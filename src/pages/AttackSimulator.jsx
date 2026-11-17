import { useState } from 'react';
import {
  Zap, ShieldAlert, Play, Square, Sliders, Target,
  Activity, ShieldCheck, Server, Terminal, TrendingUp,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSimulation } from '../context/SimulationContext';

const SCENARIOS = [
  { id: 'ddos',         name: 'DDoS Volumetric Flood',      category: 'Network & Access',    severity: 'Critical', target: '192.168.1.10', desc: 'High packet volume burst swamping edge router bandwidth and TCP buffers.' },
  { id: 'brute_force',  name: 'SSH Auth Brute Force',        category: 'Network & Access',    severity: 'High',     target: '10.0.4.15',   desc: 'High-frequency dictionary password guessing attempts against port 22.' },
  { id: 'port_scan',    name: 'Port Reconnaissance Scan',    category: 'Network & Access',    severity: 'Medium',   target: '10.0.0.0/24', desc: 'Sequential SYN sweep identifying open listening services.' },
  { id: 'sqli',         name: 'SQL Injection Attack',        category: 'Application & Host',  severity: 'Critical', target: '10.0.2.88',   desc: 'Unescaped SQL payload injection seeking database schema dump.' },
  { id: 'exfiltration', name: 'DNS Covert Exfiltration',     category: 'Application & Host',  severity: 'High',     target: '10.0.5.22',   desc: 'Encrypted payload chunking over DNS TXT queries.' },
  { id: 'ransomware',   name: 'Ransomware File Encryption',  category: 'Application & Host',  severity: 'Critical', target: '10.0.1.4',    desc: 'High-frequency file modification & entropy pattern detection.' },
];

export default function AttackSimulator() {
  const sim = useSimulation();

  // Local UI state for scenario picker / knobs (context holds running state)
  const [localScenario, setLocalScenario] = useState('ddos');
  const [localIntensity, setLocalIntensity] = useState(8);
  const [localTarget, setLocalTarget] = useState('');
  const [loading, setLoading] = useState(false);

  const scen = SCENARIOS.find(s => s.id === localScenario);
  const effectiveTarget = localTarget.trim() || scen.target;

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      sim.start(localScenario, localIntensity, effectiveTarget);
      setLoading(false);
    }, 800);
  };

  const handleStop = () => {
    setLoading(true);
    setTimeout(() => {
      sim.stop();
      setLoading(false);
    }, 500);
  };

  const { isRunning, stats, chartData, terminalLines } = sim;

  return (
    <div className="animate-in stagger-1">

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Attack Simulation Lab</h2>
          <p>Events stream live to Live Alerts, Playbooks &amp; Dashboard in real-time</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className={`badge ${isRunning ? 'critical' : 'low'}`}>
            <Server size={12} style={{ marginRight: '4px' }} />
            {isRunning ? 'RUNNING' : 'IDLE'}
          </span>
          {isRunning && <span className="live-pulse">LIVE</span>}
        </div>
      </div>

      {/* Scenario Grid + Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', marginBottom: '20px' }}>

        {/* Scenarios */}
        <div className="card animate-in stagger-2">
          <div className="card-header">
            <div className="card-title"><ShieldAlert size={16} className="card-title-icon" /> Select Attack Scenario</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>6 vectors — events propagate to all pages</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {SCENARIOS.map(s => {
              const active = localScenario === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => { if (!isRunning) { setLocalScenario(s.id); setLocalTarget(''); } }}
                  style={{
                    padding: '13px', borderRadius: '8px',
                    border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    background: active ? 'rgba(99,122,255,0.08)' : 'var(--bg-card)',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    opacity: isRunning && !active ? 0.45 : 1,
                    transition: 'all 0.18s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <span className={`badge ${s.severity.toLowerCase()}`}>{s.severity}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{s.category}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: active ? 'var(--accent-primary)' : 'var(--text-primary)', marginBottom: '5px' }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="card animate-in stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="card-header">
            <div className="card-title"><Sliders size={16} className="card-title-icon" /> Parameters</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Attack Rate / Intensity</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{localIntensity} evt/s</span>
            </div>
            <input
              type="range" min="1" max="20" value={localIntensity} disabled={isRunning}
              onChange={e => setLocalIntensity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: isRunning ? 'not-allowed' : 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>
              <span>Stealth</span><span>Aggressive</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Target IP / Subnet</div>
            <div style={{ position: 'relative' }}>
              <Target size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text" value={localTarget || scen.target} disabled={isRunning}
                onChange={e => setLocalTarget(e.target.value)}
                style={{
                  width: '100%', padding: '9px 9px 9px 32px', borderRadius: '6px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontSize: '13px',
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!isRunning ? (
              <button
                className="btn btn-primary" onClick={handleStart} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px' }}
              >
                {loading ? '⟳ Initialising…' : <><Play size={16} /> Start Simulation</>}
              </button>
            ) : (
              <button onClick={handleStop} disabled={loading} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '7px', padding: '10px', borderRadius: 'var(--radius-md)',
                background: 'var(--critical)', border: 'none', color: '#fff',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              }}>
                {loading ? '⟳ Stopping…' : <><Square size={16} /> Stop Simulation</>}
              </button>
            )}
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
              {isRunning ? '⚡ Events streaming to Live Alerts & Playbooks' : 'Events will appear across all pages when running'}
            </p>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      {isRunning && (
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          {[
            { label: 'Elapsed',       value: `${stats.elapsed}s`,                  cls: 'cyan',    icon: <TrendingUp size={18} /> },
            { label: 'Packets Sent',  value: stats.packets.toLocaleString(),        cls: 'blue',    icon: <Activity size={18} /> },
            { label: 'Auto-Blocked',  value: stats.blocked.toLocaleString(),        cls: 'emerald', icon: <ShieldCheck size={18} /> },
            { label: 'ML Confidence', value: `${stats.confidence}%`,               cls: 'red',     icon: <Zap size={18} /> },
          ].map(({ label, value, cls, icon }) => (
            <div className="stat-card" key={label}>
              <div className={`stat-card-icon ${cls}`}>{icon}</div>
              <div className="stat-card-value" style={{ fontSize: '22px' }}>{value}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart + Terminal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Anomaly Chart */}
        <div className="card animate-in stagger-4">
          <div className="card-header">
            <div className="card-title"><Activity size={16} className="card-title-icon" /> ML Anomaly Score — Live</div>
            {isRunning && <span className="live-pulse">LIVE</span>}
          </div>
          <div style={{ height: '240px' }}>
            {chartData.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Start a simulation to see live anomaly scores
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradAnomaly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--critical)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--critical)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="t" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="anomaly"   name="ML Confidence %" stroke="var(--critical)"       strokeWidth={2} fill="url(#gradAnomaly)" />
                  <Area type="monotone" dataKey="threshold" name="Alert Threshold"  stroke="var(--accent-primary)" strokeWidth={1.5} strokeDasharray="5 3" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Terminal */}
        <div className="card animate-in stagger-5">
          <div className="card-header">
            <div className="card-title"><Terminal size={16} className="card-title-icon" /> Live Event Terminal</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{terminalLines.length} events</span>
          </div>
          <div style={{
            height: '240px', overflowY: 'auto', background: '#070a12', borderRadius: '6px',
            padding: '12px 14px', fontFamily: 'JetBrains Mono', fontSize: '11px', lineHeight: '1.7',
            border: '1px solid rgba(255,255,255,0.05)',
          }} ref={el => { if (el) el.scrollTop = el.scrollHeight; }}>
            {terminalLines.length === 0 ? (
              <div style={{ color: '#4a5568', paddingTop: '80px', textAlign: 'center' }}>Waiting for simulation events…</div>
            ) : (
              terminalLines.map((e, i) => (
                <div key={i} style={{ color: e.conf > 90 ? '#ff6b6b' : e.conf > 80 ? '#ffd166' : '#a5b4fc' }}>
                  <span style={{ color: '#4a5568', marginRight: '8px' }}>{e.ts}</span>{e.line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Automated Response */}
      {isRunning && stats.elapsed >= 3 && (
        <div className="card" style={{ marginTop: '20px', padding: '16px' }}>
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <div className="card-title" style={{ color: 'var(--accent-emerald)' }}>
              <ShieldCheck size={16} className="card-title-icon" /> Automated ML Response — Active (also visible in Playbooks page)
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              `Isolation Forest triggered (conf ${stats.confidence}%)`,
              `Auto-isolation queued: ${effectiveTarget}`,
              `Edge firewall block rule pushed`,
              `PCAP capture started (256MB ring)`,
              stats.elapsed >= 8 ? `Evidence hash logged: EVD-${(stats.elapsed * 31337).toString(16).toUpperCase()}` : null,
            ].filter(Boolean).map((msg, i) => (
              <div key={i} style={{
                padding: '8px 14px', background: 'rgba(52,199,89,0.08)',
                border: '1px solid rgba(52,199,89,0.2)', borderRadius: '6px',
                fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 500,
              }}>✓ {msg}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
