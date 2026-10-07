import React from 'react';
import locales from '../../locales/en.json';
import { HelpCircle, ChevronRight, MessageSquare, Terminal } from 'lucide-react';

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

      {/* Semantic Page Header with Answer-First Summary */}
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center justify-center md:justify-start gap-3">
          <HelpCircle className="w-8 h-8 text-indigo-400" />
          Frequently Asked Questions
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
          Mentat Commons is an AI Strategy, Machine Learning, and Decision Systems consultancy. This FAQ knowledge portal provides direct, verifiable answers regarding our engineering deliverables, pricing structures, MLOps monitoring methodologies, and fractional leadership retainers for enterprise decision systems.
        </p>
        <div className="text-slate-500 text-xs font-mono">
          <span>Last Updated: 2026-10-07 • Verified AEO Technical Index</span>
        </div>
      </header>

      {/* Semantic FAQ Portal Section */}
      <section aria-labelledby="faq-portal-heading" className="space-y-4">
        <h2 id="faq-portal-heading" className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-900 pb-3">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Core Technical Frameworks & Engagement Answers
        </h2>

        <div className="space-y-4">
          {faqList.map((item, idx) => (
            <article 
              key={idx} 
              className="faq-item"
              itemScope 
              itemType="https://schema.org/Question"
            >
              <details 
                className="group border border-slate-900 bg-slate-950/20 rounded-xl p-5 hover:border-slate-800 transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 
                    itemProp="name" 
                    className="font-bold text-slate-200 text-sm md:text-base pr-4 flex items-start gap-2.5"
                  >
                    <span className="text-indigo-400 text-xs font-mono mt-1 font-bold">Q{idx + 1}.</span>
                    {item.q}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div 
                  itemScope 
                  itemProp="acceptedAnswer" 
                  itemType="https://schema.org/Answer" 
                  className="mt-4 pt-4 border-t border-slate-900/60 text-slate-300 text-xs md:text-sm leading-relaxed font-normal"
                >
                  <p itemProp="text">{item.a}</p>
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>

      {/* Inquiry Block */}
      <section aria-labelledby="inquiry-heading" className="bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-slate-900 rounded-xl p-6 md:p-8 space-y-4 text-center md:text-left">
        <h3 id="inquiry-heading" className="text-lg font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          Have a different technical question?
        </h3>
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl mx-auto md:mx-0">
          If you have a complex project query regarding ML architecture or fractional leadership that isn&apos;t covered here, initiate a direct Architecture Diagnostic Request via email.
        </p>
        <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
          <a
            href="mailto:nandhini@mentatcommons.com?subject=Mentat%20Commons%20Architecture%20Diagnostic%20Request&body=1.%20What%20is%20your%20current%20core%20LLM%2FML%20production%20stack%3F%0D%0A2.%20What%20is%20the%20primary%20operational%20symptom%20you%20are%20facing%20(e.g.%2C%20silent%20model%20decay%2C%20dataset%20leakage%2C%20vanity%20dashboard%20waste)%3F%0D%0A3.%20What%20is%20the%20current%20scale%20of%20your%20engineering%20team%20%2F%20active%20sprints%3F"
            className="cta inline-flex items-center gap-2 text-xs md:text-sm"
          >
            Initiate System Diagnostics →
          </a>
          <a
            href="/contact"
            className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all inline-flex items-center gap-1.5"
          >
            General Contact Form
          </a>
        </div>
      </section>
    </div>
  );
}
