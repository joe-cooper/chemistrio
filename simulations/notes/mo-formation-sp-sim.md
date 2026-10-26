## Teaching notes

This simulation shows how atomic orbitals of different shapes, s and p, combine to form molecular orbitals, and why the resulting bonds are classified as σ (sigma) or π (pi). It is a companion to the 1s-1s molecular orbital simulation. Where that one makes quantitative bond-length and bond-order predictions, this one gives up those numbers in exchange for a broader, purely qualitative look at orbital overlap.

## Why carbon

The orbital size is fixed at the orbital exponent for one of carbon's own 2s/2p electrons, since that is the relevant case for C–C, C=C and C≡C bonding. Slater's rules give an effective nuclear charge Z_eff = 3.25 for that electron, and the exponent that belongs in the orbital's decay is ζ = Z_eff/n = 3.25/2 = 1.625, taking n=2 for the valence shell. Use the "C–C bond length" preset (1.54 Å, the accepted single-bond length in ethane or diamond) to jump straight to a realistic separation and see visible overlap.

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

The bottom-right panel plots the overlap integral ∫ψ_Aψ_B dτ for all four overlap types against separation, with the active type bold and the others faint. All four are scaled by the same constant, the single largest value found across all four types over the whole range, so their relative sizes stay comparable (s–s is the strongest overlap at comparable separations) while the numbers stay in a readable range. Two features of these curves need explaining.

- **s-p overlap starts at zero.** An s and a p orbital centred on exactly the same point are orthogonal by symmetry, so S(0) = 0. Overlap has to build up as the atoms separate from zero, peak at some intermediate distance, then decay like every other curve.
- **Head-on p-p (σ) overlap goes negative at short range.** Bring two p orbitals aimed at each other close enough and, under the standard sign convention, their overlap briefly becomes destructive before crossing over to the familiar constructive (bonding) regime at more typical bond lengths. Tabulated two-centre overlap integrals show the same behaviour; the model notes below describe the sign convention behind it.

## Reading the MO diagram

Because nuclear repulsion has been removed, there is no equilibrium bond length or well depth to show. Instead the MO diagram solves the proper two-orbital secular equation on a schematic energy scale. With on-site energy α=0 and resonance integral β=−S(R), the bonding and antibonding levels come out as E<sub>bond</sub> = −S/(1+S) and E<sub>anti</sub> = S/(1−S), rather than the simpler α∓β you might expect.

The 1±S denominators produce the well-known asymmetry in which the antibonding level always rises *more* than the bonding level falls for the same overlap magnitude, and they allow it to shoot up steeply at very close range.

The y-axis is symmetric about zero, with the atomic-orbital reference always dead centre. Its half-range is capped at the 90th percentile of |level| across the whole separation range, taken per overlap type, so the split stays clearly visible at realistic separations like the C–C bond length instead of being squeezed flat to make room for an extreme close-approach spike. When a level runs past the cap, a ▲/▼ marker shows its value.

The S(R) used here is a separate integral, normalised to *its own* mode and bounded to roughly ±1. It is not the max-of-all-four scaling plotted in the curve panel, and the difference matters: normalising each mode to itself keeps the splitting a sensible, comparable shape whichever mode you select, whereas shared-max scaling would leave weaker modes like p–p σ with almost no visible splitting. Taking the splitting as proportional to overlap is a standard simplification, and it keeps the diagram meaningful without a full quantitative energy model for every orbital combination.

When S(R) goes negative, as described above, the diagram shows the "bonding" combination sitting *above* the "antibonding" one. This is a good place to stop when teaching that more overlap does not always mean a stronger bond.

Try "Animate approach" to watch the contour shapes, nodal surfaces and overlap value all update together as the two atoms come together continuously.

## Model notes and assumptions

**Orbital functions.** Both orbitals are simplified Slater-type functions with the same exponent, ζ = 1.625. The s orbital is e<sup>−ζr</sup>, and the p orbital multiplies this by x for the lobe along the bond axis or by y for the perpendicular one. Using one exponent for both keeps the s and p clouds a similar size, so differences in overlap come from symmetry and not from size.

**Sign convention for p<sub>σ</sub>.** For a p orbital along the bond axis, the lobe facing the other atom is taken as positive on both atoms. The labels "bonding" and "antibonding" only have a meaning once a convention like this is fixed. The perpendicular p orbitals need no flip: both atoms use the same orientation, so the in-phase combination is constructive above and below the axis.

**Calculating the overlap.** The overlap integrals are calculated numerically from the un-normalised functions above, using the cylindrical symmetry about the bond axis to reduce each one from three dimensions to two. The s–s result agrees with Mulliken's closed-form 1s–1s formula to within about 10⁻⁴ across the whole range. Side-on p–p (π) overlap, unlike the two σ cases involving a p orbital, is largest near R = 0 and falls off smoothly with no change of sign.

**Energies in the s + p mode.** The other three modes pair two orbitals of the same kind, so both atoms can share one on-site energy, α = 0. An s and a p orbital in a many-electron atom do not have the same energy: for carbon, extended Hückel parameters put 2s at about −20 eV and 2p at about −10.5 eV. Since α and β on this diagram have no energy units, that gap cannot be used directly. The s + p mode uses α<sub>s</sub> = −0.4 and α<sub>p</sub> = +0.4 instead, a gap a few times larger than the splitting that overlap produces at the C–C bond length, which is roughly the ratio in carbon. With unequal α the levels come from solving the full secular determinant, |α<sub>s</sub>−E, β−ES; β−ES, α<sub>p</sub>−E| = 0, and the bonding MO lies below the s level while the antibonding MO lies above the p level. The shape panels still draw the equal-weight combinations s<sub>A</sub> ± p<sub>B</sub>; only the energies include the gap.

**Limitations.** The constant linking β to S is not calibrated against any molecule, so the energy scale is schematic throughout. There is no electron filling, bond order or nuclear repulsion; the 1s-1s simulation covers those. Each mode is a single pair of atomic orbitals, so effects that need several pairs at once, such as s–p mixing in the period 2 diatomics, are left to the homonuclear diagram simulation.
