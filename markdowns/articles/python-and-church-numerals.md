---
title: Python and church numerals
abstract: Original post from the blog titled 'Python and church numerals'.
problem: Original post from the blog titled 'Python and church numerals'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Python and church numerals'.
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

This is a cool piece of python code showing off the first class function ability of python, written by
Vivek Haldar.
Perhaps, not very useful (well maybe except in some long integer handling, but not efficient there), nevertheless it’s a cool piece of code.
It’s cool, because it illustrates 2 things:
1.Python’s first class treatment of functions and lambda function facility allows you to stack on a bunch of func calls, while evaluating them only at the end.
2.Natural numbers can be represented as set and operators that add elements to the set. or It can be represented as a set of functions composed and applied on an initial value.
Here’s the code:
#Copied from (https://gist.github.com/2438498)
zero = lambda f: lambda x: x
succ = (lambda n: lambda f: lambda x: f(n(f)(x)))
one = succ(zero)
a

...[Full content preserved in source]