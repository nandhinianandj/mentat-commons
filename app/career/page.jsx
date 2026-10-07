'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Briefcase, 
  Cpu, 
  Users, 
  Compass, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Layers, 
  Award, 
  FileText, 
  ArrowRight, 
  Copy, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  AlertCircle, 
  Key, 
  ExternalLink,
  Info,
  Maximize2,
  X,
  Database,
  Terminal,
  Grid
} from 'lucide-react';
import locales from '../../locales/en.json';

export default function CareerKBPage() {
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

  // State Management
  const [activeTab, setActiveTab] = useState('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [navigationMode, setNavigationMode] = useState('type'); // 'axis', 'org', 'tech', 'domain', 'type'
  
  // Knowledge Graph State
  const [selectedNode, setSelectedNode] = useState(null); // { type, id, data }
  
  // Data State
  const [ckbData, setCkbData] = useState({ experiences: [], projects: [], skills: {}, talks: [], community: [], writing: { articles: [], essays: [], research_notes: [], stories: [], blog_posts: [], talk_proposals: [], white_papers: [] } });
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loadingData, setLoadingData] = useState(true);
  
  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState(null); // { url, caption }
  
  // RAG / Assistant State
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantMode, setAssistantMode] = useState('search'); // 'search', 'resume', 'interview'
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState('');
  const [ragMatches, setRagMatches] = useState([]);
  const [ragLoading, setRagLoading] = useState(false);
  
  // Generator State
  const [jobDescription, setJobDescription] = useState('');
  const [generatedData, setGeneratedData] = useState(null);
  const [generatorLoading, setGeneratorLoading] = useState(false);
  const [generatorTab, setGeneratorTab] = useState('resume');
  
  // Interview State
  const [interviewQuestion, setInterviewQuestion] = useState('');
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [apiWarning, setApiWarning] = useState('');
  
  // API Key config
  const [apiKey, setApiKey] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  // Load CKB Data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/ckb/data');
        if (response.ok) {
          const data = await response.json();
          setCkbData(data);
          // Set default selected node based on query parameters or fall back to Axelrod
          let selectedFromQuery = false;
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const nodeId = params.get('node') || params.get('id');
            if (nodeId) {
              const proj = data.projects.find(p => p.id === nodeId);
              if (proj) {
                setSelectedNode({ type: 'project', id: nodeId, data: proj });
                selectedFromQuery = true;
              }
              const exp = data.experiences.find(e => e.id === nodeId);
              if (exp) {
                setSelectedNode({ type: 'experience', id: nodeId, data: exp });
                selectedFromQuery = true;
              }
              const talk = data.talks.find(t => t.id === nodeId);
              if (talk) {
                setSelectedNode({ type: 'talk', id: nodeId, data: talk });
                selectedFromQuery = true;
              }
              const comm = data.community.find(c => c.id === nodeId);
              if (comm) {
                setSelectedNode({ type: 'community', id: nodeId, data: comm });
                selectedFromQuery = true;
              }
              if (!selectedFromQuery) {
                Object.entries(data.writing).forEach(([cat, list]) => {
                  const w = list.find(item => item.id === nodeId || item.id === `write-${nodeId}`);
                  if (w) {
                    setSelectedNode({ type: 'writing', id: w.id, data: { ...w, category: cat } });
                    selectedFromQuery = true;
                  }
                });
              }
            }
          }

          if (!selectedFromQuery && data.projects && data.projects.length > 0) {
            const axelrod = data.projects.find(p => p.id === 'proj-axelrod');
            if (axelrod) {
              setSelectedNode({ type: 'project', id: 'proj-axelrod', data: axelrod });
            } else {
              setSelectedNode({ type: 'project', id: data.projects[0].id, data: data.projects[0] });
            }
          }
        }
        
        const graphResponse = await fetch('/api/ckb/graph');
        if (graphResponse.ok) {
          const gData = await graphResponse.json();
          setGraphData(gData);
        }
      } catch (err) {
        console.error("Error loading career data:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
    
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('ckb_api_key') || '';
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('ckb_api_key', apiKey);
    }
    setShowKeyConfig(false);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // Execute RAG Search
  const handleRAGSearch = async (e, customQuery = '') => {
    if (e) e.preventDefault();
    const queryToSearch = customQuery || ragQuery;
    if (!queryToSearch.trim()) return;
    
    setRagLoading(true);
    setRagResult('');
    setRagMatches([]);
    setApiWarning('');
    
    try {
      const res = await fetch('/api/ckb/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'query',
          query: queryToSearch,
          apiKey: apiKey || undefined
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setRagResult(data.answer);
        setRagMatches(data.matches || []);
        setApiWarning(data.warning || '');
      } else {
        const err = await res.json();
        setRagResult(`Error: ${err.error || 'Failed to retrieve responses'}`);
      }
    } catch (err) {
      setRagResult(`Network error: ${err.message}`);
    } finally {
      setRagLoading(false);
    }
  };

  // Tailor Resume
  const handleTailorOutput = async (e) => {
    if (e) e.preventDefault();
    if (!jobDescription.trim()) return;
    
    setGeneratorLoading(true);
    setApiWarning('');
    
    try {
      const res = await fetch('/api/ckb/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          jobDescription: jobDescription,
          apiKey: apiKey || undefined
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedData(data);
        setApiWarning(data.warning || '');
      } else {
        alert("Failed to generate tailored materials.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setGeneratorLoading(false);
    }
  };

  // Interview Prep
  const handleInterviewPrep = async (e, customQuestion = '') => {
    if (e) e.preventDefault();
    const questionToAsk = customQuestion || interviewQuestion;
    if (!questionToAsk.trim()) return;
    
    setInterviewLoading(true);
    setInterviewPrep(null);
    setApiWarning('');
    
    try {
      const res = await fetch('/api/ckb/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'interview',
          question: questionToAsk,
          apiKey: apiKey || undefined
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setInterviewPrep(data.structure);
        setApiWarning(data.warning || '');
      } else {
        alert("Failed to retrieve interview suggestions.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Helpers to select nodes programmatically (Interconnected Graph Navigation)
  const selectNodeById = (id, type) => {
    if (type === 'project') {
      const item = ckbData.projects.find(p => p.id === id);
      if (item) setSelectedNode({ type, id, data: item });
    } else if (type === 'experience') {
      const item = ckbData.experiences.find(e => e.id === id);
      if (item) setSelectedNode({ type, id, data: item });
    } else if (type === 'talk') {
      const item = ckbData.talks.find(t => t.id === id);
      if (item) setSelectedNode({ type, id, data: item });
    } else if (type === 'community') {
      const item = ckbData.community.find(c => c.id === id);
      if (item) setSelectedNode({ type, id, data: item });
    } else if (type === 'writing') {
      let found = null;
      Object.entries(ckbData.writing).forEach(([cat, list]) => {
        const w = list.find(item => item.id === id);
        if (w) found = { ...w, category: cat };
      });
      if (found) setSelectedNode({ type, id, data: found });
    } else if (type === 'skill') {
      const entry = Object.entries(ckbData.skills).find(([name, _]) => name.toLowerCase().replace(/\s+/g, '-') === id.replace('skill-', ''));
      if (entry) {
        setSelectedNode({ type, id, data: { name: entry[0], ...entry[1] } });
      }
    }
  };

  // Grouping structures for graph rendering
  const getGraphNodes = () => {
    const nodes = [];
    
    // Search query filter
    const matchesSearch = (text) => {
      return !searchQuery || String(text).toLowerCase().includes(searchQuery.toLowerCase());
    };

    if (navigationMode === 'type') {
      // Group by Entity Category
      if (ckbData.experiences) {
        ckbData.experiences.forEach(e => {
          if (matchesSearch(e.organization + e.role + e.summary)) {
            nodes.push({ type: 'experience', id: e.id, label: `${e.role} at ${e.organization}`, category: 'Experiences' });
          }
        });
      }
      if (ckbData.projects) {
        ckbData.projects.forEach(p => {
          if (matchesSearch(p.title + p.problem + p.solution)) {
            nodes.push({ type: 'project', id: p.id, label: p.title, category: 'Projects' });
          }
        });
      }
      if (ckbData.skills) {
        Object.entries(ckbData.skills).forEach(([name, data]) => {
          if (matchesSearch(name + JSON.stringify(data.categories))) {
            nodes.push({ type: 'skill', id: `skill-${name.toLowerCase().replace(/\s+/g, '-')}`, label: name, category: 'Skills' });
          }
        });
      }
      if (ckbData.talks) {
        ckbData.talks.forEach(t => {
          if (matchesSearch(t.topic + t.lessons)) {
            nodes.push({ type: 'talk', id: t.id, label: t.topic, category: 'Talks' });
          }
        });
      }
      if (ckbData.community) {
        ckbData.community.forEach(c => {
          if (matchesSearch(c.name + JSON.stringify(c))) {
            nodes.push({ type: 'community', id: c.id, label: c.name, category: 'Community Work' });
          }
        });
      }
      if (ckbData.writing) {
        // Collect featured items first
        const featuredNodes = [];
        Object.entries(ckbData.writing).forEach(([cat, list]) => {
          list.forEach(w => {
            if (w.featured && matchesSearch(w.title + w.summary)) {
              featuredNodes.push({ type: 'writing', id: w.id, label: w.title, category: '⭐ Featured Collection' });
            }
          });
        });
        if (featuredNodes.length > 0) {
          nodes.push(...featuredNodes);
        }

        // Regular writing items
        Object.entries(ckbData.writing).forEach(([cat, list]) => {
          list.forEach(w => {
            if (matchesSearch(w.title + w.summary)) {
              nodes.push({ type: 'writing', id: w.id, label: w.title, category: `Writing: ${cat.replace('_', ' ')}` });
            }
          });
        });
      }
    } 
    
    else if (navigationMode === 'axis') {
      // Group by Career Axis
      const axes = ['axis-i', 'axis-ii', 'axis-iii'];
      axes.forEach(axis => {
        const axisLabel = axis === 'axis-i' ? 'Axis I: Technical Leadership' : axis === 'axis-ii' ? 'Axis II: Human Systems' : 'Axis III: Decision Systems';
        
        if (ckbData.experiences) {
          ckbData.experiences.forEach(e => {
            if (e.axes.includes(axis) && matchesSearch(e.organization + e.role)) {
              nodes.push({ type: 'experience', id: e.id, label: `${e.role} at ${e.organization}`, category: axisLabel });
            }
          });
        }
        if (ckbData.projects) {
          ckbData.projects.forEach(p => {
            if (p.axes.includes(axis) && matchesSearch(p.title)) {
              nodes.push({ type: 'project', id: p.id, label: p.title, category: axisLabel });
            }
          });
        }
        if (ckbData.talks) {
          ckbData.talks.forEach(t => {
            if (t.axes.includes(axis) && matchesSearch(t.topic)) {
              nodes.push({ type: 'talk', id: t.id, label: t.topic, category: axisLabel });
            }
          });
        }
        if (ckbData.community) {
          ckbData.community.forEach(c => {
            if (c.axes.includes(axis) && matchesSearch(c.name)) {
              nodes.push({ type: 'community', id: c.id, label: c.name, category: axisLabel });
            }
          });
        }
        if (ckbData.writing) {
          Object.entries(ckbData.writing).forEach(([cat, list]) => {
            list.forEach(w => {
              if (w.axes.includes(axis) && matchesSearch(w.title)) {
                nodes.push({ type: 'writing', id: w.id, label: w.title, category: axisLabel });
              }
            });
          });
        }
      });
    } 
    
    else if (navigationMode === 'org') {
      // Group by Organization
      const orgs = ['Mentat Commons', 'Bene Data Collective', 'Mentat Theatre'];
      orgs.forEach(org => {
        if (ckbData.experiences) {
          ckbData.experiences.forEach(e => {
            if (e.organization === org && matchesSearch(e.role)) {
              nodes.push({ type: 'experience', id: e.id, label: e.role, category: org });
            }
          });
        }
        if (ckbData.projects) {
          ckbData.projects.forEach(p => {
            if (p.organization === org && matchesSearch(p.title)) {
              nodes.push({ type: 'project', id: p.id, label: p.title, category: org });
            }
          });
        }
      });
    } 
    
    else if (navigationMode === 'tech') {
      // Group by main Technologies
      const techs = ['Python', 'Rust', 'WebAssembly', 'PyTorch', 'Docker', 'SQL', 'React', 'Applied Improvisation'];
      techs.forEach(tech => {
        if (ckbData.experiences) {
          ckbData.experiences.forEach(e => {
            if (e.technologies.includes(tech) && matchesSearch(e.role)) {
              nodes.push({ type: 'experience', id: e.id, label: `${e.role} at ${e.organization}`, category: tech });
            }
          });
        }
        if (ckbData.projects) {
          ckbData.projects.forEach(p => {
            if (p.technologies.includes(tech) && matchesSearch(p.title)) {
              nodes.push({ type: 'project', id: p.id, label: p.title, category: tech });
            }
          });
        }
      });
    } 
    
    else if (navigationMode === 'domain') {
      // Group by Domains
      const domains = ['Systems Design', 'Decision Design', 'Applied AI/ML', 'Organizational Learning', 'Restorative Practices', 'Applied Improvisation'];
      domains.forEach(domain => {
        if (ckbData.experiences) {
          ckbData.experiences.forEach(e => {
            if (e.domains && e.domains.includes(domain) && matchesSearch(e.role)) {
              nodes.push({ type: 'experience', id: e.id, label: `${e.role} at ${e.organization}`, category: domain });
            }
          });
        }
      });
    }

    return nodes;
  };

  const graphNodes = getGraphNodes();
  
  // Group nodes by category label
  const groupedNodes = graphNodes.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  // Find related entities for selected node (Interconnected Knowledge Graph surfacing)
  const getRelatedEntities = (node) => {
    if (!node) return [];
    const related = [];
    const id = node.id;
    const data = node.data;

    // Helper to map UI node ID to graph node ID
    const getGraphNodeId = (nid, ntype) => {
      if (ntype === 'writing') {
        return nid.replace(/^write-/, '');
      }
      if (ntype === 'skill') {
        return nid.replace(/^skill-/, '').replace(/-/g, '_');
      }
      return nid;
    };

    const graphId = getGraphNodeId(id, node.type);

    // Query nodes and edges from graphData if available
    if (graphData && graphData.edges && graphData.edges.length > 0) {
      const neighbors = new Set();
      graphData.edges.forEach(edge => {
        let neighborId = null;
        let relation = edge.relation;
        if (edge.source === graphId) {
          neighborId = edge.target;
        } else if (edge.target === graphId) {
          neighborId = edge.source;
        }

        if (neighborId) {
          neighbors.add(JSON.stringify({ id: neighborId, relation }));
        }
      });

      neighbors.forEach(str => {
        const { id: nId, relation } = JSON.parse(str);
        let matched = null;
        let matchedType = null;
        let matchedLabel = null;

        // Try experience/project directly
        const exp = ckbData.experiences.find(e => e.id === nId);
        if (exp) {
          matched = exp;
          matchedType = 'experience';
          matchedLabel = `${exp.role} at ${exp.organization}`;
        }

        const proj = ckbData.projects.find(p => p.id === nId);
        if (proj) {
          matched = proj;
          matchedType = 'project';
          matchedLabel = proj.title;
        }

        const talk = ckbData.talks.find(t => t.id === nId);
        if (talk) {
          matched = talk;
          matchedType = 'talk';
          matchedLabel = talk.topic;
        }

        const comm = ckbData.community.find(c => c.id === nId);
        if (comm) {
          matched = comm;
          matchedType = 'community';
          matchedLabel = comm.name;
        }

        // Try writing lists
        if (!matched) {
          Object.entries(ckbData.writing).forEach(([cat, list]) => {
            const w = list.find(item => item.id === nId || item.id === `write-${nId}`);
            if (w) {
              matched = w;
              matchedType = 'writing';
              matchedLabel = w.title;
            }
          });
        }

        // Try skill matching
        if (!matched && (nId.startsWith('skill_') || nId.startsWith('technology_') || nId.startsWith('concept_') || nId.startsWith('organization_'))) {
          const cleanName = nId.replace(/^(skill_|technology_|concept_|organization_)/, '').replace(/_/g, ' ');
          const entry = Object.entries(ckbData.skills).find(([name, _]) => name.toLowerCase() === cleanName.toLowerCase());
          if (entry) {
            matched = { name: entry[0], ...entry[1] };
            matchedType = 'skill';
            matchedLabel = entry[0];
          }
        }

        if (matched) {
          const relLabel = relation ? relation.charAt(0).toUpperCase() + relation.slice(1) + ': ' : '';
          related.push({
            id: matchedType === 'skill' ? `skill-${matchedLabel.toLowerCase().replace(/\s+/g, '-')}` : matched.id,
            type: matchedType,
            label: `${relLabel}${matchedLabel}`
          });
        }
      });
    }

    // Fallback to original heuristics if no relationships found via graphData
    if (related.length === 0) {
      if (node.type === 'project') {
        const relatedExp = ckbData.experiences.find(e => e.organization === data.organization);
        if (relatedExp) {
          related.push({ id: relatedExp.id, type: 'experience', label: `Org: ${relatedExp.organization}` });
        }
        ckbData.talks.forEach(t => {
          if (t.related_projects && t.related_projects.includes(id)) {
            related.push({ id: t.id, type: 'talk', label: `Talk: ${t.topic}` });
          }
        });
        Object.entries(ckbData.skills).forEach(([skillName, skillData]) => {
          let isUsed = false;
          Object.values(skillData.categories).forEach(cat => {
            if (cat.projects && cat.projects.includes(id)) isUsed = true;
          });
          if (isUsed) {
            related.push({ id: `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`, type: 'skill', label: `Skill: ${skillName}` });
          }
        });
        Object.entries(ckbData.writing).forEach(([cat, list]) => {
          list.forEach(w => {
            const commonAxis = w.axes.some(a => data.axes.includes(a));
            if (commonAxis && related.length < 6) {
              related.push({ id: w.id, type: 'writing', label: `Writing: ${w.title}` });
            }
          });
        });
      } else if (node.type === 'experience') {
        ckbData.projects.forEach(p => {
          if (p.organization === data.organization) {
            related.push({ id: p.id, type: 'project', label: `Project: ${p.title}` });
          }
        });
        Object.entries(ckbData.skills).forEach(([skillName, skillData]) => {
          let isUsed = false;
          Object.values(skillData.categories).forEach(cat => {
            if (cat.projects && cat.projects.includes(id)) isUsed = true;
          });
          if (isUsed) {
            related.push({ id: `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`, type: 'skill', label: `Skill: ${skillName}` });
          }
        });
      } else if (node.type === 'skill') {
        const prjIds = [];
        Object.values(data.categories).forEach(cat => {
          (cat.projects || []).forEach(pId => {
            if (!prjIds.includes(pId)) prjIds.push(pId);
          });
        });
        prjIds.forEach(pId => {
          const p = ckbData.projects.find(proj => proj.id === pId);
          if (p) related.push({ id: p.id, type: 'project', label: `Project: ${p.title}` });
          const e = ckbData.experiences.find(exp => exp.id === pId);
          if (e) related.push({ id: e.id, type: 'experience', label: `Experience: ${e.role}` });
        });
      } else if (node.type === 'talk') {
        (data.related_projects || []).forEach(pId => {
          const p = ckbData.projects.find(proj => proj.id === pId);
          if (p) related.push({ id: p.id, type: 'project', label: `Project: ${p.title}` });
        });
        ckbData.experiences.forEach(e => {
          const commonAxis = e.axes.some(a => data.axes.includes(a));
          if (commonAxis && related.length < 5) {
            related.push({ id: e.id, type: 'experience', label: `Experience: ${e.role}` });
          }
        });
      } else if (node.type === 'writing') {
        ckbData.projects.forEach(p => {
          const commonAxis = p.axes.some(a => data.axes.includes(a));
          if (commonAxis && related.length < 4) {
            related.push({ id: p.id, type: 'project', label: `Project: ${p.title}` });
          }
        });
        ckbData.experiences.forEach(e => {
          const commonAxis = e.axes.some(a => data.axes.includes(a));
          if (commonAxis && related.length < 6) {
            related.push({ id: e.id, type: 'experience', label: `Experience: ${e.role}` });
          }
        });
      }
    }

    return related;
  };

  const relatedEntities = getRelatedEntities(selectedNode);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8 font-sans">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* Top Header Section with AEO Answer-First Definition */}
        <header className="border-b border-slate-800 pb-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-indigo-600 rounded-lg text-white">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </span>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                    {t('ckb.title')}
                  </h1>
                  <p className="text-slate-400 text-xs mt-1">
                    {t('ckb.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAssistant(!showAssistant)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                  showAssistant 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-slate-900 border-slate-800 text-indigo-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask CKB Assistant</span>
              </button>

              <button 
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
                title="Configure API Key"
              >
                <Key className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-4xl bg-slate-900/40 p-3.5 rounded-lg border border-slate-850">
            The Mentat Commons Career Evidence Graph (CEG) is an interconnected, empirical knowledge graph indexing 16+ years of systems engineering, machine learning pipelines, and decision architecture. Every framework claim, algorithm, and organizational outcome is traceable to concrete project artifacts, codebases, and verified deliverables for transparent AI model evaluation and semantic retrieval.
          </p>
        </header>

        {/* API Key Modal Drawer */}
        {showKeyConfig && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-indigo-400" />
              API Settings
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Enter your Google Gemini API Key (starts with <code>AIza</code>) or OpenAI API Key (starts with <code>sk-</code>) to enable live LLM RAG capabilities. If left blank, the system uses a local, deterministic rule-based generator.
            </p>
            <form onSubmit={handleSaveKey} className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste API Key here..."
                className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Save Configuration
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setApiKey('');
                    localStorage.removeItem('ckb_api_key');
                    setShowKeyConfig(false);
                  }}
                  className="bg-slate-850 hover:bg-slate-800 text-slate-400 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Clear Key
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------- RAG ASSISTANT PANEL -------------------- */}
        {showAssistant && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-2xl animate-in slide-in-from-top-6 duration-200 relative overflow-hidden">
            <div className="absolute right-4 top-4">
              <button 
                onClick={() => setShowAssistant(false)} 
                className="text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Assistant Subnavigation */}
            <div className="flex gap-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto">
              <button
                onClick={() => setAssistantMode('search')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  assistantMode === 'search' 
                    ? 'bg-indigo-600/25 border border-indigo-500 text-indigo-300' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                {t('ckb.tabs.search')}
              </button>
              <button
                onClick={() => setAssistantMode('resume')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  assistantMode === 'resume' 
                    ? 'bg-indigo-600/25 border border-indigo-500 text-indigo-300' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Tailor Resume
              </button>
              <button
                onClick={() => setAssistantMode('interview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  assistantMode === 'interview' 
                    ? 'bg-indigo-600/25 border border-indigo-500 text-indigo-300' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                STAR Interview Prep
              </button>
            </div>
            
            {apiWarning && (
              <div className="bg-amber-950/45 border border-amber-900/60 rounded-lg p-3 text-xs text-amber-300 flex items-center gap-2 mb-5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{apiWarning}</span>
              </div>
            )}

            {/* Assistant Mode: Search/RAG */}
            {assistantMode === 'search' && (
              <div className="space-y-4">
                <form onSubmit={handleRAGSearch} className="flex gap-3">
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    placeholder="Search query (e.g. 'Show systems thinking projects' or ' mentoring examples')..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={ragLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-1"
                  >
                    {ragLoading ? 'Searching...' : <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Show systems thinking projects",
                    "Find mentoring examples",
                    "Which experiences show stakeholder management?",
                    "What talks relate to Cognitive Science?"
                  ].map(suggest => (
                    <button
                      key={suggest}
                      onClick={() => {
                        setRagQuery(suggest);
                        handleRAGSearch(null, suggest);
                      }}
                      className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white px-2.5 py-1 rounded-full text-xxs font-semibold transition-all"
                    >
                      {suggest}
                    </button>
                  ))}
                </div>

                {/* RAG Results */}
                {ragResult && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 mt-4 max-h-[300px] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-3">
                      <span className="text-xxs font-bold text-indigo-400 flex items-center gap-1 uppercase">
                        <Sparkles className="w-3 h-3" />
                        Retrieved Output
                      </span>
                      <button 
                        onClick={() => handleCopy(ragResult, 'rag-assistant')}
                        className="text-xxs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedKey === 'rag-assistant' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'rag-assistant' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {ragResult}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assistant Mode: Resume Tailoring */}
            {assistantMode === 'resume' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={handleTailorOutput} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Paste Target Job Description (JD)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    placeholder="Paste JD requirements here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm leading-relaxed"
                  />
                  <button
                    type="submit"
                    disabled={generatorLoading || !jobDescription.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                  >
                    {generatorLoading ? 'Tailoring narrative...' : 'Generate Tailored Documents'}
                  </button>
                </form>

                {/* Tailoring outputs */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col h-[280px]">
                  {generatedData ? (
                    <>
                      <div className="flex gap-1 border-b border-slate-850 pb-2 mb-3 overflow-x-auto">
                        {['resume', 'coverLetter', 'star', 'storyBank', 'skillsGap', 'interviewPrep'].map(tkey => (
                          <button
                            key={tkey}
                            onClick={() => setGeneratorTab(tkey)}
                            className={`text-xxs font-bold px-2.5 py-1 rounded capitalize transition-all whitespace-nowrap ${
                              generatorTab === tkey ? 'bg-indigo-600 text-white font-black' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {tkey.replace(/([A-Z])/g, ' $1')}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xxs text-slate-500 mb-2">
                        <span>Hover over bullets to check evidence trace links.</span>
                        <button
                          onClick={() => handleCopy(generatedData[generatorTab], 'tailored-doc')}
                          className="flex items-center gap-1 hover:text-white"
                        >
                          {copiedKey === 'tailored-doc' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          Copy
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {generatedData[generatorTab]}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                      <FileText className="w-8 h-8 mb-2" />
                      <p className="text-xs">Generated resumes and cover letters will appear here. No experience is hallucinated; every bullet is linked back to CKB evidence.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assistant Mode: STAR Interview Prep */}
            {assistantMode === 'interview' && (
              <div className="space-y-4">
                <form onSubmit={handleInterviewPrep} className="flex gap-3">
                  <input
                    type="text"
                    value={interviewQuestion}
                    onChange={(e) => setInterviewQuestion(e.target.value)}
                    placeholder="Enter interview question (e.g. 'Tell me about a difficult stakeholder')..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={interviewLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-1"
                  >
                    {interviewLoading ? 'Structuring...' : 'Prepare Response'}
                  </button>
                </form>

                {interviewPrep && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[300px] overflow-y-auto">
                    <div className="md:col-span-1 border-r border-slate-850 pr-4 space-y-4">
                      <div>
                        <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Target Project</span>
                        <div className="font-bold text-white text-sm mt-1">{interviewPrep.bestProject}</div>
                        <span className="text-xxs bg-slate-900 border border-slate-850 px-2 py-0.5 rounded font-mono text-indigo-400 inline-block mt-1">
                          ID: {interviewPrep.traceId}
                        </span>
                      </div>
                      <div>
                        <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Supporting Evidence</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {interviewPrep.supportingEvidence && interviewPrep.supportingEvidence.map(ev => (
                            <span key={ev} className="bg-slate-900 text-slate-300 text-xxs px-2 py-0.5 rounded font-mono">
                              {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-3">
                      <span className="text-xxs font-bold text-indigo-400 uppercase tracking-wider block">STAR Structured Rehearsal</span>
                      <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                        <p><strong>Situation (S):</strong> {interviewPrep.situation}</p>
                        <p><strong>Task (T):</strong> {interviewPrep.task}</p>
                        <p><strong>Action (A):</strong> {interviewPrep.action}</p>
                        <p><strong>Result (R):</strong> {interviewPrep.result}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* -------------------- MAIN BROWSEABLE KNOWLEDGE GRAPH UI -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: INTERCONNECTED INDEX / NAVIGATION */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Search filter for explorer nodes */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter explorer nodes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Navigation Selector Buttons */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xxs font-bold uppercase text-slate-400 tracking-wider block">
                {t('ckb.explorer.navigate_by')}
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {[
                  { id: 'type', label: t('ckb.explorer.group_type'), icon: Grid },
                  { id: 'axis', label: t('ckb.explorer.group_axis'), icon: Compass },
                  { id: 'org', label: t('ckb.explorer.group_org'), icon: Briefcase },
                  { id: 'tech', label: t('ckb.explorer.group_tech'), icon: Terminal },
                  { id: 'domain', label: t('ckb.explorer.group_domain'), icon: Database }
                ].map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setNavigationMode(mode.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                        navigationMode === mode.id 
                          ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/10' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Structured Nodes List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-h-[500px] overflow-y-auto space-y-4">
              {loadingData ? (
                <div className="text-center py-6 text-slate-500 text-xs">Loading index...</div>
              ) : (
                <>
                  {Object.entries(groupedNodes).map(([category, items]) => (
                    <div key={category} className="space-y-1.5">
                      <span className="text-xxs font-black text-slate-500 uppercase tracking-widest block border-b border-slate-850 pb-1 mb-1">
                        {category}
                      </span>
                      <div className="space-y-1">
                        {items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => selectNodeById(item.id, item.type)}
                            className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all flex items-center justify-between border ${
                              selectedNode && selectedNode.id === item.id 
                                ? 'bg-indigo-950/40 border-indigo-800 text-white font-bold pl-3.5' 
                                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${selectedNode && selectedNode.id === item.id ? 'translate-x-1' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(groupedNodes).length === 0 && (
                    <div className="text-center py-6 text-slate-650 text-xs">No matching nodes.</div>
                  )}
                </>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: KNOWLEDGE INTERACTION PANELS (NODE VIEW) */}
          <div className="lg:col-span-2">
            {selectedNode ? (
              <article aria-labelledby="selected-node-title" className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                
                {/* Node Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-950 border border-indigo-900 rounded text-indigo-400 text-xs">
                      {selectedNode.type === 'project' && <Cpu className="w-4 h-4" />}
                      {selectedNode.type === 'experience' && <Briefcase className="w-4 h-4" />}
                      {selectedNode.type === 'skill' && <Award className="w-4 h-4" />}
                      {selectedNode.type === 'talk' && <BookOpen className="w-4 h-4" />}
                      {selectedNode.type === 'community' && <Users className="w-4 h-4" />}
                      {selectedNode.type === 'writing' && <FileText className="w-4 h-4" />}
                    </span>
                    <div>
                      <span className="text-xxs font-bold text-indigo-400 uppercase tracking-widest block">
                        {t(`ckb.explorer.${selectedNode.type === 'community' ? 'community' : selectedNode.type + 's'}`)}
                      </span>
                      <h2 id="selected-node-title" className="text-xl font-extrabold text-white">
                        {selectedNode.type === 'project' ? selectedNode.data.title : selectedNode.type === 'skill' ? selectedNode.data.name : selectedNode.type === 'talk' ? selectedNode.data.topic : selectedNode.type === 'experience' ? `${selectedNode.data.role} at ${selectedNode.data.organization}` : selectedNode.data.name || selectedNode.data.title}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end text-xs text-slate-500 font-mono">
                    {selectedNode.data.organization && selectedNode.type !== 'experience' && (
                      <span className="font-semibold text-slate-400">{selectedNode.data.organization}</span>
                    )}
                    {selectedNode.data.start_date && (
                      <span className="bg-slate-850 px-2.5 py-0.5 rounded-full border border-slate-800 mt-1">
                        {selectedNode.data.start_date} - {selectedNode.data.end_date}
                      </span>
                    )}
                    <span className="text-xxs mt-1">ID: {selectedNode.id}</span>
                  </div>
                </div>

                {/* Node Details (Dynamic based on selected Type) */}
                <div className="text-slate-300 text-sm space-y-4">
                  
                  {/* Experience Entity Details */}
                  {selectedNode.type === 'experience' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block mb-1">Overview Summary</span>
                        <p className="italic text-slate-400">{selectedNode.data.summary}</p>
                      </div>
                      <div>
                        <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block mb-1">{t('common.responsibilities')}</span>
                        <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                          {selectedNode.data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block mb-1">{t('common.deliverables')}</span>
                          <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                            {selectedNode.data.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block mb-1">Key Leadership Highlight</span>
                          <ul className="list-disc pl-4 space-y-1 text-slate-200 text-xs">
                            {selectedNode.data.leadership_examples.map((le, i) => <li key={i}>{le}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block mb-1">Stakeholders Mapped</span>
                          <p className="text-xs text-slate-400">{(selectedNode.data.stakeholders || []).join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block mb-1">Professional Domains</span>
                          <p className="text-xs text-slate-400">{(selectedNode.data.domains || []).join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Entity Details */}
                  {selectedNode.type === 'project' && (
                    <div className="space-y-4">
                      
                      {/* Live project button link */}
                      {selectedNode.data.links && selectedNode.data.links.map(lnk => (
                        <a
                          key={lnk.url}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{lnk.name}</span>
                        </a>
                      ))}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">{t('common.problem')}</span>
                          <p className="text-xs text-slate-300 mt-1 bg-slate-950 p-2.5 rounded border border-slate-850">{selectedNode.data.problem}</p>
                        </div>
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">{t('common.solution')}</span>
                          <p className="text-xs text-slate-300 mt-1 bg-slate-950 p-2.5 rounded border border-slate-850">{selectedNode.data.solution}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">System Architecture</span>
                        <p className="text-xs text-slate-400 mt-1 font-mono bg-slate-950 p-2.5 rounded border border-slate-850">{selectedNode.data.architecture}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xxs font-bold uppercase text-amber-500 tracking-wider block">Key Decision</span>
                          <p className="text-xs text-slate-300 mt-1">{selectedNode.data.decisions}</p>
                        </div>
                        <div>
                          <span className="text-xxs font-bold uppercase text-amber-500 tracking-wider block">Trade-offs Faced</span>
                          <p className="text-xs text-slate-400 mt-1">{selectedNode.data.tradeoffs}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">{t('common.impact')}</span>
                        <ul className="list-disc pl-4 space-y-1 text-emerald-400 text-xs mt-1">
                          {selectedNode.data.impact.map((imp, i) => <li key={i}>{imp}</li>)}
                        </ul>
                      </div>

                      {/* Visual Gallery for Projects ( lightbox support) */}
                      {selectedNode.data.screenshots && selectedNode.data.screenshots.length > 0 && (
                        <div className="pt-4 border-t border-slate-850 space-y-2">
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                            {t('ckb.explorer.screenshot_gallery')}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {selectedNode.data.screenshots.map((shot, idx) => (
                              <div 
                                key={idx} 
                                onClick={() => setLightboxImage(shot)}
                                className="bg-slate-950 border border-slate-850 rounded-lg p-2 hover:border-indigo-500 cursor-zoom-in transition-all group overflow-hidden"
                                title={t('ckb.explorer.click_zoom')}
                              >
                                <div className="h-28 bg-slate-900 rounded flex items-center justify-center relative overflow-hidden">
                                  {shot.url.includes('placeholder') ? (
                                    <>
                                      {/* Simulated abstract visual design grids representing the project state */}
                                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-slate-900 to-indigo-950/20 opacity-80 group-hover:opacity-60 transition-opacity" />
                                      
                                      {/* Interactive game theory or CV system mock visual inside the placeholder box */}
                                      <div className="w-full h-full flex flex-col justify-between p-2 font-mono text-xxs text-slate-500">
                                        <div className="flex justify-between">
                                          <span>[SCREEN_{idx + 1}]</span>
                                          <span className="text-indigo-400 font-bold">READY</span>
                                        </div>
                                        <div className="text-center text-indigo-500/60 font-semibold py-4 uppercase text-xxs tracking-wider">
                                          {idx === 0 ? 'Simulation View' : idx === 1 ? 'Population Chart' : 'Payload Configurator'}
                                        </div>
                                        <div className="text-right text-[9px] text-slate-650">60 FPS</div>
                                      </div>
                                    </>
                                  ) : (
                                    <img 
                                      src={shot.url} 
                                      alt={shot.caption} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 leading-snug mt-1.5 line-clamp-2">
                                  {shot.caption}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skill Entity Details */}
                  {selectedNode.type === 'skill' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">Structured Categories</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          {Object.entries(selectedNode.data.categories || {}).map(([catName, catVal]) => (
                            <div key={catName} className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between font-bold text-sm text-white">
                                  <span>{catName}</span>
                                  <span className="text-indigo-400 font-mono text-xs">{catVal.confidence} / {catVal.yearsOfExperience} yrs</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1.5">{catVal.description}</p>
                              </div>
                              {catVal.projects && catVal.projects.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-slate-850/60">
                                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Projects Using It:</span>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {catVal.projects.map(projId => (
                                      <button
                                        key={projId}
                                        onClick={() => selectNodeById(projId, projId.startsWith('proj') ? 'project' : 'experience')}
                                        className="bg-slate-900 hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-300 text-[10px] border border-slate-800 hover:border-indigo-900 px-2 py-0.5 rounded font-mono"
                                      >
                                        {projId}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Talk Entity Details */}
                  {selectedNode.type === 'talk' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">Abstract Overview</span>
                        <p className="text-xs text-slate-300 mt-1 italic leading-relaxed">{selectedNode.data.abstract}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">Target Audience</span>
                          <p className="text-xs text-slate-400 mt-0.5">{selectedNode.data.audience} ({selectedNode.data.duration})</p>
                        </div>
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">Key Presentation Lessons</span>
                          <p className="text-xs text-slate-200 mt-0.5">{selectedNode.data.lessons}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Community Entity Details */}
                  {selectedNode.type === 'community' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['volunteering', 'theatre', 'facilitation', 'partnerships', 'workshops', 'organizing'].map(cKey => {
                          const valList = selectedNode.data[cKey];
                          if (!valList || valList.length === 0) return null;
                          return (
                            <div key={cKey} className="bg-slate-950 border border-slate-850 p-3 rounded-lg">
                              <span className="text-xxs font-black text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1 mb-1.5">
                                {t(`common.${cKey}`)}
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed">{valList[0]}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Writing Entity Details */}
                  {selectedNode.type === 'writing' && (
                    <div className="space-y-4">
                      {selectedNode.data.ai_assisted && (
                        <div className="bg-indigo-950/40 border border-indigo-900/60 p-3 rounded-lg flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Speculative Systems Research</span>
                            <p className="text-xxs text-slate-400 leading-normal">This narrative thought experiment is part of the MeWe project.</p>
                          </div>
                          <a 
                            href={`/narrative?node=${selectedNode.id}`} 
                            className="bg-indigo-900/60 hover:bg-indigo-800 text-slate-100 hover:text-white px-2.5 py-1.5 rounded text-[10px] font-semibold transition-all flex-shrink-0"
                          >
                            Read in Narrative View
                          </a>
                        </div>
                      )}
                      <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-850 text-xxs font-mono text-slate-500">
                        <span>Reading Time: {selectedNode.data.reading_time || '2 mins'}</span>
                        {selectedNode.data.tags && selectedNode.data.tags.length > 0 && (
                          <div className="flex gap-1">
                            {selectedNode.data.tags.map(t => (
                              <span key={t} className="bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">Abstract</span>
                        <p className="text-xs text-slate-300 mt-1 bg-slate-950 p-3 rounded border border-slate-850 leading-relaxed italic">{selectedNode.data.abstract || selectedNode.data.summary}</p>
                      </div>
                      {selectedNode.data.problem && selectedNode.data.problem !== selectedNode.data.summary && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-950 p-3 rounded border border-slate-850">
                            <span className="text-xxs font-bold text-slate-500 uppercase">Problem Scoped</span>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.data.problem}</p>
                          </div>
                          <div className="bg-slate-950 p-3 rounded border border-slate-850">
                            <span className="text-xxs font-bold text-slate-500 uppercase">Context / Scoping</span>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.data.context}</p>
                          </div>
                        </div>
                      )}
                      {selectedNode.data.key_ideas && selectedNode.data.key_ideas.length > 0 && selectedNode.data.key_ideas[0] !== selectedNode.data.summary && (
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">Key Ideas & Core Concepts</span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {selectedNode.data.key_ideas.map((idea, idx) => (
                              <span key={idx} className="bg-slate-850 text-slate-300 text-xxs px-2.5 py-1 rounded border border-slate-800 font-semibold">
                                {idea}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedNode.data.lessons && selectedNode.data.lessons !== 'Refer to post content for technical insights.' && (
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block font-mono text-indigo-400">Lessons Learned</span>
                          <p className="text-xs text-slate-300 mt-1 bg-slate-950/40 p-3 rounded border border-slate-850/60 leading-relaxed">{selectedNode.data.lessons}</p>
                        </div>
                      )}
                      {selectedNode.data.content && (
                        <div>
                          <span className="text-xxs font-bold uppercase text-slate-500 tracking-wider block">Outline & Key Assertions</span>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed whitespace-pre-wrap">{selectedNode.data.content}</p>
                        </div>
                      )}
                      {selectedNode.data.situation && (
                        <div className="mt-4 border-t border-slate-800 pt-4 space-y-3">
                          <span className="text-xxs font-bold uppercase text-indigo-400 tracking-wider block">🎯 Reusable STAR Interview Evidence</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-3 rounded border border-slate-850">
                              <span className="text-xxs font-bold text-slate-500 uppercase">Situation</span>
                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.data.situation}</p>
                            </div>
                            <div className="bg-slate-950 p-3 rounded border border-slate-850">
                              <span className="text-xxs font-bold text-slate-500 uppercase">Task</span>
                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.data.task}</p>
                            </div>
                            <div className="bg-slate-950 p-3 rounded border border-slate-850">
                              <span className="text-xxs font-bold text-slate-500 uppercase">Action</span>
                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.data.action}</p>
                            </div>
                            <div className="bg-slate-950 p-3 rounded border border-slate-850">
                              <span className="text-xxs font-bold text-slate-500 uppercase">Result</span>
                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.data.result}</p>
                            </div>
                          </div>
                          {selectedNode.data.tradeoffs && (
                            <div className="text-xs text-slate-400">
                              <strong>Trade-offs Analyzed:</strong> <span className="text-slate-300">{selectedNode.data.tradeoffs}</span>
                            </div>
                          )}
                          {selectedNode.data.stakeholders && selectedNode.data.stakeholders.length > 0 && (
                            <div className="text-xs text-slate-400">
                              <strong>Stakeholders Managed:</strong> <span className="text-slate-300">{selectedNode.data.stakeholders.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Node Metadata Footer */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 justify-between items-center text-xs">
                  <div className="flex gap-1.5">
                    {selectedNode.data.axes && selectedNode.data.axes.map(axis => (
                      <span key={axis} className="bg-indigo-950/60 text-indigo-400 border border-indigo-900/60 text-[10px] px-2.5 py-0.5 rounded-full font-bold capitalize">
                        {axis.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  {selectedNode.data.evidence_links && (
                    <div className="flex gap-2">
                      {selectedNode.data.evidence_links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xxs text-slate-400 hover:text-white flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Link #{idx + 1}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* INTERCONNECTED RELATED NODES FOOTER (Graph Traversal Engine) */}
                {relatedEntities.length > 0 && (
                  <div className="pt-6 border-t border-slate-800 space-y-2">
                    <span className="text-xxs font-bold uppercase text-indigo-400 tracking-wider block">
                      {t('ckb.explorer.related_entities')} (Surfaced Automatically)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {relatedEntities.map(rel => (
                        <button
                          key={rel.id}
                          onClick={() => selectNodeById(rel.id, rel.type)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-indigo-950/20 border border-slate-850 hover:border-indigo-900 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all"
                        >
                          <ChevronRight className="w-3 h-3 text-slate-650" />
                          <span>{rel.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </article>
            ) : (
              <div className="h-full min-h-[400px] border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-slate-900/20">
                <Compass className="w-12 h-12 text-slate-700 mb-3" />
                <h3 className="text-white font-bold text-base mb-1">Select a Node to Explore</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Click any professional entity on the left to inspect its data model and traverse related career nodes.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* -------------------- LIGHTBOX MODAL DIALOG -------------------- */}
        {lightboxImage && (
          <div className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => setLightboxImage(null)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full text-white hover:scale-105 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
                     <div className="max-w-4xl w-full flex flex-col items-center gap-4">
              {lightboxImage.url.includes('placeholder') ? (
                /* Visual mock screenshot canvas for game theory spatial tournament representation */
                <div className="w-full h-80 sm:h-[480px] bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between p-4 font-mono shadow-2xl relative overflow-hidden select-none">
                  
                  {/* Visual grid rendering for game-theory grid sandbox */}
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-30 pointer-events-none">
                    {Array(100).fill(0).map((_, i) => {
                      const isGreen = (i * 3 + 1) % 7 === 0;
                      const isRed = (i * 2 + 3) % 9 === 0;
                      return (
                        <div 
                          key={i} 
                          className={`border-[0.5px] border-slate-800/20 ${
                            isGreen ? 'bg-emerald-500/25' : isRed ? 'bg-rose-500/25' : 'bg-transparent'
                          }`} 
                        />
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center z-10 text-slate-500 text-xs border-b border-slate-850 pb-2">
                    <span>[MENTAT_COMMONS // AXELROD_GRID_SIMULATOR]</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/60 text-[10px]">ACTIVE GENERATION</span>
                  </div>
                  
                  <div className="my-auto flex flex-col items-center justify-center text-center z-10 space-y-4">
                    <Maximize2 className="w-10 h-10 text-indigo-500/60 animate-pulse" />
                    <div className="text-indigo-400 uppercase tracking-widest text-sm font-black py-1 px-4 bg-indigo-950/40 rounded border border-indigo-900/50">
                      {lightboxImage.caption.split(':')[0]}
                    </div>
                    <p className="text-slate-400 max-w-md text-xs leading-relaxed">
                      Interactive game theory model showcasing strategy propagation and agent-based spatial cooperation.
                    </p>
                  </div>

                  <div className="flex justify-between items-center z-10 text-slate-500 text-xxs font-mono border-t border-slate-850 pt-2">
                    <span>Payoff matrix: T=5, R=3, P=1, S=0</span>
                    <span>10,000 agents | 60 FPS WebAssembly</span>
                  </div>
                </div>
              ) : (
                <div className="w-full max-h-[70vh] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center shadow-2xl relative p-2">
                  <img 
                    src={lightboxImage.url} 
                    alt={lightboxImage.caption} 
                    className="max-w-full max-h-[68vh] object-contain rounded-lg"
                  />
                </div>
              )}
              
              <div className="text-slate-300 text-center max-w-2xl px-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-md">
                <p className="text-sm leading-relaxed">{lightboxImage.caption}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
