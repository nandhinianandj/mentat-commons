---
title: Visualization Grammar — VEGA
abstract: Technical review of Vega Visualization Grammar, analyzing JSON semantics
  like signals, event streams, scales, and marks for reactive charting.
problem: Technical review of Vega Visualization Grammar, analyzing JSON semantics
  like signals, event streams, scales, and marks for reactive charting.
context: Legacy Wordpress blog post reference.
key_ideas:
- Technical review of Vega Visualization Grammar, analyzing JSON semantics like signals,
  event streams, scales, and marks for reactive charting.
lessons: Refer to post content for technical insights.
related_articles: []
related_projects: []
related_skills: []
related_talks: []
career_axes:
- axis-i
reading_time: 2 mins
evidence_links:
- https://softwaremechanic.wordpress.com/
tags:
- Archive
featured: false
---

VEGA:
A visualization grammar, a language for:
* — creating, saving and sharing interactive visualization designs
* — describe visual appearance and interactive behaviour of visualization in json
* — reactive signals that dynamically modify a visualization in response to input
event streams
Key Semantics:
The key semantics are:
* — width, height, padding, autosize (all are for specifying the size of the
visualization)
* — data (an array of data definitions, can define type, name, stream, url, and values of the
data type)
— scales (Configurations for as to map columns of data to pixel positions or
colors, or type of representation(for ex: categorical==> bands etc)).
— axes (Configuration of axes)
— marks (Graphical primitives, which are used to encode data. Has properties
position, size, sh

...[Full content preserved in source]