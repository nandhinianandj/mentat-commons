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

      {/* Prominent Direct Calendly Scheduling Card */}
      <div className="bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-slate-900 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="font-bold text-slate-200 text-sm flex items-center justify-center md:justify-start gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            {t('v2.contact.calendly_title')}
          </h3>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            {t('v2.contact.calendly_desc')}
          </p>
        </div>
        <a 
          href="https://calendly.com/nandhini-anandj/new-meeting" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta text-xs inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          {t('v2.contact.calendly_btn')}
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
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
