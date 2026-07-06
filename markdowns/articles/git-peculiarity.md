---
title: git peculiarity
abstract: Original post from the blog titled 'git peculiarity'.
problem: Original post from the blog titled 'git peculiarity'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'git peculiarity'.
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

So far my understanding of distributed versioning systems has been overly ideal. I had been believing that all the repos are equal and there’s no difference between master versus branches…  Boy, was i wrong.. I just setup git server repo for the codebase(well moved from svn to git really…but..) Yep the git init –bare which is being used for creating the first repo on the git server creates a different directory structure….
— branches
— config
— description
— HEAD
— hooks
— info
— objects
— refs
Boy reminds me of the svn directory structure on the server copy…. Now i know, why they say the more things change, the more they stay the same……