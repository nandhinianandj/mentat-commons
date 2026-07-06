---
title: Lessons learnt from trying to contribute to redis.
abstract: Original post from the blog titled 'Lessons learnt from trying to contribute
  to redis.'.
problem: Original post from the blog titled 'Lessons learnt from trying to contribute
  to redis.'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Lessons learnt from trying to contribute to redis.'.
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
- Featured Collection
featured: false
---

These are the lessons i learnt from trying to add bloom filter as a data type to redis(See
here
). Given i had no experience with C outside lab/training classes, it was an immense learning experience.
1.It’s always worth the time taken to sit down and understand the interface to be provided, even if you are only porting existing code.
2.Time invested understanding the structure/architecture of the target app codebase, is time saved, and more importantly frustration saved.
3. I now understand why so much of C code has the opening { brackets right at the function declaration and not a newline.
Because of cscope. it displays the line where it found the function.
Even though you don’t need it to distinguish function declaration vs call, it is easier.
4.GDB is a very useful and handy tool, but 

...[Full content preserved in source]