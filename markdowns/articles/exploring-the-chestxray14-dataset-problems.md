---
title: 'Exploring the ChestXray14 dataset: problems'
abstract: Technical audit of label leakage, overlap, and silent patient-cross-over
  vulnerabilities in NIH's ChestXray14 machine learning dataset.
problem: Machine learning models trained on ChestXray14 show false high performance
  due to same-patient images existing in both training and test subsets (data leakage).
context: Evaluating dataset preparation and governance for medical diagnostic models.
key_ideas:
- Patient overlap leakage
- Silent label correlations
- NIH dataset validation
lessons: Partition dataset splits strictly by patient ID to prevent leakage and guarantee
  generalization in clinical applications.
related_articles: []
related_projects: []
related_skills: []
related_talks: []
career_axes:
- axis-i
reading_time: 5 mins
evidence_links:
- https://softwaremechanic.wordpress.com/
tags:
- Machine Learning
- Healthcare
- Dataset Auditing
- Featured Collection
featured: true
---

Lauren Oakden-Rayner
A couple of weeks ago,
I mentioned
I had some concerns about the
ChestXray14 dataset
. I said I would come back when I had more info, and since then I have been digging into the data. I’ve talked with Dr Summers via email a few times as well. Unfortunately, this exploration has only increased my concerns about the dataset.
WARNING
: there are going to be lots of images today. If data and bandwidth are a problem for you, beware. Also, this piece is about 5000 words long. Sorry :)
DISCLAIMER: Since some people are interpreting this wrongly, I do not think this piece in any way reflects broader problems in medical deep learning, or suggests that claims of human performance are impossible. I’ve made a claim like that myself, in recent work. These results are specific to th

...[Full content preserved in source]