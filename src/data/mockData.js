// ============================================================
// CyberForensix — Mock Data for Adaptive ML Forensic Analysis
// ============================================================

export const threatLevels = ['Critical', 'High', 'Medium', 'Low', 'Info'];

export const threatColors = {
  Critical: '#ff2d55',
  High: '#ff6b35',
  Medium: '#ffcc00',
  Low: '#34c759',
  Info: '#5ac8fa',
};

export const modelMetrics = {
  accuracy: 97.3,
  precision: 96.8,
  recall: 95.2,
  f1Score: 96.0,
  falsePositiveRate: 2.1,
  falseNegativeRate: 3.4,
  auc: 0.987,
  trainingTime: '2.4s',
  lastTrained: '2 min ago',
  modelVersion: 'v3.7.1',
  adaptations: 147,
  dataPointsProcessed: 2847361,
};

export const modelPerformanceHistory = [
  { time: '00:00', accuracy: 94.2, precision: 93.1, recall: 92.8, f1: 92.9 },
  { time: '04:00', accuracy: 94.8, precision: 93.9, recall: 93.2, f1: 93.5 },
  { time: '08:00', accuracy: 95.1, precision: 94.3, recall: 93.8, f1: 94.0 },
  { time: '12:00', accuracy: 95.7, precision: 95.1, recall: 94.2, f1: 94.6 },
  { time: '16:00', accuracy: 96.3, precision: 95.8, recall: 94.9, f1: 95.3 },
  { time: '20:00', accuracy: 96.9, precision: 96.4, recall: 95.0, f1: 95.7 },
  { time: 'Now', accuracy: 97.3, precision: 96.8, recall: 95.2, f1: 96.0 },
];

export const confusionMatrix = {
  truePositive: 4821,
  falsePositive: 103,
  trueNegative: 9847,
  falseNegative: 167,
};

export const anomalyTypes = [
  { name: 'Port Scanning', count: 342, severity: 'Medium' },
  { name: 'Brute Force', count: 189, severity: 'High' },
  { name: 'Data Exfiltration', count: 67, severity: 'Critical' },
  { name: 'Privilege Escalation', count: 145, severity: 'High' },
  { name: 'DNS Tunneling', count: 93, severity: 'Medium' },
  { name: 'Lateral Movement', count: 78, severity: 'Critical' },
  { name: 'C2 Communication', count: 56, severity: 'Critical' },
  { name: 'Credential Stuffing', count: 234, severity: 'High' },
];

export const networkTrafficData = Array.from({ length: 60 }, (_, i) => ({
  time: `${i}s`,
  inbound: Math.floor(Math.random() * 500 + 200),
  outbound: Math.floor(Math.random() * 400 + 150),
  malicious: Math.floor(Math.random() * 30),
  blocked: Math.floor(Math.random() * 20),
}));

export const liveAlerts = [
  {
    id: 'ALT-001',
    timestamp: '2026-04-27T11:35:12Z',
    type: 'Data Exfiltration',
    severity: 'Critical',
    source: '192.168.1.45',
    destination: '103.24.77.210',
    protocol: 'HTTPS',
    confidence: 98.7,
    status: 'Active',
    description: 'Unusual outbound data transfer detected. 2.3GB transferred to external IP in 4 minutes.',
    mlModel: 'Ensemble-v3.7',
    features: ['Volume Spike', 'Off-hours Activity', 'Unknown Destination', 'Encrypted Channel'],
  },
  {
    id: 'ALT-002',
    timestamp: '2026-04-27T11:34:28Z',
    type: 'Brute Force',
    severity: 'High',
    source: '10.0.0.87',
    destination: '10.0.0.5',
    protocol: 'SSH',
    confidence: 94.2,
    status: 'Active',
    description: '847 failed SSH login attempts from internal host targeting domain controller.',
    mlModel: 'RF-Classifier-v2.1',
    features: ['Rapid Attempts', 'Internal Source', 'DC Target', 'Pattern Match'],
  },
  {
    id: 'ALT-003',
    timestamp: '2026-04-27T11:33:55Z',
    type: 'Lateral Movement',
    severity: 'Critical',
    source: '172.16.0.33',
    destination: '172.16.0.50-60',
    protocol: 'SMB',
    confidence: 96.1,
    status: 'Investigating',
    description: 'Compromised workstation attempting SMB connections to multiple servers using admin credentials.',
    mlModel: 'LSTM-Seq-v1.4',
    features: ['Credential Reuse', 'Multi-target', 'Admin Access', 'Off-baseline'],
  },
  {
    id: 'ALT-004',
    timestamp: '2026-04-27T11:32:01Z',
    type: 'C2 Communication',
    severity: 'Critical',
    source: '192.168.2.101',
    destination: '45.33.32.156',
    protocol: 'DNS',
    confidence: 91.8,
    status: 'Active',
    description: 'DNS tunneling detected — encoded payload in TXT record queries at 300 req/min.',
    mlModel: 'Autoencoder-v2.8',
    features: ['DNS Anomaly', 'Encoded Payload', 'High Frequency', 'Known C2 Pattern'],
  },
  {
    id: 'ALT-005',
    timestamp: '2026-04-27T11:30:44Z',
    type: 'Privilege Escalation',
    severity: 'High',
    source: '10.0.1.22',
    destination: '10.0.1.1',
    protocol: 'RPC',
    confidence: 89.3,
    status: 'Contained',
    description: 'Service account attempting to escalate to domain admin via RPC exploit.',
    mlModel: 'GBM-Detector-v3.2',
    features: ['Role Anomaly', 'Exploit Signature', 'Service Account', 'After Hours'],
  },
  {
    id: 'ALT-006',
    timestamp: '2026-04-27T11:28:12Z',
    type: 'Port Scanning',
    severity: 'Medium',
    source: '192.168.3.200',
    destination: '192.168.3.0/24',
    protocol: 'TCP',
    confidence: 87.5,
    status: 'Monitoring',
    description: 'Sequential TCP SYN scan across subnet — 1024 ports per host.',
    mlModel: 'Ensemble-v3.7',
    features: ['Sequential Pattern', 'Subnet Sweep', 'SYN-only', 'Rapid Succession'],
  },
];

export const evidenceItems = [
  {
    id: 'EVD-001',
    name: 'Network Capture - Exfiltration',
    type: 'PCAP',
    size: '2.4 GB',
    hash: 'sha256:a1b2c3d4e5f6...',
    collectedAt: '2026-04-27T11:35:30Z',
    analyst: 'System (Auto)',
    chainOfCustody: ['Auto-Collected', 'Verified', 'Secured'],
    status: 'Preserved',
    relatedAlert: 'ALT-001',
    tags: ['exfiltration', 'network', 'critical'],
  },
  {
    id: 'EVD-002',
    name: 'SSH Auth Logs',
    type: 'Log File',
    size: '45 MB',
    hash: 'sha256:f6e5d4c3b2a1...',
    collectedAt: '2026-04-27T11:34:45Z',
    analyst: 'System (Auto)',
    chainOfCustody: ['Auto-Collected', 'Verified'],
    status: 'Under Analysis',
    relatedAlert: 'ALT-002',
    tags: ['brute-force', 'ssh', 'authentication'],
  },
  {
    id: 'EVD-003',
    name: 'Memory Dump - WKS033',
    type: 'Memory Image',
    size: '16 GB',
    hash: 'sha256:1a2b3c4d5e6f...',
    collectedAt: '2026-04-27T11:34:00Z',
    analyst: 'J. Morrison',
    chainOfCustody: ['Manually Collected', 'Hashed', 'Verified', 'Secured'],
    status: 'Preserved',
    relatedAlert: 'ALT-003',
    tags: ['memory', 'lateral-movement', 'malware'],
  },
  {
    id: 'EVD-004',
    name: 'DNS Query Logs',
    type: 'Log File',
    size: '120 MB',
    hash: 'sha256:9f8e7d6c5b4a...',
    collectedAt: '2026-04-27T11:32:15Z',
    analyst: 'System (Auto)',
    chainOfCustody: ['Auto-Collected', 'Verified', 'Secured'],
    status: 'Analyzed',
    relatedAlert: 'ALT-004',
    tags: ['dns', 'c2', 'tunneling'],
  },
];

export const timelineEvents = [
  { time: '11:15:00', event: 'Initial compromise detected on WKS033', severity: 'Critical', category: 'Detection' },
  { time: '11:18:23', event: 'Malware payload downloaded via HTTP', severity: 'Critical', category: 'Execution' },
  { time: '11:20:45', event: 'Persistence mechanism installed (registry key)', severity: 'High', category: 'Persistence' },
  { time: '11:22:01', event: 'Credential harvesting from memory (Mimikatz)', severity: 'Critical', category: 'Credential Access' },
  { time: '11:24:30', event: 'Lateral movement to SRV-DB01 via SMB', severity: 'Critical', category: 'Lateral Movement' },
  { time: '11:26:15', event: 'Privilege escalation to Domain Admin', severity: 'Critical', category: 'Priv Escalation' },
  { time: '11:28:00', event: 'Reconnaissance scan of 192.168.3.0/24', severity: 'Medium', category: 'Discovery' },
  { time: '11:30:12', event: 'C2 channel established via DNS tunneling', severity: 'Critical', category: 'Command & Control' },
  { time: '11:32:44', event: 'Database export initiated on SRV-DB01', severity: 'High', category: 'Collection' },
  { time: '11:35:00', event: 'Data exfiltration — 2.3GB to external IP', severity: 'Critical', category: 'Exfiltration' },
  { time: '11:36:30', event: 'ML model triggered auto-containment', severity: 'Info', category: 'Response' },
  { time: '11:37:00', event: 'Network segment isolated', severity: 'Info', category: 'Response' },
];

export const logEntries = [
  { timestamp: '11:35:12.847', level: 'CRITICAL', source: 'ML-Engine', message: '[Ensemble-v3.7] Data exfiltration detected — confidence 98.7% — src:192.168.1.45 dst:103.24.77.210' },
  { timestamp: '11:35:12.001', level: 'WARNING', source: 'NetFlow', message: 'Outbound traffic spike: 2.3GB in 4min from 192.168.1.45 — exceeds baseline by 4700%' },
  { timestamp: '11:34:28.392', level: 'ERROR', source: 'Auth-Monitor', message: '847 failed SSH attempts from 10.0.0.87 in 120s — brute force threshold exceeded' },
  { timestamp: '11:34:00.115', level: 'CRITICAL', source: 'ML-Engine', message: '[LSTM-Seq-v1.4] Lateral movement pattern — SMB credential reuse across 10 hosts' },
  { timestamp: '11:33:55.203', level: 'WARNING', source: 'AD-Monitor', message: 'Admin credential used from non-admin workstation WKS033' },
  { timestamp: '11:32:01.776', level: 'CRITICAL', source: 'ML-Engine', message: '[Autoencoder-v2.8] DNS tunneling — encoded payloads in TXT queries to 45.33.32.156' },
  { timestamp: '11:31:44.890', level: 'INFO', source: 'Firewall', message: 'Rule #4471 triggered: blocked outbound to 185.220.101.0/24 (known C2 range)' },
  { timestamp: '11:30:44.102', level: 'WARNING', source: 'ML-Engine', message: '[GBM-v3.2] Privilege escalation attempt — service account → domain admin via RPC' },
  { timestamp: '11:28:12.554', level: 'INFO', source: 'IDS', message: 'Sequential SYN scan detected from 192.168.3.200 targeting full subnet' },
  { timestamp: '11:26:33.001', level: 'INFO', source: 'SIEM', message: 'Correlation rule matched: credential theft + lateral movement + data access' },
  { timestamp: '11:25:00.332', level: 'DEBUG', source: 'ML-Engine', message: 'Model adaptation #147 applied — updated feature weights for DNS anomaly detection' },
  { timestamp: '11:24:15.887', level: 'INFO', source: 'Endpoint', message: 'Suspicious process: powershell.exe -enc [BASE64] on WKS033 — flagged by heuristic engine' },
];

export const featureImportance = [
  { feature: 'Packet Size Distribution', importance: 0.92, delta: '+0.03' },
  { feature: 'Request Frequency', importance: 0.89, delta: '+0.01' },
  { feature: 'Destination Entropy', importance: 0.87, delta: '-0.02' },
  { feature: 'Protocol Anomaly Score', importance: 0.85, delta: '+0.05' },
  { feature: 'Time-of-Day Factor', importance: 0.82, delta: '0.00' },
  { feature: 'Payload Entropy', importance: 0.79, delta: '+0.04' },
  { feature: 'Connection Duration', importance: 0.76, delta: '-0.01' },
  { feature: 'Source Reputation', importance: 0.74, delta: '+0.02' },
  { feature: 'Geo-anomaly Score', importance: 0.71, delta: '+0.06' },
  { feature: 'Session Behavior', importance: 0.68, delta: '-0.03' },
];

export const attackVectors = [
  { name: 'Phishing', value: 34, color: '#ff6b35' },
  { name: 'Exploit Kit', value: 22, color: '#ff2d55' },
  { name: 'Insider Threat', value: 15, color: '#af52de' },
  { name: 'Brute Force', value: 12, color: '#ffcc00' },
  { name: 'Supply Chain', value: 9, color: '#5ac8fa' },
  { name: 'Zero-Day', value: 5, color: '#ff375f' },
  { name: 'Social Eng.', value: 3, color: '#34c759' },
];

export const geoData = [
  { country: 'China', attacks: 1247, blocked: 1198 },
  { country: 'Russia', attacks: 892, blocked: 834 },
  { country: 'USA', attacks: 567, blocked: 445 },
  { country: 'Iran', attacks: 423, blocked: 410 },
  { country: 'N. Korea', attacks: 312, blocked: 308 },
  { country: 'Brazil', attacks: 234, blocked: 198 },
  { country: 'India', attacks: 189, blocked: 156 },
  { country: 'Vietnam', attacks: 145, blocked: 130 },
];

export const systemHealth = {
  cpu: 34,
  memory: 67,
  disk: 45,
  network: 78,
  gpuUtil: 82,
  modelLatency: 12,
  throughput: 24500,
  uptime: '99.97%',
  nodesOnline: 8,
  nodesTotal: 8,
};

export const dashboardStats = {
  totalEvents: 2847361,
  threatsDetected: 1893,
  activeIncidents: 4,
  modelAccuracy: 97.3,
  avgResponseTime: 12,
  dataProcessed: '47.3 TB',
  alertsToday: 156,
  blockedThreats: 1742,
};

export const trainingHistory = [
  { epoch: 1, loss: 0.682, valLoss: 0.701, accuracy: 58.2, valAccuracy: 55.1 },
  { epoch: 5, loss: 0.423, valLoss: 0.458, accuracy: 78.4, valAccuracy: 75.2 },
  { epoch: 10, loss: 0.287, valLoss: 0.312, accuracy: 86.7, valAccuracy: 84.1 },
  { epoch: 15, loss: 0.198, valLoss: 0.234, accuracy: 91.2, valAccuracy: 89.3 },
  { epoch: 20, loss: 0.142, valLoss: 0.178, accuracy: 93.8, valAccuracy: 92.1 },
  { epoch: 25, loss: 0.098, valLoss: 0.134, accuracy: 95.4, valAccuracy: 93.7 },
  { epoch: 30, loss: 0.067, valLoss: 0.098, accuracy: 96.7, valAccuracy: 95.0 },
  { epoch: 35, loss: 0.045, valLoss: 0.072, accuracy: 97.3, valAccuracy: 95.2 },
];

export const reportTemplates = [
  { id: 1, name: 'Incident Summary Report', type: 'Incident', fields: 12, lastGenerated: '2 hours ago' },
  { id: 2, name: 'Forensic Analysis Report', type: 'Forensic', fields: 24, lastGenerated: '1 day ago' },
  { id: 3, name: 'Threat Intelligence Brief', type: 'Intel', fields: 8, lastGenerated: '4 hours ago' },
  { id: 4, name: 'ML Model Performance Report', type: 'Analytics', fields: 18, lastGenerated: '30 min ago' },
  { id: 5, name: 'Compliance Audit Trail', type: 'Compliance', fields: 15, lastGenerated: '1 week ago' },
  { id: 6, name: 'Chain of Custody Report', type: 'Evidence', fields: 10, lastGenerated: '3 hours ago' },
];
