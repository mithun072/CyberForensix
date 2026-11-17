import time
from typing import List, Dict

class PlaybookEngine:
    def __init__(self):
        self.blocked_ips = set()
        self.isolated_hosts = set()
        self.playbook_logs: List[Dict] = []
        
        # Seed default state for SOC simulation presentation
        self.blocked_ips.add('185.220.101.5')
        self.playbook_logs.append({
            'id': 'PB-1001',
            'timestamp': time.time() - 3600,
            'rule': 'AUTO_BLOCK_CRITICAL_IP',
            'target': '185.220.101.5',
            'action': 'IP_FIREWALL_BLOCK',
            'status': 'SUCCESS',
            'reason': 'Triggered by high confidence (96.4%) SSH Brute Force attempt.'
        })

    def evaluate_event(self, event: dict) -> dict:
        """
        Evaluates incoming security alert and automatically executes response playbooks if thresholds met.
        """
        source_ip = event.get('source', '')
        dest_ip = event.get('destination', '')
        severity = event.get('severity', 'Low')
        confidence = event.get('confidence', 0)
        alert_type = event.get('type', '')

        result = {
            'action_taken': None,
            'playbook_triggered': False
        }

        # Playbook 1: Auto-block Critical Malicious Source IP
        if severity == 'Critical' and confidence > 85.0 and source_ip and source_ip not in self.blocked_ips:
            self.blocked_ips.add(source_ip)
            log_entry = {
                'id': f"PB-{len(self.playbook_logs) + 1001}",
                'timestamp': time.time(),
                'rule': 'AUTO_CONTAINMENT_IP_BLOCK',
                'target': source_ip,
                'action': 'IP_FIREWALL_BLOCK',
                'status': 'SUCCESS',
                'reason': f"Automated block executed for {alert_type} (ML Confidence: {confidence}%)"
            }
            self.playbook_logs.insert(0, log_entry)
            result['action_taken'] = f"Blocked IP {source_ip}"
            result['playbook_triggered'] = True

        # Playbook 2: Auto-isolate Target Host on Ransomware / Exfiltration
        if ('Ransomware' in alert_type or 'Exfiltration' in alert_type) and dest_ip and dest_ip not in self.isolated_hosts:
            self.isolated_hosts.add(dest_ip)
            log_entry = {
                'id': f"PB-{len(self.playbook_logs) + 1001}",
                'timestamp': time.time(),
                'rule': 'HOST_ISOLATION_EMERGENCY',
                'target': dest_ip,
                'action': 'VIRTUAL_VLAN_ISOLATE',
                'status': 'SUCCESS',
                'reason': f"Host isolated due to critical active threat: {alert_type}"
            }
            self.playbook_logs.insert(0, log_entry)
            result['action_taken'] = f"Isolated Host {dest_ip}"
            result['playbook_triggered'] = True

        return result

    def unblock_ip(self, ip: str) -> bool:
        if ip in self.blocked_ips:
            self.blocked_ips.remove(ip)
            self.playbook_logs.insert(0, {
                'id': f"PB-{len(self.playbook_logs) + 1001}",
                'timestamp': time.time(),
                'rule': 'MANUAL_UNBLOCK_OVERRIDE',
                'target': ip,
                'action': 'IP_UNBLOCK',
                'status': 'SUCCESS',
                'reason': 'Analyst manual override.'
            })
            return True
        return False

    def restore_host(self, host_ip: str) -> bool:
        if host_ip in self.isolated_hosts:
            self.isolated_hosts.remove(host_ip)
            self.playbook_logs.insert(0, {
                'id': f"PB-{len(self.playbook_logs) + 1001}",
                'timestamp': time.time(),
                'rule': 'MANUAL_REINTEGRATE_OVERRIDE',
                'target': host_ip,
                'action': 'HOST_RESTORE',
                'status': 'SUCCESS',
                'reason': 'Analyst restored network access after forensic scan.'
            })
            return True
        return False

    def get_status(self) -> dict:
        return {
            'blocked_ips': list(self.blocked_ips),
            'isolated_hosts': list(self.isolated_hosts),
            'playbook_logs': self.playbook_logs[:20]
        }

playbook_engine = PlaybookEngine()
