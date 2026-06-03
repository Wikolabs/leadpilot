"use client";

import { useLang } from "./LangProvider";

export function HowItWorks() {
  const { t } = useLang();
  return (
    <section className="mb-6 rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-[15px] font-semibold">{t.how.title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.how.steps.map((s) => (
          <div key={s.t} className="rounded-lg border border-border bg-[#0b1220] p-4">
            <div className="mb-1.5 font-semibold text-blue-400">{s.t}</div>
            <p className="text-[13px] leading-relaxed text-muted">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
