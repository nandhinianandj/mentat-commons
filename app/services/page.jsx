"use client";

import React from 'react';
import locales from '../../locales/en.json';
import { ArrowRight, Settings, Brain, Layers, Cpu, Server, Database, BookOpen, Users, Award, Shield } from 'lucide-react';

const serviceIcons = {
  "ai-strategy": Brain,
  "machine-learning": Settings,
  "llm-development": Cpu,
  "rag-systems": Layers,
  "mlops": Server,
  "data-engineering": Database,
  "ai-training": BookOpen,
  "corporate-workshops": Users,
  "fractional-ai-leadership": Award,
  "ai-consulting": Shield
};

export default function ServicesPage() {
  const services = locales.services || {};

  // Construct Breadcrumb and Service List Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nandhinianand.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://nandhinianand.vercel.app/services"
      }
    ]
  };

  const servicesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Mentat Commons AI Consulting Services",
    "description": "Factual list of professional services in machine learning, LLM systems, MLOps, and strategic decision design.",
    "itemListElement": Object.entries(services).map(([slug, s], index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": s.title,
        "description": s.description,
        "provider": {
          "@type": "ProfessionalService",
          "name": "Mentat Commons",
          "url": "https://nandhinianand.vercel.app"
        },
        "url": `https://nandhinianand.vercel.app/services/${slug}`
      }
    }))
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-12 py-4">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesListSchema) }}
      />

      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
          Professional Services & Offerings
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          Mentat Commons provides evidence-backed engineering, training, and strategic leadership. We specialize in bringing rigor to machine learning setups and making organizational decisions transparent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(services).map(([slug, s]) => {
          const Icon = serviceIcons[slug] || Settings;
          return (
            <div key={slug} className="card hover:border-slate-800 bg-slate-950/20 p-6 flex flex-col justify-between space-y-4 transition-all">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-950/40 text-indigo-400 border border-indigo-900/50 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-100">{s.title}</h2>
                </div>
                <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">{s.tagline}</p>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{s.description}</p>
              </div>
              <div className="pt-2">
                <a
                  href={`/services/${slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Explore Service Specifications
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
