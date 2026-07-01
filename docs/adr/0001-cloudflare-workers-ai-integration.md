# ADR 0001: Cloudflare Workers AI Integration

*   **Status**: Accepted
*   **Date**: 2026-07-02
*   **Deciders**: Nandhini Anand (Architect), Antigravity (AI Architect)
*   **Related Issues/PRs**: None

---

## 1. Context and Problem Statement

Mentat Commons is evolving from a static portfolio website into a long-term knowledge platform, meaning it will host personal knowledge stores, data ingestion scripts, search indices, and LLM text generation features.

When deploying to production, we must respect the following constraints:
1.  **Low/Zero Operational Cost**: The dev/hosting setup should ideally fit within free tiers.
2.  **Privacy and Evidence Preservation**: We want to avoid sending private data to expensive proprietary external APIs (like OpenAI/Gemini) if possible, keeping the data lifecycle self-contained.
3.  **Edge Constraints**: Running a local GPU model (like Ollama) directly inside standard serverless runtimes (like Vercel Serverless Functions or Cloudflare Workers) is impossible due to memory limits (128MB to 512MB) and timeout limits (10 to 30 seconds).

We need an architecture that supports free/cheap LLM generation directly inside our serverless deployment context.

---

## 2. Decision Drivers

*   Maximize operational cost savings (zero-cost free tiers).
*   Respect hosting runtime boundaries (serverless memory/timeout limits).
*   Maintain codebase portability between Vercel and Cloudflare Pages.
*   Preserve professional data privacy.

---

## 3. Options Considered

### Option A: Local-Only Retrieval & Synthesis (Zero Cost, Fully Offline)
*   **Description**: Run purely on our custom rule-based synthesis fallback engine. No external LLMs are queried in production.
*   **Pros**:
    *   100% free and 100% private.
    *   No external API latency; executes in `< 5ms`.
*   **Cons**:
    *   Lacks natural language rephrasing, tone tailoring, or contextual conversational search.

### Option B: Proprietary Third-Party APIs (OpenAI / Gemini)
*   **Description**: Query external models via serverless REST calls, using key configurator secrets or browser-supplied client keys.
*   **Pros**:
    *   State-of-the-art reasoning and rephrasing quality.
*   **Cons**:
    *   Requires payment tokens or paid developer accounts.
    *   Passes career evidence details to external proprietary servers.

### Option C: Cloudflare Workers AI (Edge GPU Inference)
*   **Description**: Call Cloudflare's edge-hosted open-source models (like Llama-3-8B-Instruct) via their Edge API using account credentials.
*   **Pros**:
    *   Generous free tier (up to 10,000–100,000 tokens daily), allowing free LLM generation in production.
    *   Maintained on Cloudflare's secure infrastructure, matching edge routing.
*   **Cons**:
    *   Requires setting up a Cloudflare Account ID and API Token in environment variables.
    *   Edge models are smaller (8B to 70B parameter models) than proprietary giants, though fully sufficient for CKB rephrasing.

---

## 4. Decision Outcome

*   **Chosen Option**: **Option C (Cloudflare Workers AI)**, with a fallback to **Option A (Local Synthesis)** when no keys are defined, and support for **Local Ollama** during offline development. 
*   **Rationale**: Cloudflare Workers AI represents the best middle ground, allowing free, high-performance edge LLM execution directly within the hosting provider's boundary. By wrapping the implementation in a standard HTTP fetch REST request, the codebase remains 100% portable: it can run locally under Vercel/Node.js or inside a native Cloudflare Page deployment.

### ⚖️ Alignment with Project Principles
*   **Separate facts from interpretation**: Raw data (JSON) is processed locally on the client/edge first, and only the retrieved matching evidence context is forwarded to the edge LLM for final synthesis.
*   **Human-readable and machine-readable**: All configurations map to standard environment variables (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`), which are easily configured in CI pipelines.

---

## 5. Consequences

*   **Positive impacts**:
    *   Enables free production-ready LLM generation under Cloudflare's edge worker free tier.
    *   Ensures fast, low-latency API execution since models run close to user edge requests.
    *   Retains support for local development using local Ollama.
*   **Negative impacts / Trade-offs**:
    *   Developers must configure a Cloudflare Account and fetch an API Token.
*   **Subsequent Tasks**:
    *   Implement Cloudflare Workers AI HTTP REST fetch handler inside `lib/rag_ckb.mjs` (Completed).
    *   Integrate model routing environment variable bindings in `app/api/ckb/query/route.js` (Completed).
    *   Update project specs to include Cloudflare Workers AI configuration guidelines (Completed).
