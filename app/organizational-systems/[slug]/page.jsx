import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Briefcase, Layers } from 'lucide-react';
import orgData from '../../../data/organizational_systems.json';
import locales from '../../../locales/en.json';
import ShieldText from '../../../components/ShieldText';

export async function generateStaticParams() {
  const publishedItems = (orgData.items || []).filter(
    item => item.publication_status === 'published'
  );
  return publishedItems.map(item => ({
    slug: item.slug
  }));
}

export default function OrganizationalSystemArticlePage({ params }) {
  const { slug } = params;
  const item = (orgData.items || []).find(i => i.slug === slug);
  const t = (key) => locales.org_systems[key] || key;

  if (!item) {
    return (
      <div className="container max-w-3xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-100">Article Not Found</h1>
        <p className="text-slate-400">The requested case study or essay does not exist or remains in the editorial backlog.</p>
        <Link href="/organizational-systems" className="text-indigo-400 inline-block hover:underline text-sm font-semibold">
          {t('back_to_index')}
        </Link>
      </div>
    );
  }

  // Schema Definitions for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.mentatcommons.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Organizational Systems",
        "item": "https://www.mentatcommons.com/organizational-systems"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": item.title,
        "item": `https://www.mentatcommons.com/organizational-systems/${slug}`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": item.title,
    "description": item.summary,
    "datePublished": item.published_at,
    "author": {
      "@type": "Person",
      "name": "Nandhini Anand Jeyahar",
      "url": "https://www.mentatcommons.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mentat Commons",
      "url": "https://www.mentatcommons.com",
      "logo": "https://www.mentatcommons.com/images/mentat-commons-og.png"
    }
  };

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
    <div className="container max-w-3xl mx-auto space-y-12 py-4">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Top Navigation */}
      <div>
        <Link
          href="/organizational-systems"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('back_to_index')}
        </Link>

        {/* 1. Header & Concise Opening Hook */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border font-mono ${getBadgeStyle(item.content_type)}`}>
              {getTypeName(item.content_type)}
            </span>
            <span className="text-slate-500 text-xs font-mono">•</span>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{item.reading_time}</span>
            </div>
            {item.published_at && (
              <>
                <span className="text-slate-500 text-xs font-mono">•</span>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.published_at}</span>
                </div>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            {item.title}
          </h1>

          {item.hook && (
            <ShieldText className="text-base md:text-lg text-slate-200 font-medium leading-relaxed border-l-2 border-indigo-500 pl-4 py-1">
              {item.hook}
            </ShieldText>
          )}

          <ShieldText className="text-slate-400 text-sm leading-relaxed">
            {item.summary}
          </ShieldText>
        </header>
      </div>

      {/* 2. Operational Context */}
      <section className="card bg-slate-950/30 border-slate-900 p-6 md:p-8 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">
          {t('section_context')}
        </h2>
        <ShieldText className="text-slate-300 text-sm md:text-base leading-relaxed">
          {item.context_setting}
        </ShieldText>
      </section>

      {/* 3. Observed Symptoms & Events */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-900 pb-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          {t('section_observations')}
        </h2>
        <div className="space-y-3">
          {item.observed_events.map((evt, idx) => (
            <div key={idx} className="flex gap-3 items-start bg-slate-950/20 p-4 border border-slate-900 rounded-xl">
              <span className="w-5 h-5 bg-amber-950/40 border border-amber-900/60 text-amber-400 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold mt-0.5">
                {idx + 1}
              </span>
              <ShieldText className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {evt}
              </ShieldText>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Structural Interpretation & Systemic Hypothesis */}
      <section className="space-y-4 bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-indigo-950/60 rounded-xl p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          {t('section_hypothesis')}
        </h2>
        <ShieldText className="text-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-line">
          {item.structural_hypothesis}
        </ShieldText>
      </section>

      {/* 5. Alternative Explanations & Evidence Limits */}
      <section className="card bg-slate-950/20 border-slate-900 p-6 md:p-8 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
          {t('section_alternatives')}
        </h2>
        <ul className="space-y-2.5">
          {item.alternative_explanations.map((alt, idx) => (
            <li key={idx} className="flex gap-2.5 items-start text-xs md:text-sm text-slate-400">
              <span className="text-slate-500 font-bold">•</span>
              <ShieldText as="span">{alt}</ShieldText>
            </li>
          ))}
        </ul>
        {item.evidence_limitations && (
          <div className="pt-3 border-t border-slate-900/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
              Evidence Bound:
            </span>
            <ShieldText className="text-xs text-slate-500 italic">
              {item.evidence_limitations}
            </ShieldText>
          </div>
        )}
      </section>

      {/* 6. Practical Diagnostic Questions */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-900 pb-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          {t('section_questions')}
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {item.diagnostic_questions.map((q, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex gap-3 items-start">
              <span className="text-indigo-400 font-mono font-bold text-xs mt-0.5">
                D{idx + 1}.
              </span>
              <ShieldText className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed">
                {q}
              </ShieldText>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Connected Mentat Commons Service & Diagnostic Next Step */}
      {item.related_service && (
        <section className="card bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-950 border border-indigo-900/50 p-6 md:p-8 space-y-4">
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest font-mono block">
            {t('section_consulting')}
          </span>
          <h3 className="text-xl font-bold text-slate-100">
            {item.related_service.title}
          </h3>
          <ShieldText className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
            {item.related_service.description}
          </ShieldText>
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              href={`/services/${item.related_service.slug}`}
              className="cta text-xs md:text-sm inline-flex items-center gap-2"
            >
              Explore Service Specifications
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all"
            >
              {t('initiate_dialogue')}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
