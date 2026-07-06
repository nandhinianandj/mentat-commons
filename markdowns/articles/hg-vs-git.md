---
title: Hg vs git vs darcs vs bzr
abstract: Original post from the blog titled 'Hg vs git vs darcs vs bzr'.
problem: Original post from the blog titled 'Hg vs git vs darcs vs bzr'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Hg vs git vs darcs vs bzr'.
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

Hg pull is the same as git fetch. while git pull is like hg update.
Damn, what a mess of command semantics…
rantingrick
(python list) is right.
We have too much multiplicity..
Hg pull and git fetch retrieve the differences between local and remote repository.
hg update and git pull retrieve the differences and merge/update the local repo.
What do you know? bzr pull does the same thing as git pull. So does
darcs
. Ah guess mercurial tried to copy/borrow the svn update semantics….
See
here
for a very detailed implementation agnostic tutorial of source control softwares.