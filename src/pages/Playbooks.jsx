import { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, Server, AlertTriangle, 
  RefreshCw, CheckCircle2, XCircle, FileText, Zap 
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const MOCK_PLAYBOOKS = {
  blocked_ips: ['103.24.77.210', '45.33.32.156', '185.220.101.45'],
  isolated_hosts: ['192.168.1.45', '172.16.0.33'],
  playbook_logs: [
    { timestamp: '11:36:30', action: 'Auto-isolated WKS033 — lateral movement detected', status: 'success' },
    { timestamp: '11:35:12', action: 'Blocked outbound to 103.24.77.210 — exfiltration detected', status: 'success' },
    { timestamp: '11:32:01', action: 'DNS tunneling blocked — payload drop rule applied', status: 'success' },
    { timestamp: '11:30:44', action: 'RPC exploit blocked — privilege escalation attempt', status: 'success' },
    { timestamp: '11:28:12', action: 'SYN flood rate-limited on 192.168.3.200', status: 'warning' },
  ],
};

export default function Playbooks() {
  const { isRunning, playbookLog, simAlerts } = useSimulation();
  const [playbooks, setPlaybooks] = useState(MOCK_PLAYBOOKS);
  const [actionMessage, setActionMessage] = useState('');

  // Merge sim-generated blocked IPs into the list
  const simBlockedIps = [...new Set(simAlerts.map(a => a.source))].slice(0, 5);
  const allBlockedIps = isRunning
    ? [...new Set([...simBlockedIps, ...playbooks.blocked_ips])]
    : playbooks.blocked_ips;

  // Merge sim playbook log on top
  const allLogs = isRunning
    ? [...playbookLog, ...playbooks.playbook_logs].slice(0, 20)
    : playbooks.playbook_logs;

  const handleUnblock = (ip) => {
    setPlaybooks(prev => ({ ...prev, blocked_ips: prev.blocked_ips.filter(i => i !== ip) }));
    setActionMessage(`Analyst override: Unblocked IP ${ip}`);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const handleRestore = (hostIp) => {
    setPlaybooks(prev => ({ ...prev, isolated_hosts: prev.isolated_hosts.filter(h => h !== hostIp) }));
    setActionMessage(`Analyst override: Restored network connectivity to ${hostIp}`);
    setTimeout(() => setActionMessage(''), 4000);
  };

  return (
    <div className="animate-in stagger-1">
      <div className="page-header">
        <h2>Automated Incident Response &amp; Playbooks</h2>
        <p>Real-time autonomous containment rules, blocked source IPs, and isolated host management</p>
      </div>

      {/* Simulation active banner */}
      {isRunning && (
        <div style={{
          padding: '10px 16px', marginBottom: '16px', borderRadius: '8px',
          background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.3)',
          fontSize: '12px', color: 'var(--critical)', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Zap size={14} /> SIMULATION ACTIVE — automated responses firing in real-time below
        </div>
      )}

      {actionMessage && (
        <div className="animate-in" style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '6px', color: '#10b981', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {actionMessage}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-icon red"><Lock size={20} /></div>
          <div className="stat-card-value">{allBlockedIps.length}</div>
          <div className="stat-card-label">Active Blocked Source IPs</div>
          <div className="stat-card-trend down"><ShieldAlert size={12} /> Auto-firewall rules applied</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon cyan"><Server size={20} /></div>
          <div className="stat-card-value">{playbooks.isolated_hosts.length}</div>
          <div className="stat-card-label">Isolated Host Systems</div>
          <div className="stat-card-trend down"><AlertTriangle size={12} /> Isolated on VLAN 99</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon emerald"><ShieldCheck size={20} /></div>
          <div className="stat-card-value">{allLogs.length}</div>
          <div className="stat-card-label">Playbook Actions Fired</div>
          <div className="stat-card-trend up">Auto-response speed &lt; 500ms</div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        {/* Blocked IPs */}
        <div className="card animate-in stagger-2">
          <div className="card-header">
            <div className="card-title"><Lock size={16} className="card-title-icon" /> Active Firewall Blocked IPs</div>
            {isRunning && <span className="live-pulse">LIVE</span>}
          </div>
          {allBlockedIps.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>No IPs currently blocked.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Source IP</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {allBlockedIps.map(ip => (
                  <tr key={ip}>
                    <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--high)' }}>{ip}</td>
                    <td><span className="badge critical">FIREWALL BLOCKED</span></td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleUnblock(ip)} style={{ padding: '4px 10px', fontSize: '11px' }}>
                        Unblock IP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Isolated Hosts */}
        <div className="card animate-in stagger-3">
          <div className="card-header">
            <div className="card-title"><Server size={16} className="card-title-icon" /> Isolated Host Machines</div>
          </div>
          {playbooks.isolated_hosts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>No hosts currently isolated.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Host IP</th><th>VLAN State</th><th>Action</th></tr></thead>
              <tbody>
                {playbooks.isolated_hosts.map(host => (
                  <tr key={host}>
                    <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--accent-primary)' }}>{host}</td>
                    <td><span className="badge medium">QUARANTINED</span></td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleRestore(host)} style={{ padding: '4px 10px', fontSize: '11px' }}>
                        Re-integrate Host
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="card animate-in stagger-4">
        <div className="card-header">
          <div className="card-title"><FileText size={16} className="card-title-icon" /> Automated Playbook Audit Trail</div>
          {isRunning && <span className="live-pulse">LIVE</span>}
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Action Executed</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allLogs.map((log, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', fontSize: '11px' }}>{log.timestamp}</td>
                <td style={{ fontSize: '12px', fontWeight: 500 }}>{log.action}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: log.confidence > 90 ? 'var(--critical)' : 'var(--accent-primary)' }}>
                  {log.confidence ? `${log.confidence}%` : '—'}
                </td>
                <td>
                  <span className={`badge ${log.status === 'success' ? 'emerald' : 'medium'}`}>
                    {log.status === 'success' ? '✓ Executed' : '⚠ Warning'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
