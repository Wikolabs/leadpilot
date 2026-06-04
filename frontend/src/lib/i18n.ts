export type Lang = "fr" | "en";

export type Dict = (typeof translations)["fr"];

export const translations = {
  fr: {
    subtitle:
      "Qualification de leads B2B en pilote automatique · enrichissement + scoring ICP",
    hero: {
      badge: "Automatisation commerciale B2B",
      tagline:
        "Ne perdez plus de temps avec les faux profils. LeadPilot enrichit, score et trie vos leads entrants automatiquement · vous ne parlez qu'aux bons.",
      ctaPrimary: "Essayer la démo",
      ctaSecondary: "Comment ça marche",
      metrics: [
        { v: "< 2s", l: "par lead" },
        { v: "97%", l: "faux profils filtrés" },
        { v: "0", l: "saisie manuelle" },
        { v: "24/7", l: "en pilote auto" },
      ],
    },
    demo: {
      badge: "Démo en direct",
      title: "Essayez vous-même",
      subtitle:
        "Soumettez un email comme le ferait un prospect : l'enrichissement, le score et le verdict s'affichent en temps réel.",
    },
    workflow: {
      badge: "En coulisses",
      title: "Le workflow d'automatisation",
      subtitle:
        "Le même processus, orchestré en no-code avec n8n · importable tel quel.",
      caption: "Workflow n8n : workflow-qualification-leads.json",
      target: "cible",
      off: "hors-cible",
      trigger: "Déclencheur",
      enrich: "Enrichissement",
      score: "Scoring ICP",
      ifq: "Lead qualifié ?",
      person: "Créer Personne",
      deal: "Créer Deal",
      notify: "Notifier l'équipe",
      reject: "Email de refus",
    },
    funnel: {
      received: "Reçus",
      qualified: "Qualifiés",
      rejected: "Hors-cible",
      rate: "Taux qualif.",
    },
    form: {
      title: "Simuler une soumission de formulaire",
      email: "Email",
      name: "Nom complet",
      message: "Message du prospect (intention d'achat)",
      messagePlaceholder:
        "Bonjour, nous évaluons des outils ce trimestre, budget 50k EUR, déjà sur HubSpot...",
      messageHint:
        "Analyse contextuelle : budget, timing, besoin, concurrent cité (+30 pts max).",
      submit: "Qualifier le lead",
      examples: "Exemples :",
      ex: {
        target1: "acme-corp.com (cible)",
        target2: "globex.io (cible)",
        personal: "gmail.com (perso)",
        tiny: "startup-tiny.fr (trop petit)",
      },
    },
    table: {
      title: "Leads qualifiés",
      email: "Email",
      company: "Entreprise",
      role: "Poste",
      size: "Taille",
      score: "Score",
      intent: "Intent",
      status: "Statut",
      source: "Source",
      empty: "Aucun lead. Soumets-en un ci-dessus.",
      target: "CIBLE",
      offTarget: "HORS-CIBLE",
    },
    how: {
      title: "Comment ça marche",
      steps: [
        {
          t: "1. Capture",
          d: "Un prospect remplit un formulaire (Typeform, Tally, Google Forms). LeadPilot reçoit la soumission via webhook.",
        },
        {
          t: "2. Enrichissement",
          d: "L'email est enrichi automatiquement (entreprise, taille, poste, secteur) via Hunter.io / Clearbit.",
        },
        {
          t: "3. Scoring ICP",
          d: "Un score de 0 à 100 est calculé selon ton profil cible : taille, séniorité, secteur, pays.",
        },
        {
          t: "4. Routing",
          d: "Lead cible → créé dans le CRM + notification commerciale. Hors-cible → email de refus poli automatisé.",
        },
      ],
    },
    features: {
      title: "Fonctionnalités",
      items: [
        { t: "Enrichissement automatique", d: "De l'email seul aux données firmographiques complètes." },
        { t: "Scoring ICP configurable", d: "Critères pondérés : taille, séniorité, secteur, géographie." },
        { t: "Routing intelligent", d: "CRM + notification pour les cibles, refus poli pour le reste." },
        { t: "Anti faux-profils", d: "Les emails personnels (gmail, yahoo…) sont écartés automatiquement." },
        { t: "Funnel en temps réel", d: "Suivi reçus → qualifiés → CRM, mesuré par source." },
        { t: "Multi-formulaires", d: "Typeform, Tally, Google Forms via un webhook unifié." },
      ],
    },
    footerProduct: "Un produit Wikolabs",
  },
  en: {
    subtitle: "B2B lead qualification on autopilot · enrichment + ICP scoring",
    hero: {
      badge: "B2B sales automation",
      tagline:
        "Stop wasting time on fake profiles. LeadPilot enriches, scores and sorts your inbound leads automatically · you only talk to the right ones.",
      ctaPrimary: "Try the demo",
      ctaSecondary: "How it works",
      metrics: [
        { v: "< 2s", l: "per lead" },
        { v: "97%", l: "fake profiles filtered" },
        { v: "0", l: "manual entry" },
        { v: "24/7", l: "on autopilot" },
      ],
    },
    demo: {
      badge: "Live demo",
      title: "Try it yourself",
      subtitle:
        "Submit an email like a prospect would: enrichment, score and verdict appear in real time.",
    },
    workflow: {
      badge: "Behind the scenes",
      title: "The automation workflow",
      subtitle: "The same process, orchestrated no-code with n8n · ready to import.",
      caption: "n8n workflow: workflow-qualification-leads.json",
      target: "target",
      off: "off-target",
      trigger: "Trigger",
      enrich: "Enrichment",
      score: "ICP scoring",
      ifq: "Lead qualified?",
      person: "Create Person",
      deal: "Create Deal",
      notify: "Notify team",
      reject: "Rejection email",
    },
    funnel: {
      received: "Received",
      qualified: "Qualified",
      rejected: "Off-target",
      rate: "Qual. rate",
    },
    form: {
      title: "Simulate a form submission",
      email: "Email",
      name: "Full name",
      message: "Prospect message (purchase intent)",
      messagePlaceholder:
        "Hi, we're evaluating tools this quarter, budget 50k EUR, already on HubSpot...",
      messageHint:
        "Contextual analysis: budget, timing, need, competitor mentioned (+30 pts max).",
      submit: "Qualify lead",
      examples: "Examples:",
      ex: {
        target1: "acme-corp.com (target)",
        target2: "globex.io (target)",
        personal: "gmail.com (personal)",
        tiny: "startup-tiny.fr (too small)",
      },
    },
    table: {
      title: "Qualified leads",
      email: "Email",
      company: "Company",
      role: "Role",
      size: "Size",
      score: "Score",
      intent: "Intent",
      status: "Status",
      source: "Source",
      empty: "No leads yet. Submit one above.",
      target: "TARGET",
      offTarget: "OFF-TARGET",
    },
    how: {
      title: "How it works",
      steps: [
        {
          t: "1. Capture",
          d: "A prospect fills out a form (Typeform, Tally, Google Forms). LeadPilot receives the submission via webhook.",
        },
        {
          t: "2. Enrichment",
          d: "The email is automatically enriched (company, size, role, industry) via Hunter.io / Clearbit.",
        },
        {
          t: "3. ICP scoring",
          d: "A 0–100 score is computed against your target profile: size, seniority, industry, country.",
        },
        {
          t: "4. Routing",
          d: "Target lead → created in the CRM + sales notification. Off-target → polite automated rejection email.",
        },
      ],
    },
    features: {
      title: "Features",
      items: [
        { t: "Automatic enrichment", d: "From a bare email to full firmographic data." },
        { t: "Configurable ICP scoring", d: "Weighted criteria: size, seniority, industry, geography." },
        { t: "Smart routing", d: "CRM + notification for targets, polite rejection for the rest." },
        { t: "Anti fake-profiles", d: "Personal emails (gmail, yahoo…) are filtered out automatically." },
        { t: "Real-time funnel", d: "Track received → qualified → CRM, measured by source." },
        { t: "Multi-form", d: "Typeform, Tally, Google Forms through one unified webhook." },
      ],
    },
    footerProduct: "A Wikolabs product",
  },
};
