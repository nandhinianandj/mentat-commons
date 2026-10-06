import React from 'react';
import locales from '../../locales/en.json';
import { HelpCircle, ChevronRight, MessageSquare } from 'lucide-react';

export default function FAQPage() {
  const faqList = locales.faq || [];

  // Generate FAQPage JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

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
        "name": "FAQ",
        "item": "https://www.mentatcommons.com/faq"
      }
    ]
  };

  return (
    <div className="container max-w-3xl mx-auto space-y-12 py-4">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center justify-center md:justify-start gap-3">
          <HelpCircle className="w-8 h-8 text-indigo-400" />
          Frequently Asked Questions
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          Detailed, fact-based answers on pricing models, engagement timelines, vector databases, MLOps monitoring systems, and technical consulting deliverables.
        </p>
        <div className="text-slate-500 text-xs font-mono">
          <span>Last Updated: 2026-08-07</span>
        </div>
      </div>

      <div className="space-y-4">
        {faqList.map((item, idx) => (
          <details 
            key={idx} 
            className="group border border-slate-900 bg-slate-950/20 rounded-xl p-5 hover:border-slate-800 transition-all [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-bold text-slate-200 text-sm md:text-base pr-4 flex items-start gap-2.5">
                <span className="text-indigo-400 text-xs font-mono mt-1 font-bold">Q{idx + 1}.</span>
                {item.q}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform flex-shrink-0" />
            </summary>
            <div className="mt-4 pt-4 border-t border-slate-900/60 text-slate-300 text-xs md:text-sm leading-relaxed font-normal">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      {/* Inquiry Block */}
      <section className="bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-slate-900 rounded-xl p-6 md:p-8 space-y-4 text-center md:text-left">
        <h3 className="text-lg font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          Have a different technical question?
        </h3>
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl mx-auto md:mx-0">
          If you have a complex project query regarding ML architecture or fractional leadership that isn&apos;t covered here, schedule a direct discovery call.
        </p>
        <div className="pt-2">
          <a
            href="/contact"
            className="cta inline-flex items-center gap-2 text-xs md:text-sm"
          >
            Ask a Question
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
