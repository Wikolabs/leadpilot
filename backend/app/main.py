"""LeadPilot — API de qualification de leads B2B (MVP exécutable).

Pipeline synchrone : webhook -> enrichissement -> scoring ICP -> routing.
Sert aussi un dashboard intégré sur `/`.
"""
import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .enrichment import enrich
from .models import Lead
from .scoring import DEFAULT_ICP, score_lead

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LeadPilot", description="Qualification de leads B2B en pilote automatique", version="0.1.0")

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static")


class WebhookPayload(BaseModel):
    email: str
    full_name: str | None = ""
    message: str | None = None


def process_lead(db: Session, email: str, full_name: str, source: str) -> Lead:
    """Cœur du pipeline : enrichit, score, route et persiste."""
    enr = enrich(email)
    score, breakdown, status = score_lead(enr)
    lead = Lead(
        email=email, full_name=full_name or "", source=source,
        score=score, status=status, enrichment=enr, breakdown=breakdown,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    # Effets de bord simulés (en prod : CRM / email). Loggés pour la démo.
    if status == "qualified":
        print(f"[CRM] upsert {email} (score {score}) -> Pipedrive + notif commerciale")
    else:
        print(f"[MAIL] email de refus poli -> {email} (score {score})")
    return lead


@app.post("/api/v1/webhook/{source}")
def webhook(source: str, payload: WebhookPayload, db: Session = Depends(get_db)):
    lead = process_lead(db, payload.email, payload.full_name or "", source)
    return {"lead_id": lead.id, "score": lead.score, "status": lead.status}


@app.get("/api/v1/leads")
def list_leads(db: Session = Depends(get_db)):
    rows = db.execute(select(Lead).order_by(Lead.created_at.desc())).scalars().all()
    return [lead.to_dict() for lead in rows]


@app.get("/api/v1/leads/{lead_id}")
def get_lead(lead_id: str, db: Session = Depends(get_db)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="lead introuvable")
    return lead.to_dict()


@app.get("/api/v1/icp")
def get_icp():
    return DEFAULT_ICP


@app.get("/api/v1/analytics/funnel")
def funnel(db: Session = Depends(get_db)):
    rows = db.execute(select(Lead)).scalars().all()
    received = len(rows)
    qualified = sum(1 for r in rows if r.status == "qualified")
    rejected = received - qualified
    return {
        "received": received,
        "qualified": qualified,
        "rejected": rejected,
        "qualification_rate": round(qualified / received, 3) if received else 0.0,
    }


@app.get("/")
def dashboard():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))


@app.get("/health")
def health():
    return {"status": "ok"}
