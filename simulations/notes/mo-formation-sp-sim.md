## Teaching notes

This simulation shows how atomic orbitals of different shapes, s and p, combine to form molecular orbitals, and why the resulting bonds are classified as σ (sigma) or π (pi). It is a companion to the 1s-1s molecular orbital simulation. Where that one makes quantitative bond-length and bond-order predictions, this one gives up those numbers in exchange for a broader, purely qualitative look at orbital overlap.

## Why carbon

The orbital size is no longer a user control. It is fixed at the orbital exponent for one of carbon's own 2s/2p electrons, since that is the relevant case for C–C, C=C and C≡C bonding. Slater's rules give an effective nuclear charge Z_eff = 3.25 for that electron, and the exponent that belongs in the orbital's decay is ζ = Z_eff/n = 3.25/2 = 1.625, taking n=2 for the valence shell. Use the "C–C bond length" preset (1.54 Å, the accepted single-bond length in ethane or diamond) to jump straight to a realistic separation and see visible overlap.

## Four overlap types

Use the "Overlap" buttons to switch between:

- **s + s**: two spherical orbitals overlapping head-on. Always σ symmetry.
- **s + p (σ)**: a spherical orbital overlapping with a directional p orbital pointing straight at it. Still σ symmetry.
- **p + p (σ)**: two p orbitals pointing at each other along the bond axis, overlapping head-on. σ symmetry.
- **p + p (π)**: two p orbitals oriented *perpendicular* to the bond axis, overlapping side-on. This is π symmetry.

For each, the two contour panels show the **bonding** combination (atomic orbitals added in phase) and the **antibonding** combination (subtracted, out of phase). This is the same LCAO idea as the 1s-1s simulation, applied to different orbital shapes.

## σ vs π symmetry

The defining test for σ vs π is rotational symmetry about the bond axis:

- A **σ** orbital looks the same from every angle around the internuclear axis, and no nodal plane contains that axis. All three head-on combinations above (s-s, s-p, p-p σ) are σ.
- A **π** orbital has exactly one nodal plane that *contains* the bond axis, so rotating around the axis is no longer a symmetry operation. The side-on p-p combination is π. You can see the nodal plane running straight along the internuclear axis in both the bonding and antibonding panels.

This is also why σ overlap is generally stronger than π overlap at a typical bonding distance. Head-on orbitals overlap directly along the line connecting the nuclei, while side-on orbitals only overlap off to the side, away from where the electron density is most concentrated.

## What the overlap integral curve shows

The bottom-right panel plots the overlap integral ∫ψ_Aψ_B dτ for all four overlap types against separation, with the active type bold and the others faint. All four are scaled by the same constant, the single largest value found across all four types over the whole range, so their relative sizes stay comparable (s–s really is the strongest overlap at comparable separations) while the numbers stay in a readable range. Two features are worth noticing.

- **s-p overlap starts at zero.** An s and a p orbital centred on exactly the same point are orthogonal by symmetry, so S(0) = 0. Overlap has to build up as the atoms separate from zero, peak at some intermediate distance, then decay like every other curve.
- **Head-on p-p (σ) overlap goes negative at short range.** Bring two p orbitals aimed at each other close enough and, under the standard sign convention, their overlap briefly becomes destructive before crossing over to the familiar constructive (bonding) regime at more typical bond lengths. This is tabulated two-centre-integral behaviour rather than a fault in the simulation; the in-page "Model notes" has the full explanation.

## Reading the MO diagram

Because nuclear repulsion has been removed, there is no equilibrium bond length or well depth to show. Instead the MO diagram solves the proper two-orbital secular equation on a schematic energy scale. With on-site energy α=0 and resonance integral β=−S(R), the bonding and antibonding levels come out as E<sub>bond</sub> = −S/(1+S) and E<sub>anti</sub> = S/(1−S), rather than the simpler α∓β you might expect.

Those 1±S denominators are doing real work. They produce the well-known asymmetry in which the antibonding level always rises *more* than the bonding level falls for the same overlap magnitude, and they allow it to shoot up steeply at very close range.

The y-axis is symmetric about zero, with the atomic-orbital reference always dead centre. Its half-range is capped at the 90th percentile of |level| across the whole separation range, taken per overlap type, so the split stays clearly visible at realistic separations like the C–C bond length instead of being squeezed flat to make room for an extreme close-approach spike. When a level does run past the cap, a ▲/▼ marker appears with its actual value rather than clipping it away silently.

The S(R) used here is a separate integral, normalised to *its own* mode and bounded to roughly ±1. It is not the max-of-all-four scaling plotted in the curve panel, and the difference matters: normalising each mode to itself keeps the splitting a sensible, comparable shape whichever mode you select, whereas shared-max scaling would leave weaker modes like p–p σ with almost no visible splitting. Taking the splitting as proportional to overlap is a standard simplification, and it keeps the diagram meaningful without a full quantitative energy model for every orbital combination.

One consequence is worth pausing on. When S(R) goes negative, as described above, the diagram shows the "bonding" combination sitting *above* the "antibonding" one. If you are using this to teach why bond strength is not simply a matter of more overlap always winning, that is the place to stop.

Try "Animate approach" to watch the contour shapes, nodal surfaces and overlap value all update together as the two atoms come together continuously.
