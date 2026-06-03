# Lancer et tester LeadPilot (MVP)

Le MVP est **réellement exécutable** : backend FastAPI (webhook → enrichissement mocké sans clé API → scoring ICP → routing) + frontend Next.js 14.

## Option 1 — Docker (tout-en-un, recommandé)

```powershell
docker compose up --build
```
Dashboard **Next.js** sur **http://localhost:3004**. C'est tout.

## Option 2 — Local (backend + frontend séparés)

**Terminal 1 — backend (port 3004) :**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 3004
```

**Terminal 2 — frontend Next.js (port 3000) :**
```powershell
cd frontend
npm install
npm run dev
```

Puis ouvre **http://localhost:3000** → dashboard Next.js. Le frontend proxy `/api/*` vers le backend (configurable via `BACKEND_URL`, défaut `http://localhost:3004`).

> Le backend sert aussi un dashboard HTML de secours sur **http://localhost:3004** (utile pour tester l'API sans lancer le frontend).

### Tester l'API en ligne de commande
```powershell
# Lead cible -> qualifié
curl.exe -X POST http://localhost:3004/api/v1/webhook/typeform -H "Content-Type: application/json" -d "{\"email\":\"marie@acme-corp.com\",\"full_name\":\"Marie Dupont\"}"

# Email perso -> hors-cible
curl.exe -X POST http://localhost:3004/api/v1/webhook/typeform -H "Content-Type: application/json" -d "{\"email\":\"jean@gmail.com\",\"full_name\":\"Jean Bricoleur\"}"

# Funnel
curl.exe http://localhost:3004/api/v1/analytics/funnel
```

## Tests automatisés

```powershell
cd backend
pip install pytest
pytest -v
```

## Documentation API interactive

Une fois le serveur lancé : **http://localhost:3004/docs** (Swagger auto-généré par FastAPI).

## Ce qui est mocké (et comment passer en réel)

| Brique | MVP | Production |
|--------|-----|-----------|
| Enrichissement | `app/enrichment.py` déterministe | Appel HTTP Hunter.io / Clearbit |
| CRM / email | `print()` dans `process_lead` | Pipedrive API + Resend/SMTP |
| Stockage | SQLite | PostgreSQL (changer `DATABASE_URL`) |
| Async | synchrone | Celery + Redis |
