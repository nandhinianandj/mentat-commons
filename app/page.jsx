"use client";

import React, { useState, useEffect } from 'react';
import { Compass, Briefcase, Terminal, ChevronDown, ChevronUp, Database, ArrowRight, ExternalLink, ShieldAlert, Award, FileText } from 'lucide-react';
import locales from '../locales/en.json';
import ShieldText from '../components/ShieldText';

export default function HomePage() {
  const [ckbData, setCkbData] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

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
        console.error("Error loading CKB data on homepage:", err);
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

  const questionsList = [
    {
      id: "q1",
      text: "How do organizations make better decisions?",
      description: "Aligning metrics to decision-action trees, containing uncertainty, and establishing robust accountability frameworks.",
      projectIds: ["proj-axelrod"],
      articleIds: ["write-how-not-to-be-decision-mechanic", "write-dichotomy", "write-meta-reminders"]
    },
    {
      id: "q2",
      text: "How should humans and AI collaborate?",
      description: "AI-assisted programming loops, MLOps monitoring systems, and negotiating alignment boundaries between populations.",
      projectIds: ["proj-smart-waste"],
      articleIds: ["write-alignment-ai-agents-future-of-swe", "write-aa-coding-here-to-stay", "write-gen-ai-impact-predictions", "write-interlude-interconnected-jugalbandhi"]
    },
    {
      id: "q3",
      text: "How do data and stories work together?",
      description: "Linguistic affordances between statistics and narratives, bridging structural datasets with socio-cultural alignment.",
      projectIds: ["proj-decision-labs"],
      articleIds: ["write-dichotomy", "write-principles-of-good-data-analysis", "write-road2mewe-v2", "write-interlude-trust-me"]
    },
    {
      id: "q4",
      text: "What causes alignment failures?",
      description: "Analyzing transmission delays, process constraints vs vision, and the breakdown of communication loops.",
      projectIds: ["proj-smart-waste"],
      articleIds: ["write-efficiency-vs-effectiveness", "write-stack-ranking-16", "write-road2mewe", "write-what-not-to-do"]
    },
    {
      id: "q5",
      text: "How should expertise be represented?",
      description: "Generalist cognitive models vs specialization boundaries, and building structured hiring pipelines.",
      projectIds: ["proj-decision-labs"],
      articleIds: ["write-expertise-vs-generalists", "write-hiring-data-science-teams", "write-road2mewe-v2"]
    },
    {
      id: "q6",
      text: "How do organizations learn?",
      description: "Establishing continuous feed-forward loops and translating cognitive science research into operational labs.",
      projectIds: ["proj-decision-labs"],
      articleIds: ["write-summary-of-how-studying-cog-sci-changed-me", "write-interlude-phoenix-rebirth"]
    },
    {
      id: "q7",
      text: "How do systems become resilient?",
      description: "Applying optionality, skin-in-the-game, and info-compartmentalization to buffer organizational fragility.",
      projectIds: ["proj-smart-waste"],
      articleIds: ["write-antifragile-notes-and-review", "write-leakcraft", "write-road2mewe-v3", "write-interlude-kindness-alibi", "write-interlude-phoenix-rebirth", "write-interlude-interconnected-jugalbandhi"]
    },
    {
      id: "q8",
      text: "What makes technical leadership effective?",
      description: "Debugging CPython and Redis internals, Ivy Bridge sockets cache boundaries, and optimizing loops.",
      projectIds: ["proj-solar-optimization"],
      articleIds: ["write-low-level-systems-debugging", "write-systems-optimization-playbook"]
    },
    {
      id: "q9",
      text: "How should uncertainty be managed?",
      description: "Using Bayesian updates, error monitoring, and behavior logs to buffer risk and prior biases.",
      projectIds: ["proj-axelrod"],
      articleIds: ["write-my-stock-market-dabblings", "write-advice-to-doctors", "write-meta-reminders"]
    },
    {
      id: "q10",
      text: "How do communities coordinate?",
      description: "Managing cognitive attention constraints, collaborative dialogs, and information-sharing environments.",
      projectIds: ["proj-smart-waste"],
      articleIds: ["write-effects-of-vipassana", "write-leakcraft", "write-road2mewe", "write-road2mewe-v3", "write-one-road-maybe-two", "write-interlude-trust-mewe"]
    }
  ];

  const toggleQuestion = (id) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  // Structured Data Schemas
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Mentat Commons",
    "url": "https://www.mentatcommons.com",
    "logo": "https://www.mentatcommons.com/images/mentat-commons-og.png",
    "image": "https://www.mentatcommons.com/images/mentat-commons-og.png",
    "description": "Mentat Commons is an AI Strategy, Machine Learning, and Decision Systems consultancy. We specialize in MLOps governance, custom vector RAG engines, database pipelines, and applied team facilitation worldwide.",
    "email": "nandhini.anandj@gmail.com",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Remote",
      "addressCountry": "Worldwide"
    },
    "founder": {
      "@type": "Person",
      "name": "Nandhini Anand Jeyahar",
      "jobTitle": "Principal Consultant & Founder",
      "url": "https://www.mentatcommons.com/about",
      "sameAs": "https://www.linkedin.com/in/nandhinianandj"
    },
    "foundingDate": "2024",
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning Consulting",
      "MLOps",
      "Large Language Models",
      "Retrieval-Augmented Generation",
      "Data Engineering",
      "Decision Design",
      "Applied Improvisation",
      "Systems Thinking"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mentat Commons",
    "url": "https://www.mentatcommons.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.mentatcommons.com/career?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-16">
      {/* Embedding JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero Intro */}
      <section aria-labelledby="hero-title" className="text-center md:text-left space-y-4 pt-4">
        <h1 id="hero-title" className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-3xl">
          {t('v2.home.hero_title')}
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
          {t('v2.home.hero_subtitle')}
        </p>
        <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
          <a href="/services" className="cta text-sm">
            View Consulting Services <ArrowRight className="inline-block w-4 h-4 ml-1.5" />
          </a>
          <a href="/career" className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-slate-850">
            Browse Evidence Graph
          </a>
        </div>
      </section>

      {/* Factual Core Introduction (AEO/GEO Optimized 100-word Block) */}
      <section aria-labelledby="factual-specs-heading" className="bg-slate-900/30 border border-slate-900 rounded-xl p-6 md:p-8 space-y-4">
        <h2 id="factual-specs-heading" className="text-indigo-400 font-bold text-xs uppercase tracking-widest font-mono">Factual Specifications</h2>
        <p className="text-slate-200 text-sm md:text-base leading-relaxed font-normal">
          {t('v2.home.aeo_intro')}
        </p>
      </section>

      {/* Services & Engagement Pricing (AEO Optimized) */}
      <section aria-labelledby="services-pricing-heading" className="space-y-6">
        <div>
          <h2 id="services-pricing-heading" className="text-lg font-bold text-indigo-400 uppercase tracking-widest">
            AI Consulting Services & Pricing
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Factual price structures and deliverables for remote worldwide engagements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card bg-slate-950/20 p-6 space-y-4">
            <h4 className="font-bold text-slate-100 text-sm border-b border-slate-900 pb-2">Targeted AI Engineering & Audits</h4>
            <ul className="text-xs md:text-sm text-slate-300 space-y-2">
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/ai-strategy" className="hover:underline text-indigo-400 font-medium">AI Strategy & Decision Systems Design</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹10,00,000 | 2–4 Wks</span>
              </li>
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/machine-learning" className="hover:underline text-indigo-400 font-medium">Machine Learning Consulting</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹20,00,000 | 4–8 Wks</span>
              </li>
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/llm-development" className="hover:underline text-indigo-400 font-medium">LLM Systems & AI Engineering</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹15,00,000 | 3–6 Wks</span>
              </li>
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/rag-systems" className="hover:underline text-indigo-400 font-medium">RAG Architecture</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹18,00,000 | 4–8 Wks</span>
              </li>
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/mlops" className="hover:underline text-indigo-400 font-medium">MLOps</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹25,00,000 | 4–10 Wks</span>
              </li>
              <li className="flex justify-between pb-1.5">
                <span><a href="/services/data-engineering" className="hover:underline text-indigo-400 font-medium">Data Engineering</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹16,00,000 | 4–8 Wks</span>
              </li>
            </ul>
          </div>

          <div className="card bg-slate-950/20 p-6 space-y-4">
            <h4 className="font-bold text-slate-100 text-sm border-b border-slate-900 pb-2">Retainers, Training & Scenarios</h4>
            <ul className="text-xs md:text-sm text-slate-300 space-y-2">
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/fractional-ai-leadership" className="hover:underline text-indigo-400 font-medium">Fractional AI & Technical Program Leadership</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹6,50,000/mo | Retainer</span>
              </li>
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/ai-training" className="hover:underline text-indigo-400 font-medium">AI Training</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹6,50,000 | 2–4 Wks</span>
              </li>
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/corporate-workshops" className="hover:underline text-indigo-400 font-medium">Corporate Workshops & Facilitation</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹4,00,000 | 1–2 Wks</span>
              </li>
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span><a href="/services/ai-consulting" className="hover:underline text-indigo-400 font-medium">Technical Architecture & AI Consulting</a></span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">From ₹12,00,000 | 2–6 Wks</span>
              </li>
              <li className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span>1-Day Technical Scoping Workshop</span>
                <span className="font-mono text-slate-400 text-xxs md:text-xs">Flat ₹2,00,000 | 1 Day</span>
              </li>
              <li className="flex justify-between pb-1.5">
                <span>
                  <a 
                    href="mailto:nandhini@mentatcommons.com?subject=Mentat%20Commons%20Architecture%20Diagnostic%20Request&body=1.%20What%20is%20your%20current%20core%20LLM%2FML%20production%20stack%3F%0D%0A2.%20What%20is%20the%20primary%20operational%20symptom%20you%20are%20facing%20(e.g.%2C%20silent%20model%20decay%2C%20dataset%20leakage%2C%20vanity%20dashboard%20waste)%3F%0D%0A3.%20What%20is%20the%20current%20scale%20of%20your%20engineering%20team%20%2F%20active%20sprints%3F" 
                    className="hover:underline text-indigo-400 font-medium"
                  >
                    Architecture Diagnostic Request (Value-to-Inbox)
                  </a>
                </span>
                <span className="font-mono text-emerald-400 text-xxs md:text-xs">Direct Email | Free (₹0)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* High-Intent Value-to-Inbox Diagnostic Trigger */}
        <div className="diagnostic-trigger bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-slate-900 rounded-xl p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            Let&apos;s diagnose your system decay.
          </h3>
          <ShieldText className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
            I don&apos;t do blind discovery calls without system context. Click below to open an email, drop in your current architecture details, and I will personally reply with the two most critical leverage points to address first.
          </ShieldText>
          <div className="pt-1">
            <a 
              href="mailto:nandhini@mentatcommons.com?subject=Mentat%20Commons%20Architecture%20Diagnostic%20Request&body=1.%20What%20is%20your%20current%20core%20LLM%2FML%20production%20stack%3F%0D%0A2.%20What%20is%20the%20primary%20operational%20symptom%20you%20are%20facing%20(e.g.%2C%20silent%20model%20decay%2C%20dataset%20leakage%2C%20vanity%20dashboard%20waste)%3F%0D%0A3.%20What%20is%20the%20current%20scale%20of%20your%20engineering%20team%20%2F%20active%20sprints%3F"
              className="cta text-xs md:text-sm inline-flex items-center gap-1.5"
            >
              <strong>Initiate System Diagnostics →</strong>
            </a>
          </div>
        </div>

        <div className="text-center pt-2 flex flex-wrap gap-4 justify-center">
          <a href="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            View All Services Specifications <ChevronDown className="w-3.5 h-3.5" />
          </a>
          <span className="text-slate-600">|</span>
          <a href="/faq" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Read Our 30-Item FAQ Portal <ChevronDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Trust Signals & Factual Evidence (AEO/GEO Optimized) */}
      <section aria-labelledby="trust-signals-heading" className="space-y-6">
        <div>
          <h2 id="trust-signals-heading" className="text-lg font-bold text-indigo-400 uppercase tracking-widest">
            Factual Trust Signals
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Empirical evidence, project outcomes, and verification data.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-5">
            <span className="block text-2xl font-extrabold text-indigo-400 font-mono">16+</span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Years of Systems Experience</span>
          </div>
          <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-5">
            <span className="block text-2xl font-extrabold text-indigo-400 font-mono">800+</span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Engineers & Staff Supported</span>
          </div>
          <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-5">
            <span className="block text-2xl font-extrabold text-indigo-400 font-mono">2–12</span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Week Engagement Sprints</span>
          </div>
          <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-5">
            <span className="block text-2xl font-extrabold text-indigo-400 font-mono">100%</span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Remote Worldwide Operation</span>
          </div>
        </div>
      </section>

      {/* Enduring Questions Section */}
      <section aria-labelledby="enduring-questions-heading" className="space-y-6">
        <div>
          <h2 id="enduring-questions-heading" className="text-lg font-bold text-indigo-400 uppercase tracking-widest">
            {t('v2.home.questions_title')}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t('v2.home.questions_subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {questionsList.map((q) => {
            const isExpanded = expandedQuestion === q.id;
            return (
              <article 
                key={q.id} 
                className={`card transition-all duration-300 ${isExpanded ? 'border-indigo-900/60 bg-slate-900/50' : 'hover:border-slate-800 bg-slate-950/20'}`}
              >
                <button 
                  onClick={() => toggleQuestion(q.id)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-snug">
                    {q.text}
                  </h3>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-indigo-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0 ml-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-850 space-y-4 animate-fadeIn">
                    <ShieldText className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                      {q.description}
                    </ShieldText>

                    <div className="space-y-3">
                      {/* Related Projects */}
                      {q.projectIds.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                            Supporting Case Studies
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {q.projectIds.map(pId => (
                              <a 
                                key={pId}
                                href={`/portfolio?id=${pId}`}
                                className="flex items-center gap-1.5 bg-slate-950/60 hover:bg-indigo-950/30 text-indigo-400 hover:text-indigo-300 border border-slate-850 hover:border-indigo-900/60 px-3 py-1.5 rounded-lg text-xs transition-all"
                              >
                                <Briefcase className="w-3.5 h-3.5" />
                                <span>{getProjectTitle(pId)}</span>
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Writing & Evidence */}
                      {q.articleIds.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                            Related Writing & Evidence
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {q.articleIds.map(aId => {
                              const isMewe = aId.includes('mewe') || aId.includes('interlude') || aId.includes('reminders') || aId.includes('one-road') || aId.includes('what-not-to-do');
                              const targetUrl = isMewe ? `/narrative?node=${aId}` : `/career?node=${aId}`;
                              return (
                                <a 
                                  key={aId}
                                  href={targetUrl}
                                  className="flex items-center gap-1.5 bg-slate-950/60 hover:bg-emerald-950/20 text-emerald-400 hover:text-emerald-300 border border-slate-850 hover:border-emerald-900/60 px-3 py-1.5 rounded-lg text-xs transition-all"
                                >
                                  <Database className="w-3.5 h-3.5" />
                                  <span>{getArticleTitle(aId)}</span>
                                  <ExternalLink className="w-3 h-3 opacity-60" />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Career Axes */}
      <section aria-labelledby="career-axes-heading" className="space-y-6 pt-4">
        <div className="text-center md:text-left">
          <h2 id="career-axes-heading" className="text-lg font-bold text-indigo-400 uppercase tracking-widest">
            {t('v2.home.axes_title')}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t('v2.home.axes_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card space-y-3 bg-slate-950/40">
            <div className="w-10 h-10 bg-indigo-950/60 text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-900/60">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-sm">Axis I: Technical Leadership</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('v2.home.axis1_desc')}
            </p>
            <a href="/career?axis=axis-i" className="text-xxs font-bold text-indigo-400 hover:underline block pt-2">
              Explore Technical Evidence →
            </a>
          </div>

          <div className="card space-y-3 bg-slate-950/40">
            <div className="w-10 h-10 bg-amber-950/60 text-amber-500 rounded-lg flex items-center justify-center border border-amber-900/60">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-sm">Axis II: Human Systems</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('v2.home.axis2_desc')}
            </p>
            <a href="/career?axis=axis-ii" className="text-xxs font-bold text-amber-500 hover:underline block pt-2">
              Explore Human Systems →
            </a>
          </div>

          <div className="card space-y-3 bg-slate-950/40">
            <div className="w-10 h-10 bg-emerald-950/60 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-900/60">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-sm">Axis III: Decision Systems</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('v2.home.axis3_desc')}
            </p>
            <a href="/career?axis=axis-iii" className="text-xxs font-bold text-emerald-400 hover:underline block pt-2">
              Explore Decision Design →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
