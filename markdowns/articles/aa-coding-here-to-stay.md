---
title: AA Coding is here to stay & no it's not going to replace people.
abstract: Post-mortem analysis of developing a sentiment-analyzing RSS parser in 2
  hours using LLMs, reflecting on taste and engineering context.
problem: Will AI-assisted code generation render traditional software expertise obsolete?
context: Building Python FastAPI/SQLite/Distilbert microservices in 2025.
key_ideas:
- AI-Assisted Coding (AAC)
- Taste development
- CPython codebase context
lessons: AI-assisted coding enables rapid MVP delivery, but maintaining and scale-proofing
  complex products requires high-context systems taste.
related_articles: []
related_projects: []
related_skills: []
related_talks: []
career_axes:
- axis-i
- axis-ii
reading_time: 3 mins
evidence_links:
- https://www.linkedin.com/posts/nandhinianandj_aa-coding-here-to-stay
tags:
- AI Coding
- Software Engineering
- Ira Glass Taste
- Python
- LinkedIn
featured: false
---

AI Assisted Coding(Not Vibe Coding) is here to stay...

I just spent a couple of hours using chatGPT free version and one session to write a python fastapi based REST API app that will take a rss feed , read it, parse it, feed the rss item content to a distilbert model and classify it as positive or negative sentiment and store it in sqlite db.

And that's all it took 2 hours... 10 years ago, this would have been a whole lot of 2 days of work to write it referring documentation, example scripts, modify it, write test cases, debug , add support for db , etc...


And no , it's not gonna replace human beings, I started this work yesterday, first using a news website, trying to figure out crawling and getting the data from the site. Also, I have more than a decade(a little shy of 2 decades) of programming experience, almost 15 years of being only on a Linux flavoured OS, working with python since 2009, years spent reading python source code for frameworks like django, flask, bottle.py, tornado etc.. And another couple of years reading cpython internals(for fun).. ... And also building some web apps and web framework backends. For the record, I don't say this to gatekeep but to give context. I think of myself more as a average programmer/hacker/builder than anything(And that's real humility not fake one)

They are all not useless, but also not necessary in the modern day to know everything.. There's this idea from advice for artists by Ira Glass comes to mind. What beginner artists have is good taste. AAC(as some call it Vibe Coding) can help beginners to get to good taste may be faster, but definitely to turn out some apps quickly... But here's the thing the bigger/popular/complex that thing/app/product gets, the harder it is to have a good sense of that taste..

AA coding is transforming the software industry for sure, how and is it just super express/fast or just more robust or something else entirely is a matter of prediction and I'd be interested in trying to find a answer from a mixture of experts .

I'll be interested in how the opinion evolves and following it..