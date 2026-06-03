"use client";

import type { Funnel } from "@/lib/api";
import { useLang } from "./LangProvider";

export function FunnelStats({ funnel }: { funnel: Funnel | null }) {
  const { t } = useLang();
  const cards: [string, string | number][] = [
    [t.funnel.received, funnel?.received ?? 0],
    [t.funnel.qualified, funnel?.qualified ?? 0],
    [t.funnel.rejected, funnel?.rejected ?? 0],
    [t.funnel.rate, `${Math.round((funnel?.qualification_rate ?? 0) * 100)}%`],
  ];
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {cards.map(([label, n]) => (
        <div
          key={label}
          className="min-w-[140px] flex-1 rounded-xl border border-border bg-card p-4"
        >
          <div className="text-2xl font-bold">{n}</div>
          <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
        </div>
      ))}
    </div>
  );
}
