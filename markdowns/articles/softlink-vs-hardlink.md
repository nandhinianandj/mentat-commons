---
title: softlink vs hardlink
abstract: Original post from the blog titled 'softlink vs hardlink'.
problem: Original post from the blog titled 'softlink vs hardlink'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'softlink vs hardlink'.
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

Difference between softlink and hardlink on a ext2 fs.
The ext2 filesystem has a table called MFT(Master File Table).
This is the table that holds inode(hexadecimal short addresses, that point(mapped) to a block of HD memory.)
This is also the table that is created during FS creation, unless am mistake, it is also modified during tune2fs modifying block sizes.
Anyway, to get to the point, softlinking to a file maps an unassigned inode to the existing files inode.
On the other hand Hardlinking just creates a pointer to that inode in the hardlink directory’s entry.
A simple look:
Here’s a file i created with touch and it’s inode:
ls -li test_link
29886232 -rw-r–r– 2 root root 0 Oct 11 21:16 test_link
Here’s the output for a  symlink:
ls -li link1
29886233 lrwxrwxrwx 1 root root 9 Oct 11 21:1

...[Full content preserved in source]