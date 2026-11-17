import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Bell, Maximize2, Minimize2, Moon, Sun, X, ShieldAlert, Activity, Network, Clock } from 'lucide-react';

const pageNames = {
  dashboard: 'Dashboard',
  simulator: 'Attack Simulator Lab',
  alerts: 'Live Alerts',
  playbooks: 'Automated Response & Playbooks',
  'ml-model': 'ML Model Monitor',
  anomaly: 'Anomaly Detection',
  network: 'Network Forensics',
  evidence: 'Evidence Manager',
  timeline: 'Timeline Analysis',
  logs: 'Log Analyzer',
  'threat-intel': 'Threat Intelligence',
  reports: 'Reports',
  settings: 'Settings',
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: ShieldAlert,
    color: 'var(--critical)',
    title: 'Critical: Data Exfiltration Detected',
    desc: '2.3GB outbound to 103.24.77.210 — ML confidence 98.7%',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    icon: ShieldAlert,
    color: 'var(--high)',
    title: 'High: Brute Force on SSH',
    desc: '847 failed attempts from 10.0.0.87 in 120 seconds',
    time: '5 min ago',
    unread: true,
  },
  {
    id: 3,
    icon: Network,
    color: 'var(--critical)',
    title: 'Critical: Lateral Movement Confirmed',
    desc: 'SMB credential reuse across 10 internal hosts',
    time: '9 min ago',
    unread: true,
  },
  {
    id: 4,
    icon: Activity,
    color: 'var(--accent-primary)',
    title: 'ML Model Adapted — #147',
    desc: 'DNS anomaly feature weights updated in real time',
    time: '18 min ago',
    unread: true,
  },
  {
    id: 5,
    icon: Clock,
    color: 'var(--text-muted)',
    title: 'Evidence Auto-collected',
    desc: 'EVD-004 DNS query logs preserved and hashed',
    time: '22 min ago',
    unread: false,
  },
];

export default function Header({ activePage, isDark, onThemeToggle, searchQuery, onSearchChange }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  // For portal positioning — track bell button position
  const bellRef = useRef(null);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });

  const unreadCount = notifications.filter(n => n.unread).length;

  // Recalculate panel position when opened
  useEffect(() => {
    if (showNotifications && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setPanelPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showNotifications]);

  // Fullscreen toggle
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Sync icon if user presses Esc to exit fullscreen
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Close notification panel on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handler = (e) => {
      if (bellRef.current && bellRef.current.contains(e.target)) return;
      // Check if clicked inside the portal panel
      const panel = document.getElementById('notif-portal-panel');
      if (panel && panel.contains(e.target)) return;
      setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotifications]);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const dismissNotif = (id) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  // Notification dropdown rendered in a Portal so it's never clipped by header
  const NotifPortal = showNotifications
    ? createPortal(
        <div
          id="notif-portal-panel"
          style={{
            position: 'fixed',
            top: panelPos.top,
            right: panelPos.right,
            width: '360px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'fadeInUp 0.18s ease',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '8px', background: 'var(--critical)', color: '#fff',
                  fontSize: '10px', fontWeight: 700, padding: '2px 7px',
                  borderRadius: '10px',
                }}>{unreadCount}</span>
              )}
            </span>
            <button
              onClick={markAllRead}
              style={{
                fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Mark all read
            </button>
          </div>

          {/* List */}
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {notifications.length === 0 && (
              <div style={{
                padding: '32px', textAlign: 'center',
                color: 'var(--text-muted)', fontSize: '13px',
              }}>
                All caught up — no notifications
              </div>
            )}
            {notifications.map(notif => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '13px 16px', borderBottom: '1px solid var(--border-subtle)',
                    background: notif.unread ? 'rgba(99,122,255,0.05)' : 'transparent',
                    position: 'relative', transition: 'background 150ms',
                  }}
                >
                  {/* Unread indicator bar */}
                  {notif.unread && (
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: '3px', background: 'var(--accent-primary)',
                      borderRadius: '0 3px 3px 0',
                    }} />
                  )}

                  {/* Icon */}
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${notif.color}1a`, border: `1px solid ${notif.color}40`,
                  }}>
                    <Icon size={14} style={{ color: notif.color }} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)',
                      marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{notif.title}</div>
                    <div style={{
                      fontSize: '11px', color: 'var(--text-secondary)',
                      lineHeight: 1.4, marginBottom: '4px',
                    }}>{notif.desc}</div>
                    <div style={{
                      fontSize: '10px', color: 'var(--text-muted)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>{notif.time}</div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => dismissNotif(notif.id)}
                    title="Dismiss"
                    style={{
                      width: '22px', height: '22px', borderRadius: '4px',
                      background: 'none', border: '1px solid transparent',
                      color: 'var(--text-muted)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--critical-bg)';
                      e.currentTarget.style.borderColor = 'var(--critical-border)';
                      e.currentTarget.style.color = 'var(--critical)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <header className="header" id="main-header">
        {/* Breadcrumb */}
        <div className="header-left">
          <div className="header-breadcrumb">
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>CyberForensix</span>
            <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>/</span>
            <span className="header-breadcrumb-current">{pageNames[activePage] || 'Dashboard'}</span>
          </div>
        </div>

        <div className="header-right">
          {/* Threat Level */}
          <div className="threat-level-indicator critical" id="threat-level-badge">
            <span className="pulse-icon" />
            Threat Level: Elevated
          </div>

          {/* Search */}
          <div className="header-search">
            <Search size={14} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search type, IP, protocol…"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute', right: '10px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', padding: 0,
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Bell */}
          <button
            ref={bellRef}
            className="header-btn"
            title="Notifications"
            onClick={() => setShowNotifications(v => !v)}
            style={{ borderColor: showNotifications ? 'var(--accent-primary)' : '' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="header-btn-badge">{unreadCount}</span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            className="header-btn"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onClick={onThemeToggle}
            style={{ borderColor: !isDark ? 'var(--accent-primary)' : '' }}
          >
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Fullscreen */}
          <button
            className="header-btn"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            onClick={handleFullscreen}
            style={{ borderColor: isFullscreen ? 'var(--accent-primary)' : '' }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* Portal renders notification panel directly in <body> — never clipped */}
      {NotifPortal}
    </>
  );
}
