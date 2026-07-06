---
title: Make lessons
abstract: Original post from the blog titled 'Make lessons'.
problem: Original post from the blog titled 'Make lessons'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Make lessons'.
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

I was messing around with opencv library for C++ and it’s interface.
Very soon, after I began typing out code from web pages and compiling, I got tired of running the compilation command manually from the terminal.
Not to mention, since I had built opencv from source, I had to explicitly pass -I folder.
Soon, I was wishing I can just run make  and get the code to run.
Well, instead of that I figured out a way to run make and just compile and create all object files in the current folder.
Here’s the MakeFile I ended up using:
PROGRAMS_SRC=$(wildcard *.c)
TARGETS=$(patsubst %.c, %,$(PROGRAMS_SRC))
CPPFLAGS=I/usr/local/include/opencv2
all:
$(foreach var,$(PROGRAMS_SRC),g++ $(var) -o $(patsubst %.c, %,$(var)) -$(CPPFLAGS); )
The two key things I learnt were patsubst and foreach. I had seen pat

...[Full content preserved in source]