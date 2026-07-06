---
title: Deep C- struct packing
abstract: Original post from the blog titled 'Deep C- struct packing'.
problem: Original post from the blog titled 'Deep C- struct packing'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Deep C- struct packing'.
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

Once again, from
Deep C
. The size of structs.
The basic idea is to test the knowledge that sometimes compilers do optimizations on how the structure is situated in memory. According to the pdf, this is because most hardware architectures are optimized for byte sized access, and so compilers generally pad structures and their elements so that they can be accessed in a byte wise manner.  Now this may have been true sometime back, and perhaps still true in a statistical majority sense, but with the profusion of mobile computing devices, I suspect new architectures might have a more fine-grained(than word) access. Anyway,that’s marked for future research. Besides, given how much we have shrunk memory, that’s probably not the case for Smartphones and tablet. They probably still use word optimi

...[Full content preserved in source]