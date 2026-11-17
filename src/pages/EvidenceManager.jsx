import { useState } from 'react';
import { Fingerprint, HardDrive, ShieldCheck, Lock, Search, Plus, Hash, Download, Eye, Tag, FileText, CheckCircle } from 'lucide-react';
import { evidenceItems as initialEvidenceItems } from '../data/mockData';

export default function EvidenceManager() {
  const [evidenceList, setEvidenceList] = useState(initialEvidenceItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [verifiedHash, setVerifiedHash] = useState(null);

  // New Evidence Form State
  const [newArtifact, setNewArtifact] = useState({
    name: '',
    type: 'PCAP',
    size: '1.2 GB',
    analyst: 'Security Analyst',
    relatedAlert: 'ALT-007',
    tags: 'network, pcap',
  });

  const filteredEvidence = evidenceList.filter(item => {
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleVerifyHash = (item) => {
    setVerifiedHash(item.id);
    setTimeout(() => {
      setVerifiedHash(null);
    }, 3000);
  };

  const handleAddEvidence = (e) => {
    e.preventDefault();
    if (!newArtifact.name) return;

    const createdItem = {
      id: `EVD-00${evidenceList.length + 1}`,
      name: newArtifact.name,
      type: newArtifact.type,
      size: newArtifact.size,
      hash: `sha256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}...`,
      collectedAt: new Date().toISOString(),
      analyst: newArtifact.analyst,
      chainOfCustody: ['Manually Ingested', 'SHA-256 Calculated', 'Secured'],
      status: 'Preserved',
      relatedAlert: newArtifact.relatedAlert,
      tags: newArtifact.tags.split(',').map(t => t.trim()),
    };

    setEvidenceList([createdItem, ...evidenceList]);
    setShowAddModal(false);
    setNewArtifact({ name: '', type: 'PCAP', size: '1.2 GB', analyst: 'Security Analyst', relatedAlert: 'ALT-007', tags: 'network, pcap' });
  };

  return (
    <div className="animate-in stagger-1">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Digital Forensic Evidence Vault</h2>
          <p>Cryptographic evidence preservation, hash verification & chain of custody management</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Ingest Forensic Evidence
        </button>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon blue">
            <Fingerprint size={20} />
          </div>
          <div className="stat-card-value">{evidenceList.length}</div>
          <div className="stat-card-label">Preserved Artifacts</div>
          <div className="stat-card-trend up">Immutable Storage</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon cyan">
            <HardDrive size={20} />
          </div>
          <div className="stat-card-value">18.6 GB</div>
          <div className="stat-card-label">Total Vault Storage</div>
          <div className="stat-card-trend">Encrypted at Rest</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon emerald">
            <ShieldCheck size={20} />
          </div>
          <div className="stat-card-value">100%</div>
          <div className="stat-card-label">SHA-256 Hash Integrity</div>
          <div className="stat-card-trend up">0 Integrity Failures</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon red">
            <Lock size={20} />
          </div>
          <div className="stat-card-value">4</div>
          <div className="stat-card-label">Active Custody Locks</div>
          <div className="stat-card-trend">Court Admissible Legal Hold</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card animate-in stagger-2">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
          <div className="card-title">
            <FileText size={16} className="card-title-icon" />
            Evidence Items & Cryptographic Signatures
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Filter by Type */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'PCAP', 'Log File', 'Memory Image'].map((t) => (
                <button
                  key={t}
                  className={`btn ${selectedType === t ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                  onClick={() => setSelectedType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search ID, name, hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '30px', paddingRight: '10px', paddingTop: '4px', paddingBottom: '4px', fontSize: '12px', width: '200px' }}
              />
            </div>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Evidence ID</th>
              <th>Artifact Name</th>
              <th>Type & Size</th>
              <th>Cryptographic Hash (SHA-256)</th>
              <th>Collected At</th>
              <th>Analyst</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvidence.map((item) => (
              <tr key={item.id}>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  {item.id}
                </td>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardDrive size={14} color="var(--text-muted)" />
                    {item.name}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    {item.tags.map((tag) => (
                      <span key={tag} className="badge gray" style={{ fontSize: '9px', padding: '1px 5px' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className="badge blue">{item.type}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'JetBrains Mono' }}>
                    {item.size}
                  </div>
                </td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {item.hash}
                  {verifiedHash === item.id && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '8px', color: 'var(--accent-emerald)', fontSize: '11px' }}>
                      <CheckCircle size={12} /> Verified Match
                    </span>
                  )}
                </td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {new Date(item.collectedAt).toLocaleString()}
                </td>
                <td style={{ fontSize: '12px' }}>{item.analyst}</td>
                <td>
                  <span className={`badge ${item.status === 'Preserved' ? 'green' : 'yellow'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="Verify SHA-256 Hash"
                      onClick={() => handleVerifyHash(item)}
                    >
                      <Hash size={12} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="Inspect Chain of Custody"
                      onClick={() => setActiveEvidence(item)}
                    >
                      <Eye size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chain of Custody Inspector Modal */}
      {activeEvidence && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '600px', maxWidth: '90vw', padding: '24px' }}>
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <div className="card-title" style={{ fontSize: '16px' }}>
                <Fingerprint size={18} className="card-title-icon" />
                Chain of Custody — {activeEvidence.id} ({activeEvidence.name})
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <strong>Cryptographic Hash:</strong>
                <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontFamily: 'JetBrains Mono', fontSize: '12px', marginTop: '4px', wordBreak: 'break-all' }}>
                  {activeEvidence.hash}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>Artifact Size:</strong> {activeEvidence.size}</div>
                <div><strong>Associated Alert:</strong> {activeEvidence.relatedAlert}</div>
                <div><strong>Primary Custodian:</strong> {activeEvidence.analyst}</div>
                <div><strong>Preservation Status:</strong> <span className="badge green">{activeEvidence.status}</span></div>
              </div>

              <div>
                <strong>Chain of Custody Audit Trail:</strong>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeEvidence.chainOfCustody.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <span className="badge blue" style={{ fontSize: '10px' }}>Step {idx + 1}</span>
                      <span style={{ fontWeight: 500 }}>{step}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => alert(`Downloading manifest for ${activeEvidence.id}`)}>
                <Download size={14} style={{ marginRight: '6px' }} /> Download Vault Manifest
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveEvidence(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Evidence Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90vw', padding: '24px' }}>
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <div className="card-title" style={{ fontSize: '16px' }}>
                <Plus size={18} className="card-title-icon" />
                Ingest New Forensic Evidence Artifact
              </div>
            </div>

            <form onSubmit={handleAddEvidence} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>Artifact Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Memory_Dump_WKS099.raw"
                  value={newArtifact.name}
                  onChange={(e) => setNewArtifact({ ...newArtifact, name: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>Artifact Type</label>
                  <select
                    className="form-input"
                    value={newArtifact.type}
                    onChange={(e) => setNewArtifact({ ...newArtifact, type: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="PCAP">PCAP Network Capture</option>
                    <option value="Log File">System Log File</option>
                    <option value="Memory Image">RAM / Memory Dump</option>
                    <option value="Disk Artifact">Disk / EnCase File</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>Estimated Size</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 500 MB"
                    value={newArtifact.size}
                    onChange={(e) => setNewArtifact({ ...newArtifact, size: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>Lead Analyst</label>
                <input
                  type="text"
                  className="form-input"
                  value={newArtifact.analyst}
                  onChange={(e) => setNewArtifact({ ...newArtifact, analyst: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newArtifact.tags}
                  onChange={(e) => setNewArtifact({ ...newArtifact, tags: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Lock & Preserved in Vault</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
