"use client";

import React, { useState, useEffect } from 'react';
import { Compass, Briefcase, Terminal, ChevronDown, ChevronUp, Database, ArrowRight, ExternalLink } from 'lucide-react';
import locales from '../locales/en.json';

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

  return (
    <div className="container max-w-4xl mx-auto space-y-16">
      
      {/* Hero Intro */}
      <section className="text-center md:text-left space-y-4 pt-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-3xl">
          {t('v2.home.hero_title')}
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
          {t('v2.home.hero_subtitle')}
        </p>
        <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
          <a href="/training" className="cta text-sm">
            Work With Me <ArrowRight className="inline-block w-4 h-4 ml-1.5" />
          </a>
          <a href="/career" className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-slate-850">
            Browse the Evidence
          </a>
        </div>
      </section>

      {/* Enduring Questions Section */}
      <section className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-indigo-400 uppercase tracking-widest">
            {t('v2.home.questions_title')}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {t('v2.home.questions_subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {questionsList.map((q) => {
            const isExpanded = expandedQuestion === q.id;
            return (
              <div 
                key={q.id} 
                className={`card transition-all duration-300 ${isExpanded ? 'border-indigo-900/60 bg-slate-900/50' : 'hover:border-slate-800 bg-slate-950/20'}`}
              >
                <button 
                  onClick={() => toggleQuestion(q.id)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="font-semibold text-slate-100 text-sm md:text-base leading-snug">
                    {q.text}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-indigo-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0 ml-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-850 space-y-4 animate-fadeIn">
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                      {q.description}
                    </p>

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

                      {/* Related Articles */}
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
              </div>
            );
          })}
        </div>
      </section>

      {/* Career Axes */}
      <section className="space-y-6 pt-4">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-indigo-400 uppercase tracking-widest">
            {t('v2.home.axes_title')}
          </h3>
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
