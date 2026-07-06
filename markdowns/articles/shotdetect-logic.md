---
title: Shotdetect logic
abstract: Audit of scene change detection loop in Shotdetect and spatial weighting
  proposal.
problem: High false positive rate in scene cut detection due to localized contrast
  changes (e.g. headlight corners).
context: Analyzing source code in film.cc within the Shotdetect C codebase.
key_ideas:
- Spatial grid segmentation
- Weighting matrix optimization
- CompareFrame loop performance
lessons: Weighting local spatial segments is more robust than global summary statistics
  for image transitions.
related_articles:
- write-c_learnings-from-trying-to-fix-cpython-bug-8452
related_projects:
- proj-waste-detection
related_skills:
- C++
- Image Processing
related_talks: []
career_axes:
- axis-i
reading_time: 3 mins
evidence_links:
- https://softwaremechanic.wordpress.com/2015/06/25/shotdetect-logic/
tags:
- Computer Vision
- C
- Algorithms
- Image Analysis
- Featured Collection
featured: true
---

Shotdetect logic:
Shotdetect
is a nice useful tool, for video processing area of work. In essence, it tells you at which shots there was/is a  scene/shot change. It takes a threshold value and compares two consecutive frames.(I’d like an option to compare more ,but the compare algo gets complicated).
Even for the two images, he’s doing summary statistics of the frames/images. But, there are problems with that approach, (i.e: high intensity object in a small corner of an image, like a car headlight, ) can be counted as shot, it can be valid in cases where 25% of the image/frame is a car light, but on a long shot of the road, it’s probably a bad idea.
So he splits the image into segments and summarizes the segments and compare segment by segment.
Here’s the logic/code:
(in film.cc cscope/gre

...[Full content preserved in source]