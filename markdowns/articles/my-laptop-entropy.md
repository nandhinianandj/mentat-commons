---
title: My laptop entropy
abstract: Original post from the blog titled 'My laptop entropy'.
problem: Original post from the blog titled 'My laptop entropy'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'My laptop entropy'.
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

Suddenly, had an interest in finding out the entropy of my laptop and ran time dd if=/dev/random of= bs=1M count=500.
For those of you who don’t know what /dev/random does, here’s a quote from
wikipedia link.
In Unix-like operating systems, /dev/random is a special file that serves as a blocking pseudorandom number generator. It allows access to environmental noise collected from device drivers and other sources.[1] Not all operating systems implement the same semantics for /dev/random.
And the results are in:
Date:17-Sep-2011. Torrent download going on. System uptime for about 7-8 hrs
time dd if=/dev/random of=test_entropy bs=1M count=500
0+500 records in
0+500 records out
4025 bytes (4.0 kB) copied, 564.065 s, 0.0 kB/s
real	9m24.855s
user	0m0.005s
sys	0m0.125s
Date: 19-Sep-2011
Just did 

...[Full content preserved in source]