# Scénario de démonstration — LeadPilot

Script de démo de bout en bout. Chaque scénario correspond à un bouton d'exemple de la zone **Démo en direct** du dashboard (`http://localhost:3000`).

## Intro (le pitch)
> « Un prospect remplit un formulaire sur le site. À partir de son seul email, LeadPilot l'enrichit, le score selon notre client idéal, et décide tout seul : on le met dans le CRM, ou on l'écarte poliment. »

Le scoring ICP par défaut (pondéré sur 100, seuil **70**) :

| Critère | Poids | Cible |
|---|---|---|
| Taille entreprise | 35 | ≥ 50 employés |
| Séniorité | 30 | director / vp / executive / manager |
| Secteur | 25 | Software / Fintech / Consulting |
| Pays | 10 | FR / BE / CH |

---

## Scénario A — Le lead parfait ✅
**Bouton :** `acme-corp.com (cible)` — `marie@acme-corp.com`

| Étape | Résultat |
|---|---|
| Enrichissement | Acme Corp · 250 employés · Marketing Director · Software · FR |
| Scoring | 35 + 30 + 25 + 10 = **100/100** |
| Routing | **CIBLE** → Pipedrive (Personne + Deal) + notification commerciale |

---

## Scénario B — Le décideur tech 🏢
**Bouton :** `globex.io (cible)` — `paul@globex.io`

- Globex · 1200 employés · VP Sales · Fintech · FR
- Score **100/100** → **CIBLE**
- Démontre un autre profil cible (grande entreprise, autre secteur validé).

---

## Scénario C — Le faux profil 🚫
**Bouton :** `gmail.com (perso)` — `jean@gmail.com`

- Email **personnel**, aucune entreprise rattachée
- Score **0/100** (disqualification immédiate)
- Routing : **HORS-CIBLE** → email de refus poli automatique
- *« Le commercial n'est jamais dérangé pour ça. »*

---

## Scénario D — Le cas limite (le plus parlant) ⚖️
**Bouton :** `startup-tiny.fr (trop petit)` — `leo@startup-tiny.fr`

- Tiny Startup · **4 employés** · Founder (executive) · Software · FR
- Score : séniorité 30 + secteur 25 + pays 10 + taille **0** = **65/100**
- Seuil 70 → **HORS-CIBLE**
- *« Même un fondateur est écarté si l'entreprise est trop petite. Le scoring est pondéré, pas binaire — paramétrable selon la cible. »*

---

## Conclusion — le funnel
Après les 4 soumissions, le funnel affiche : **Reçus 4 · Qualifiés 2 · Hors-cible 2 · Taux 50%**.

> « Sur 4 leads entrants, l'équipe ne voit que les 2 bons, déjà dans le CRM. Les 2 autres ont reçu un refus poli. Zéro tri manuel, 24/7. »
