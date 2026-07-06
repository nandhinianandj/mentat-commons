---
title: xmonad/haskell weirdnesses
abstract: Original post from the blog titled 'xmonad/haskell weirdnesses'.
problem: Original post from the blog titled 'xmonad/haskell weirdnesses'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'xmonad/haskell weirdnesses'.
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

Xmonad or haskell seem to be acting weird. Well weird to someone used to the execution sequence. changing a line in the xmonad.hs config file causes a different error. That’s normal but what’s funny is if i leave it as it is, it seems to get executed till a different line (where default terminal gets set to gnome-terminal and if i change this line it doesn’t. i.e i get the default terminal as xterm … Whoa.. that’s very odd implementation i believe….)
Sun 06 Nov 2011 02:00:58 IST Correction: If i change that line back to what it was and logout and login it doesn’t go back to gnome-terminal. Hmm.. looks more like funny xmonad recompilation than haskell implementation…still weird though..
Update  Sun 06 Nov 2011 02:02:40 IST:
Beginning to think the funniness was just me. I had gnome-terminal 

...[Full content preserved in source]