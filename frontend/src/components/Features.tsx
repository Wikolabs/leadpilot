"use client";

import { useLang } from "./LangProvider";

export function Features() {
  const { t } = useLang();
  return (
    <section className="mb-6 rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-[15px] font-semibold">{t.features.title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {t.features.items.map((f) => (
          <div key={f.t} className="flex gap-3 rounded-lg border border-border bg-[#0b1220] p-3.5">
            <span className="mt-0.5 text-green-400">✓</span>
            <div>
              <div className="text-[13px] font-semibold">{f.t}</div>
              <p className="text-xs leading-relaxed text-muted">{f.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
