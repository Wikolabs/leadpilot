"use client";

import { useLang } from "./LangProvider";
import { LangSwitch } from "./LangSwitch";

export function Hero() {
  const { t } = useLang();
  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* halo décoratif */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-sm text-white">
              L
            </span>
            Lead<span className="-ml-1.5 text-blue-500">Pilot</span>
          </div>
          <LangSwitch />
        </div>

        <div className="mx-auto max-w-2xl py-10 text-center sm:py-12">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            {t.hero.badge}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Lead<span className="text-blue-500">Pilot</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            {t.hero.tagline}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#demo"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#how"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-card"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-x-8">
            {t.hero.metrics.map((m) => (
              <div key={m.l} className="text-center">
                <div className="text-2xl font-bold text-ink">{m.v}</div>
                <div className="text-xs text-muted">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
