import { createContext, useContext, useState, useRef, useCallback } from 'react';

/* ── Shared simulation context ──────────────────────────── */
const SimulationContext = createContext(null);

const randIp = () =>
  `${10 + Math.floor(Math.random() * 220)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${1 + Math.floor(Math.random() * 254)}`;

const SCENARIO_META = {
  ddos:         { type: 'DDoS Volumetric Flood',     protocol: 'UDP/TCP', features: ['High Packet Rate', 'SYN Flood Pattern', 'Bandwidth Exhaustion'] },
  brute_force:  { type: 'SSH Auth Brute Force',      protocol: 'TCP/SSH', features: ['Failed Auth Burst', 'Single Source Repeat', 'Port 22 Targeting'] },
  port_scan:    { type: 'Port Reconnaissance Scan',  protocol: 'TCP/SYN', features: ['Sequential Port Access', 'Low TTL', 'RST Response Pattern'] },
  sqli:         { type: 'SQL Injection Attack',       protocol: 'HTTP',    features: ['Payload Injection', 'WAF Score High', 'DB Error Response'] },
  exfiltration: { type: 'DNS Covert Exfiltration',   protocol: 'DNS',     features: ['High Entropy Query', 'TXT Record Abuse', 'Data Chunking'] },
  ransomware:   { type: 'Ransomware File Encryption', protocol: 'SMB',    features: ['High File Entropy', 'Mass Rename', 'Key Exchange Detected'] },
};

const RESPONSE_TEMPLATES = [
  (type, ip) => `Auto-isolated host ${ip} — ${type} detected`,
  (type, ip) => `Edge firewall block rule pushed: DROP src=${ip}`,
  (type, ip) => `PCAP capture initiated for ${ip} (256MB ring buffer)`,
  (type, ip) => `Threat Intel lookup queued: ${ip}`,
  (type, ip) => `Evidence snapshot preserved: EVD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
];

let globalEventId = 1;

export function SimulationProvider({ children }) {
  const [isRunning, setIsRunning]         = useState(false);
  const [scenarioId, setScenarioId]       = useState('ddos');
  const [intensity, setIntensity]         = useState(8);
  const [targetIp, setTargetIp]           = useState('');
  const [simAlerts, setSimAlerts]         = useState([]);   // feeds LiveAlerts
  const [playbookLog, setPlaybookLog]     = useState([]);   // feeds Playbooks
  const [stats, setStats]                 = useState({ packets: 0, blocked: 0, confidence: 0, elapsed: 0 });
  const [chartData, setChartData]         = useState([]);
  const [terminalLines, setTerminalLines] = useState([]);

  const intervalRef = useRef(null);
  const tickRef     = useRef(0);

  const start = useCallback((sid, intens, tgt) => {
    clearInterval(intervalRef.current);
    tickRef.current = 0;
    setSimAlerts([]);
    setPlaybookLog([]);
    setStats({ packets: 0, blocked: 0, confidence: 0, elapsed: 0 });
    setChartData([]);
    setTerminalLines([]);
    setScenarioId(sid);
    setIntensity(intens);
    setTargetIp(tgt);
    setIsRunning(true);

    const meta = SCENARIO_META[sid] || SCENARIO_META.ddos;

    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      const src = randIp();
      const conf = parseFloat(Math.min(99.5, 72 + t * 0.9 + Math.random() * 2.5).toFixed(1));
      const pkts = intens * (8 + Math.floor(Math.random() * 6));
      const blk  = Math.floor(pkts * (0.3 + Math.min(0.6, t * 0.025)));
      const ts   = new Date().toISOString();

      // Build alert compatible with LiveAlerts format
      const alert = {
        id:          `SIM-${String(globalEventId++).padStart(4, '0')}`,
        alertId:     `SIM-${String(globalEventId).padStart(4, '0')}`,
        timestamp:   ts,
        severity:    conf > 92 ? 'Critical' : conf > 82 ? 'High' : 'Medium',
        type:        meta.type,
        source:      src,
        destination: tgt,
        confidence:  conf,
        protocol:    meta.protocol,
        status:      'ACTIVE',
        mlModel:     'Isolation Forest v3.7',
        features:    meta.features,
        description: `[SIM T+${t}s] ${meta.type} from ${src} → ${tgt} | score=-0.${Math.floor(conf * 9)} | pkts=${pkts}`,
        log:         `[SIM T+${t}s] ${meta.type} from ${src} → ${tgt} | score=-0.${Math.floor(conf * 9)} | pkts=${pkts}`,
        isSimulated: true,
      };

      setSimAlerts(prev => [alert, ...prev].slice(0, 50));

      // Terminal line
      const logLine = `[T+${t}s] ${meta.type} | src=${src} dst=${tgt} | conf=${conf}% | pkts=${pkts} | blocked=${blk}`;
      setTerminalLines(prev => [...prev, { ts: ts.slice(11, 23), line: logLine, conf }].slice(-60));

      // Chart
      setChartData(prev => [...prev, { t: `T+${t}s`, anomaly: conf, threshold: 85 }].slice(-30));

      // Stats
      setStats(prev => ({
        packets:    prev.packets + pkts,
        blocked:    prev.blocked + blk,
        confidence: conf,
        elapsed:    t,
      }));

      // Playbook response — fire on high confidence events or every 5 ticks
      if (conf > 85 || t % 5 === 0) {
        const tmpl = RESPONSE_TEMPLATES[t % RESPONSE_TEMPLATES.length];
        setPlaybookLog(prev => [{
          timestamp: ts.slice(11, 19),
          action:    tmpl(meta.type, conf > 92 ? tgt : src),
          status:    conf > 90 ? 'success' : 'warning',
          confidence: conf,
          source:    src,
        }, ...prev].slice(0, 30));
      }
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  }, []);

  return (
    <SimulationContext.Provider value={{
      isRunning, scenarioId, intensity, targetIp,
      simAlerts, playbookLog, stats, chartData, terminalLines,
      start, stop,
      setScenarioId, setIntensity, setTargetIp,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  return useContext(SimulationContext);
}
