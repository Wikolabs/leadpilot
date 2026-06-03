"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";

export function LeadForm({ onSubmit }: { onSubmit: (email: string, name: string) => void }) {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const examples: [string, string, string][] = [
    ["marie@acme-corp.com", "Marie Dupont", t.form.ex.target1],
    ["paul@globex.io", "Paul Martin", t.form.ex.target2],
    ["jean@gmail.com", "Jean Bricoleur", t.form.ex.personal],
    ["leo@startup-tiny.fr", "Léo Petit", t.form.ex.tiny],
  ];

  return (
    <div>
      <form
        className="flex flex-wrap items-end gap-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          if (email) onSubmit(email, name);
          setEmail("");
          setName("");
        }}
      >
        <label className="flex w-full flex-col gap-1 text-xs text-muted sm:w-auto">
          {t.form.email}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marie@acme-corp.com"
            className="w-full rounded-lg border border-border bg-[#0b1220] px-2.5 py-2 text-ink sm:w-[240px]"
          />
        </label>
        <label className="flex w-full flex-col gap-1 text-xs text-muted sm:w-auto">
          {t.form.name}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marie Dupont"
            className="w-full rounded-lg border border-border bg-[#0b1220] px-2.5 py-2 text-ink sm:w-[240px]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:brightness-110 sm:w-auto"
        >
          {t.form.submit}
        </button>
      </form>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">{t.form.examples}</span>
        {examples.map(([ex, exName, label]) => (
          <button
            key={ex}
            onClick={() => onSubmit(ex, exName)}
            className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-xs hover:brightness-110"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
