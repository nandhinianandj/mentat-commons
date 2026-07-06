---
title: Training a haar wavelet cascade classifier
abstract: Original post from the blog titled 'Training a haar wavelet cascade classifier'.
problem: Original post from the blog titled 'Training a haar wavelet cascade classifier'.
context: Legacy Wordpress blog post reference.
key_ideas:
- Original post from the blog titled 'Training a haar wavelet cascade classifier'.
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

Training a Haar-Cascade classifier:
Original inspiration from the post
here.
. And based off the documentation
here.
Before we start, if you don’t know what the haar wavelet part read about it
here.
and for cascade classifier read
here.
The Haar-cascade classifier, is a combination of both. i.e: find haar wavelet thresholds at different levels and chain all those weak classifiers to form a stronger one.
Before we start creating the classifier data, we need a data set. You’ll need to find positive and negative images of the object you want to train. i.e images with the object and without it. Make sure, you have resized them to the same size, and they’re not screwed up by the resizing.
Now, we’re ready for the 1st step in haar-wavelet cascade classifier training.
Before we can train, we need

...[Full content preserved in source]