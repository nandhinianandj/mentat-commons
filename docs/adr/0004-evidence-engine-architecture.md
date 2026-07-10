# ADR 0004: Evidence Engine Architecture

*   **Status**: Proposed
*   **Date**: 2026-07-10
*   **Deciders**: Nandhini Anand (Architect), Antigravity (AI Architect)
*   **Related Issues/PRs**: [ADR 0001: Cloudflare Workers AI Integration](file:///home/bobbyd/playspace/mentat-commons/docs/adr/0001-cloudflare-workers-ai-integration.md), [ADR 0003: Idea Incubator Design](file:///home/bobbyd/playspace/mentat-commons/docs/adr/0003-idea-incubator-design.md)

---

## 1. Context and Problem Statement

Initially, the Mentat Commons repository was designed as a static/dynamic consultancy portfolio website, with an explorer tool as a side feature. 

We now recognize that the website is only **one of many outputs**. The core product is an **Evidence Engine** that generates professional artifacts (Resumes, Cover Letters, Interview Notes, Consulting Proposals, Speaker Bios, and Web pages) from a unified, verified underlying career database.

We need to architect this engine so that:
1.  **Truthfulness is guaranteed**: Generated artifacts must only reference real, schema-validated nodes and metrics in the database. Hallucinated accomplishments are strictly forbidden.
2.  **Context-aware generation**: Generative tasks (e.g. matching a job description for a resume or matching a client problem for a proposal) must query and compile the most semantically relevant projects, skills, and talks as context before generation.
3.  **Multiple output formats**: The engine must support emitting plain text, JSON, markdown, and HTML, facilitating both CLI script operations and Web GUI downloads.

---

## 2. Decision Drivers

*   **Provenance & Traceability**: Ability to verify that every sentence/claim in a generated artifact maps to a specific project ID in `career_knowledge_base.json`.
*   **Decoupled Outputs**: The layout and styling of the website must be independent of the core retrieval-generation logic.
*   **Prompt Containment**: Centralized template management to ensure consistent, evidence-constrained outputs.
*   **Alignment with Project Principles**: *Retrieval before generation*, *Preserve provenance*, and *Never rewrite history*.

---

## 3. Options Considered

### Option A: Isolated Generation Scripts (Ad-hoc CLI utilities)
*   **Description**: Write independent scripts under `scripts/` (e.g., `generate-resume.js`, `generate-proposal.js`) with custom fetching and LLM prompting.
*   **Pros**:
    *   Simple to set up initially.
*   **Cons**:
    *   Duplicate prompt templates and retrieval code.
    *   No shared schema validation for truthfulness.
    *   Cannot be easily exposed to the Next.js web application for client-side downloads/copy.

### Option B: A Modular Service-Based Pipeline (Unified Compiler)
*   **Description**: Implement a core compiler layer in `lib/evidence_engine.mjs` that accepts:
    1.  An **Artifact Type** (resume, cover_letter, proposal, bio, etc.).
    2.  A **Target Constraint/Input** (e.g. job description text, speaking theme, client problem statement).
    3.  A **Template Selection**.
    The engine queries `searchCKB()`, aggregates matching nodes, formats the evidence context, calls the LLM, and validates the output claims against the source graph database before returning it.
*   **Pros**:
    *   Single source of truth for prompts, formatting, and safety checks.
    *   Easily exposed via both CLI commands (`scripts/evidence-compiler.mjs`) and API routes (`app/api/evidence/generate/route.js`).
    *   Guarantees strict provenance tracking.
*   **Cons**:
    *   Requires designing a generic API interface for diverse inputs and outputs.

---

## 4. Decision Outcome

*   **Chosen Option**: **Option B (Modular Service-Based Pipeline)**.
*   **Rationale**: Decoupling the generation engine from specific CLI scripts and frontend pages allows the website, the CLI compilers, and future sidecar extensions to share the same retrieval logic, truthfulness guards, and prompt templates. 

### ⚖️ Alignment with Project Principles
*   **Retrieval before generation**: The compiler first searches the Career Knowledge Base (CKB) for matching projects and experiences using the target constraints, injecting only relevant nodes as prompt context rather than letting the LLM generate freely.
*   **Preserve provenance**: Every compiled artifact includes a metadata header mapping claims back to CKB entity IDs (`write-*`, `proj-*`, `exp-*`), ensuring 100% auditability.

---

## 5. Consequences

*   **Positive impacts**:
    *   Allows generating a custom, highly tailored resume or cover letter in seconds via the terminal or web page, with mathematical certainty that no accomplishments are made up.
    *   Clean separation between data storage (JSON), processing (Engine), and outputs (Web/CLI).
*   **Negative impacts / Trade-offs**:
    *   Requires writing robust text-scraping parsers (e.g. to parse input Job Descriptions).
*   **Subsequent Tasks**:
    *   Write the technical specification [evidence-engine.md](file:///home/bobbyd/playspace/mentat-commons/docs/specs/evidence-engine.md).
    *   Create `lib/evidence_engine.mjs` containing the compiler.
    *   Expose the compiler through the CLI at `scripts/compile-artifact.mjs` and API at `/api/evidence/generate`.
