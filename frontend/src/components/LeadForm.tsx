"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";

type ExampleFr = "target1" | "target2" | "personal" | "tiny";

const EXAMPLE_MESSAGES: Record<ExampleFr, { fr: string; en: string }> = {
  target1: {
    fr: "Bonjour, nous évaluons des outils d'outbound automation pour notre équipe de 8 SDR ce trimestre. Budget alloué ~50k EUR. Actuellement sur HubSpot.",
    en: "Hi, we're evaluating outbound automation tools for our 8-SDR team this quarter. Budget around 50k EUR. Currently on HubSpot.",
  },
  target2: {
    fr: "Nous comparons plusieurs solutions de sales engagement. Décision avant fin Q2.",
    en: "We're comparing several sales engagement solutions. Decision before end of Q2.",
  },
  personal: {
    fr: "Salut, juste pour info, je découvre un peu.",
    en: "Hey, just curious, having a look around.",
  },
  tiny: {
    fr: "Bonjour, on est 4 mais on veut scaler vite. Budget 20k€, décision ASAP. On compare avec Apollo.",
    en: "Hi, we're 4 but want to scale fast. Budget 20k EUR, decision ASAP. We're comparing with Apollo.",
  },
};

export function LeadForm({
  onSubmit,
}: {
  onSubmit: (email: string, name: string, message: string) => void;
}) {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const examples: [string, string, ExampleFr, string][] = [
    ["marie@acme-corp.com", "Marie Dupont", "target1", t.form.ex.target1],
    ["paul@globex.io", "Paul Martin", "target2", t.form.ex.target2],
    ["jean@gmail.com", "Jean Bricoleur", "personal", t.form.ex.personal],
    ["leo@startup-tiny.fr", "Léo Petit", "tiny", t.form.ex.tiny],
  ];

  return (
    <div>
      <form
        className="flex flex-col gap-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          if (email) onSubmit(email, name, message);
          setEmail("");
          setName("");
          setMessage("");
        }}
      >
        <div className="flex flex-wrap items-end gap-2.5">
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
        </div>
        <label className="flex w-full flex-col gap-1 text-xs text-muted">
          {t.form.message}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.form.messagePlaceholder}
            rows={3}
            className="w-full rounded-lg border border-border bg-[#0b1220] px-2.5 py-2 text-ink resize-y"
          />
          <span className="text-[10px] text-muted/80">{t.form.messageHint}</span>
        </label>
        <button
          type="submit"
          className="self-start rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:brightness-110"
        >
          {t.form.submit}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">{t.form.examples}</span>
        {examples.map(([ex, exName, key, label]) => (
          <button
            key={ex}
            onClick={() => onSubmit(ex, exName, EXAMPLE_MESSAGES[key][lang])}
            className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-xs hover:brightness-110"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
