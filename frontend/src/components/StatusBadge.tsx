"use client";

import { useLang } from "./LangProvider";

export function StatusBadge({ status }: { status: string }) {
  const { t } = useLang();
  const qualified = status === "qualified";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
        qualified
          ? "bg-green-500/15 text-green-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      {qualified ? t.table.target : t.table.offTarget}
    </span>
  );
}
