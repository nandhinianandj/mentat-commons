# Session Context

## Current Task
AEO & GEO dynamic redesign to maximize indexability, semantic hierarchy, and citation alignment for LLMs.

## Key Decisions
* **Dynamic Landing Pages**: Designed `/services` and dynamic specifications page `/services/[slug]` for the 10 core offerings.
* **30-Item FAQ Accordion**: Developed `/faq` using native HTML tags alongside dynamic `FAQPage` JSON-LD schema.
* **LLM Crawl Optimization**: Deployed `/llms.txt`, updated `robots.txt` and `sitemap.xml` with absolute routes, and set up a build-time prebuild hook.

## Next Steps
* Monitor SearchGPT and Perplexity indexing loops.
* Review LLM-facing metadata mapping.
