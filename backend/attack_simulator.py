import random
import time
from typing import Dict, Generator
from ml_engine import ml_engine
from playbook_engine import playbook_engine

ATTACK_SCENARIOS = {
    'ddos': {
        'name': 'DDoS Volumetric Flood',
        'category': 'Network & Access',
        'default_target': '192.168.1.10 (Edge Gateway)',
        'description': 'High volume UDP/SYN traffic burst swamping target interface throughput.',
        'log_templates': [
            "SYN_FLOOD src={src} dst={dst} dport=80 win=65535 size={size}B rate={rate}pps",
            "UDP_RAW_BURST src={src} dst={dst} dport=443 length={size} size={size}B",
            "ICMP_ECHO_STORM src={src} dst={dst} ttl=64 size={size}B"
        ]
    },
    'brute_force': {
        'name': 'SSH / Auth Brute Force',
        'category': 'Network & Access',
        'default_target': '10.0.4.15 (Auth Server)',
        'description': 'Automated high-frequency credential stuffing against port 22.',
        'log_templates': [
            "SSH_AUTH_FAIL user=root src={src} dst={dst} port=22 invalid_pass_count={auth}",
            "SSH_AUTH_FAIL user=admin src={src} dst={dst} port=22 invalid_pass_count={auth}",
            "PAM_UNAUTHORIZED src={src} dst={dst} service=sshd user=sysadmin"
        ]
    },
    'port_scan': {
        'name': 'Port Scanning & Reconnaissance',
        'category': 'Network & Access',
        'default_target': '10.0.0.0/24 (Internal Subnet)',
        'description': 'Sequential TCP SYN scanning across active subnet service ports.',
        'log_templates': [
            "TCP_SYN_SCAN src={src} dst={dst} ports=[21,22,80,443,3306,8080] status=FILTERED",
            "NMAP_SWEEP src={src} target_range={dst} flag=SYN timing=T4",
            "RECON_PROBE src={src} dst={dst} port=3389 RDP_DETECT"
        ]
    },
    'sqli': {
        'name': 'SQL Injection (SQLi)',
        'category': 'Application & Host',
        'default_target': '10.0.2.88 (Web Database API)',
        'description': 'Malicious SQL payload injection exploiting unescaped form inputs.',
        'log_templates': [
            "HTTP_POST /api/v1/login query=\"' OR '1'='1' --\" src={src} dst={dst} status=500",
            "HTTP_GET /products?id=1 UNION SELECT username,password FROM users -- src={src} dst={dst}",
            "SQL_PARSER_ERROR query=\"SELECT * FROM accounts WHERE id=1; DROP TABLE logs;\" src={src}"
        ]
    },
    'exfiltration': {
        'name': 'DNS / HTTP Data Exfiltration',
        'category': 'Application & Host',
        'default_target': '10.0.5.22 (Internal Document Storage)',
        'description': 'Encrypted chunked data exfiltration via covert DNS TXT tunnels.',
        'log_templates': [
            "DNS_TUNNEL_QUERY qname=chunk7a8f9b.exfil.attacker.xyz src={src} dst=8.8.8.8 size={size}B",
            "HTTP_PUT /upload_covert payload_size=45.2MB dst=45.33.22.11 src={src}",
            "STAGED_EXFILTRATION archive=customer_pii.tar.gz bytes_sent={size} src={src}"
        ]
    },
    'ransomware': {
        'name': 'Ransomware File Mod Pattern',
        'category': 'Application & Host',
        'default_target': '10.0.1.4 (File Share Server)',
        'description': 'Rapid high-frequency file modification & file header entropy anomaly.',
        'log_templates': [
            "FILE_SYSTEM_ALERT high_write_rate dir=/var/data/files extension=.locked src={src} dst={dst}",
            "CRYPTO_PROCESS_SPAWN pid=4912 proc=encrypter.exe entropy=7.99 src={src}",
            "SHADOW_COPY_DELETED command=\"vssadmin delete shadows /all /quiet\" src={src}"
        ]
    }
}

class AttackSimulator:
    def __init__(self):
        self.is_active = False
        self.current_scenario = 'ddos'
        self.intensity = 5  # events per second
        self.target_ip = '192.168.1.10'
        self.stats = {
            'total_events': 14280,
            'threats_detected': 312,
            'active_attack': False
        }

    def start(self, scenario: str, intensity: int = 5, target: str = None) -> dict:
        if scenario in ATTACK_SCENARIOS:
            self.current_scenario = scenario
        self.intensity = max(1, min(20, intensity))
        if target:
            self.target_ip = target
        else:
            self.target_ip = ATTACK_SCENARIOS[self.current_scenario]['default_target']
        self.is_active = True
        self.stats['active_attack'] = True
        return {
            'status': 'started',
            'scenario': ATTACK_SCENARIOS[self.current_scenario]['name'],
            'intensity': self.intensity,
            'target': self.target_ip
        }

    def stop(self) -> dict:
        self.is_active = False
        self.stats['active_attack'] = False
        return {'status': 'stopped'}

    def generate_telemetry_event(self) -> Dict:
        """
        Generates either an attack event (if active) or background network telemetry.
        """
        now = time.time()
        self.stats['total_events'] += 1

        if self.is_active:
            scen = ATTACK_SCENARIOS[self.current_scenario]
            src_ip = f"{random.randint(45, 185)}.{random.randint(10, 220)}.{random.randint(1, 254)}.{random.randint(1, 254)}"
            dest_ip = self.target_ip.split(' ')[0]
            
            packet_size = random.randint(1200, 4096) if self.current_scenario in ['ddos', 'exfiltration'] else random.randint(200, 800)
            event_rate = self.intensity * random.randint(10, 50)
            failed_auth = random.randint(5, 30) if self.current_scenario == 'brute_force' else random.randint(0, 2)
            payload_score = random.randint(75, 99) if self.current_scenario in ['sqli', 'ransomware'] else random.randint(40, 85)

            template = random.choice(scen['log_templates'])
            log_msg = template.format(
                src=src_ip,
                dst=dest_ip,
                size=packet_size,
                rate=event_rate,
                auth=failed_auth
            )

            raw_event = {
                'id': f"EVT-{self.stats['total_events']}",
                'timestamp': now * 1000,
                'type': scen['name'],
                'category': scen['category'],
                'source': src_ip,
                'destination': dest_ip,
                'packet_size': packet_size,
                'event_rate': event_rate,
                'failed_auth': failed_auth,
                'payload_score': payload_score,
                'log': log_msg
            }

            # Enrich with ML detection scores
            ml_results = ml_engine.analyze_event(raw_event)
            raw_event.update(ml_results)

            if raw_event['severity'] in ['High', 'Critical']:
                self.stats['threats_detected'] += 1

            # Check automated playbooks
            playbook_res = playbook_engine.evaluate_event(raw_event)
            if playbook_res['playbook_triggered']:
                raw_event['mitigation'] = playbook_res['action_taken']

            return raw_event

        else:
            # Baseline normal background network event
            src_ip = f"10.0.{random.randint(1, 5)}.{random.randint(10, 200)}"
            dest_ip = f"10.0.0.{random.randint(1, 20)}"
            packet_size = random.randint(64, 1200)
            
            raw_event = {
                'id': f"EVT-{self.stats['total_events']}",
                'timestamp': now * 1000,
                'type': random.choice(['HTTPS TLS Handshake', 'DNS Query A Record', 'Internal TCP Keepalive', 'NTP Time Sync']),
                'category': 'Normal Telemetry',
                'source': src_ip,
                'destination': dest_ip,
                'packet_size': packet_size,
                'event_rate': random.randint(1, 10),
                'failed_auth': 0,
                'payload_score': random.randint(0, 15),
                'log': f"ALLOW TCP src={src_ip}:443 dst={dest_ip}:51204 size={packet_size}B status=OK"
            }
            
            ml_results = ml_engine.analyze_event(raw_event)
            raw_event.update(ml_results)
            return raw_event

simulator = AttackSimulator()
