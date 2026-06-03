export type Enrichment = {
  company_name: string | null;
  employees: number;
  industry: string | null;
  title: string | null;
  seniority: string | null;
  country: string | null;
  is_personal?: boolean;
};

export type MessageSignals = {
  budget_mentioned?: boolean;
  budget_eur?: number | null;
  timing_mentioned?: boolean;
  timing_days?: number | null;
  has_specific_need?: boolean;
  mentions_competitor?: boolean;
  urgency_score?: number;
  reason?: string;
};

export type Lead = {
  id: string;
  email: string;
  full_name: string;
  source: string;
  score: number;
  status: "qualified" | "rejected" | "received";
  enrichment: Enrichment;
  breakdown: Record<string, number | string>;
  message: string;
  message_score: number;
  message_signals: MessageSignals;
  created_at: string;
};

export type Funnel = {
  received: number;
  qualified: number;
  rejected: number;
  qualification_rate: number;
};

// basePath is set in next.config.mjs but Next.js doesn't auto-prefix client-side fetch().
const BASE_PATH = "/offers/leadpilot/demo";

const json = (path: string, init?: RequestInit) =>
  fetch(`${BASE_PATH}/api/v1${path}`, init).then((r) => r.json());

export const getLeads = (): Promise<Lead[]> => json("/leads");
export const getFunnel = (): Promise<Funnel> => json("/analytics/funnel");

export const submitLead = (email: string, full_name: string, message: string = "") =>
  json("/webhook/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, full_name, message }),
  });
