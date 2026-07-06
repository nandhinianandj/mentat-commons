---
title: Cabal Haskell unrecognized world-file
abstract: Original post from the blog titled 'Cabal Haskell unrecognized world-file'.
problem: Original post from the blog titled 'Cabal Haskell unrecognized world-file'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Cabal Haskell unrecognized world-file'.
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

looks like
cabal haskell’s
package manager doesn’t like to be moved around or i am messing with different versions..
I had in a fit of youthful rebellion combined the home folder between my fedora and ubuntu box… merging and replacing files and folders at will…
Result whenever i run cabal install i get a warning… i open the config file and realize there are a lot of references to the old username…damn…
i change it, but i still get the warning
Warning: /home/anandjeyahar/.cabal/config: Unrecognized field world-file on
line 15
Hmm.. wonder what’s the problem??
Update-06-Jun-2013:
Ok it seems an awful lot of people visit this post, so i’ll just put up this solution i found from googling.
cabal –config-file=”path/to/config”
9.913986
78.121727