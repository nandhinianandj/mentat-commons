---
title: Debugging a redis contribution– adding bloom filter
abstract: Original post from the blog titled 'Debugging a redis contribution– adding
  bloom filter'.
problem: Original post from the blog titled 'Debugging a redis contribution– adding
  bloom filter'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Debugging a redis contribution– adding bloom filter'.
lessons: Refer to post content for technical insights.
related_articles: []
related_projects: []
related_skills: []
related_talks: []
career_axes:
- axis-ii
reading_time: 2 mins
evidence_links:
- https://softwaremechanic.wordpress.com/
tags:
- Archive
featured: false
---

I got stuck on this weird segmentation fault during my attempt to add bloom filter to redis. (See
here for source
.)
Running redis server with gdb and then printing out variables, i concluded that the Bloom filter struct’s member variable a points to an unassigned or atleast out of bounds memory address.
Now, my first thought was that damn may be it’s because default redis make creates the redis binary with gcc optimizations enabled. So  I did a
<blockquote>
make clean
followed it up with a
make noopt
as suggested by this part in the Makefile
here.
noopt:
$(MAKE) OPTIMIZATION=”-O0″
But that didn’t solve any of my problems. So at first , i blamed the Makefile saying it doesn’t propagate the -O0. But then decided, I’ll try the same scenario on a small test code. After all, there’s a lot that

...[Full content preserved in source]