---
title: Linux applications
abstract: Original post from the blog titled 'Linux applications'.
problem: Original post from the blog titled 'Linux applications'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Linux applications'.
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

Unfortunately, a lot of application developers like overcommit, presumably for two reasons:
It allows you to allocate a ridiculous amounts of memory as long as you know you’ll only make sparse use of it. In our credit card analogy, this is like a contractor going to a building supply store and buying twice the amount of materials they expect to need using a credit card, knowing they’ll be safe as long as they go back and return the unused materials for a refund before the credit card bill is due.
It gives you an excuse to be lazy handling errors. You can rationalize ignoring the return value of
malloc
on the basis that, due to overcommit, even if you check the return value you can’t be sure to avoid crashing later when the kernel doesn’t have enough physical memory to instantiate your virt

...[Full content preserved in source]