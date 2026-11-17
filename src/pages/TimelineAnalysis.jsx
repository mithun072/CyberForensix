import { useState } from 'react';
import { Clock, Download, PlayCircle, Eye, GitCommit, Search } from 'lucide-react';
import { timelineEvents, evidenceItems } from '../data/mockData';

export default function TimelineAnalysis() {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="animate-in stagger-1">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Incident Timeline & Evidence</h2>
          <p>Chronological reconstruction and digital chain of custody</p>
        </div>
        <button className="btn btn-primary"><Download size={16} /> Export Dossier</button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
          <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Chronological View
        </button>
        <button className={`tab ${activeTab === 'evidence' ? 'active' : ''}`} onClick={() => setActiveTab('evidence')}>
          <GitCommit size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Chain of Custody
        </button>
      </div>

      {activeTab === 'timeline' && (
        <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="card animate-in stagger-2">
            <div className="card-header">
              <div className="card-title">
                <Clock size={16} className="card-title-icon" />
                Attack Reconstruction — Incident INC-2026-04
              </div>
              <div className="card-action"><PlayCircle size={14} /> Replay Attack</div>
            </div>
            
            <div className="timeline" style={{ marginTop: '20px' }}>
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className={`timeline-item ${evt.severity.toLowerCase()}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="timeline-time">{evt.time}</div>
                    <div className="timeline-category">{evt.category}</div>
                  </div>
                  <div className="timeline-event">{evt.event}</div>
                  
                  {evt.severity === 'Critical' && (
                    <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>
                      [ML_CORRELATION_ENGINE] Connected to MITRE ATT&CK tactic: {evt.category.toUpperCase()}
                      <br/>Confidence Score: {(Math.random() * 5 + 94).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card animate-in stagger-3" style={{ height: 'fit-content' }}>
            <div className="card-header">
              <div className="card-title">
                <Search size={16} className="card-title-icon" />
                Linked Evidence
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {evidenceItems.slice(0, 3).map((item) => (
                <div key={item.id} className="evidence-card" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>{item.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--accent-primary)', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>{item.hash.substring(0,20)}...</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="tag">{item.type}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}><Eye size={12} style={{ display:'inline', verticalAlign:'middle' }}/> View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="card animate-in stagger-2">
          <table className="data-table">
            <thead>
              <tr>
                <th>Evidence ID</th>
                <th>Asset / Artifact Name</th>
                <th>Type / Size</th>
                <th>Cryptographic Hash (SHA-256)</th>
                <th>Status</th>
                <th>Chain of Custody</th>
              </tr>
            </thead>
            <tbody>
              {evidenceItems.map(item => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--accent-primary)' }}>{item.id}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>
                    {item.type}<br/>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.size}</span>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-secondary)' }}>{item.hash}</td>
                  <td>
                    <span className={`badge ${item.status === 'Preserved' ? 'low' : 'info'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="evidence-chain">
                      {item.chainOfCustody.map((step, idx) => (
                        <span key={idx} className="chain-step">{step}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
