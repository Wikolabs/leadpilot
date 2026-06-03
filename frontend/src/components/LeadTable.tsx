"use client";

import type { Lead } from "@/lib/api";
import { useLang } from "./LangProvider";
import { ScoreGauge } from "./ScoreGauge";
import { StatusBadge } from "./StatusBadge";

const dash = <span className="text-muted">—</span>;

export function LeadTable({ leads }: { leads: Lead[] }) {
  const { t } = useLang();
  const headers = [
    t.table.email,
    t.table.company,
    t.table.role,
    t.table.size,
    t.table.score,
    t.table.status,
    t.table.source,
  ];
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
    <table className="w-full min-w-[620px] border-collapse">
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
            <td colSpan={7} className="px-2 py-4 text-muted">
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
