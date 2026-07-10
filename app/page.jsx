"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, Sparkles, Upload, Download, Copy, Check, 
  Key, Brain, AlertCircle, RefreshCw, Eye, EyeOff, 
  ChevronRight, ArrowRight, ExternalLink, HelpCircle 
} from 'lucide-react';
import locales from '../locales/en.json';

export default function CopilotWorkspace() {
  // Config state
  const [ckbData, setCkbData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('resume');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  // Inputs state
  const [jdText, setJdText] = useState('');
  
  // Outputs state
  const [outputs, setOutputs] = useState({
    resume: '',
    cover_letter: '',
    interview_notes: ''
  });
  const [citations, setCitations] = useState([]);
  
  // Editor state
  const [editingCkb, setEditingCkb] = useState(false);
  const [rawCkbText, setRawCkbText] = useState('');
  const [saveStatus, setSaveStatus] = useState({ type: '', msg: '' });
  
  // Interaction state
  const [selectedCitationDetail, setSelectedCitationDetail] = useState(null);
  const [copiedTab, setCopiedTab] = useState('');

  // Load CKB Data initially
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/ckb/data');
        if (res.ok) {
          const data = await res.json();
          setCkbData(data);
          setRawCkbText(JSON.stringify(data, null, 2));
        }
      } catch (err) {
        console.error("Error loading CKB data:", err);
      }
    }
    loadData();
  }, []);

  // Save/Import updated CKB JSON data
  const handleSaveCkb = async () => {
    setSaveStatus({ type: 'loading', msg: 'Validating and saving data...' });
    try {
      const parsed = JSON.parse(rawCkbText);
      if (!Array.isArray(parsed.experiences) || !Array.isArray(parsed.projects)) {
        throw new Error("Invalid structure: CKB JSON must have 'experiences' and 'projects' arrays.");
      }
      
      const res = await fetch('/api/ckb/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ckbData: parsed })
      });
      
      if (res.ok) {
        setCkbData(parsed);
        setSaveStatus({ type: 'success', msg: 'CKB synced successfully!' });
        setTimeout(() => {
          setSaveStatus({ type: '', msg: '' });
          setEditingCkb(false);
        }, 1500);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save CKB data on backend.");
      }
    } catch (err) {
      setSaveStatus({ type: 'error', msg: `Failed: ${err.message}` });
    }
  };

  // Trigger parallel LLM/local generation
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!jdText.trim()) return;

    setLoading(true);
    setOutputs({ resume: '', cover_letter: '', interview_notes: '' });
    setCitations([]);
    
    try {
      const [resResume, resCover, resInterview] = await Promise.all([
        fetch('/api/evidence/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'resume', targetText: jdText, apiKey })
        }).then(r => r.json()),
        fetch('/api/evidence/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'cover_letter', targetText: jdText, apiKey })
        }).then(r => r.json()),
        fetch('/api/evidence/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'interview_notes', targetText: jdText, apiKey })
        }).then(r => r.json())
      ]);

      setOutputs({
        resume: resResume.artifact || '',
        cover_letter: resCover.artifact || '',
        interview_notes: resInterview.artifact || ''
      });

      const mergedCitations = Array.from(new Set([
        ...(resResume.citations || []),
        ...(resCover.citations || []),
        ...(resInterview.citations || [])
      ]));
      setCitations(mergedCitations);

    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Copy output to clipboard
  const handleCopyTab = async (text, tabName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabName);
      setTimeout(() => setCopiedTab(''), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Trigger browser blob downloads
  const handleDownloadAll = () => {
    const triggerDownload = (filename, text) => {
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };

    if (outputs.resume) triggerDownload('tailored-resume.md', outputs.resume);
    if (outputs.cover_letter) triggerDownload('tailored-cover-letter.md', outputs.cover_letter);
    if (outputs.interview_notes) triggerDownload('interview-prep-notes.md', outputs.interview_notes);
  };

  // Find CKB node details to show on hover/click of [Ref: id]
  const showCitationPopover = (refId) => {
    if (!ckbData) return;
    const cleanId = refId.toLowerCase().trim();
    
    // Search projects
    const proj = ckbData.projects.find(p => p.id.toLowerCase() === cleanId);
    if (proj) {
      setSelectedCitationDetail({ type: 'project', data: proj });
      return;
    }

    // Search experiences
    const exp = ckbData.experiences.find(e => e.id.toLowerCase() === cleanId);
    if (exp) {
      setSelectedCitationDetail({ type: 'experience', data: exp });
      return;
    }

    // Search writing
    if (ckbData.writing) {
      for (const catList of Object.values(ckbData.writing)) {
        const w = catList.find(item => item.id.toLowerCase() === cleanId || `write-${item.id.toLowerCase()}` === cleanId);
        if (w) {
          setSelectedCitationDetail({ type: 'writing', data: w });
          return;
        }
      }
    }

    // Search skills
    if (ckbData.skills) {
      for (const [skillName, skillVal] of Object.entries(ckbData.skills)) {
        const skillId = `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`;
        if (skillId.toLowerCase() === cleanId) {
          setSelectedCitationDetail({ type: 'skill', data: { name: skillName, ...skillVal } });
          return;
        }
      }
    }

    setSelectedCitationDetail({ type: 'unknown', id: refId });
  };

  // Custom renderer helper to render inline Markdown and make [Ref: id] clickable
  const renderTailoredMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={lineIdx} className="text-xl font-bold text-white mt-4 mb-2 border-b border-slate-800 pb-1">{renderInlineFormat(line.substring(2))}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={lineIdx} className="text-lg font-bold text-slate-100 mt-4 mb-1">{renderInlineFormat(line.substring(3))}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={lineIdx} className="text-sm font-semibold text-slate-200 mt-3 mb-1">{renderInlineFormat(line.substring(4))}</h3>;
      }
      // List item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={lineIdx} className="text-xs text-slate-350 ml-4 list-disc pl-1 py-0.5 leading-relaxed">
            {renderInlineFormat(line.replace(/^[\s*-]+/, ''))}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }
      // Normal paragraph
      return <p key={lineIdx} className="text-xs text-slate-350 leading-relaxed mb-2">{renderInlineFormat(line)}</p>;
    });
  };

  // Parse formatting in inline text: bold, file paths, and [Ref: id] tags
  const renderInlineFormat = (text) => {
    // Regex for [Ref: id] or similar
    const refRegex = /(\[Ref:\s*([a-zA-Z0-9-_]+)\])/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = refRegex.exec(text)) !== null) {
      const fullMatch = match[1];
      const refId = match[2];
      const matchIndex = match.index;

      // Add text before match
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      // Add clickable citation tag
      parts.push(
        <span 
          key={matchIndex} 
          onClick={() => showCitationPopover(refId)}
          className="bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/60 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] cursor-pointer font-mono mx-1 inline-flex items-center gap-0.5 transition-all select-none hover:scale-105"
          title="Click to trace back to source CKB evidence"
        >
          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
          {refId}
        </span>
      );

      lastIndex = refRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Process bold formatting (**text**)
    return parts.map((part, partIdx) => {
      if (typeof part !== 'string') return part;
      
      const boldParts = part.split('**');
      if (boldParts.length === 1) return part;

      return boldParts.map((subText, subIdx) => {
        if (subIdx % 2 === 1) {
          return <strong key={subIdx} className="text-slate-100 font-bold">{subText}</strong>;
        }
        return subText;
      });
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col antialiased">
      {/* -------------------- MAIN HEADER -------------------- */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-650 p-2 rounded-lg text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">MENTAT COMMONS</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Career Application Copilot // V1</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditingCkb(!editingCkb)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-350 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import/Update Resume (CKB)</span>
          </button>
          
          <a
            href="/career"
            target="_blank"
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-400 font-semibold transition-colors"
          >
            <span>Launch Explorer View</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* -------------------- WORKSPACE LAYOUT -------------------- */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==================== LEFT COLUMN: INPUTS (lg:col-span-5) ==================== */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* CKB STATE STATS CARD */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Active Career Evidence Base</h2>
            {ckbData ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded border border-slate-850/60 text-center">
                  <span className="text-xxs text-slate-500 uppercase font-mono block">Experiences</span>
                  <span className="text-lg font-black text-white">{ckbData.experiences?.length || 0}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-850/60 text-center">
                  <span className="text-xxs text-slate-500 uppercase font-mono block">Projects</span>
                  <span className="text-lg font-black text-white">{ckbData.projects?.length || 0}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-850/60 text-center">
                  <span className="text-xxs text-slate-500 uppercase font-mono block">Writings</span>
                  <span className="text-lg font-black text-white">
                    {ckbData.writing ? Object.values(ckbData.writing).reduce((sum, list) => sum + (list?.length || 0), 0) : 0}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                <RefreshCw className="w-4 h-4 animate-spin text-slate-650" />
                <span>Loading career knowledge base metadata...</span>
              </div>
            )}
          </div>

          {/* TARGET JOB DESCRIPTION CARD */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Target Job Description (JD)
              </label>
              <span className="text-[10px] font-mono text-slate-500">Input constraints</span>
            </div>
            
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={12}
              placeholder="Paste the target Job Description (JD) requirements here. The compiler will scan and align CKB accomplishments to match these constraints..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-all font-mono leading-relaxed resize-y"
            />

            {/* KEY CONFIG PANEL */}
            <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Set LLM API Key (optional fallback)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <Key className="w-3.5 h-3.5 text-slate-650 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-slate-600 hover:text-slate-400 absolute right-3 top-2.5"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !jdText.trim()}
              className="w-full bg-indigo-650 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-99 disabled:opacity-40 disabled:hover:scale-100 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Aligning & Compiling Artifacts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Compile Application Bundle</span>
                </>
              )}
            </button>
          </div>

        </section>

        {/* ==================== RIGHT COLUMN: OUTPUTS (lg:col-span-7) ==================== */}
        <section className="lg:col-span-7">
          
          <div className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
            
            {/* TABS HEADER */}
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-850 flex flex-wrap justify-between items-center gap-3">
              <div className="flex gap-1.5">
                {[
                  { id: 'resume', label: 'Resume Output' },
                  { id: 'cover_letter', label: 'Cover Letter' },
                  { id: 'interview_notes', label: 'Interview STAR Sheet' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === t.id
                        ? 'bg-indigo-600/20 border border-indigo-500/60 text-indigo-400'
                        : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {outputs[activeTab] && (
                  <>
                    <button
                      onClick={() => handleCopyTab(outputs[activeTab], activeTab)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-bold text-slate-450 hover:bg-slate-800 hover:text-white transition-all"
                    >
                      {copiedTab === activeTab ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedTab === activeTab ? 'Copied' : 'Copy markdown'}</span>
                    </button>
                    
                    <button
                      onClick={handleDownloadAll}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-bold text-slate-450 hover:bg-slate-800 hover:text-white transition-all"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download All</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* TAB CONTAINER AREA */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[650px] bg-slate-900/40">
              {loading ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Executing CKB semantic retrieval search and assembling tailored Markdown templates. This takes under 15 seconds...
                  </p>
                </div>
              ) : outputs[activeTab] ? (
                <div className="space-y-1 font-sans select-text">
                  {/* Warning Box for citation check */}
                  {citations.length > 0 && activeTab === 'resume' && (
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-850 text-[10px] text-indigo-400 font-mono flex items-center justify-between mb-4">
                      <span>✓ Cites {citations.length} verified projects/experiences in database</span>
                      <span className="text-slate-600">Click references below to inspect facts</span>
                    </div>
                  )}
                  {renderTailoredMarkdown(outputs[activeTab])}
                </div>
              ) : (
                <div className="h-full min-h-[400px] border border-dashed border-slate-850 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-slate-900/10">
                  <FileText className="w-10 h-10 text-slate-750 mb-3" />
                  <h3 className="text-slate-400 font-bold text-sm mb-1">Tailored Artifacts Pending</h3>
                  <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
                    Paste the job description on the left and click **Compile** to generate tailored, evidence-traced files immediately.
                  </p>
                </div>
              )}
            </div>

          </div>

        </section>

      </main>

      {/* -------------------- SLIDE-OVER / MODAL FOR CKB JSON IMPORT -------------------- */}
      {editingCkb && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col p-6 space-y-4 animate-in slide-in-from-right-12 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Import & Update Career Knowledge Base</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Pasting new records updates your resume evidence database file</p>
              </div>
              <button 
                onClick={() => setEditingCkb(false)}
                className="text-slate-400 hover:text-white px-2 py-1 bg-slate-950 rounded border border-slate-850 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {saveStatus.msg && (
              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                saveStatus.type === 'success' ? 'bg-green-950/30 border-green-900/60 text-green-400' :
                saveStatus.type === 'error' ? 'bg-rose-950/30 border-rose-900/60 text-rose-400' :
                'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveStatus.msg}</span>
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <textarea
                value={rawCkbText}
                onChange={(e) => setRawCkbText(e.target.value)}
                className="flex-1 w-full bg-slate-950 border border-slate-850 rounded-xl p-4 text-xs font-mono text-slate-350 placeholder-slate-700 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                placeholder="Paste career_knowledge_base.json schema object here..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRawCkbText(JSON.stringify(ckbData, null, 2))}
                className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-semibold text-slate-450 hover:text-white"
              >
                Reset Changes
              </button>
              <button
                onClick={handleSaveCkb}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
              >
                Validate & Save CKB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- PROVENANCE EVIDENCE OVERLAY MODAL -------------------- */}
      {selectedCitationDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedCitationDetail(null)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded text-xs font-mono"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Brain className="w-4 h-4" />
                <span className="text-xxs font-mono uppercase font-black tracking-wider">Provenance Evidence Trace</span>
              </div>

              {selectedCitationDetail.type === 'project' && (
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-base border-b border-slate-800 pb-1">
                    {selectedCitationDetail.data.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xxs font-mono text-slate-500">
                    <div>ORG: <span className="text-slate-350">{selectedCitationDetail.data.organization}</span></div>
                    <div>ROLE: <span className="text-slate-350">{selectedCitationDetail.data.role_association || 'Architect'}</span></div>
                  </div>
                  <div>
                    <span className="text-xxs text-slate-550 block font-semibold uppercase">Problem Solved</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{selectedCitationDetail.data.problem}</p>
                  </div>
                  <div>
                    <span className="text-xxs text-slate-550 block font-semibold uppercase">Implementation Solution</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{selectedCitationDetail.data.solution}</p>
                  </div>
                  {selectedCitationDetail.data.impact && (
                    <div>
                      <span className="text-xxs text-slate-550 block font-semibold uppercase">Key Metrics & Impact</span>
                      <ul className="list-disc ml-4 mt-0.5 text-xs text-slate-300 space-y-0.5">
                        {selectedCitationDetail.data.impact.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedCitationDetail.type === 'experience' && (
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-base border-b border-slate-800 pb-1">
                    {selectedCitationDetail.data.role}
                  </h3>
                  <div className="text-xs text-slate-400 font-semibold">{selectedCitationDetail.data.organization}</div>
                  <div className="text-xxs font-mono text-slate-550">
                    DATES: {selectedCitationDetail.data.start_date} - {selectedCitationDetail.data.end_date}
                  </div>
                  <div>
                    <span className="text-xxs text-slate-550 block font-semibold uppercase">Responsibilities</span>
                    <ul className="list-disc ml-4 mt-0.5 text-xs text-slate-300 space-y-0.5">
                      {selectedCitationDetail.data.responsibilities.slice(0, 4).map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedCitationDetail.type === 'writing' && (
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-base border-b border-slate-800 pb-1">
                    {selectedCitationDetail.data.title}
                  </h3>
                  <div className="text-xs text-indigo-400 font-mono font-semibold">Writing Node ({selectedCitationDetail.data.category || 'Article'})</div>
                  <div>
                    <span className="text-xxs text-slate-550 block font-semibold uppercase">Core Summary</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{selectedCitationDetail.data.summary}</p>
                  </div>
                </div>
              )}

              {selectedCitationDetail.type === 'skill' && (
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-base border-b border-slate-800 pb-1">
                    Skill: {selectedCitationDetail.data.name}
                  </h3>
                  <div className="text-xs text-slate-350">
                    Total Experience: <strong>{selectedCitationDetail.data.totalYears} years</strong>
                  </div>
                  <div>
                    <span className="text-xxs text-slate-550 block font-semibold uppercase">Focus Areas</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.keys(selectedCitationDetail.data.categories || {}).map(cat => (
                        <span key={cat} className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-xxs font-mono font-bold uppercase">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedCitationDetail.type === 'unknown' && (
                <div className="space-y-2 py-4 text-center">
                  <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                  <h4 className="text-white font-bold text-sm">Reference Unresolved</h4>
                  <p className="text-slate-500 text-xs">
                    Citation ID <span className="font-mono text-rose-400 font-bold">"{selectedCitationDetail.id}"</span> does not exist in the Career Knowledge Base.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button 
                  onClick={() => setSelectedCitationDetail(null)}
                  className="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs"
                >
                  Close Trace
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
