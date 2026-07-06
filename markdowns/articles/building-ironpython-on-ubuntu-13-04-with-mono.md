---
title: Building IronPython on ubuntu 13.04 with mono
abstract: Original post from the blog titled 'Building IronPython on ubuntu 13.04
  with mono'.
problem: Original post from the blog titled 'Building IronPython on ubuntu 13.04 with mono'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Building IronPython on ubuntu 13.04 with mono'.
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

In another of those obviously pointless, crazy ideas* i come up with, i decided that since Ubuntu supports mono and C# programming via that, i need to install Iron python on my Ubuntu 13.04 box.(That poor laptop will cry out if it could, my old one certainly did).
Anyways i found
this
so dutifully did run apt-get install ironpython, apparently that package is not available in my current software sources repo. OK time to figure out where it is available and add that source repo, in the mean time i can also put in a git clone as mentioned
here
See am skeptic it will work out of the box even if i find a software source and install ironpython from there..
That blog post mentions pypy and jython as other implementations and refers to both jython and ironpython as GIL less.. Oh cool, ofcourse i 

...[Full content preserved in source]