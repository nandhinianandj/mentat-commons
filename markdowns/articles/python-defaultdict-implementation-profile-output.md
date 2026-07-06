---
title: python defaultdict implementation profile output
abstract: Original post from the blog titled 'python defaultdict implementation profile output'.
problem: Original post from the blog titled 'python defaultdict implementation profile output'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'python defaultdict implementation profile output'.
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

Hi,
i was just reading old classes vs new style classes (
http://www.python.org/download/releases/2.2.3/descrintro/
)
and saw that Guido was saying the key in list implementation of defaultdict would be slower.
sure it made sense. but just wanted to see how much differnce it would make. i hadn’t used cProfile anywher yet.. so got it done and here it goes no surprise. the in keys implementation is slower for medium -big dictionaries… Here are the results on github(
https://github.com/anandjeyahar/python-dict-profiler
)