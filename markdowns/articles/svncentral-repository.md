---
title: svn/Central repository
abstract: Original post from the blog titled 'svn/Central repository'.
problem: Original post from the blog titled 'svn/Central repository'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'svn/Central repository'.
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

One of the downsides of svn vs git (perhaps central vs distributed versioning itself??) is that when you delete a file from a local copy1 of a repo. and then update the local copy2 it doesn’t delete the file. Even if the file hasn’t changed. I can understand if the local copy2 has changed the file but, even if it hasn’t changed??? Come on…. that’s a bad design… Maybe because it’s a centralized repository?? On second thoughts, no even that doesn’t make sense. Even if it’s a centralized repo you do have a backup of the file in a previous revision right?? So what’s the point of not deleting it in the local copy… it just creates extra work for the developer really…
And really ..WTF is this error message…??
svn: warning: Tree conflicts can only be resolved to ‘working’ state; ‘misc/ssh3.py’ not

...[Full content preserved in source]