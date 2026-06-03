"use client";

import { useCallback, useEffect, useState } from "react";
import { getFunnel, getLeads, submitLead, type Funnel, type Lead } from "@/lib/api";
import { useLang } from "@/components/LangProvider";
import { Hero } from "@/components/Hero";
import { FunnelStats } from "@/components/FunnelStats";
import { HowItWorks } from "@/components/HowItWorks";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { Features } from "@/components/Features";
import { LeadForm } from "@/components/LeadForm";
import { LeadTable } from "@/components/LeadTable";
import { Footer } from "@/components/Footer";

export default function Dashboard() {
  const { t } = useLang();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [funnel, setFunnel] = useState<Funnel | null>(null);

  const refresh = useCallback(async () => {
    const [l, f] = await Promise.all([getLeads(), getFunnel()]);
    setLeads(l);
    setFunnel(f);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSubmit = useCallback(
    async (email: string, name: string, message: string) => {
      await submitLead(email, name, message);
      refresh();
    },
    [refresh],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Hero />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8 sm:py-12">
        {/* 1. Pédagogie : ce que fait le produit */}
        <div id="how" className="scroll-mt-8">
          <HowItWorks />
        </div>

        {/* 2. Le workflow d'automatisation (visuel n8n) */}
        <section className="mb-6">
          <div className="mb-4">
            <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted">
              {t.workflow.badge}
            </span>
            <h2 className="mt-3 text-2xl font-bold">{t.workflow.title}</h2>
            <p className="mt-1 text-[13px] text-muted">{t.workflow.subtitle}</p>
          </div>
          <WorkflowDiagram />
          <p className="mt-2 text-center text-xs text-muted">{t.workflow.caption}</p>
        </section>

        {/* 3. Fonctionnalités */}
        <Features />

        {/* 3. Démo interactive clairement identifiée */}
        <section
          id="demo"
          className="scroll-mt-8 rounded-2xl border border-blue-500/30 bg-blue-500/[0.04] p-4 sm:p-6"
        >
          <div className="mb-5 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              {t.demo.badge}
            </span>
            <h2 className="mt-3 text-2xl font-bold">{t.demo.title}</h2>
            <p className="mx-auto mt-2 max-w-lg text-[13px] text-muted">{t.demo.subtitle}</p>
          </div>

          <FunnelStats funnel={funnel} />

          <div className="mb-5 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="mb-3.5 text-[15px] font-semibold">{t.form.title}</h3>
            <LeadForm onSubmit={handleSubmit} />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="mb-3.5 text-[15px] font-semibold">{t.table.title}</h3>
            <LeadTable leads={leads} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
