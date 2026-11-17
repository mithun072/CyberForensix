import { useState } from 'react';
import { FileText, Download, Printer, Calendar, FileBarChart, CheckCircle2, Eye, Clock, Sparkles, Share2 } from 'lucide-react';
import { reportTemplates } from '../data/mockData';

const historicReports = [
  { id: 'RPT-8091', name: 'Executive Incident Summary - Ransomware Event', date: '2026-04-27 10:14', format: 'PDF', size: '2.4 MB', author: 'SOC Lead Analyst' },
  { id: 'RPT-8090', name: 'ML Model Performance & Feature Weights Q2', date: '2026-04-26 18:30', format: 'JSON', size: '850 KB', author: 'System Auto-Export' },
  { id: 'RPT-8089', name: 'Forensic PCAP Exfiltration Analysis', date: '2026-04-25 14:00', format: 'PDF', size: '5.1 MB', author: 'J. Morrison' },
  { id: 'RPT-8088', name: 'Compliance Audit Trail - ISO27001 Annex A', date: '2026-04-20 09:15', format: 'CSV', size: '1.2 MB', author: 'Audit System' },
];

export default function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0]);
  const [timeRange, setTimeRange] = useState('24h');
  const [outputFormat, setOutputFormat] = useState('PDF');
  const [includeSections, setIncludeSections] = useState({
    executiveSummary: true,
    mlMetrics: true,
    timeline: true,
    evidenceManifest: true,
    mitreAttck: true,
  });

  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport({
        id: `RPT-${Math.floor(Math.random() * 1000 + 9000)}`,
        title: selectedTemplate.name,
        type: selectedTemplate.type,
        timeRange,
        format: outputFormat,
        generatedAt: new Date().toLocaleString(),
        summary: 'This forensic report synthesizes deep telemetry data, unsupervised isolation forest anomaly scores, live attack simulation records, and preserved chain-of-custody artifacts captured during the selected window.',
        keyMetrics: {
          totalEvents: '2,847,361',
          threatsIdentified: '1,893',
          isolationForestAccuracy: '97.3%',
          evidenceArtifacts: '4 Items Verified',
        }
      });
    }, 1200);
  };

  return (
    <div className="animate-in stagger-1">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Forensic Report Generator & Export Vault</h2>
          <p>Automated SOC executive summaries, compliance audits, and deep forensic telemetry exports</p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="card animate-in stagger-2" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title">
            <FileBarChart size={16} className="card-title-icon" />
            Select Forensic Report Template
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              style={{
                background: selectedTemplate.id === template.id ? 'rgba(99, 122, 255, 0.15)' : 'var(--bg-secondary)',
                border: selectedTemplate.id === template.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge blue">{template.type}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{template.lastGenerated}</span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {template.name}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Includes {template.fields} dynamic telemetry metrics & anomaly scores.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Generator Options */}
      <div className="card animate-in stagger-3" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={16} className="card-title-icon" />
            Customize Report Parameters for "{selectedTemplate.name}"
          </div>
        </div>

        <form onSubmit={handleGenerate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Time Scope
              </label>
              <select className="form-input" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={{ width: '100%' }}>
                <option value="1h">Last 1 Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days (Monthly Audit)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Export Format
              </label>
              <select className="form-input" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} style={{ width: '100%' }}>
                <option value="PDF">PDF (Executive Presentation)</option>
                <option value="JSON">JSON (Machine Readable Telemetry)</option>
                <option value="CSV">CSV (Raw Event Dump)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Included Data Sections
            </label>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px' }}>
              {Object.keys(includeSections).map((sec) => (
                <label key={sec} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeSections[sec]}
                    onChange={(e) => setIncludeSections({ ...includeSections, [sec]: e.target.checked })}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{sec.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isGenerating}>
            {isGenerating ? 'Compiling Forensic Telemetry...' : 'Generate Forensic Report'}
          </button>
        </form>
      </div>

      {/* Generated Report Result */}
      {generatedReport && (
        <div className="card animate-in stagger-4" style={{ marginBottom: '20px', border: '1px solid var(--accent-primary)' }}>
          <div className="card-header">
            <div className="card-title" style={{ color: 'var(--accent-primary)' }}>
              <CheckCircle2 size={18} className="card-title-icon" />
              Report Ready: {generatedReport.id} - {generatedReport.title}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={() => alert(`Downloading ${generatedReport.id}.${generatedReport.format.toLowerCase()}`)}>
                <Download size={14} style={{ marginRight: '6px' }} /> Download {generatedReport.format}
              </button>
              <button className="btn btn-secondary" onClick={() => alert('Printing report summary...')}>
                <Printer size={14} style={{ marginRight: '6px' }} /> Print
              </button>
            </div>
          </div>

          <div style={{ fontSize: '13px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p>{generatedReport.summary}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div><strong>Events Analysed:</strong> {generatedReport.keyMetrics.totalEvents}</div>
              <div><strong>Threats Identified:</strong> {generatedReport.keyMetrics.threatsIdentified}</div>
              <div><strong>ML Accuracy:</strong> {generatedReport.keyMetrics.isolationForestAccuracy}</div>
              <div><strong>Evidence State:</strong> {generatedReport.keyMetrics.evidenceArtifacts}</div>
            </div>
          </div>
        </div>
      )}

      {/* Historic Report Archive */}
      <div className="card animate-in stagger-4">
        <div className="card-header">
          <div className="card-title">
            <Clock size={16} className="card-title-icon" />
            Generated Report Archive
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Report Name</th>
              <th>Generated Date</th>
              <th>Format & Size</th>
              <th>Author / Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {historicReports.map((rpt) => (
              <tr key={rpt.id}>
                <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-primary)', fontWeight: 600 }}>{rpt.id}</td>
                <td style={{ fontWeight: 600 }}>{rpt.name}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-muted)' }}>{rpt.date}</td>
                <td>
                  <span className={`badge ${rpt.format === 'PDF' ? 'red' : rpt.format === 'JSON' ? 'blue' : 'emerald'}`}>{rpt.format}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px', fontFamily: 'JetBrains Mono' }}>{rpt.size}</span>
                </td>
                <td style={{ fontSize: '12px' }}>{rpt.author}</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => alert(`Downloading archive report ${rpt.id}`)}>
                    <Download size={12} style={{ marginRight: '4px' }} /> Export
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
