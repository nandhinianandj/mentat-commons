---
title: Technical Debt in ML models
abstract: Summary notes on technical debt vectors and anti-patterns in machine learning
  models.
problem: ML pipelines fail silently due to data dependencies, configuration bloat,
  and system feedback loops.
context: Studying MLOps architecture and software engineering anti-patterns.
key_ideas:
- Boundary erosion
- Feedback loops
- Configuration debt
lessons: Data dependencies in ML systems are costlier and harder to audit than traditional
  code dependencies.
related_articles:
- write-801-2
related_projects:
- proj-waste-detection
related_skills:
- MLOps
- Model Governance
related_talks: []
career_axes:
- axis-i
reading_time: 3 mins
evidence_links:
- https://softwaremechanic.wordpress.com/2016/06/15/technical-debt-in-ml-models/
tags:
- MLOps
- Software Architecture
- Technical Debt
- Featured Collection
featured: true
---

Technical Debts are also there in ML
:
Complex models erode boundaries
* -- Entanglement of features and feature distributions
* -- Correction cascades creating cascade chains of models and dependency hell
* -- Undeclared consumers for the model predictions
Data dependencies are costlier than code dependencies
* -- Unstable Data Dependencies unstable input data or signals or predictions from a previous model..(For ex: in [speech to text](https://github.com/kaldi-asr/kaldi), the syllables is a prediction and signal/input to the word-language model)
* -- Underutilized Data Dependencies   (Creep in via Legacy Features, Bundled Features,
Correlated Features etc)
* -- Static analysis of data dependencies can help mitigate these issues to some extent
Feedback loops
* -- Direct Feedback loops(In 

...[Full content preserved in source]