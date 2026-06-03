"""Modèle de données — un lead porte son enrichissement et son scoring (MVP)."""
import datetime
import uuid

from sqlalchemy import String, Integer, DateTime, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def gen_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: gen_id("ld"))
    email: Mapped[str] = mapped_column(String, index=True)
    full_name: Mapped[str] = mapped_column(String, default="")
    source: Mapped[str] = mapped_column(String, default="api")
    score: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String, default="received")  # qualified | rejected
    enrichment: Mapped[dict] = mapped_column(JSON, default=dict)
    breakdown: Mapped[dict] = mapped_column(JSON, default=dict)
    message: Mapped[str] = mapped_column(Text, default="")
    message_score: Mapped[int] = mapped_column(Integer, default=0)
    message_signals: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "source": self.source,
            "score": self.score,
            "status": self.status,
            "enrichment": self.enrichment,
            "breakdown": self.breakdown,
            "message": self.message,
            "message_score": self.message_score,
            "message_signals": self.message_signals,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
