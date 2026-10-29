"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Info, ChevronDown, ChevronUp, Database, ExternalLink, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import locales from '../../locales/en.json';
import ShieldText from '../../components/ShieldText';

export default function SpeculativeResearchPage() {
  const [ckbData, setCkbData] = useState(null);
  const [expandedChapterId, setExpandedChapterId] = useState(null);

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
          
          // Parameter deep linking support
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const node = params.get('node') || params.get('id');
            if (node && (node.includes('mewe') || node.includes('interlude') || node.includes('reminders') || node.includes('one-road') || node.includes('what-not-to-do'))) {
              setExpandedChapterId(node);
            }
          }
        }
      } catch (err) {
        console.error("Error loading CKB data in narrative page:", err);
      }
    }
    loadData();
  }, []);

  const getArticleTitle = (id) => {
    if (!ckbData || !ckbData.writing) return id;
    let found = null;
    Object.values(ckbData.writing).forEach(list => {
      const art = list.find(w => w.id === id || w.id === `write-${id}`);
      if (art) found = art.title;
    });
    return found || id;
  };

  const getProjectTitle = (id) => {
    if (!ckbData || !ckbData.projects) return id;
    const p = ckbData.projects.find(proj => proj.id === id);
    return p ? p.title : id;
  };

  // Mappings of MeWe chapters to the enduring questions they explore
  const questionExploringMap = {
    "write-meta-reminders": "How do organizations make better decisions? & How should uncertainty be managed?",
    "write-road2mewe": "How do communities coordinate? & What creates trust?",
    "write-road2mewe-v2": "How do data and stories work together? & How should expertise be represented?",
    "write-road2mewe-v3": "How do systems become resilient? & How do communities coordinate?",
    "write-one-road-maybe-two": "How do communities coordinate? & What creates trust?",
    "write-what-not-to-do": "What causes alignment failures? & How do institutions fail?",
    "write-interlude-kindness-alibi": "What creates trust? & How do systems become resilient?",
    "write-interlude-phoenix-rebirth": "How do systems become resilient? & How do organizations learn?",
    "write-interlude-trust-me": "What creates trust? & How do data and stories work together?",
    "write-interlude-trust-mewe": "How do communities coordinate? & What creates trust?",
    "write-interlude-interconnected-jugalbandhi": "How should humans and AI collaborate? & How do systems become resilient?"
  };

  // Mappings of MeWe chapters to related projects/articles
  const relatedEvidenceMap = {
    "write-meta-reminders": { projects: ["proj-axelrod"], articles: ["write-how-not-to-be-decision-mechanic"] },
    "write-road2mewe": { projects: ["proj-decision-labs"], articles: ["write-dichotomy"] },
    "write-road2mewe-v2": { projects: ["proj-smart-waste"], articles: ["write-principles-of-good-data-analysis"] },
    "write-road2mewe-v3": { projects: ["proj-smart-waste"], articles: ["write-antifragile-notes-and-review"] },
    "write-one-road-maybe-two": { projects: ["proj-decision-labs"], articles: ["write-effects-of-vipassana"] },
    "write-what-not-to-do": { projects: ["proj-smart-waste"], articles: ["write-efficiency-vs-effectiveness", "write-stack-ranking-16"] },
    "write-interlude-kindness-alibi": { projects: ["proj-decision-labs"], articles: ["write-leakcraft"] },
    "write-interlude-phoenix-rebirth": { projects: ["proj-smart-waste"], articles: ["write-low-level-systems-debugging"] },
    "write-interlude-trust-me": { projects: ["proj-axelrod"], articles: ["write-dichotomy"] },
    "write-interlude-trust-mewe": { projects: ["proj-decision-labs"], articles: ["write-leakcraft"] },
    "write-interlude-interconnected-jugalbandhi": { projects: ["proj-smart-waste"], articles: ["write-technical-debt-in-ml-models"] }
  };

  const getMeweArticles = () => {
    if (!ckbData) return [];
    const list = [];
    Object.values(ckbData.writing).forEach(subList => {
      subList.forEach(item => {
        if (
          item.id.includes('mewe') || 
          item.id.includes('interlude') || 
          item.id.includes('reminders') || 
          item.id.includes('one-road') || 
          item.id.includes('what-not-to-do')
        ) {
          list.push(item);
        }
      });
    });
    return list;
  };

  const meweList = getMeweArticles();

  const toggleChapter = (id) => {
    if (expandedChapterId === id) {
      setExpandedChapterId(null);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('node');
        window.history.pushState({}, '', url);
      }
    } else {
      setExpandedChapterId(id);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('node', id);
        window.history.pushState({}, '', url);
      }
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-12">
      
      {/* Intro Header */}
      <section className="space-y-4 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
          {t('v2.narrative.title')}
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
          {t('v2.narrative.subtitle')}
        </p>
      </section>

      {/* Speculative Research Philosophy Card */}
      <section className="card bg-indigo-950/10 border-indigo-900/30 p-6 space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Speculative Systems Research
        </h3>
        <ShieldText className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {t('v2.narrative.research_philosophy')}
        </ShieldText>
      </section>

      {/* AI Disclosure Card */}
      <section className="card bg-slate-900/25 border-slate-850 p-6 space-y-3 flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-950/60 text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-900/60 flex-shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {t('v2.narrative.disclosure_title')}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('v2.narrative.disclosure_desc')}
          </p>
        </div>
      </section>

      {/* Chapters Accordion */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
          Thought Experiments & Chapters
        </h3>
        
        {meweList.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-10">No narrative chapters loaded.</div>
        ) : (
          <div className="space-y-3">
            {meweList.map((chapter) => {
              const isExpanded = expandedChapterId === chapter.id;
              const question = questionExploringMap[chapter.id] || "Socio-political systems and coordination models.";
              const evidence = relatedEvidenceMap[chapter.id];
              
              return (
                <div 
                  key={chapter.id} 
                  className={`card transition-all duration-300 ${isExpanded ? 'border-indigo-900/50 bg-slate-900/40' : 'hover:border-slate-800 bg-slate-950/20'}`}
                >
                  {/* Collapsed Header */}
                  <button 
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <div className="space-y-1 pr-4">
                      <span className="bg-indigo-950/40 text-indigo-400 border border-indigo-900/60 text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                        AI-Assisted Speculative Research
                      </span>
                      <h4 className="text-base font-bold text-slate-100 mt-1.5 leading-snug">
                        {chapter.title}
                      </h4>
                      <ShieldText className="text-xs text-slate-400 font-medium italic">
                        {chapter.summary}
                      </ShieldText>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-slate-850 space-y-6 animate-fadeIn">
                      
                      {/* What Question is it Exploring? */}
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 flex items-start gap-2.5">
                        <span className="text-[10px] bg-indigo-900/40 text-indigo-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-0.5">
                          Inquiry
                        </span>
                        <div className="text-xs text-slate-300">
                          <strong className="text-slate-400 font-mono">Enduring Question:</strong>{" "}
                          <span className="italic font-medium text-indigo-300">{question}</span>
                        </div>
                      </div>

                      {/* Full Story Content - Protected via Private ShieldFont */}
                      <ShieldText as="div" className="prose prose-invert prose-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap max-w-none text-xs md:text-sm pl-2">
                        {chapter.content}
                      </ShieldText>

                      {/* Related Evidence Footer */}
                      {evidence && (
                        <div className="pt-6 border-t border-slate-850 space-y-4">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                            Interconnected Systems Evidence
                          </span>
                          <div className="flex flex-wrap gap-3 text-xxs">
                            {/* Related Projects */}
                            {evidence.projects.map(pId => (
                              <a 
                                key={pId}
                                href={`/portfolio?id=${pId}`}
                                className="flex items-center gap-1 bg-slate-950 hover:bg-indigo-950/30 text-indigo-400 hover:text-indigo-300 border border-slate-850 hover:border-indigo-900/60 px-2.5 py-1.5 rounded-lg transition-all"
                              >
                                <span>Project: {getProjectTitle(pId)}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            ))}
                            {/* Related Articles */}
                            {evidence.articles.map(aId => (
                              <a 
                                key={aId}
                                href={`/career?node=${aId}`}
                                className="flex items-center gap-1 bg-slate-950 hover:bg-emerald-950/20 text-emerald-400 hover:text-emerald-300 border border-slate-850 hover:border-emerald-900/60 px-2.5 py-1.5 rounded-lg transition-all"
                              >
                                <span>Article: {getArticleTitle(aId)}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
