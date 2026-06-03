"use client";

import { useLang } from "./LangProvider";
import type { Lang } from "@/lib/i18n";

export function LangSwitch() {
  const { lang, setLang } = useLang();
  const langs: Lang[] = ["fr", "en"];

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-border text-xs">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 font-semibold uppercase transition-colors ${
            lang === l ? "bg-blue-600 text-white" : "text-muted hover:bg-card"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
