---
title: LVM
abstract: Original post from the blog titled 'LVM'.
problem: Original post from the blog titled 'LVM'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'LVM'.
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

LVm has a very peculiar way of working. i did a pvmove. Then an lvresize. then i did a pvremove. And then a resize2fs later. now it doesn’t mount seems to have a bad geometry. i guess this means the process did not update the Master File Table inode entries.i thought the resize2fs was supposed to do the same. Infact e2fsck now says bad superblock. But running it once seems to fix the error…Hmm.. i am missing something.
And it gets funnier.. i can now(after e2fsck) mount the device from my live usb version and the maintenance mode of my usual ubuntu image. But not in the usual mode. Very funny business going on…
Ah.. what i missed was that i should have resized the filesystem before the logical volume. that caused the problem. but still can’t understand why it would mount fine in single use

...[Full content preserved in source]