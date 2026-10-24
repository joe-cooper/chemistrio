## Teaching notes

For a reaction to happen, particles must **collide** with each other. Even then, not every collision succeeds. The simulation has three tabs, each isolating one factor that raises the rate: **Concentration**, which changes how *often* particles collide; **Temperature**, which changes how often and how successfully they collide; and **Surface area**, which changes how much of a solid reactant is available to react at all.

The first two tabs share the same reaction vessel and the same choice of reaction. In **A → B**, a collision converts both particles to product, so the total particle count never changes. In **2A → B**, a collision converts one particle and removes the other, so the total falls as the reaction proceeds. That second case is a simplification, made so that the 2:1 stoichiometry is visible on screen.

### The Concentration tab

Every qualifying collision has the same fixed chance of reacting, set directly by the **Collision success chance** slider. This tab is about how often collisions happen; the chance of any one of them succeeding stays wherever you put it.

There are two independent ways to raise concentration here. You can add more particles to the fixed-size box, or you can shrink the box itself with the **Vessel volume** slider while holding the particle count still. Both routes raise the same underlying quantity, particles per unit volume, and both raise the rate the same way.

**Suggested use.** Start with a modest particle count and press Run. Reset, then roughly double the particle count and compare: the rate readout should be noticeably higher. Reset again, and this time leave the particle count untouched and drag Vessel volume down instead. Use "Show previous run" to overlay the two graphs and confirm they show the same kind of speed-up, even though only one of the two controls moved.

### The Temperature tab

Here temperature drives **both** particle speed and collision success chance at once. This is the two-part explanation used in GCSE and A-level collision theory. Particle speed scales as √T, since average kinetic energy is proportional to T. Separately, the live **Success chance** readout follows an Arrhenius-style relationship with temperature and the **Activation energy** slider: only collisions energetic enough to clear that barrier react, and a hotter sample has a larger share of them.

Both sliders update live, without resetting the run. Dragging Temperature mid-run rescales every particle already in the box, much as heating a reaction that is already going would. Activation energy behaves the same way, and lowering it *without* touching temperature is exactly what a catalyst does, which a later module will build on directly.

**Suggested use.** Begin cold and press Run; reactions should be rare. Drag the temperature up while it is running and watch both effects happen together, as particles visibly speed up and the Success chance readout climbs. Reset, then try compensating for a temperature rise by also raising Activation energy. A high enough barrier can keep a reaction slow even when it is hot.

### The Surface area tab

This tab looks and behaves quite differently from the other two, because the chemistry is different. A **solid** reactant (blue) sits in a **fluid** reactant (teal), like marble chips in acid, rather than two gases mixing freely. The solid is always exactly **100 particles**, and that never changes. Only how those 100 particles are **arranged** changes, via the **Number of pieces** slider.

A fluid particle can only trigger a reaction with a solid particle it can physically touch, meaning one on the exposed surface of a piece. Particles buried inside a block are shielded until the layers above them dissolve away, so a single lump erodes from the outside in rather than dissolving all at once. The simulation gets this from the geometry rather than by assumption: it tracks which particles lie on a boundary and recomputes that after every dissolution.

The **Exposed surface** stat is the number to watch. Splitting the same 100 particles into more, smaller pieces exposes dramatically more surface for an identical amount of solid. That is the whole mechanism behind the effect of surface area on rate, and here you can watch it happen directly.

**Suggested use.** Set the slider to 1 piece (a single 10×10 block) and press Run. The reaction should be slow, since only the block's outer edge is reachable. Reset with the same fluid count and probability, but set pieces to something like 25 or 100, and compare. Exposed surface jumps enormously even though Solid remaining still starts at 100 either way, and the rate readout follows suit. Use "Show previous run" to overlay the two directly.

### Key ideas

- Rate of reaction depends on how often particles collide **and** what fraction of those collisions succeed.
- Concentration changes collision *frequency* only. The underlying idea is the same whether you get there by adding particles or by shrinking the vessel.
- Temperature changes *both* frequency (via speed) and the *successful fraction* (via the energy barrier). This is why raising temperature tends to have a much bigger effect on rate than raising concentration by a comparable amount.
- Surface area changes how much of a fixed amount of solid reactant is available to react at any moment. Breaking a lump into pieces adds no solid; it exposes more of what is already there.
- A reaction slows over time as reactants are used up, whichever tab you are on, because fewer particles (or less exposed surface) are left to react with.
- Activation energy is the height of the energy barrier a collision must clear. A catalyst works by lowering that barrier, not by heating anything.

### Suggested questions

**Q1.** On the Concentration tab, why does raising the particle count and lowering the vessel volume both increase the rate, even though one adds particles and the other doesn't?

<details class="qa">
<summary>Show answer</summary>

Rate depends on concentration, which is particles per unit volume, rather than on the particle count or the volume on its own. Adding particles to a fixed volume raises concentration; shrinking the volume around a fixed number of particles raises it in exactly the same way. Both routes pack more particles into the same space, so collisions happen more often either way.

</details>

**Q2.** On the Temperature tab, why does raising the temperature usually speed up a reaction by more than raising the concentration by a similar proportion?

<details class="qa">
<summary>Show answer</summary>

Concentration only affects how often particles collide. Temperature affects that too, since particles move faster, but it also raises the fraction of collisions with enough energy to succeed, and that second effect grows quickly along the Arrhenius-style curve. The two effects multiply together, so a given percentage rise in temperature tends to produce a bigger jump in rate than the same percentage rise in concentration.

</details>

**Q3.** If you raise the temperature on the Temperature tab, does the Success chance ever reach 100%?

<details class="qa">
<summary>Show answer</summary>

It gets close at the highest temperatures and the lowest activation energies, but the simulation never quite lets it reach 100%. Real reactions have requirements this simulation does not model, such as the orientation of the two particles as they meet, so some collisions still fail even at high temperature.

</details>

**Q4.** On the Surface area tab, two students both start with 100 solid particles, but one uses 1 piece and the other uses 100 pieces. Whose reaction finishes first, and why doesn't the *amount* of solid reactant matter here?

<details class="qa">
<summary>Show answer</summary>

The 100-piece student's reaction finishes far faster, even though both started with exactly the same amount of solid. What the amount of solid sets is how much *product* eventually forms. The rate depends instead on the exposed surface available at any moment, and splitting the solid into many small pieces exposes almost all of it immediately, while a single lump only exposes its outer layer at first.

</details>

