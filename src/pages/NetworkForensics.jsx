import { Network, Activity, ArrowRightLeft, Cpu, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { networkTrafficData, geoData } from '../data/mockData';
import { useSimulation } from '../context/SimulationContext';

export default function NetworkForensics() {
  const { isRunning, scenarioId, targetIp, stats } = useSimulation();

  return (
    <div className="animate-in stagger-1">
      <div className="page-header">
        <h2>Network Forensics</h2>
        <p>Deep packet inspection, traffic baselining, and geo-analysis</p>
      </div>

      {/* Simulation Banner */}
      {isRunning && (
        <div style={{
          padding: '10px 16px', marginBottom: '16px', borderRadius: '8px',
          background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.3)',
          fontSize: '12px', color: 'var(--critical)', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Zap size={14} /> LIVE ATTACK TRAFFIC STREAMING — High-volume burst detected targeting <strong>{targetIp || '192.168.1.10'}</strong> ({scenarioId?.toUpperCase()}) | {stats.packets.toLocaleString()} packets captured in PCAP ring buffer
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card animate-in stagger-2">
          <div className="card-header">
            <div className="card-title">
              <Activity size={16} className="card-title-icon" />
              Live Network Traffic Analysis (Last 60s)
            </div>
          </div>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--critical)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--critical)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  labelStyle={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="inbound" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorIn)" name="Inbound (Mbps)" />
                <Area type="monotone" dataKey="outbound" stroke="var(--accent-cyan)" fillOpacity={1} fill="url(#colorOut)" name="Outbound (Mbps)" />
                <Area type="monotone" dataKey="malicious" stroke="var(--critical)" fillOpacity={1} fill="url(#colorMal)" name="Malicious Drops" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card animate-in stagger-3">
          <div className="card-header">
            <div className="card-title">
              <Network size={16} className="card-title-icon" />
              Geo-origin Threat Tracking
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>Country</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>Total Attacks</span>
                <span>Auto-Blocked</span>
              </div>
            </div>
            {geoData.slice(0, 7).map((geo, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{geo.country}</div>
                <div>
                  <div className="geo-bar">
                    <div className="geo-bar-track">
                      <div className="geo-bar-fill attacks" style={{ width: `${(geo.attacks / 1500) * 100}%` }}></div>
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', minWidth: '40px' }}>{geo.attacks}</span>
                  </div>
                  <div className="geo-bar" style={{ marginTop: '4px' }}>
                    <div className="geo-bar-track">
                      <div className="geo-bar-fill blocked" style={{ width: `${(geo.blocked / 1500) * 100}%` }}></div>
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', minWidth: '40px', color: 'var(--accent-emerald)' }}>{geo.blocked}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid-3">
        <div className="card animate-in stagger-4">
          <div className="card-header">
            <div className="card-title">
              <ArrowRightLeft size={16} className="card-title-icon" />
              Protocol Distribution
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['HTTPS (443)', 'HTTP (80)', 'DNS (53)', 'SSH (22)', 'SMB (445)'].map((proto, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>{proto}</span>
                  <span style={{ fontFamily: 'JetBrains Mono' }}>{Math.floor(80 - i * 15)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill blue" style={{ width: `${80 - i * 15}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card animate-in stagger-5">
          <div className="card-header">
            <div className="card-title">
              <Cpu size={16} className="card-title-icon" />
              Bandwidth Utilization
            </div>
          </div>
          <div className="gauge-container" style={{ margin: '20px 0' }}>
            <div className="gauge-ring">
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="50" className="gauge-bg" />
                <circle cx="60" cy="60" r="50" className="gauge-fill" stroke="var(--accent-cyan)" strokeDasharray="314" strokeDashoffset={314 * (1 - 0.78)} />
              </svg>
              <div className="gauge-value">78<span style={{ fontSize: '14px' }}>%</span></div>
            </div>
            <div className="gauge-label">Peak Usage</div>
          </div>
        </div>

        <div className="card animate-in stagger-6">
          <div className="card-header">
            <div className="card-title">
              <Network size={16} className="card-title-icon" />
              Subnet Anomalies
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Segments exhibiting deviating broadcast traffic</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--high-bg)', border: '1px solid var(--high-border)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--high)' }}>172.16.0.0/24</span>
              <span className="live-pulse" style={{ color: 'var(--high)' }}>Scanning</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--critical-bg)', border: '1px solid var(--critical-border)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--critical)' }}>10.0.1.0/24</span>
              <span className="live-pulse" style={{ color: 'var(--critical)' }}>Exfiltration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
