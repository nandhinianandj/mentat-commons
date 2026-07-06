---
title: Building ghc from source
abstract: Original post from the blog titled 'Building ghc from source'.
problem: Original post from the blog titled 'Building ghc from source'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Building ghc from source'.
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

Am trying to get a latest ghc + haskell platform + cabal setup on my laptop.. I have built ghc-7.4 from source… now here’s the time it takes to run make on amd athlon 64×2  running on a 32-bit Ubuntu 11.10 with 2 GB RAM..
time -p ./configure
real 32.47
user 12.16
sys 4.77
time -p make
real 10345.75
user 8729.29
sys 1045.89
sudo time -p make install
real 121.08
user 54.49
sys 8.96
9.913986
78.121727