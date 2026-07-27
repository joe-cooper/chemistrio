## Teaching notes

Pick a preset weak acid (or drag pKa directly) and drag **[HA]₀** across its full range. The graph plots pH against [HA]₀ on a log scale, for both models at once: the dashed grey **approximation** curve, which assumes [H⁺]=[A⁻] and [HA]≈[HA]₀, and the solid gold **exact** curve, which solves the full charge balance with no such assumptions. The panel on the left reads off both pH values, plus the percentage of the acid that actually dissociates according to the exact model, at whatever concentration the slider is set to.

### The two assumptions, made explicit

The textbook shortcut for a weak acid's pH rests on two separate simplifications, both named in the sliders' output:

1. **[H⁺]=[A⁻]** — assumes the only source of H⁺ is the acid's own dissociation, ignoring the tiny contribution water itself always makes.
2. **[HA]=[HA]₀** — assumes so little of the acid ionises that the concentration of un-ionised HA is barely changed from what you weighed out.

Combining both with K<sub>a</sub>=[H⁺][A⁻]/[HA] gives the familiar pH = ½(pK<sub>a</sub> − log[HA]₀). The exact curve makes neither assumption: it solves [H⁺] − [OH⁻] − [HA]₀K<sub>a</sub>/(K<sub>a</sub>+[H⁺]) = 0 directly, which uses the *actual* mass balance ([HA]+[A⁻]=[HA]₀, letting [HA] fall as dissociation proceeds) and the *actual* charge balance (including water's own [OH⁻]).

### Where the two curves diverge — and why

Watch the two curves converge and diverge as [HA]₀ moves:

- **High concentration, weak Ka** (e.g. ethanoic acid at 0.1 mol dm⁻³): the curves sit almost on top of each other. Only a tiny fraction of the acid dissociates, so both assumptions hold well.
- **Low concentration**: the curves peel apart. As [HA]₀ falls, a *larger fraction* of it must dissociate to satisfy K<sub>a</sub>, so [HA]≈[HA]₀ stops holding — and at extremely low concentrations, water's own autoionisation starts to matter too, which the approximation has no way to capture (it will happily predict a pH above 7 for an acid, which is obviously wrong).
- **Stronger Ka (lower pKa)**: the same divergence appears at higher concentrations, since a larger K<sub>a</sub> pushes more dissociation for the same [HA]₀.

The "% dissociated" readout and the "reasonable / breaks down" badge track the standard classroom rule of thumb: the approximation is considered safe once [HA]₀/K<sub>a</sub> ≳ 400, corresponding to less than about 5% dissociation.

### Suggested use

1. Leave the defaults (ethanoic acid, [HA]₀ = 0.1 mol dm⁻³) — the badge reads "reasonable" and the two pH values agree closely.
2. Drag [HA]₀ down towards 10⁻⁵ mol dm⁻³. Watch the percentage dissociated climb, the badge flip to "breaks down", and the two curves separate visibly on the graph.
3. Switch to HCN or phenol (much larger pKa, much weaker acids) and see how much higher a concentration is needed before the badge flips back to "reasonable" — a very weak acid needs to be reasonably concentrated before the [HA]≈[HA]₀ assumption is safe.
4. Switch to methanoic or benzoic acid (smaller pKa, stronger weak acids) and find how much *higher* a concentration is now needed for the same 5% cutoff, compared with ethanoic acid.
5. Drag the pKa slider directly to a very low value (a "weak" acid approaching fully strong) and see the divergence appear even at fairly high concentrations, since K<sub>a</sub> itself is now large enough to force substantial dissociation.

### Key ideas

- Every weak-acid shortcut formula is really two separate assumptions bundled together, and each one can fail independently.
- The [HA]≈[HA]₀ assumption gets worse as concentration falls, because the *fraction* dissociated must rise to satisfy a fixed K<sub>a</sub> as the total amount present shrinks.
- The [H⁺]=[A⁻] assumption gets worse as [H⁺] from the acid approaches the ~10⁻⁷ mol dm⁻³ that water supplies on its own — at that point the acid's own dissociation is no longer the dominant source of H⁺.
- The exact charge-balance approach makes neither assumption and stays valid across the whole range — it's the same style of equation used to model buffers and titrations exactly, just for a solution with no added conjugate base or salt.
- The rule of thumb "valid when [HA]₀/K<sub>a</sub> ≥ 400" is not arbitrary — it is exactly the condition under which the two curves in this simulation are indistinguishable to within about a hundredth of a pH unit.
