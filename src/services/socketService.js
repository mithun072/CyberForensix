import { useState, useEffect } from 'react';

const WS_URL = 'ws://localhost:8000/ws/events';
const REST_URL = 'http://localhost:8000';

export function useCyberTelemetry() {
  const [telemetry, setTelemetry] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [telemetryHistory, setTelemetryHistory] = useState([]);

  useEffect(() => {
    let ws = null;
    let reconnectTimer = null;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          setTelemetry(data);

          if (data.event) {
            setTelemetryHistory((prev) => [data.event, ...prev.slice(0, 49)]);

            if (data.event.severity === 'High' || data.event.severity === 'Critical') {
              setRecentAlerts((prev) => [data.event, ...prev.slice(0, 24)]);
            }
          }
        } catch (e) {
          console.error("Failed to parse telemetry message", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, []);

  return { telemetry, isConnected, recentAlerts, telemetryHistory };
}

export async function startAttackSimulation(scenario, intensity = 5, target = null) {
  try {
    const res = await fetch(`${REST_URL}/api/simulator/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, intensity, target })
    });
    return await res.json();
  } catch (e) {
    console.error("Error starting simulation", e);
    return { error: true };
  }
}

export async function stopAttackSimulation() {
  try {
    const res = await fetch(`${REST_URL}/api/simulator/stop`, { method: 'POST' });
    return await res.json();
  } catch (e) {
    console.error("Error stopping simulation", e);
    return { error: true };
  }
}

export async function unblockIp(ip) {
  try {
    const res = await fetch(`${REST_URL}/api/playbooks/unblock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: ip })
    });
    return await res.json();
  } catch (e) {
    return { error: true };
  }
}

export async function restoreHost(hostIp) {
  try {
    const res = await fetch(`${REST_URL}/api/playbooks/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: hostIp })
    });
    return await res.json();
  } catch (e) {
    return { error: true };
  }
}
