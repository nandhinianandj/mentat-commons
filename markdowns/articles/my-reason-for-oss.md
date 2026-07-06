---
title: My reason for OSS
abstract: Original post from the blog titled 'My reason for OSS'.
problem: Original post from the blog titled 'My reason for OSS'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'My reason for OSS'.
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

I have spent close to 6 hours today trying to figure out why Netscaler nitro api’s login won’t work… Finally someone from irc pointed out this blog
http://blogs.citrix.com/2011/09/28/netscaler-nitro-api-101-logging-in-with-python/
and i realized i was sending the credentials without the “object ” part… Damn… you Documentations…This is one of the main reasons i am a huge supporter of open-source… Now the documentation did not say not to send object as part of data, neither did it say it needs to be sent.. From the way it was given and my pythonized brain, i just assumed it to be a dictionary object and “object ” just being a variable….
If i had access to the source, i would have read it instead… agreed familiarity with the language matters, but …
Again, NetScaler proves they don’t have a te

...[Full content preserved in source]