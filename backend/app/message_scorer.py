"""Analyse contextuelle du message du prospect.

Extrait 4 signaux d'intention (budget / timing / besoin / concurrent) et calcule
un bonus de score 0-30 qui s'ajoute au score ICP structurel.

Implémentation : appel JSON-mode à un LLM hébergé (clé via GROQ_API_KEY).
Fallback gracieux : si pas de clé ou erreur réseau → renvoie 0 + raison.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Any

import httpx

logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"
HTTP_TIMEOUT = 8.0

SYSTEM_PROMPT = """Tu es un analyseur de messages de prospects B2B. Tu reçois le texte libre qu'un prospect a écrit dans un formulaire d'intérêt. Tu dois extraire des signaux d'intention d'achat et renvoyer un JSON STRICT avec cette structure exacte :

{
  "budget_mentioned": boolean,
  "budget_eur": integer | null,
  "timing_mentioned": boolean,
  "timing_days": integer | null,
  "has_specific_need": boolean,
  "mentions_competitor": boolean,
  "urgency_score": integer (0-10)
}

Règles :
- budget_mentioned : true si le prospect mentionne un budget, un montant, un coût, "k€", "EUR", "$", "10k", "50k", etc.
- budget_eur : montant approximatif en euros si déductible, sinon null
- timing_mentioned : true si une échéance est mentionnée ("ce trimestre", "Q1", "asap", "urgent", "dans 30 jours", "next month"...)
- timing_days : nombre de jours approximatif jusqu'à la décision, sinon null
- has_specific_need : true si le prospect décrit un besoin précis avec contexte métier (>3 mots), false si vague ("juste curieux", "pour info")
- mentions_competitor : true si un nom d'outil/concurrent est cité (HubSpot, Salesforce, Pipedrive, Apollo, etc.) — signal de shopping comparatif
- urgency_score : 0 (pas d'urgence) à 10 (très urgent, "asap", "today", "fire")

Si le message est vide ou non interprétable, renvoie tous les booléens à false, tous les null/0.

RÉPONSE : JSON pur uniquement, aucun texte autour."""


# Points attribués par signal
SIGNAL_WEIGHTS = {
    "budget_mentioned": 10,
    "timing_mentioned": 10,
    "has_specific_need": 5,
    "mentions_competitor": 5,
}
MAX_MESSAGE_SCORE = sum(SIGNAL_WEIGHTS.values())  # 30


def _empty_signals() -> dict[str, Any]:
    return {
        "budget_mentioned": False,
        "budget_eur": None,
        "timing_mentioned": False,
        "timing_days": None,
        "has_specific_need": False,
        "mentions_competitor": False,
        "urgency_score": 0,
    }


def _score_from_signals(signals: dict[str, Any]) -> int:
    """Convertit les signaux booléens en score 0-30."""
    score = 0
    for key, weight in SIGNAL_WEIGHTS.items():
        if signals.get(key) is True:
            score += weight
    return score


def extract_signals(message: str | None) -> tuple[int, dict[str, Any]]:
    """Analyse le message du prospect → (score 0-30, signaux extraits).

    Renvoie toujours un tuple. Fallback silencieux en cas d'erreur.
    """
    msg = (message or "").strip()
    if not msg:
        sig = _empty_signals()
        sig["reason"] = "message_vide"
        return 0, sig

    if not GROQ_API_KEY:
        sig = _empty_signals()
        sig["reason"] = "api_key_absente"
        return 0, sig

    try:
        with httpx.Client(timeout=HTTP_TIMEOUT) as client:
            r = client.post(
                GROQ_BASE_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": msg[:2000]},
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.1,
                    "max_tokens": 300,
                },
            )
            r.raise_for_status()
            content = r.json()["choices"][0]["message"]["content"]
            signals = json.loads(content)
    except Exception as e:
        logger.warning("Message extraction failed: %s", e)
        sig = _empty_signals()
        sig["reason"] = f"extraction_failed: {type(e).__name__}"
        return 0, sig

    # Normalisation : whitelist des clés attendues
    clean = _empty_signals()
    for k in clean.keys():
        if k in signals:
            clean[k] = signals[k]

    return _score_from_signals(clean), clean
