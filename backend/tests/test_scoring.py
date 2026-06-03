"""Tests du moteur de qualification (enrichissement + scoring)."""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.enrichment import enrich
from app.scoring import score_lead


def test_email_personnel_est_rejete():
    enr = enrich("jean@gmail.com")
    assert enr["is_personal"] is True
    score, _, status = score_lead(enr)
    assert score == 0
    assert status == "rejected"


def test_lead_cible_est_qualifie():
    enr = enrich("marie@acme-corp.com")  # 250 employés, director, Software, FR
    score, breakdown, status = score_lead(enr)
    assert status == "qualified"
    assert score >= 70
    assert breakdown["seniority"] > 0


def test_entreprise_trop_petite_score_partiel():
    enr = enrich("leo@startup-tiny.fr")  # 4 employés, executive
    score, _, status = score_lead(enr)
    # Décideur mais entreprise minuscule -> sous le seuil
    assert status == "rejected"


def test_enrichissement_deterministe():
    assert enrich("a@inconnu-xyz.com") == enrich("b@inconnu-xyz.com")
