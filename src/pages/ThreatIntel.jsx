import { useState } from 'react';
import { Globe, ShieldAlert, Crosshair, Radar, Search, ExternalLink, Activity, Database, AlertCircle, Radio, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { geoData } from '../data/mockData';

const threatActors = [
  { id: 'APT29', name: 'Cozy Bear (APT29)', origin: 'Russia / State-Sponsored', targets: 'Government, Defense, Energy', primaryTTPs: 'Spearphishing, Supply Chain, SolarWinds DLL', severity: 'Critical' },
  { id: 'APT38', name: 'Lazarus Group (APT38)', origin: 'N. Korea / State-Sponsored', targets: 'Financial, Crypto Exchanges, SWIFT', primaryTTPs: 'Custom Backdoors, AppleJeus, Ransomware', severity: 'Critical' },
  { id: 'APT28', name: 'Fancy Bear (APT28)', origin: 'Russia / GRU Unit 26165', targets: 'Elections, NATO, Media, Aerospace', primaryTTPs: 'Zero-day Exploitation, X-Agent malware', severity: 'High' },
  { id: 'FIN7', name: 'Carbanak / FIN7', origin: 'Eastern Europe / Cybercrime', targets: 'Retail, Hospitality, POS Systems', primaryTTPs: 'Grip malware, POS Memory Scrapers, BadUSB', severity: 'High' },
];

export default function ThreatIntel() {
  const [iocSearch, setIocSearch] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  const handleIocLookup = (e) => {
    e.preventDefault();
    if (!iocSearch.trim()) return;

    // Simulate IOC lookup database result
    const query = iocSearch.trim();
    const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(query);

    setLookupResult({
      query,
      type: isIp ? 'IPv4 Address' : query.includes('.') ? 'Domain / FQDN' : 'File Hash (SHA-256)',
      reputationScore: Math.floor(Math.random() * 40 + 60), // 60 to 100 risk score
      riskLevel: 'Critical Malicious',
      asn: 'AS4134 China Telecom / Host Provider',
      geo: 'Beijing, CN',
      malwareFamily: 'Mirai Botnet / Cobalt Strike C2',
      lastSeen: '12 minutes ago',
      associatedIOCs: ['45.33.32.156', 'exfil-data.darknet.ru', 'b3f8a9...c421'],
    });
  };

  return (
    <div className="animate-in stagger-1">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Global Threat Intelligence & Geo Attribution</h2>
          <p>Real-time IOC feeds, adversary TTP mapping & external threat feeds integration</p>
        </div>
        <span className="badge green" style={{ padding: '6px 12px', fontSize: '12px' }}>
          <Radio size={14} style={{ marginRight: '6px' }} />
          Live Threat Feed: Synced
        </span>
      </div>

      {/* Top Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon red">
            <Globe size={20} />
          </div>
          <div className="stat-card-value">4,047</div>
          <div className="stat-card-label">Blocked Malicious IPs</div>
          <div className="stat-card-trend down">Updated 1m ago</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon cyan">
            <Radar size={20} />
          </div>
          <div className="stat-card-value">124</div>
          <div className="stat-card-label">Active C2 Channels Tracked</div>
          <div className="stat-card-trend">Global Network Radar</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon blue">
            <Crosshair size={20} />
          </div>
          <div className="stat-card-value">14 Threat Actors</div>
          <div className="stat-card-label">Tracked APT Groups</div>
          <div className="stat-card-trend">MITRE ATT&CK Mapped</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon emerald">
            <Database size={20} />
          </div>
          <div className="stat-card-value">99.4%</div>
          <div className="stat-card-label">Feed Reputation Confidence</div>
          <div className="stat-card-trend up">Multi-source Verified</div>
        </div>
      </div>

      {/* IOC Search Bar */}
      <div className="card animate-in stagger-2" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title">
            <Search size={16} className="card-title-icon" />
            Indicator of Compromise (IOC) Intelligence Lookup
          </div>
        </div>
        <form onSubmit={handleIocLookup} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Enter IP (e.g. 45.33.32.156), Domain (e.g. mal-site.com), or Hash..."
            value={iocSearch}
            onChange={(e) => setIocSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Query Threat Intel DB
          </button>
        </form>

        {lookupResult && (
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--critical-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px', fontFamily: 'JetBrains Mono', color: 'var(--critical)' }}>
                {lookupResult.query}
              </span>
              <span className="badge critical">{lookupResult.riskLevel} (Risk Score: {lookupResult.reputationScore}/100)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
              <div><strong>Query Type:</strong> {lookupResult.type}</div>
              <div><strong>ASN / Provider:</strong> {lookupResult.asn}</div>
              <div><strong>Geolocation:</strong> {lookupResult.geo}</div>
              <div><strong>Malware Classification:</strong> {lookupResult.malwareFamily}</div>
            </div>
          </div>
        )}
      </div>

      {/* Grid for Geo Distribution & Threat Actors */}
      <div className="dashboard-grid">
        {/* Geo Distribution */}
        <div className="card animate-in stagger-3">
          <div className="card-header">
            <div className="card-title">
              <Globe size={16} className="card-title-icon" />
              Attack Origin Geo-Distribution
            </div>
            <div className="card-action">Top Origin Countries</div>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="country" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)' }} />
                <Bar dataKey="attacks" fill="var(--critical)" radius={[0, 4, 4, 0]} barSize={14} name="Total Attacks" />
                <Bar dataKey="blocked" fill="var(--accent-emerald)" radius={[0, 4, 4, 0]} barSize={14} name="Blocked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Actor Profiles */}
        <div className="card animate-in stagger-4">
          <div className="card-header">
            <div className="card-title">
              <Crosshair size={16} className="card-title-icon" />
              Tracked Threat Actor Groups (APTs)
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '280px' }}>
            {threatActors.map((actor) => (
              <div key={actor.id} style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{actor.name}</span>
                  <span className={`badge ${actor.severity.toLowerCase()}`}>{actor.severity}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <strong>Origin:</strong> {actor.origin} | <strong>Targets:</strong> {actor.targets}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
                  <strong>Key TTPs:</strong> {actor.primaryTTPs}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
