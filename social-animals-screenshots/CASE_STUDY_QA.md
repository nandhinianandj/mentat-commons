# HumanZoo — Case Study Q&A

This guide contains key architectural and game design Q&As suitable for copy-pasting directly into your developer portfolio case study or project website.

---

### 1. Technical Architecture (Separation of Concerns)
**Q: why did you decouple the core game logic from the Flutter UI layer, rather than utilizing standard widget-state binding?**
* **A:** The game logic is decoupled into a modular `GameEngine` using the MVC pattern to ensure it remains a pure Dart library with zero dependencies on the Flutter framework. This makes the engine highly testable in headless unit test environments, allows for the classification rules to be completely swapped out (e.g., to an ML classifier) without rebuilding the UI, and prepares the core rules to be ported to web platforms or servers for collective simulations in future phases.

---

### 2. Seeding & Deterministic RNG
**Q: How does the Daily Seed system work, and what benefits does it bring to a single-player offline game?**
* **A:** Every day, the game engine calculates a unique integer seed based on the current calendar date (`YYYYMMDD`). This seed is fed into a pseudo-random number generator (`Random(seed)`) to deterministically generate the event sequence and initialize starting attributes. This ensures that every player worldwide experiences the exact same "world events" on the same day, driving collective daily shared discussions (similar to Wordle) while preventing raw luck from altering the baseline challenge.

---

### 3. Animal Classification Engine
**Q: Why use a Euclidean Distance vector model to classify players into animals instead of a tree of branching conditional IF-ELSE statements?**
* **A:** Branching IF-ELSE trees scale poorly, lead to edge-case bugs, and create arbitrary binary splits. By treating the five player traits (Curiosity, Adaptability, Resilience, Influence, Caution) as coordinates in a 5D space, we calculate the shortest straight-line distance ($Distance = \sqrt{\sum (State_x - Ideal_x)^2}$) to pre-defined animal coordinate vectors. This Euclidean model is mathematically elegant, deterministic, guarantees that the closest profile is always selected, and makes it incredibly easy to add new animal archetypes later by simply declaring a new set of 5D coordinates.

---

### 4. User Experience & Hidden Attributes
**Q: What is the design rationale behind keeping the five core attributes hidden during gameplay and only displaying Money, Energy, and Time?**
* **A:** Showing personality changes as numbers during gameplay shifts the player's mindset from intuitive, human roleplay to mathematical optimization (trying to "min-max" the stats). By hiding Curiosity, Adaptability, Resilience, Influence, and Caution until the reveal screen, players make authentic decisions based on the narrative context. The final chart reveal acts as a mirror, sparking self-reflection on how their survival instincts evolved throughout the run.

---

### 5. Monetization Philosophy
**Q: Why implement a voluntary post-run contribution flow instead of standard mobile ad loops or energy-gate paywalls?**
* **A:** Traditional monetization mechanics (ads, timers, premium powerups) disrupt immersion and break the pacing of a five-minute reflective game. We replaced them with a voluntary reciprocity screen ("If this game made you think differently today...") shown only *after* the emotional payoff of the animal reveal. By offering micro-contributions (₹1, ₹10, ₹50) along with a friction-free "Not today" option, we change the transaction from transactional pressure to voluntary gratitude, building a supportive user community.
