## Teaching Notes

This simulation shows how atomic orbitals of different shapes — s and p — combine to form molecular orbitals, and why the resulting bonds are classified as σ (sigma) or π (pi). It is a companion to the 1s-1s molecular orbital simulation, but trades that simulation's quantitative bond-length/bond-order predictions for a broader, purely qualitative look at orbital overlap.

## Why carbon

The orbital size is no longer a user control — it's fixed at the orbital exponent for one of carbon's own 2s/2p electrons, since that's the relevant case for C–C, C=C and C≡C bonding. Slater's rules give an effective nuclear charge Z_eff = 3.25 for that electron, and the exponent that belongs in the orbital's decay is ζ = Z_eff/n = 3.25/2 = 1.625 (n=2 for the valence shell) — use the "C–C bond length" preset (1.54 Å, the accepted single-bond length in ethane or diamond) to jump straight to a realistic separation and see visible overlap.

## Four overlap types

Use the "Overlap" buttons to switch between:

- **s + s** — two spherical orbitals overlapping head-on. Always σ symmetry.
- **s + p (σ)** — a spherical orbital overlapping with a directional p orbital pointing straight at it. Still σ symmetry.
- **p + p (σ)** — two p orbitals pointing at each other along the bond axis, overlapping head-on. σ symmetry.
- **p + p (π)** — two p orbitals oriented *perpendicular* to the bond axis, overlapping side-on. This is π symmetry.

For each, the two contour panels show the **bonding** combination (atomic orbitals added in phase) and the **antibonding** combination (subtracted, out of phase) — exactly the same LCAO idea as the 1s-1s simulation, just applied to different orbital shapes.

## σ vs π symmetry

The defining test for σ vs π is rotational symmetry about the bond axis:

- A **σ** orbital looks the same from every angle around the internuclear axis — no nodal plane contains that axis. All three head-on combinations above (s-s, s-p, p-p σ) are σ.
- A **π** orbital has exactly one nodal plane that *contains* the bond axis — rotating around the axis is not a symmetry operation. The side-on p-p combination is π; you can see the nodal plane running straight along the internuclear axis in both the bonding and antibonding panels.

This is also why σ overlap is generally stronger than π overlap at a typical bonding distance: head-on orbitals overlap directly along the line connecting the nuclei, while side-on orbitals only overlap "off to the side," away from where the electron density is most concentrated.

## What the overlap integral curve shows

The bottom-right panel plots the overlap integral ∫ψ_Aψ_B dτ for all four overlap types against separation (active type bold, others faint), each scaled by the same constant — the single largest value found across all four types over the whole range — so their relative sizes stay honest (s–s really is the strongest overlap at comparable separations) while keeping the numbers in a readable range. Two features are worth noticing:

- **s-p overlap starts at zero.** An s and a p orbital centred on exactly the same point are orthogonal by symmetry, so S(0) = 0 — overlap has to build up as the atoms separate from zero, peak at some intermediate distance, then decay like every other curve.
- **Head-on p-p (σ) overlap goes negative at short range.** Bring two p orbitals aimed at each other close enough and, under the standard sign convention, their overlap briefly becomes destructive before crossing over to the familiar constructive (bonding) regime at more typical bond lengths. This is real, tabulated two-centre-integral behaviour, not a mistake — see the in-page "Model notes" for the full explanation.

## Reading the MO diagram

Because nuclear repulsion has been removed, there's no equilibrium bond length or well depth to show. Instead the MO diagram solves the proper two-orbital secular equation on a schematic energy scale: with on-site energy α=0 and resonance integral β=−S(R), the bonding and antibonding levels are E<sub>bond</sub> = −S/(1+S) and E<sub>anti</sub> = S/(1−S) — not the simpler α∓β you might expect. Those 1±S denominators aren't decoration: they produce a real, well-known asymmetry where the antibonding level always rises *more* than the bonding level falls, for the same overlap magnitude, and can shoot up steeply at very close range. The y-axis is symmetric about zero (the atomic-orbital reference, always dead centre) with its half-range capped at the 90th percentile of |level| across the whole separation range, per overlap type — so the split stays clearly visible at realistic separations like the C–C bond length, rather than being squeezed flat to make room for an extreme close-approach spike. When the level does run past the cap, a ▲/▼ marker with its actual value shows instead of clipping it away silently. Here S(R) is a separate integral, normalized to *its own* mode (bounded to roughly ±1) — deliberately not the max-of-all-four-scaled value plotted in the curve panel, since normalizing each mode to itself is what keeps the splitting a sensible, comparable shape regardless of which mode is selected (the shared-max scaling used in the curve panel would make weaker modes like p–p σ show almost no splitting here, which isn't the point of this diagram). This is a standard simplification (splitting proportional to overlap) used to keep the diagram meaningful without needing a full quantitative energy model for every orbital combination. When S(R) goes negative (see above), the diagram will honestly show the "bonding" combination sitting *above* the "antibonding" one — worth pausing on if you're using this to teach why bond strength isn't just "more overlap always wins."

Try "Animate approach" to watch the contour shapes, nodal surfaces, and overlap value all update together as the two atoms come together continuously.
