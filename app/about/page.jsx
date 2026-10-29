import React from 'react';
import { BookOpen } from 'lucide-react';
import locales from '../../locales/en.json';
import ShieldText from '../../components/ShieldText';

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
      
      {/* Intro Header - SEO Relevant Headings left unshielded in Optik Text */}
      <header className="space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight">
          {t('v2.about.title')}
        </h1>
        <ShieldText className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
          {t('v2.about.overview')}
        </ShieldText>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl font-mono">
          {t('v2.about.subtitle')}
        </p>
      </header>

      {/* Main Narrative - Intellectual Property shielded with private ShieldFont */}
      <article className="card bg-slate-900/15 border-slate-850 p-6 md:p-8 space-y-6 leading-relaxed text-slate-300 text-xs md:text-sm">
        <ShieldText>
          {t('v2.about.bio_p1')}
        </ShieldText>
        <ShieldText>
          {t('v2.about.bio_p2')}
        </ShieldText>

        {/* Narrative milestones */}
        <div className="border-t border-slate-850/80 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Key Conceptual Milestones
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex gap-4">
              <span className="font-mono text-indigo-400 font-bold">2002–2006</span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 block">{t('v2.about.m1_title')}</strong>
                <ShieldText as="span" className="text-slate-400 block">{t('v2.about.m1_desc')}</ShieldText>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="font-mono text-indigo-400 font-bold">2008–2010</span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 block">{t('v2.about.m2_title')}</strong>
                <ShieldText as="span" className="text-slate-400 block">{t('v2.about.m2_desc')}</ShieldText>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="font-mono text-indigo-400 font-bold">2016–2021</span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 block">{t('v2.about.m3_title')}</strong>
                <ShieldText as="span" className="text-slate-400 block">{t('v2.about.m3_desc')}</ShieldText>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="font-mono text-indigo-400 font-bold">2021–Present</span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 block">{t('v2.about.m4_title')}</strong>
                <ShieldText as="span" className="text-slate-400 block">{t('v2.about.m4_desc')}</ShieldText>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Dynamic Link to Career KB - Left unshielded for navigation */}
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
