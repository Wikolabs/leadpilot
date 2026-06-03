"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Dict, type Lang } from "@/lib/i18n";

type LangContextValue = { lang: Lang; setLang: (l: Lang) => void; t: Dict };

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  // Persiste le choix de langue entre les visites.
  useEffect(() => {
    const saved = window.localStorage.getItem("lang") as Lang | null;
    if (saved === "fr" || saved === "en") setLang(saved);
  }, []);

  const update = (l: Lang) => {
    setLang(l);
    window.localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: update, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
