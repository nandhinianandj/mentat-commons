"use client";

import React, { useState, useEffect } from 'react';
import { Compass, Briefcase, Terminal, ArrowLeft, ExternalLink, Shield, Cpu, Lightbulb, CheckCircle } from 'lucide-react';
import locales from '../../locales/en.json';

export default function PortfolioPage() {
  const [ckbData, setCkbData] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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
          
          // Parse query parameter to select a project immediately
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const pId = params.get('id') || params.get('project');
            if (pId && data.projects.some(p => p.id === pId)) {
              setSelectedProjectId(pId);
            }
          }
        }
      } catch (err) {
        console.error("Error loading CKB data in portfolio:", err);
      }
    }
    loadData();
  }, []);

  const projects = ckbData?.projects || [];
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.pushState({}, '', url);
    }
  };

  const handleClearSelection = () => {
    setSelectedProjectId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url);
    }
  };

  // Static articles mapping for related links
  const relatedArticlesMap = {
    "proj-axelrod": ["write-how-not-to-be-decision-mechanic", "write-dichotomy", "write-my-stock-market-dabblings"],
    "proj-smart-waste": ["write-alignment-ai-agents-future-of-swe", "write-exploring-the-chestxray14-dataset-problems", "write-shotdetect-logic"],
    "proj-solar-optimization": ["write-low-level-systems-debugging", "write-systems-optimization-playbook"],
    "proj-decision-labs": ["write-efficiency-vs-effectiveness", "write-effects-of-vipassana", "write-leakcraft"]
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

  if (!ckbData) {
    return (
      <div className="container text-center py-20">
        <div className="text-slate-400 text-sm animate-pulse">Loading case studies...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      {!selectedProject ? (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-50">
            {t('v2.portfolio.title')}
          </h2>
          <p className="text-sm text-slate-400">
            {t('v2.portfolio.subtitle')}
          </p>
        </div>
      ) : (
        <button 
          onClick={handleClearSelection}
          className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Studies</span>
        </button>
      )}

      {/* Grid List View */}
      {!selectedProject ? (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              className="card bg-slate-950/20 hover:border-indigo-900/40 hover:bg-slate-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                  {proj.organization}
                </span>
                <h3 className="text-lg font-bold text-slate-100 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {proj.problem}
                </p>
              </div>
              <div className="pt-6">
                <button 
                  onClick={() => handleSelectProject(proj.id)}
                  className="w-full text-center bg-slate-900 hover:bg-indigo-950/40 text-slate-300 hover:text-indigo-300 text-xs font-semibold py-2.5 rounded-lg border border-slate-800 hover:border-indigo-900/60 transition-all"
                >
                  Explore Case Study
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Case Study Deep-dive Detail View */
        <article className="card bg-slate-900/10 border-slate-850 p-6 md:p-8 space-y-8 animate-fadeIn">
          
          {/* Title header */}
          <div className="space-y-2 pb-6 border-b border-slate-850">
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
              Case Study // {selectedProject.organization}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 leading-tight">
              {selectedProject.title}
            </h1>
          </div>

          {/* Problem & Context Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/40 border border-slate-850/60 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-500" />
                Problem Scoped
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedProject.problem}
              </p>
            </div>
            <div className="bg-slate-950/40 border border-slate-850/60 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                Context & Scoping
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedProject.context}
              </p>
            </div>
          </div>

          {/* Approach & Solution Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
              Approach & Architecture
            </h3>
            <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Solution Architecture</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.solution}</p>
              </div>
              {selectedProject.architecture && (
                <div className="space-y-1 pt-2 border-t border-slate-850/40">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Implementation Details</span>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">{selectedProject.architecture}</p>
                </div>
              )}
            </div>
          </div>

          {/* Decisions & Trade-offs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engineering Decisions</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.decisions}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantified Trade-offs</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.tradeoffs}</p>
            </div>
          </div>

          {/* Outcomes & Impact Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
              Outcomes & Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProject.outcomes && selectedProject.outcomes.map((out, idx) => (
                <div key={idx} className="flex gap-2.5 items-start bg-emerald-950/10 border border-emerald-900/20 p-3 rounded-lg text-xs text-emerald-400">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="leading-normal">{out}</span>
                </div>
              ))}
              {selectedProject.impact && selectedProject.impact.map((imp, idx) => (
                <div key={idx} className="flex gap-2.5 items-start bg-indigo-950/20 border border-indigo-900/25 p-3 rounded-lg text-xs text-indigo-300">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="leading-normal">{imp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reusable Lessons / Stories */}
          {selectedProject.reusable_stories && selectedProject.reusable_stories.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
                Lessons & Organizational Stories
              </h3>
              <ul className="space-y-2">
                {selectedProject.reusable_stories.map((story, idx) => (
                  <li key={idx} className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{story}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Footer */}
          <div className="pt-6 border-t border-slate-850 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-2">Technologies Used</span>
            {selectedProject.technologies.map(tech => (
              <span key={tech} className="bg-slate-950 border border-slate-850 text-slate-300 font-mono text-[10px] px-2.5 py-1 rounded-md">
                {tech}
              </span>
            ))}
          </div>

          {/* Interconnected Articles Footer */}
          {relatedArticlesMap[selectedProject.id] && (
            <div className="pt-6 border-t border-slate-850 space-y-3">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block">
                Related Research & Writing (Interconnected Evidence)
              </span>
              <div className="flex flex-col gap-2">
                {relatedArticlesMap[selectedProject.id].map(artId => (
                  <a 
                    key={artId}
                    href={`/career?node=${artId}`}
                    className="flex justify-between items-center bg-slate-950 hover:bg-indigo-950/15 border border-slate-850 hover:border-indigo-900/60 p-3 rounded-lg text-xs text-slate-300 hover:text-white transition-all group"
                  >
                    <span>{getArticleTitle(artId)}</span>
                    <ArrowLeft className="w-4 h-4 text-indigo-400 transform rotate-180 transition-transform group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </article>
      )}

    </div>
  );
}
