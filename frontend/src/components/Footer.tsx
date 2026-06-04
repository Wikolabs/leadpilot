"use client";

import { useLang } from "./LangProvider";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted sm:px-8">
      © 2026 LeadPilot · {t.footerProduct},{" "}
      <a href="mailto:team@wikolabs.com" className="text-blue-400 hover:underline">
        team@wikolabs.com
      </a>
    </footer>
  );
}
