"use client";

import type { Lead, MessageSignals } from "@/lib/api";
import { useLang } from "./LangProvider";
import { ScoreGauge } from "./ScoreGauge";
import { StatusBadge } from "./StatusBadge";

const dash = <span className="text-muted"> · </span>;

function IntentCell({ score, signals }: { score: number; signals?: MessageSignals }) {
  if (!score && !signals) return dash;
  const tags: string[] = [];
  if (signals?.budget_mentioned) tags.push("💰");
  if (signals?.timing_mentioned) tags.push("⏱");
  if (signals?.has_specific_need) tags.push("🎯");
  if (signals?.mentions_competitor) tags.push("🆚");
  const title = [
    signals?.budget_mentioned ? `Budget${signals.budget_eur ? ` ~${signals.budget_eur}€` : ""}` : null,
    signals?.timing_mentioned ? `Timing${signals.timing_days ? ` ~${signals.timing_days}j` : ""}` : null,
    signals?.has_specific_need ? "Besoin précis" : null,
    signals?.mentions_competitor ? "Concurrent cité" : null,
    typeof signals?.urgency_score === "number" ? `Urgence ${signals.urgency_score}/10` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="flex items-center gap-1.5" title={title || undefined}>
      <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-amber-300">
        +{score}
      </span>
      {tags.length > 0 && <span className="text-[11px]">{tags.join(" ")}</span>}
    </div>
  );
}

export function LeadTable({ leads }: { leads: Lead[] }) {
  const { t } = useLang();
  const headers = [
    t.table.email,
    t.table.company,
    t.table.role,
    t.table.size,
    t.table.score,
    t.table.intent,
    t.table.status,
    t.table.source,
  ];
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="text-[11px] uppercase text-muted">
            {headers.map((h) => (
              <th key={h} className="border-b border-border px-2 py-2.5 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-2 py-4 text-muted">
                {t.table.empty}
              </td>
            </tr>
          ) : (
            leads.map((l) => {
              const e = l.enrichment || ({} as Lead["enrichment"]);
              return (
                <tr key={l.id} className="text-[13px]">
                  <td className="border-b border-border px-2 py-2.5">{l.email}</td>
                  <td className="border-b border-border px-2 py-2.5">{e.company_name || dash}</td>
                  <td className="border-b border-border px-2 py-2.5">{e.title || dash}</td>
                  <td className="border-b border-border px-2 py-2.5">{e.employees || dash}</td>
                  <td className="border-b border-border px-2 py-2.5">
                    <ScoreGauge score={l.score} />
                  </td>
                  <td className="border-b border-border px-2 py-2.5">
                    <IntentCell score={l.message_score || 0} signals={l.message_signals} />
                  </td>
                  <td className="border-b border-border px-2 py-2.5">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="border-b border-border px-2 py-2.5 text-muted">{l.source}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
