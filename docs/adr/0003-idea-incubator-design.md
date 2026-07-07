# ADR 0003: Idea Incubator Conceptual Merging and Lifecycle State Machine

*   **Status**: Proposed
*   **Date**: 2026-07-07
*   **Deciders**: Nandhini Anand (Architect), Antigravity (AI Architect)
*   **Related Issues/PRs**: [ADR 0002: Conversation Radar Storage Engine](file:///home/bobbyd/playspace/mentat-commons/docs/adr/0002-conversation-radar-storage.md)

---

## 1. Context and Problem Statement

The **Idea Incubator** module shifts the focus of the Mentat Commons platform from short-term content tracking to long-term intellectual capital management. It must identify core ideas that reappear across time, industries, and contexts under different names.

To build this, we must solve three key technical problems:
1.  **Semantic Concept Merging**: Traditional keyword matching or raw vector embedding distance (cosine similarity) falls short when grouping concepts. For example, "Prompt Engineering" and "AI Agent Tool Use" might be close in vector space, but they represent distinct concepts. Conversely, "Model Hallucination" and "Evidence Validation" are far apart in raw vector space but conceptually map to the same deep theme: **Evidence**.
2.  **Concept Lifecycle Transitions**: Ideas must progress through distinct stages (Seed ➔ Interesting ➔ Recurring ➔ Persistent ➔ Research Worthy ➔ Signature Theme ➔ Consulting Capability) based on evidence. We need a deterministic, rule-based recommendation machine for these transitions.
3.  **Question Drift Mapping**: How do we dynamically map shallow technical buzzwords (e.g. "MCP", "Vector DB") to their deeper, long-term philosophical questions (e.g. "Coordination", "Knowledge Representation")?

---

## 2. Decision Drivers

*   Accuracy in conceptual alignment (avoiding false merges based on generic vector proximity).
*   Traceability (every idea record must trace back to raw ingested items and personal history).
*   Performance (running Jaccard clustering first, then executing targeted reasoning steps to avoid heavy API overhead).
*   Adherence to Project Principles: *Ignore novelty, optimize for persistence* and *Preserve provenance*.

---

## 3. Options Considered

### Option A: Pure Embedding-Based Vector Clustering (e.g. K-Means on cosine distance)
*   **Description**: Convert incoming Radar topics to embeddings and cluster them mathematically.
*   **Pros**:
    *   Fast, fully automated, and cheap.
*   **Cons**:
    *   Unreliable for deep semantic normalization. "AI Safety" and "Model Alignment" might cluster together, but will fail to map to the deeper concept of "Governance" unless an explicit reasoning step is performed.

### Option B: Reasoning-Based Hybrid Parsing (Jaccard + LLM Synthesis)
*   **Description**: Run a lightweight keyword/token Jaccard grouping on incoming feed items first. Then, pass the clustered concepts to the LLM alongside existing memories and ask it to perform semantic reasoning to: (a) normalize the terminology, (b) check if it should merge with an existing concept, and (c) map it to a deeper underlying question.
*   **Pros**:
    *   Highly accurate; captures abstract conceptual connections (e.g., Prompt Engineering ➔ Human-Computer Collaboration).
    *   Fits the *human-in-the-loop* philosophy.
*   **Cons**:
    *   Higher LLM API token consumption, though mitigated by running Jaccard pre-filtering first.

---

## 4. Decision Outcome

*   **Chosen Option**: **Option B (Reasoning-Based Hybrid Parsing)**.
*   **Rationale**: The Idea Incubator is not a real-time search engine; it runs as a daily or weekly batch job. Therefore, we prioritize semantic accuracy over microsecond execution speeds. Using the LLM to perform logical normalization and classification ensures that we build a high-quality personal knowledge base of enduring themes rather than a generic tag cloud.

### ⚖️ Alignment with Project Principles
*   **Evidence before narrative**: An idea is only promoted to "Signature Theme" if the database has logged it across multiple timeframes, industries, and personal experiences. The lifecycle machine verifies this evidence before suggesting a promotion.
*   **Everything is evidence**: Articles, research papers, consulting logs, and workshop feedback are treated as first-class signals in the persistence scorer.

---

## 5. Consequences

*   **Positive impacts**:
    *   Builds a highly clean, structured database of personal "Signature Themes" that naturally align with your consulting capabilities.
    *   Avoids tag fragmentation (e.g., having separate tags for "ASR", "audio model", and "transcription" when they represent the same core category).
*   **Negative impacts / Trade-offs**:
    *   Daily/weekly batch runs will take longer due to sequential LLM reasoning steps.
*   **Subsequent Tasks**:
    *   Add tables to [radar_db.json](file:///data/radar_db.json) for `incubator_ideas` and `question_drift`.
    *   Write the concept normalization and merging logic inside `lib/incubator_engine.mjs`.
    *   Integrate the Weekly Review compiler and UI dashboard.
