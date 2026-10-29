"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, BookOpen, Layers, ArrowRight, ShieldCheck, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import orgData from '../../data/organizational_systems.json';
import locales from '../../locales/en.json';
import ShieldText from '../../components/ShieldText';

export default function OrganizationalSystemsIndexPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const t = (key) => locales.org_systems[key] || key;

  const publishedItems = (orgData.items || []).filter(
    item => item.publication_status === 'published'
  );

  const filteredItems = publishedItems.filter(item => {
    if (activeFilter === 'all') return true;
    return item.content_type === activeFilter;
  });

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'field_case':
        return 'bg-amber-950/50 text-amber-300 border-amber-900/60';
      case 'essay':
        return 'bg-indigo-950/50 text-indigo-300 border-indigo-900/60';
      case 'field_note':
        return 'bg-emerald-950/50 text-emerald-300 border-emerald-900/60';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-800';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'field_case':
        return t('type_field_case');
      case 'essay':
        return t('type_essay');
      case 'field_note':
        return t('type_field_note');
      default:
        return type;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-12 py-4 animate-fadeIn">
      {/* Semantic Page Header - Unshielded for SEO */}
      <header className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/40 text-indigo-400 border border-indigo-900/60 rounded-full text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>Diagnostic Inquiry Portal</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
          {t('portal_title')}
        </h1>
        <ShieldText className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
          {orgData.introduction.description}
        </ShieldText>
      </header>

      {/* Working Thesis Callout Card */}
      <section className="card bg-slate-900/40 border-slate-800 p-6 md:p-8 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">
          {t('working_thesis_title')}
        </h2>
        <ShieldText as="blockquote" className="text-slate-200 text-sm md:text-base italic border-l-2 border-indigo-500 pl-4 py-1 leading-relaxed">
          &ldquo;{orgData.introduction.thesis}&rdquo;
        </ShieldText>
        <p className="text-xs text-slate-400 font-mono pt-1">
          A diagnostic lens for separating acute operational symptoms from systemic incentive failure.
        </p>
      </section>

      {/* Filter Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-850 hover:border-slate-800'
          }`}
        >
          {t('filter_all')} ({publishedItems.length})
        </button>
        <button
          onClick={() => setActiveFilter('field_case')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'field_case'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-850 hover:border-slate-800'
          }`}
        >
          {t('filter_cases')} ({publishedItems.filter(i => i.content_type === 'field_case').length})
        </button>
        <button
          onClick={() => setActiveFilter('essay')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'essay'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-850 hover:border-slate-800'
          }`}
        >
          {t('filter_essays')} ({publishedItems.filter(i => i.content_type === 'essay').length})
        </button>
      </div>

      {/* Articles Feed */}
      <section className="space-y-6" aria-label="Organizational Systems Articles">
        {filteredItems.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-12">{t('empty_filter')}</p>
        ) : (
          filteredItems.map(item => (
            <article
              key={item.id}
              className="card bg-slate-950/20 hover:border-slate-800 transition-all p-6 md:p-8 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border font-mono ${getBadgeStyle(item.content_type)}`}>
                    {getTypeName(item.content_type)}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">•</span>
                  <span className="text-slate-400 text-xs font-mono">{item.reading_time}</span>
                  {item.published_at && (
                    <>
                      <span className="text-slate-500 text-xs font-mono">•</span>
                      <span className="text-slate-500 text-xs font-mono">{item.published_at}</span>
                    </>
                  )}
                </div>

                <Link href={`/organizational-systems/${item.slug}`}>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-100 hover:text-indigo-300 transition-colors tracking-tight">
                    {item.title}
                  </h3>
                </Link>

                <ShieldText className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  {item.summary}
                </ShieldText>

                {item.themes && item.themes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.themes.map((th, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-900/80 text-slate-400 border border-slate-850 px-2 py-0.5 rounded text-[10px] font-mono"
                      >
                        {th}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-900/80 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Linked Offering: </span>
                  <Link
                    href={`/services/${item.related_service?.slug}`}
                    className="text-indigo-400 hover:underline font-semibold"
                  >
                    {item.related_service?.title}
                  </Link>
                </div>
                <Link
                  href={`/organizational-systems/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {t('read_article')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Editorial Backlog Note */}
      <section className="bg-slate-950/40 border border-slate-900 rounded-xl p-6 text-center space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Editorial Backlog & Active Inquiries
        </h4>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          Additional field cases on quality definition conflicts, persuasion vs. authority, and unit economics validation are maintained in the active research backlog and published following rigorous practitioner anonymization.
        </p>
      </section>
    </div>
  );
}
