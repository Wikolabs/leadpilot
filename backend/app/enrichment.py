"""Enrichissement d'email.

MVP : implémentation mockée déterministe (aucune clé API requise) qui imite la
réponse de Hunter.io / Clearbit. Pour passer en réel, remplacer `enrich()` par un
appel HTTP à l'API d'enrichissement (voir README, section Stack).
"""
import hashlib

# Domaines emails personnels -> jamais une entreprise B2B
PERSONAL_DOMAINS = {
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.fr", "hotmail.com",
    "hotmail.fr", "outlook.com", "outlook.fr", "live.com", "live.fr",
    "icloud.com", "me.com", "free.fr", "orange.fr", "sfr.fr", "laposte.net",
    "wanadoo.fr", "protonmail.com", "proton.me", "gmx.com", "aol.com",
}

# Fixtures pour des démos prévisibles
FIXTURES = {
    "acme-corp.com": {"company_name": "Acme Corp", "employees": 250, "industry": "Software", "title": "Marketing Director", "seniority": "director", "country": "FR"},
    "globex.io": {"company_name": "Globex", "employees": 1200, "industry": "Fintech", "title": "VP Sales", "seniority": "vp", "country": "FR"},
    "initech.com": {"company_name": "Initech", "employees": 80, "industry": "Consulting", "title": "Head of Ops", "seniority": "director", "country": "BE"},
    "startup-tiny.fr": {"company_name": "Tiny Startup", "employees": 4, "industry": "Software", "title": "Founder", "seniority": "executive", "country": "FR"},
    "bigretail.de": {"company_name": "BigRetail", "employees": 5000, "industry": "Retail", "title": "Buyer", "seniority": "manager", "country": "DE"},
}

SENIORITIES = ["junior", "manager", "senior", "director", "vp", "executive"]
INDUSTRIES = ["Software", "Fintech", "Retail", "Manufacturing", "Healthcare", "Consulting"]
COUNTRIES = ["FR", "BE", "CH", "US", "DE"]
EMPLOYEE_BUCKETS = [5, 12, 45, 120, 300, 800, 2500]
TITLES = {
    "junior": "Analyst", "manager": "Manager", "senior": "Senior Manager",
    "director": "Director", "vp": "VP", "executive": "Chief Officer",
}


def _bucket(seed: str, mod: int) -> int:
    return int(hashlib.md5(seed.encode()).hexdigest(), 16) % mod


def enrich(email: str) -> dict:
    """Email -> données firmographiques (mockées mais déterministes)."""
    email = (email or "").strip().lower()
    domain = email.split("@")[-1] if "@" in email else ""

    base = {"provider": "mock", "domain": domain}

    if not domain or domain in PERSONAL_DOMAINS:
        return {**base, "is_personal": True, "company_name": None, "employees": 0,
                "industry": None, "title": None, "seniority": None, "country": None}

    if domain in FIXTURES:
        return {**base, "is_personal": False, **FIXTURES[domain]}

    seniority = SENIORITIES[_bucket(domain + "s", len(SENIORITIES))]
    return {
        **base,
        "is_personal": False,
        "company_name": domain.split(".")[0].capitalize(),
        "employees": EMPLOYEE_BUCKETS[_bucket(domain, len(EMPLOYEE_BUCKETS))],
        "industry": INDUSTRIES[_bucket(domain + "i", len(INDUSTRIES))],
        "title": TITLES[seniority],
        "seniority": seniority,
        "country": COUNTRIES[_bucket(domain + "c", len(COUNTRIES))],
    }
