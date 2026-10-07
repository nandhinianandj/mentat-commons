'use client';

import React, { useState } from 'react';
import locales from '../../locales/en.json';
import { Calendar, ChevronRight } from 'lucide-react';

export default function ContactPage() {
  const [state, setState] = useState({ name: '', email: '', message: '', status: null });

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

  async function submit(e) {
    e.preventDefault();
    setState({ ...state, status: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: state.name, email: state.email, message: state.message })
      });
      if (res.ok) {
        setState({ name: '', email: '', message: '', status: 'sent' });
      } else {
        setState({ ...state, status: 'error' });
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setState({ ...state, status: 'error' });
    }
  }

  return (
    <div className="container max-w-2xl mx-auto space-y-8 py-4">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          {t('v2.contact.title')}
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          {t('v2.contact.subtitle')}
        </p>
      </div>

      {/* High-Intent Value-to-Inbox Diagnostic Trigger */}
      <div className="diagnostic-trigger bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-slate-900 rounded-xl p-6 space-y-4">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-base font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
            Let&apos;s diagnose your system decay.
          </h3>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
            I don&apos;t do blind discovery calls without system context. Click below to open an email, drop in your current architecture details, and I will personally reply with the two most critical leverage points to address first.
          </p>
        </div>
        <div>
          <a 
            href="mailto:nandhini@mentatcommons.com?subject=Mentat%20Commons%20Architecture%20Diagnostic%20Request&body=1.%20What%20is%20your%20current%20core%20LLM%2FML%20production%20stack%3F%0D%0A2.%20What%20is%20the%20primary%20operational%20symptom%20you%20are%20facing%20(e.g.%2C%20silent%20model%20decay%2C%20dataset%20leakage%2C%20vanity%20dashboard%20waste)%3F%0D%0A3.%20What%20is%20the%20current%20scale%20of%20your%20engineering%20team%20%2F%20active%20sprints%3F"
            className="cta text-xs md:text-sm inline-flex items-center gap-1.5"
          >
            <strong>Initiate System Diagnostics →</strong>
          </a>
        </div>
      </div>

      {/* Structured Fallback Proposal Form */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-300 text-sm border-b border-slate-900 pb-2">
          {t('v2.contact.form_title')}
        </h3>
        <form onSubmit={submit} className="card space-y-4 bg-slate-950/20">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {t('v2.contact.label_name')}
            </label>
            <input 
              required 
              className="w-full p-2 border border-slate-900 bg-slate-950/40 rounded-lg text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
              value={state.name} 
              onChange={e => setState({ ...state, name: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {t('v2.contact.label_email')}
            </label>
            <input 
              required 
              type="email"
              className="w-full p-2 border border-slate-900 bg-slate-950/40 rounded-lg text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
              value={state.email} 
              onChange={e => setState({ ...state, email: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {t('v2.contact.label_message')}
            </label>
            <textarea 
              required 
              rows={5} 
              className="w-full p-2 border border-slate-900 bg-slate-950/40 rounded-lg text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors resize-none" 
              value={state.message} 
              onChange={e => setState({ ...state, message: e.target.value })} 
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="submit" className="cta text-xs md:text-sm">
              {t('v2.contact.btn_submit')}
            </button>
            {state.status && (
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest animate-pulse">
                {state.status}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
