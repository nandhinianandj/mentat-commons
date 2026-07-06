---
title: Binary vs binary + tree
abstract: Original post from the blog titled 'Binary vs binary + tree'.
problem: Original post from the blog titled 'Binary vs binary + tree'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Binary vs binary + tree'.
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

Binary tree, is something you guys should have studied in college and how it is very good for finding an element in terms of time complexity.
Now all of that is true and it is awesome, but if you’re trying to find the set of values in a range, it gets harder. In comes the B+ tree.
In essence it is the binary tree + plus a  sorted linked list of element at the lowermost row.
Now the nodes at the lower most part of the tree are the actual values. Everything above is placeholder values for pointing the search to the right pointer in the lower most linked list.
Given how the binary tree works, the values of upper nodes will be in the actual values, generally speaking, but need not be.
That is to say during insertion, we’d be inserting the value in one of the upper nodes(for routing), but durin

...[Full content preserved in source]