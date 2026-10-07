"use client";

import React from 'react';
import { Compass, Briefcase, Terminal, BookOpen } from 'lucide-react';
import locales from '../../locales/en.json';

export default function AboutPage() {
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

  return (
    <div className="container max-w-3xl mx-auto space-y-12 animate-fadeIn">
      
      {/* Intro Header */}
      <header className="space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight">
          {t('v2.about.title')}
        </h1>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
          Mentat Commons is an independent AI Strategy, Machine Learning, and Decision Systems consultancy founded by Nandhini Anand Jeyahar. Combining 16+ years of systems architecture, cognitive science, and human facilitation, the studio designs fault-tolerant data pipelines, decision-action trees, and model monitoring frameworks for enterprise engineering organizations worldwide.
        </p>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl font-mono">
          {t('v2.about.subtitle')}
        </p>
      </header>

      {/* Main Narrative */}
      <article className="card bg-slate-900/15 border-slate-850 p-6 md:p-8 space-y-6 leading-relaxed text-slate-300 text-xs md:text-sm">
        <p>
          {t('v2.about.bio_p1')}
        </p>
        <p>
          {t('v2.about.bio_p2')}
        </p>

        {/* Narrative milestones */}
        <div className="border-t border-slate-850/80 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Key Conceptual Milestones
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex gap-4">
              <span className="font-mono text-indigo-400 font-bold">2002–2006</span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 block">Early Vision & Thread Profiling</strong>
                <span className="text-slate-400">Scoping machine vision quality inspections for screw thread profiles; early algorithms in C.</span>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="font-mono text-indigo-400 font-bold">2008–2010</span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 block">Cognitive Science & AGI Studies</strong>
                <span className="text-slate-400">M.Tech rejections redirected to a Master's in Cognitive Science; thesis in NLP. Deep dive into transhumanism and dynamical models.</span>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="font-mono text-indigo-400 font-bold">2016–2021</span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 block">Industrial Data Science Roles</strong>
                <span className="text-slate-400">Five years in business-to-data-science bridge positions, learning how organizations distort metric systems.</span>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="font-mono text-indigo-400 font-bold">2021–Present</span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 block">Systems Redesign & Applied Improv</strong>
                <span className="text-slate-400">Combining model monitoring, edge computing, MLOps, and Applied Theater for restorative coordination.</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Dynamic Link to Career KB */}
      <section className="text-center">
        <a 
          href="/career" 
          className="bg-slate-900 border border-slate-800 hover:border-indigo-900/60 hover:text-white px-6 py-3 rounded-xl text-xs md:text-sm font-semibold transition-all inline-flex items-center gap-2 text-slate-300"
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Explore the Career Evidence Graph</span>
        </a>
      </section>

    </div>
  );
}
