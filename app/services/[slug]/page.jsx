import React from 'react';
import locales from '../../../locales/en.json';
import { ArrowLeft, CheckCircle2, Clock, Cpu, HelpCircle, Briefcase, ChevronRight } from 'lucide-react';

export async function generateStaticParams() {
  const services = locales.services || {};
  return Object.keys(services).map((slug) => ({
    slug: slug,
  }));
}

export default function ServiceDetailPage({ params }) {
  const { slug } = params;
  const service = locales.services[slug];

  if (!service) {
    return (
      <div className="container max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-100">Service Not Found</h1>
        <p className="text-slate-400 mt-2">The requested consulting service does not exist.</p>
        <a href="/services" className="text-indigo-400 mt-4 inline-block hover:underline">Back to Services</a>
      </div>
    );
  }

  // Schema definitions
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "ProfessionalService",
      "name": "Mentat Commons",
      "url": "https://nandhinianand.vercel.app",
      "logo": "https://nandhinianand.vercel.app/images/mentat-commons-og.png",
      "email": "nandhini.anandj@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Remote",
        "addressCountry": "Worldwide"
      }
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": service.pricing.starting_from.replace(/[^0-9]/g, ''),
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "priceCurrency": "INR",
        "price": service.pricing.starting_from.replace(/[^0-9]/g, ''),
        "description": `Starting From ${service.pricing.starting_from} (Typical range: ${service.pricing.typical_range})`
      }
    }
  };

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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.title,
        "item": `https://nandhinianand.vercel.app/services/${slug}`
      }
    ]
  };

  return (
    <div className="container max-w-3xl mx-auto space-y-10 py-4">
      {/* Dynamic Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Navigation and Metadata */}
      <div>
        <a 
          href="/services" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all services
        </a>
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            {service.title}
          </h1>
          <p className="text-sm md:text-base text-indigo-400 font-bold tracking-wide uppercase">
            {service.tagline}
          </p>
          <div className="text-slate-500 text-xs flex gap-4 font-mono">
            <span>Published: 2026-08-01</span>
            <span>•</span>
            <span>Last Updated: 2026-08-07</span>
          </div>
        </div>
      </div>

      {/* Service Core Description */}
      <section className="bg-slate-900/30 border border-slate-900 rounded-xl p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-200">What is this service?</h2>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
          {service.description}
        </p>
      </section>

      {/* Who is this for & Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-slate-950/20 p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            Who is this for?
          </h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            {service.for}
          </p>
        </div>

        <div className="card bg-slate-950/20 p-6 space-y-3 border-indigo-950/50">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Pricing & Engagement
          </h3>
          <ul className="text-xs md:text-sm space-y-1.5 text-slate-300">
            <li><strong>Starting from:</strong> {service.pricing.starting_from}</li>
            <li><strong>Typical range:</strong> {service.pricing.typical_range}</li>
            <li><strong>Pricing Model:</strong> {service.pricing.model}</li>
            <li><strong>Engagement timeline:</strong> {service.timeline}</li>
          </ul>
        </div>
      </div>

      {/* Typical Problems Resolved */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Typical Problems We Resolve</h3>
        <div className="space-y-3">
          {service.problems.map((prob, idx) => (
            <div key={idx} className="flex gap-3 items-start bg-slate-950/10 p-4 border border-slate-900 rounded-lg">
              <span className="w-5 h-5 bg-red-950/30 border border-red-900/40 text-red-400 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold mt-0.5">
                !
              </span>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{prob}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Deliverables & Technologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200">Key Deliverables</h3>
          <div className="space-y-2">
            {service.deliverables.map((del, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs md:text-sm">{del}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {service.technologies.map((tech, idx) => (
              <span 
                key={idx}
                className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Expected Outcomes */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Expected Outcomes</h3>
        <div className="space-y-3">
          {service.outcomes.map((out, idx) => (
            <div key={idx} className="flex gap-3 items-start bg-slate-950/10 p-4 border border-slate-900 rounded-lg">
              <span className="w-5 h-5 bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold mt-0.5">
                ✓
              </span>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{out}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next Steps Engagement */}
      <section className="bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-900/50 rounded-xl p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          Next Steps & Engagement
        </h3>
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
          {service.next_steps}
        </p>
        <div className="pt-2">
          <a
            href="/contact"
            className="cta inline-flex items-center gap-2 text-xs md:text-sm"
          >
            Initiate Contact
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
