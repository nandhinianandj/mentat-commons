# Session Context

## Current Task
Legacy WordPress blog migration, interconnected evidence graph construction, STAR interview mapping, V2 conceptual redesign for Mentat Commons, and MeWe speculative systems research integration.

## Key Decisions
* **Consolidation**: Consolidated Research and Technical Notes into three playbooks (`statistical_inference_playbook.md`, `low_level_systems_debugging.md`, `systems_optimization_playbook.md`).
* **STAR Data Injection**: Mapped and injected STAR interview structures directly into the matching writing entities inside [career_knowledge_base.json](file:///mnt/data/playspace/mentat-commons/data/career_knowledge_base.json).
* **UI Detail Panel Expansion**: Modified [page.jsx](file:///mnt/data/playspace/mentat-commons/app/career/page.jsx) to dynamically render structured STAR segments, lessons learned, trade-offs, and stakeholder badges for writing nodes.
* **Graph API & Explorer Integration**: Exposed `/api/ckb/graph` to load [evidence_graph.json](file:///mnt/data/playspace/mentat-commons/data/evidence_graph.json) and integrated relationship-based neighbor queries directly into the UI explorer panels, enabling graph traversal.
* **Mentat Commons Schema Migration**: Updated `schema.json` and converted all 236 writing database items to support rich metadata attributes (Abstract, Problem, Context, Key Ideas, Lessons Learned, Reading Time, and Tags) and updated the page details layout to display them.
* **Mentat Commons Markdown Export**: Generated 152 individual YAML-frontmatter-enabled Markdown files in `/mnt/data/playspace/mentat-commons/markdowns/articles/`, converting the chronological blog history into a clean, file-based knowledge repository.
* **Featured Collection Tagging & Grouping**: Tagged exactly 20 original core articles (excluding all reblogged or purely experimental content) as `featured: true` in the primary database, enriched them with custom profiles, and dynamically injected this collection at the top of the sidebar explorer.
* **LinkedIn Posts Integration**: Parsed `linkedin_posts.md` and successfully integrated 7 new posts (chain of thought, AGI history, Zomato pure veg decisions, hiring data science teams, Gen-AI, AA coding, efficiency vs effectiveness) into the primary JSON database and generated their individual Markdown files under `/mnt/data/playspace/mentat-commons/markdowns/articles/`.
* **V2 Conceptual Redesign**:
  - Homepage restructured around 10 interactive enduring research questions and 3 career axes. Added MeWe spec-fiction article links directly under their corresponding question mappings.
  - Portfolio page updated to render dynamic case studies with deep-linking support.
  - Consulting page restructured under "problems we can solve together" backed by database evidence.
  - About page rewritten as a narrative milestone list.
  - Updated global layout, navigation links, and theme styling (globals.css) with a premium slate-dark mode.
* **MeWe Speculative Systems Research**:
  - Integrated 11 speculative fiction and interlude articles into the CKB JSON database under `writing.stories` or `writing.essays` with `"ai_assisted": true`.
  - Created a dedicated `/narrative` page with a Speculative Research Philosophy card and transparent **AI Disclosure box** (detailing the iterative human-AI collaboration process).
  - Deep-linked MeWe links from the homepage questions list directly to `/narrative?node=write-some-slug` (expanding the corresponding chapter automatically).
  - Added a transition bridge banner inside the Career Explorer details panel for any AI-assisted articles, routing visitors to read them in narrative context.
* **Test Suite Integration**:
  - Created `scripts/test-speculative-research.mjs` verifying schema validation, MeWe article presence, referential integrity of mapped evidence links, and i18n localization completion.
  - Configured `npm run test:spec`, `npm run test:ckb`, and `npm test` scripts in `package.json` to run both test suites simultaneously. All test cases compiled and passed successfully.

## Next Steps
* Add deep-dive code evidence links to the corresponding historical GitHub projects.
* Expand the retrieval APIs to incorporate graph-based context fetching.
