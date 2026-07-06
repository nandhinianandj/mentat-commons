---
title: Haskell –my observations
abstract: Original post from the blog titled 'Haskell –my observations'.
problem: Original post from the blog titled 'Haskell –my observations'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Haskell –my observations'.
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

Just trying out haskell. For all the coolness and power of infinite lists, actual performance looks absymal. Just implemented the fibonacci series as a recursively defined infinite list. And running it with naive basic options takes a visibly long time. Clearly under-utilizing the CPU resources i have. But i guess, it’s not very surprising and i ought to try it with options for memoization and other stuff.
Am beginning to doubt in my obsession with haskell’s pattern-matching i have run into a bad case of tail-call recursion.
Update:  I was wrong. it turns out tail-call recursion is actually good for performance. My prog was horrible because it repeated every fibonacci call twice…. Thanks to stackoverflow for pointing out my ignorance.
http://stackoverflow.com/questions/7854040/haskell-inef

...[Full content preserved in source]