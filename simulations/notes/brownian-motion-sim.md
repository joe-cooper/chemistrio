## Teaching notes

### Suggested use

Press **Run** with the default settings. All that's visible at first is a single large orange disc drifting around, leaving a dotted trail behind it — that's the pollen grain, and it's already being tracked. Watch the trail for a while before touching anything else. It jitters, doubles back, stalls, then lurches off somewhere else. Nothing here has been scripted to look random — this is exactly what a real pollen grain does under a microscope, exactly as Robert Brown first saw in 1827.

Ask what's making it move like that before revealing the answer. Then click **Show water molecules**. The box fills with small, fast blue dots — this is what was invisible the whole time, and it's what's actually striking the pollen grain constantly from every direction. No single collision does anything dramatic to something so much bigger and heavier, but with hundreds of molecules arriving every second, there's always a small random imbalance in how many are hitting from which side at any instant — and it's that imbalance that produces the jiggle. Turn the water back off and the pollen grain keeps moving exactly as before; hiding the water only changes what's drawn, not the physics.

Try the **Pollen size** slider. Shrink it towards the water molecules' own size (drag it down) and the "pollen" starts darting around rapidly, behaving just like an ordinary water molecule. Grow it and the grain becomes slow and heavily damped — it barely drifts at all, even with the same bombardment going on. This is the size range Brown himself was working in: pollen grains happen to be big enough to see clearly under a microscope, yet light enough that molecular collisions still visibly move them. Much smaller and you couldn't see the particle at all; much larger and it wouldn't visibly jiggle.

**Number of water molecules** and **Water molecule speed** both change how vigorously the pollen grain gets jostled — more molecules, or faster ones, mean more frequent and more energetic collisions, and a busier-looking trail.

### What is happening

Every particle in this simulation — water molecule or pollen grain — obeys the same physics: straight-line motion between collisions, and a genuine elastic collision (conserving both momentum and kinetic energy) whenever two particles touch or one hits a wall. Nothing about the pollen grain's motion is scripted; its jitter is the real, calculated outcome of many individual elastic collisions with the water molecules around it.

What makes the pollen grain behave so differently from a water molecule is mass. At a given moment, every particle in the box shares, on average, the same kinetic energy — this is the *equipartition* of energy, and it's why a much heavier pollen grain ends up moving much more slowly than the water molecules jostling it: $\frac{1}{2}mv^2$ being roughly equal for both means a heavier particle needs a smaller $v$. A collision that sends a light water molecule bouncing back at full speed barely nudges a much heavier pollen grain — but with a great many water molecules arriving from every direction, those nudges don't always cancel out. At any instant there's a small net imbalance, and it's that imbalance, repeated relentlessly and randomly, that produces the visible jiggle.

Brown himself, in 1827, was originally trying to work out whether the constant movement he saw in pollen grains suspended in water meant they were somehow alive. He ruled that out by showing dust and ground-up rock did the same thing — but he had no explanation for what was actually causing it, and neither did anyone else for nearly 80 years. Einstein's 1905 paper finally explained it exactly as this simulation shows: unseen, constantly colliding water molecules buffeting a much larger suspended particle from random directions. The genuinely remarkable part is what came next — because Einstein's theory made *quantitative* predictions about how far a grain should wander in a given time, those predictions could be tested. Jean Perrin did exactly that between 1908 and 1913, using real pollen-sized grains under a microscope, and the measurements matched Einstein's theory closely enough to yield one of the first solid experimental values for Avogadro's constant — turning "atoms" from a convenient calculating device into something whose existence and size had actually been measured.

### Key relationship

The parameter that controls everything here is the mass ratio between the pollen grain and a single water molecule. Equipartition of energy links the two particles' typical speeds by

$$
\frac{v_{\text{pollen}}}{v_{\text{water}}} = \sqrt{\frac{m_{\text{water}}}{m_{\text{pollen}}}}
$$

A pollen grain 100 times heavier than a water molecule moves, on average, only a tenth as fast — but "a tenth as fast" is still very much in motion, not stationary. The jiggle you see with the water hidden is the leftover signature of that motion after millions of individual, momentum-conserving collisions: no single collision matters, but their statistical imbalance, moment to moment, is real and measurable — which is exactly the insight Einstein and Perrin turned into hard evidence for the existence of atoms.

### Suggested questions

**Q1.** The pollen size slider is set so a pollen grain is 80 times heavier than a single water molecule. Using equipartition, roughly how many times slower does the pollen grain move than a water molecule, on average?

<details class="qa">
<summary>Show answer</summary>

$$
\frac{v_{\text{pollen}}}{v_{\text{water}}} = \frac{1}{\sqrt{80}} \approx \frac{1}{8.9}
$$

So the pollen grain moves roughly 9 times slower than a water molecule, on average — despite being struck by them constantly. This is why the pollen grain drifts sedately across the box while the (hidden) water molecules would be a blur.

</details>

**Q2.** A student watches the simulation with water molecules hidden and says "the pollen grain's motion looks completely random, so nothing about what's happening is predictable or governed by a law." Using what you can see by revealing the water molecules, explain what's wrong with this claim.

<details class="qa">
<summary>Show answer</summary>

Every individual collision between the pollen grain and a water molecule obeys exactly the same predictable law: conservation of momentum and kinetic energy, given each particle's mass and velocity at that instant. Nothing about any single collision is random or unpredictable — Newtonian mechanics determines the outcome exactly. What looks "random" is only the *net effect* of enormous numbers of these individually deterministic collisions arriving from unpredictable directions at unpredictable times; the randomness is a statistical property of the whole system, not a breakdown of the underlying physical law governing each collision.

</details>

**Q3.** Explain, using the idea of equipartition of energy, why Brownian motion is only visible for particles within a fairly narrow range of sizes — not for individual molecules, and not for large visible objects like a grain of sand.

<details class="qa">
<summary>Show answer</summary>

An individual molecule is far too small to see directly under any ordinary microscope, whatever its motion — the effect is real at that scale but not observable. At the other extreme, equipartition means a much larger, heavier particle (like a grain of sand) moves so slowly on average, and is so hard to shift via individual molecular collisions, that any residual jiggle becomes too small to detect against its own size — it is effectively too heavily damped by its own inertia. Pollen grains sit in the size range where both conditions are satisfied at once: large enough to resolve under a microscope, yet light enough that the statistical imbalance in molecular bombardment still produces a visible, measurable displacement.

</details>
