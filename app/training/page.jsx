"use client";

import React, { useState, useEffect } from 'react';
import { Compass, Briefcase, Terminal, ArrowRight, ExternalLink, ShieldCheck, HeartHandshake, BookOpen } from 'lucide-react';
import locales from '../../locales/en.json';
import ShieldText from '../../components/ShieldText';

export default function ConsultingPage() {
  const [ckbData, setCkbData] = useState(null);

  // Localization helper
  const t = (key, defaultValue = '') => {
    const keys = key.split('.');
    let current = locales;
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        return defaultValue || key;
      }
    }
    return current;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/ckb/data');
        if (res.ok) {
          const data = await res.json();
          setCkbData(data);
        }
      } catch (err) {
        console.error("Error loading CKB data in consulting:", err);
      }
    }
    loadData();
  }, []);

  const getProjectTitle = (id) => {
    if (!ckbData || !ckbData.projects) return id;
    const p = ckbData.projects.find(proj => proj.id === id);
    return p ? p.title : id;
  };

  const getArticleTitle = (id) => {
    if (!ckbData || !ckbData.writing) return id;
    let found = null;
    Object.values(ckbData.writing).forEach(list => {
      const art = list.find(w => w.id === id || w.id === `write-${id}`);
      if (art) found = art.title;
    });
    return found || id;
  };

  const services = [
    {
      id: "srv-tech",
      title: t('v2.consulting.service1_title'),
      description: t('v2.consulting.service1_desc'),
      icon: Terminal,
      problems: [
        "ML pipelines that fail silently due to data dependency loops rather than compiler bugs.",
        "Resource-constrained hardware requiring extreme model pruning and edge-based quantization.",
        "Silent patient-data leakage in medical training sets leading to exaggerated model accuracy claims."
      ],
      projectIds: ["proj-smart-waste", "proj-solar-optimization"],
      articleIds: ["write-technical-debt-in-ml-models", "write-low-level-systems-debugging", "write-systems-optimization-playbook", "write-hiring-data-science-teams"]
    },
    {
      id: "srv-decision",
      title: t('v2.consulting.service2_title'),
      description: t('v2.consulting.service2_desc'),
      icon: ShieldCheck,
      problems: [
        "Engineering teams wasting months building complex analytics dashboards for unconstrained decision nodes.",
        "Misaligned employee performance incentives driven by statistical misapplication of normal distribution curves.",
        "Individual trading and forecasting biases deforming system design priors."
      ],
      projectIds: ["proj-axelrod"],
      articleIds: ["write-how-not-to-be-decision-mechanic", "write-dichotomy", "write-my-stock-market-dabblings", "write-principles-of-good-data-analysis"]
    },
    {
      id: "srv-human",
      title: t('v2.consulting.service3_title'),
      description: t('v2.consulting.service3_desc'),
      icon: HeartHandshake,
      problems: [
        "Vision transmission failures where managers enforce rigid templates that violate organizational intent.",
        "Layperson-expert communication gaps leading to diagnostic, scoping, and scheduling errors.",
        "Information overload eroding private thinking spaces and collapsing team psychological safety."
      ],
      projectIds: ["proj-decision-labs"],
      articleIds: ["write-efficiency-vs-effectiveness", "write-effects-of-vipassana", "write-leakcraft"]
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto space-y-12">
      
      {/* Header with Answer-First Summary */}
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
          {t('v2.consulting.title')}
        </h1>
        <ShieldText className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
          Mentat Commons provides specialized technical consulting, MLOps audits, and organizational decision systems engineering. We work directly with leadership to eliminate silent dataset decay, decouple fragile dependencies, and establish transparent metrics before capital is spent on vanity infrastructure.
        </ShieldText>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed font-mono">
          {t('v2.consulting.subtitle')}
        </p>
      </header>

      {/* Services Grid */}
      <section aria-labelledby="consulting-services-heading" className="space-y-8">
        <h2 id="consulting-services-heading" className="sr-only">Consulting Services & Practice Areas</h2>
        {services.map((srv) => {
          const Icon = srv.icon;
          return (
            <article key={srv.id} className="card bg-slate-900/25 border-slate-850 p-6 md:p-8 space-y-6">
              
              {/* Header block */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-950/60 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-900/60 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-100 leading-snug">
                    {srv.title}
                  </h3>
                  <ShieldText className="text-xs text-slate-400 leading-relaxed font-medium">
                    {srv.description}
                  </ShieldText>
                </div>
              </div>

              {/* Problems list */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest block">
                  Typical Problems We Can Solve Together
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {srv.problems.map((prob, idx) => (
                    <li 
                      key={idx} 
                      className="bg-slate-950/40 p-3 rounded-lg border border-slate-850/60 text-xs text-slate-300 leading-relaxed flex gap-2"
                    >
                      <span className="text-rose-500 font-bold">•</span>
                      <ShieldText as="span">{prob}</ShieldText>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interconnected Evidence Section */}
              <div className="pt-4 border-t border-slate-850/80 space-y-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Supporting Capability Evidence
                </span>
                
                <div className="space-y-2.5">
                  {/* Supporting case studies */}
                  {srv.projectIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 mr-2">Case Studies:</span>
                      {srv.projectIds.map(pId => (
                        <a 
                          key={pId}
                          href={`/portfolio?id=${pId}`}
                          className="flex items-center gap-1 bg-slate-950 hover:bg-indigo-950/30 text-indigo-400 hover:text-indigo-300 border border-slate-850 hover:border-indigo-900/60 px-2.5 py-1 rounded-md text-[10px] transition-all"
                        >
                          <span>{getProjectTitle(pId)}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Supporting research notes */}
                  {srv.articleIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 mr-2">Research:</span>
                      {srv.articleIds.map(aId => (
                        <a 
                          key={aId}
                          href={`/career?node=${aId}`}
                          className="flex items-center gap-1 bg-slate-950 hover:bg-emerald-950/20 text-emerald-400 hover:text-emerald-300 border border-slate-850 hover:border-emerald-900/60 px-2.5 py-1 rounded-md text-[10px] transition-all"
                        >
                          <span>{getArticleTitle(aId)}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </article>
          );
        })}
      </section>

      {/* CTA Footer */}
      <section className="card bg-slate-900/10 border-indigo-900/20 text-center p-8 space-y-4 max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-slate-100">Have a complex systems problem to scope?</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
          Let's align your organization's technical constraints, decision paths, and human facilitation systems. Emergent solutions come from evidence.
        </p>
        <div className="pt-2">
          <a href="/contact" className="cta text-xs">
            Initiate Project Scoping <ArrowRight className="inline-block w-4 h-4 ml-1.5" />
          </a>
        </div>
      </section>

    </div>
  );
}
