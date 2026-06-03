# LeadPilot — Qualification de leads B2B en pilote automatique (Enrichissement + Scoring ICP)

> Ne perdez plus de temps avec les faux profils. Enrichissement + scoring ICP en < 2s. 97% des profils hors-cible filtrés avant votre CRM. Déployé en 1 heure.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![Celery](https://img.shields.io/badge/Celery-5.4-37814A?style=flat&logo=celery)](https://docs.celeryq.dev)
[![Pipedrive](https://img.shields.io/badge/Pipedrive-API-1A1A1A?style=flat)](https://developers.pipedrive.com)

---

## Vue d'ensemble

LeadPilot est une plateforme d'automatisation commerciale qui qualifie les leads B2B sans intervention humaine. Un prospect remplit un formulaire (Typeform, Tally, Google Forms) ; LeadPilot capte la soumission, **enrichit** l'email via Hunter.io / Clearbit (entreprise, taille, poste, secteur), applique un **scoring ICP** configurable, puis route automatiquement : les leads cibles sont créés dans le CRM (Pipedrive / HubSpot) avec notification commerciale, les hors-cible reçoivent un email de refus poli. Applications : SDR augmentés, RevOps, inbound à fort volume.

**Domaine :** Sales Automation / RevOps / B2B Lead Intelligence  
**Port VM :** 3004 | **Sous-domaine :** leadpilot.wikolabs.com

---

## Contenu du dépôt

| Élément | Description |
|---|---|
| [`backend/`](backend/) | API **FastAPI** exécutable : webhook → enrichissement → scoring ICP → routing (SQLite, tests inclus) |
| [`frontend/`](frontend/) | **Next.js 14** : landing + dashboard, sélecteur **FR/EN**, visuel du workflow n8n, démo interactive, responsive |
| [`docker-compose.yml`](docker-compose.yml) | Lancement tout-en-un (backend + frontend) sur le port 3004 |
| [`workflow-qualification-leads.json`](workflow-qualification-leads.json) | Variante **no-code** du même flux, importable dans n8n |
| [`RUN.md`](RUN.md) | Comment lancer et tester (local ou Docker) |
| [`SCENARIO.md`](SCENARIO.md) | Script de démonstration de bout en bout |

> **MVP exécutable :** l'enrichissement est mocké (déterministe, sans clé API) et les effets CRM/email sont journalisés — l'app se lance et se démontre sans aucune dépendance externe. Le chemin de passage en réel (Hunter.io, Pipedrive, Resend) est documenté dans [RUN.md](RUN.md). La stack « production » ci-dessous (Postgres, Redis, Celery) est la cible de déploiement.

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Dashboard leads, configuration ICP, analytics funnel |
| Backend | FastAPI (Python 3.11), Uvicorn | Webhooks formulaires, enrichissement, scoring, sync CRM |
| Enrichment | **Hunter.io** / Clearbit API | Email → entreprise, taille, poste, séniorité, secteur |
| Scoring | Moteur ICP custom (règles + pondération) | Score 0–100 vs profil cible |
| CRM | Pipedrive / HubSpot API | Création Personne + Deal automatisée |
| Email | Resend / SMTP | Email de refus poli + notification interne |
| Queue | Celery + Redis | Enrichissement & scoring asynchrones |
| Storage | PostgreSQL 16 | Leads, enrichments, profils ICP, audit |
| Cache | Redis | Cache enrichissement (anti-quota API) |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3004) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
celery==5.4.0
redis==5.0.4
httpx==0.27.0
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
pydantic==2.7.1
pydantic[email]==2.7.1
resend==2.0.0
tenacity==8.3.0
python-multipart==0.0.9
```

---

## Architecture mono-repo

```
leadpilot/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx              # Dashboard leads + statut qualification
│   │   ├── leads/[id]/           # Fiche lead : enrichissement + score détaillé
│   │   ├── icp/                  # Configuration profil ICP (critères + poids)
│   │   ├── templates/            # Éditeur email de refus / notification
│   │   └── analytics/            # Funnel : reçus → enrichis → qualifiés → CRM
│   └── src/components/
│       ├── LeadTable.tsx         # Table filtrable (source, score, statut)
│       ├── ScoreGauge.tsx        # Jauge score 0–100 + verdict cible/hors-cible
│       ├── ICPRuleBuilder.tsx    # Builder critères pondérés (taille, poste...)
│       ├── EnrichmentCard.tsx    # Données Hunter affichées (entreprise, poste)
│       ├── FunnelChart.tsx       # Taux de conversion par étape
│       └── RejectionEditor.tsx   # Template email refus (variables {{ }})
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── webhook.py        # POST /webhook/{source} (form → lead)
│   │   │   ├── leads.py          # CRUD + GET /leads (filtres, pagination)
│   │   │   ├── icp.py            # CRUD profils ICP
│   │   │   └── analytics.py      # GET /analytics/funnel
│   │   ├── services/
│   │   │   ├── enrichment.py     # Hunter.io / Clearbit + cache Redis
│   │   │   ├── scoring_engine.py # Calcul score ICP pondéré
│   │   │   ├── crm_sync.py       # Pipedrive / HubSpot (upsert anti-doublon)
│   │   │   ├── mailer.py         # Refus poli + notification commerciale
│   │   │   └── dedup.py          # Détection doublons CRM par email
│   │   ├── tasks.py              # Pipeline Celery (enrich → score → route)
│   │   └── models/
│   │       ├── lead.py
│   │       └── icp_profile.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e3a8a', 'primaryTextColor': '#fff', 'primaryBorderColor': '#1e40af', 'lineColor': '#374151', 'secondaryColor': '#eff6ff'}}}%%
flowchart TB
    FORMS["📝 Formulaires\nTypeform / Tally / Google Forms"] -->|webhook| API

    subgraph VM["🖥️ VM — Docker Compose (port 3004)"]
        NEXT["Next.js 14\nSales Dashboard"]
        API["FastAPI\nWebhook + API"]
        CELERY["Celery Workers\nPipeline async"]

        subgraph ENGINE["⚙️ Qualification Engine"]
            ENRICH["Enrichment\nHunter.io / Clearbit"]
            SCORE["Scoring ICP\nrègles pondérées"]
            ROUTE["Router\ncible / hors-cible"]
        end

        PG[("PostgreSQL\nLeads + ICP + Audit")]
        REDIS[("Redis\nQueue + cache enrich")]
    end

    API --> CELERY
    CELERY --> ENRICH --> SCORE --> ROUTE
    ROUTE -->|cible| CRM["📊 CRM\nPipedrive / HubSpot"]
    ROUTE -->|cible| NOTIF["🔔 Notif équipe\ncommerciale"]
    ROUTE -->|hors-cible| REJECT["✉️ Email de\nrefus poli"]
    CELERY --> PG
    ENRICH --> REDIS
```

### Séquence — Qualification d'un lead entrant

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e3a8a', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant FORM as Formulaire
    participant API as FastAPI
    participant CELERY as Celery
    participant ENRICH as Enrichment
    participant SCORE as Scoring ICP
    participant CRM as Pipedrive
    participant MAIL as Mailer

    FORM->>API: POST /webhook/typeform {email, name, message}
    API->>CELERY: enqueue qualify(lead_id)
    API-->>FORM: 202 Accepted

    CELERY->>ENRICH: enrich(email)
    ENRICH->>ENRICH: cache Redis (domaine) ?
    ENRICH-->>CELERY: {company: "Acme", employees: 250, title: "Marketing Director", seniority: "director"}

    CELERY->>SCORE: score(lead, icp_profile)
    SCORE-->>CELERY: {score: 88, verdict: "qualified", breakdown: {...}}

    alt score >= seuil (qualifié)
        CELERY->>CRM: upsert person + create deal
        CRM-->>CELERY: {person_id, deal_id}
        CELERY->>MAIL: notify_sales(lead, score)
    else score < seuil (hors-cible)
        CELERY->>MAIL: send_rejection(email, template_fr)
    end

    CELERY->>API: update lead.status
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e3a8a', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    LEAD {
        uuid id PK
        string email
        string full_name
        string source
        int score
        string status
        timestamp created_at
    }
    ENRICHMENT {
        uuid id PK
        uuid lead_id FK
        string company_name
        int employees
        string industry
        string title
        string seniority
        string country
        string provider
        jsonb raw
    }
    ICP_PROFILE {
        uuid id PK
        string name
        jsonb criteria
        jsonb weights
        int threshold
        boolean active
    }
    CRM_SYNC {
        uuid id PK
        uuid lead_id FK
        string crm
        string external_id
        string status
        timestamp synced_at
    }
    REJECTION {
        uuid id PK
        uuid lead_id FK
        string template
        timestamp sent_at
    }

    LEAD ||--|| ENRICHMENT : "enrichi_par"
    LEAD }o--|| ICP_PROFILE : "scoré_contre"
    LEAD ||--o{ CRM_SYNC : "synchronisé"
    LEAD ||--o| REJECTION : "refusé_par"
```

---

## PRD

### Problème
Les équipes commerciales B2B reçoivent un flux massif de leads inbound dont une large part est hors-cible (emails personnels, freelances, étudiants, concurrents, mauvaise taille d'entreprise). Le tri manuel — rechercher chaque entreprise sur LinkedIn, vérifier la taille, le poste — coûte ~15 min par lead, génère de la fatigue, et pollue le CRM de faux profils qui faussent les prévisions de vente.

### Solution
LeadPilot capte chaque soumission de formulaire, enrichit l'email automatiquement, applique un scoring ICP pondéré, et route en moins de 2 secondes : les leads cibles atterrissent dans le CRM prêts à être contactés avec notification commerciale, les hors-cible reçoivent un refus poli. Zéro tri manuel, zéro faux profil dans le CRM, 24/7.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| SDR / BDR | Ne traiter que des leads pré-qualifiés et enrichis |
| Head of Sales | Un CRM propre, des prévisions fiables, un temps de réponse court |
| RevOps Manager | Configurer l'ICP, mesurer le funnel, garantir la conformité RGPD |

### OKRs
- Temps de qualification < 2s par lead (P95)
- 0 email personnel (gmail/yahoo) créé comme lead cible dans le CRM
- 100% des leads cibles synchronisés au CRM en < 5s
- Taux de leads qualifiés mesuré et exportable par source

---

## User Stories

```
US-01 [SDR] En tant que SDR,
      je veux que chaque lead arrive dans le CRM déjà enrichi et scoré
      afin de contacter en priorité les comptes à fort potentiel.

US-02 [RevOps] En tant que RevOps Manager,
      je veux configurer mon profil ICP (taille, secteur, poste, géographie)
      avec des poids ajustables
      afin d'adapter la qualification à notre marché sans coder.

US-03 [Head of Sales] En tant que Head of Sales,
      je veux que les emails personnels et profils hors-cible soient écartés
      automatiquement avec un refus poli
      afin de garder un CRM propre et une équipe concentrée.

US-04 [RevOps] En tant que RevOps Manager,
      je veux voir le funnel (reçus → enrichis → qualifiés → CRM)
      par source de formulaire
      afin d'identifier les canaux qui apportent les meilleurs leads.

US-05 [SDR] En tant que SDR,
      je veux voir le détail du score d'un lead (pourquoi qualifié/refusé)
      afin de comprendre la décision et corriger un faux négatif.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Validation email | Format + délivrabilité vérifiés avant enrichissement | ✅ Email status |
| R2 | Emails personnels | gmail / yahoo / outlook… → flag « pro requis » | ✅ Domain badge |
| R3 | Cache enrichissement | Même domaine déjà enrichi < 30j → réutilisation (anti-quota) | ✅ Cache hit tag |
| R4 | Scoring pondéré | Score 0–100 = somme pondérée des critères ICP | ✅ Score breakdown |
| R5 | Seuil de qualification | score ≥ seuil (défaut 70) → cible, sinon hors-cible | ✅ Threshold slider |
| R6 | Anti-doublon CRM | Email déjà présent → mise à jour (upsert), pas de doublon | ✅ Dedup notice |
| R7 | Profils ICP multiples | Plusieurs ICP, un seul actif par défaut | ✅ ICP selector |
| R8 | Templates de refus | Email de refus multilingue à variables `{{ }}` | ✅ Template editor |
| R9 | Rate limit API | Respect des quotas Hunter/Clearbit (retry + backoff) | ✅ Quota gauge |
| R10 | Audit & RGPD | Journal des décisions, rétention configurable, droit à l'oubli | ✅ Audit log |

---

## Spécification API

**Base URL :** `http://leadpilot.wikolabs.com/api/v1`

### POST /webhook/{source}
```json
// source ∈ {typeform, tally, google_forms}
{"email": "marie.dupont@acme-corp.com", "full_name": "Marie Dupont", "message": "Demande de démo"}
// Response: {"lead_id": "ld_xyz", "status": "queued"}
```

### GET /leads/{id}
```json
// Response:
{
  "id": "ld_xyz",
  "email": "marie.dupont@acme-corp.com",
  "source": "typeform",
  "score": 88,
  "status": "qualified",
  "enrichment": {"company_name": "Acme Corp", "employees": 250, "title": "Marketing Director", "seniority": "director", "industry": "Software"},
  "crm_sync": {"crm": "pipedrive", "external_id": "person_4821", "status": "synced"}
}
```

### POST /icp
```json
{
  "name": "ICP SaaS Mid-Market",
  "criteria": {"min_employees": 50, "industries": ["Software", "Fintech"], "seniorities": ["director", "vp", "executive"], "countries": ["FR", "BE", "CH"]},
  "weights": {"employees": 35, "seniority": 30, "industry": 25, "country": 10},
  "threshold": 70
}
// Response: {"icp_id": "icp_xyz", "active": true}
```

### GET /analytics/funnel
```json
// Response: {"received": 1240, "enriched": 1198, "qualified": 412, "synced_crm": 412, "rejected": 786, "qualification_rate": 0.34}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Lead Table** | Table filtrable par source / score / statut, mise à jour live |
| **Score Gauge** | Jauge 0–100 avec verdict coloré (cible / hors-cible) |
| **ICP Rule Builder** | Construction visuelle des critères pondérés (drag des poids) |
| **Enrichment Card** | Données Hunter affichées : entreprise, taille, poste, secteur |
| **Funnel Chart** | Taux de conversion reçus → enrichis → qualifiés → CRM |
| **Rejection Editor** | Édition du template de refus avec aperçu des variables |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: leadpilot, POSTGRES_USER: lp_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
    volumes: ["pg_data:/var/lib/postgresql/data"]
  redis:
    image: redis:7-alpine
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://lp_user:${POSTGRES_PASSWORD}@postgres/leadpilot
      REDIS_URL: "redis://redis:6379/0"
      HUNTER_API_KEY: "${HUNTER_API_KEY}"
      PIPEDRIVE_TOKEN: "${PIPEDRIVE_TOKEN}"
      RESEND_API_KEY: "${RESEND_API_KEY}"
    depends_on: [postgres, redis]
    expose: ["8000"]
  worker:
    build: ./backend
    command: celery -A app.tasks worker --loglevel=info
    environment:
      DATABASE_URL: postgresql+asyncpg://lp_user:${POSTGRES_PASSWORD}@postgres/leadpilot
      REDIS_URL: "redis://redis:6379/0"
    depends_on: [redis, postgres]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3004:80"]
    depends_on: [backend, frontend]
volumes:
  pg_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] Webhook ingestion multi-formulaires (Typeform, Tally, Google Forms)
- [ ] Enrichissement Hunter.io + cache Redis
- [ ] Scoring ICP pondéré + routing CRM / refus

### Phase 2 — Configuration & visibilité
- [ ] ICP Rule Builder no-code
- [ ] Dashboard funnel + analytics par source
- [ ] Templates de refus multilingues

### Phase 3 — Échelle & conformité
- [ ] Support HubSpot + Salesforce
- [ ] Audit log RGPD + droit à l'oubli
- [ ] Scoring enrichi par signaux d'intention (visites site, ouverture emails)

---

> **Variante no-code disponible :** une implémentation [n8n](workflow-qualification-leads.json) du même flux (Google Forms → Hunter.io → Pipedrive) est fournie pour les déploiements rapides sans backend custom.

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
