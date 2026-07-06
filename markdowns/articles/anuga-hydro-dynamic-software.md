---
title: Anuga– hydro dynamic software
abstract: Original post from the blog titled 'Anuga– hydro dynamic software'.
problem: Original post from the blog titled 'Anuga– hydro dynamic software'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Anuga– hydro dynamic software'.
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

I was at
scipy India 2012
conference in Mumbai over the weekend and got bored of juost following the lecture and tride to install this anuga hydro dynamics project on my fedora box. There was no direct rpm for fedora 17 and i had to build from source, and soon i find that there’s an import of ScientificIO python package* required to be downloaded.
Some more google searching and it turns out it is an old package of scipy,numpy and netcdf, but not bundled anymore therefore not available anymore. I had scipy and numpy installed and only need netcdf .
I found an rpm and got it installed, thanks to iit bombay’s ftp mirrors.
Now the only thing left for me to install anuga is to get the python imports replaced.. After trying to run python setup.py install a couple of times and replacing the impor

...[Full content preserved in source]