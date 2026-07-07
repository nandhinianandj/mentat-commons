# ADR 0002: Conversation Radar Storage Engine

*   **Status**: Proposed
*   **Date**: 2026-07-07
*   **Deciders**: Nandhini Anand (Architect), Antigravity (AI Architect)
*   **Related Issues/PRs**: None

---

## 1. Context and Problem Statement

The **Mentat Commons Conversation Radar** requires storing several types of state:
1.  **Ingested Feed Cache**: Cached post metadata (IDs, URLs, dates) from Hacker News, Reddit, RSS, arXiv, etc., to avoid re-fetching and processing duplicate entries.
2.  **Clustered Topics & Briefs**: Structured summaries of clustered topics and daily morning briefings.
3.  **Long-Term Memory**: Tracking recurring themes, questions, ideas to be researched further, and suggested consulting opportunities.

Since the system must run both locally (for terminal CLI/cron scripts) and in production (potentially on Vercel or Cloudflare Pages), the storage engine must support:
*   Low latency for RAG comparison against the Career Evidence Graph (CEG).
*   No-cost / low-cost operations.
*   Cross-environment compatibility (local Node.js environment vs. edge serverless environment).
*   Commitment to the Project Principles: *Human-readable and machine-readable* and *Preserve provenance*.

---

## 2. Decision Drivers

*   Local-first developer experience (zero complex infrastructure dependencies).
*   Cost-effectiveness in serverless deployments.
*   Schema flexibility (feed models, memory matrices, structured markdown briefs).
*   Portability between Vercel and Cloudflare.

---

## 3. Options Considered

### Option A: Flat-File JSON Storage (Root Data Directory)
*   **Description**: Store cache lists and memories in JSON files under the root `data/` directory (e.g. `data/radar_cache.json`, `data/radar_memory.json`), similar to `career_knowledge_base.json`.
*   **Pros**:
    *   100% human-readable, version-controlled in Git, and simple to edit.
    *   No external hosting fees or database connections.
    *   Easy to parse in both Node.js and serverless workers.
*   **Cons**:
    *   Serverless runtimes (Vercel, Cloudflare Workers) have read-only filesystems at runtime. Pushing new daily cache items or memories requires committing back to Git or writing via Git APIs, causing build churn.

### Option B: SQLite (Local) / Cloudflare D1 (Edge SQL)
*   **Description**: Use SQLite for local development and compile/bind to Cloudflare D1 SQL database when deployed to Cloudflare Pages.
*   **Pros**:
    *   Fully transactional; perfect for updating cache entries and appending memory logs at runtime.
    *   Native integration with Cloudflare Workers/Pages (D1 is Cloudflare's serverless SQL database, featuring a free tier).
    *   SQL tables are excellent for relational joins between feeds, items, and clusters.
*   **Cons**:
    *   Requires migration tooling and environment-specific database drivers (SQLite locally vs. D1 binding on Cloudflare).
    *   Database rows are less immediately human-readable/diffable than raw Git-committed files.

### Option C: Cloudflare KV (Key-Value) / Local Mock KV
*   **Description**: Use Cloudflare KV for edge persistence (caching URLs, storing memory strings) and a local JSON-backed KV mock for local development.
*   **Pros**:
    *   Extremely simple API read/writes (`kv.get(url)`, `kv.put(url, date)`).
    *   Very low latency and cheap/free on Cloudflare.
*   **Cons**:
    *   Lacks relational queries (e.g., matching a topic against multiple experiences or querying all clusters by date).

---

## 4. Decision Outcome

*   **Chosen Option**: **Option B (SQLite for local / Cloudflare D1 for production)**.
*   **Rationale**: The Conversation Radar is a dynamic ingestion pipeline. Its cache, clusters, and memory state are updated automatically on a daily schedule. Flat-file JSON (Option A) fails in serverless production because filesystems are read-only at runtime. SQLite/D1 provides the necessary write access while maintaining a local-first philosophy (SQLite is a single local file, requiring zero external server setup). 
*   We will build a **Database Access Layer (DAL)** interface with two drivers: `sqlite3` for local Node.js CLI execution, and `D1` SQL bindings for Cloudflare Pages.

### ⚖️ Alignment with Project Principles
*   **Preserve provenance**: Storing feed URL records, publish dates, and matching scores in SQL tables ensures that every briefing item remains traceable to its original raw feed item via database keys.
*   **Separate facts from interpretation**: Feed items (facts) are stored in the `items` table; generated briefs and LinkedIn suggestion arguments (interpretations) are stored separately in the `briefings` table.

---

## 5. Consequences

*   **Positive impacts**:
    *   Allows automatic daily cron scripts to update cached URLs and build summaries without Git commit churn.
    *   Enables SQL queries to quickly aggregate recurring themes over time (e.g. querying most frequent topics in the last 30 days).
    *   Completely free edge database hosting using Cloudflare D1's free tier.
*   **Negative impacts / Trade-offs**:
    *   Requires writing simple SQL schema migrations.
    *   Requires double-driver implementation (SQLite vs. D1).
*   **Subsequent Tasks**:
    *   Create SQL table schemas for `radar_sources`, `radar_items`, `radar_clusters`, and `radar_memory`.
    *   Write the database connection wrapper supporting both drivers.
