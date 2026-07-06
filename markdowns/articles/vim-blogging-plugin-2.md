---
title: vim blogging plugin
abstract: Original post from the blog titled 'vim blogging plugin'.
problem: Original post from the blog titled 'vim blogging plugin'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'vim blogging plugin'.
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

Hmm..it’s interesting the behaviour of this plugin… and very odd… right after “:Blog publish” it fetches the date with local time +time zone difference. I think that’s where the source of the problem lies. i.e the point where the plugin sends the post over to wordpress it sends it with the local time but somehow assumes the time in GMT.. Hmm.