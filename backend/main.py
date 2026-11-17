import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from attack_simulator import simulator, ATTACK_SCENARIOS
from playbook_engine import playbook_engine
from ml_engine import ml_engine

app = FastAPI(title="CyberForensix SOC Backend API", version="3.7.1")

# Enable CORS for React frontend on http://localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception:
                pass

manager = ConnectionManager()

class SimulatorStartRequest(BaseModel):
    scenario: str
    intensity: Optional[int] = 5
    target: Optional[str] = None

class PlaybookActionRequest(BaseModel):
    target: str

@app.get("/")
def read_root():
    return {"status": "online", "system": "CyberForensix SOC Forensic Engine", "version": "3.7.1"}

@app.get("/api/scenarios")
def get_scenarios():
    return ATTACK_SCENARIOS

@app.post("/api/simulator/start")
def start_simulation(req: SimulatorStartRequest):
    res = simulator.start(req.scenario, req.intensity, req.target)
    return res

@app.post("/api/simulator/stop")
def stop_simulation():
    res = simulator.stop()
    return res

@app.get("/api/simulator/status")
def get_simulator_status():
    return {
        'is_active': simulator.is_active,
        'scenario': simulator.current_scenario,
        'intensity': simulator.intensity,
        'target': simulator.target_ip,
        'stats': simulator.stats
    }

@app.get("/api/playbooks/status")
def get_playbook_status():
    return playbook_engine.get_status()

@app.post("/api/playbooks/unblock")
def unblock_ip(req: PlaybookActionRequest):
    success = playbook_engine.unblock_ip(req.target)
    if not success:
        raise HTTPException(status_code=400, detail="IP not found in blocked list")
    return {"status": "success", "unblocked": req.target}

@app.post("/api/playbooks/restore")
def restore_host(req: PlaybookActionRequest):
    success = playbook_engine.restore_host(req.target)
    if not success:
        raise HTTPException(status_code=400, detail="Host not found in isolated list")
    return {"status": "success", "restored": req.target}

@app.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Generate continuous security event stream
            event = simulator.generate_telemetry_event()
            system_state = {
                'event': event,
                'simulator': {
                    'is_active': simulator.is_active,
                    'scenario': simulator.current_scenario,
                    'intensity': simulator.intensity,
                    'target': simulator.target_ip
                },
                'stats': simulator.stats,
                'playbooks': playbook_engine.get_status(),
                'ml_metrics': {
                    'accuracy': ml_engine.accuracy,
                    'precision': ml_engine.precision,
                    'recall': ml_engine.recall,
                    'f1_score': ml_engine.f1_score
                }
            }
            await websocket.send_json(system_state)
            
            # Adjust broadcast frequency based on attack intensity
            sleep_time = 1.0 / (simulator.intensity if simulator.is_active else 2.0)
            await asyncio.sleep(sleep_time)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
