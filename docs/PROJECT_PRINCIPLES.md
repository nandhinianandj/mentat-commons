# Mentat Commons Project Principles

This document acts as the constitution for the Mentat Commons platform. It governs all architectural decisions, code contributions, data modeling, and documentation structures. All developers and subagents must adhere to these principles.

---

## 1. Core Principles

### I. Evidence Before Narrative
Narratives (resumes, cover letters, capability statements, interview answers) must always be constructed as downstream views of verified, factual evidence. No narrative should exist without being anchored to a specific, historical data point.

### II. Preserve Provenance
Every generated statement, bullet point, or summary must trace back directly to its origin. Provenance must be maintained via explicit trace identifiers (e.g., entity IDs or evidence links) that map back to the immutable data layer.

### III. Never Rewrite History
Factual evidence is immutable. You cannot modify, embellish, or delete historical data to fit a narrative. If an experience or outcome was not historically recorded in the knowledge base, it cannot be synthesized or hallucinated for a specific opportunity. Reorganize and retrieve history; never rewrite it.

### IV. Retrieval Before Generation
The system must search and retrieve the most relevant evidence blocks from the knowledge base *before* attempting to generate any tailored content. Generation is a synthesis task, not an invention task.

### V. Separate Facts from Interpretation
Isolate raw facts (such as organizations, project solutions, technologies, and exact metrics) from their interpretation (how a project demonstrates technical leadership or collaborative coordination). Facts are stored in the canonical data layer; interpretations are generated contextually in the application layer.

### VI. Prefer Composition Over Duplication
Professional experiences should exist exactly once in the repository. Resumes, portfolios, and interview sheets must be composed dynamically from the single source of truth, avoiding the duplication of bullet points across different files.

### VII. Human-Readable and Machine-Readable
All data schemas and records must be easily read and edited by humans (e.g., structured JSON, YAML, or clean Markdown) while remaining highly structured for automated indexing, semantic search, and RAG pipelines.

### VIII. Everything is Evidence
Professional experience is not limited to corporate employment. Theater coordination, community facilitation, academic research, talk recordings, essays, volunteering, and open-source contributions are first-class evidence blocks and must be modeled with the same rigor as standard jobs.

### IX. Every Artifact Should Have a Purpose
Avoid creating files, code directories, or documentation without a clear, defined place in the system hierarchy. Every new asset must justify its existence by aligning with the overall architectural layout.

---

## 2. Platform Architecture Blueprint

The Mentat Commons platform is structured into three layers:

```
Mentat Commons
│
├── Foundation
│   Philosophy, Principles, and Architecture specifications.
│
├── Engine
│   Knowledge Graph data model, ingestion, retrieval, and generation code.
│
└── Applications
    The client-facing website, resume tailor, interview prep, and CRM tools.
```
