---
title: Calling conventions, ABIs
abstract: Original post from the blog titled 'Calling conventions, ABIs'.
problem: Original post from the blog titled 'Calling conventions, ABIs'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Calling conventions, ABIs'.
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

Well, In another set of weird “following my nose”* instances, I end reading up about cdecl calling conventions for x86.
Turns out there’s more layers involved in between the conversion of C-code to executable than the ones I was aware of.
Not only that there’s a compiler and linker stage, they are there to provide abstractions about the hardware.
Now, that’s not new, anyone who took a basic peek at Operating Systems course can tell you that.
The interesting part according to this wikipedia page
is that there’s something called an Application Binary Interface.
And then there are calling conventions. These turn out to be a set of standards agreed on by hardware manufacturers.
It turns out they needed such a thing because before microcomputers, each hardware manufacturer used to supply his ow

...[Full content preserved in source]