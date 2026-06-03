"""Moteur de scoring ICP — score pondéré 0–100 + verdict cible / hors-cible.

Total = score_icp (0-100) + score_message (0-30), plafonné à 100.
Le score message peut donc transformer un lead borderline (60-69) en lead qualifié.
"""

DEFAULT_ICP = {
    "name": "ICP B2B par défaut",
    "min_employees": 50,
    "industries": ["Software", "Fintech", "Consulting"],
    "seniorities": ["director", "vp", "executive", "manager"],
    "countries": ["FR", "BE", "CH"],
    "weights": {"employees": 35, "seniority": 30, "industry": 25, "country": 10},
    "threshold": 70,
}


def score_lead(enr: dict, message_score: int = 0, icp: dict = DEFAULT_ICP):
    """Retourne (score: int, breakdown: dict, status: str).

    Args:
        enr: données firmographiques enrichies.
        message_score: bonus 0-30 dérivé du message du prospect.
    """
    weights = icp["weights"]

    # Disqualification immédiate : email perso / pas d'entreprise
    if enr.get("is_personal") or not enr.get("company_name"):
        return 0, {"raison": "email personnel ou entreprise inconnue"}, "rejected"

    breakdown: dict[str, int] = {}

    employees = enr.get("employees") or 0
    if employees >= icp["min_employees"]:
        breakdown["employees"] = weights["employees"]
    elif employees >= 10:
        breakdown["employees"] = weights["employees"] // 2
    else:
        breakdown["employees"] = 0

    breakdown["seniority"] = weights["seniority"] if enr.get("seniority") in icp["seniorities"] else 0
    breakdown["industry"] = weights["industry"] if enr.get("industry") in icp["industries"] else 0
    breakdown["country"] = weights["country"] if enr.get("country") in icp["countries"] else 0

    icp_score = sum(breakdown.values())
    breakdown["message"] = max(0, int(message_score))
    total = min(100, icp_score + breakdown["message"])

    status = "qualified" if total >= icp["threshold"] else "rejected"
    return total, breakdown, status
