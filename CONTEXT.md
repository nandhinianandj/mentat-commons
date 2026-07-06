# Session Context

## Current Task
Legacy WordPress blog migration, interconnected evidence graph construction, and STAR interview mapping for Mentat Commons.

## Key Decisions
* **Consolidation**: Consolidated Research and Technical Notes into three playbooks (`statistical_inference_playbook.md`, `low_level_systems_debugging.md`, `systems_optimization_playbook.md`).
* **STAR Data Injection**: Mapped and injected STAR interview structures directly into the matching writing entities inside [career_knowledge_base.json](file:///mnt/data/playspace/mentat-commons/data/career_knowledge_base.json).
* **UI Detail Panel Expansion**: Modified [page.jsx](file:///mnt/data/playspace/mentat-commons/app/career/page.jsx) to dynamically render structured STAR segments, lessons learned, trade-offs, and stakeholder badges for writing nodes.
* **Graph API & Explorer Integration**: Exposed `/api/ckb/graph` to load [evidence_graph.json](file:///mnt/data/playspace/mentat-commons/data/evidence_graph.json) and integrated relationship-based neighbor queries directly into the UI explorer panels, enabling graph traversal.
* **Mentat Commons Schema Migration**: Updated `schema.json` and converted all 236 writing database items to support rich metadata attributes (Abstract, Problem, Context, Key Ideas, Lessons Learned, Reading Time, and Tags) and updated the page details layout to display them.
* **Mentat Commons Markdown Export**: Generated 152 individual YAML-frontmatter-enabled Markdown files in `/mnt/data/playspace/mentat-commons/markdowns/articles/`, converting the chronological blog history into a clean, file-based knowledge repository.
* **Featured Collection Tagging & Grouping**: Tagged exactly 20 original core articles (excluding all reblogged or purely experimental content) as `featured: true` in the primary database, enriched them with custom profiles, and dynamically injected this collection at the top of the sidebar explorer.

## Next Steps
* Add deep-dive code evidence links to the corresponding historical GitHub projects.
* Expand the retrieval APIs to incorporate graph-based context fetching.
