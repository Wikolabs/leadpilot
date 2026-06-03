"""Connexion base de données (SQLite par défaut, Postgres si DATABASE_URL fourni)."""
import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./leadpilot.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Ajout idempotent des colonnes message_* aux installs existantes (SQLite friendly).
MIGRATIONS = [
    "ALTER TABLE leads ADD COLUMN message TEXT DEFAULT ''",
    "ALTER TABLE leads ADD COLUMN message_score INTEGER DEFAULT 0",
    "ALTER TABLE leads ADD COLUMN message_signals JSON DEFAULT '{}'",
]


def run_migrations() -> None:
    """Applique chaque migration une par une, ignore si la colonne existe déjà."""
    with engine.begin() as conn:
        for stmt in MIGRATIONS:
            try:
                conn.execute(text(stmt))
            except Exception as e:
                msg = str(e).lower()
                if "duplicate column" in msg or "already exists" in msg:
                    continue
                logger.warning("Migration skipped (%s): %s", stmt, e)
