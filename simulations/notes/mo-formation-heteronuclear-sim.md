## Teaching Notes

This simulation is the heteronuclear companion to the Period 2 homonuclear MO diagram. Instead of a single element repeated on both sides, you pick Atom A and Atom B independently from Li–F and see the full valence MO diagram for that pair — including the real polarisation that a mismatched pair produces.

## What's genuinely different from the homonuclear case

When both atoms are the same element, every bonding/antibonding pair is an exactly-equal 50/50 mix — that's why the homonuclear diagram is left-right symmetric. Real atoms differ in electronegativity, so their 2s/2p energies differ too, and the maths that combines them (the non-orthogonal secular equation) is the more general case where the two atomic orbitals don't contribute equally. Each molecular orbital ends up weighted toward whichever atom's atomic orbital already sat closer to it in energy — usually the more electronegative one for the bonding levels. That's the actual orbital-theory content behind "the bonding electron density sits closer to the more electronegative atom," derived here rather than just asserted.

## Reading the diagram

Both atoms now get their own pair of reference lines (2s and 2p), generally at different heights, on the left (Atom A) and right (Atom B) of the diagram. The correlation lines connecting each atomic level to a molecular level fade or strengthen depending on how much of that molecular orbital actually belongs to that atom — a faint line means "barely any character here," a strong line means "this MO is basically that atom's orbital." Click any level to see its real shape: the contour plot uses the real (or, for a few pairs, estimated) bond length and each atom's own orbital size, and the shape itself is visibly lopsided toward whichever atom the formula tag says dominates.

## Bond lengths: mostly real, sometimes estimated

21 of the 28 possible pairs (7 homonuclear + 14 heteronuclear) use real experimental equilibrium bond lengths from NIST's CCCBDB. The remaining 7 — every pairing between {Li, Be} and {Li, Be, B, C, N} that isn't already covered, i.e. Li–Be, Li–B, Li–C, Li–N, Be–B, Be–C, Be–N — aren't well-characterised experimentally, so the simulation falls back to the Schomaker–Stevenson estimate (single-bond covalent radii, corrected for electronegativity difference) and marks the bond-length readout with an asterisk. Checked against the 14 known pairs, the estimate typically runs long for pairs that would have real multiple-bond character (it has no way to know that in advance) — worth bearing in mind for the marked pairs too.

## A genuine limitation, not a bug

For pairs with a very large electronegativity gap — Li–F, Li–O, Be–F, Be–O — the simple bond-order count (bonding minus antibonding electrons, over 2) over-states the real bond order, because the "bonding" combinations barely differ from pure lone pairs on the more electronegative atom when the atomic energies are this far apart. LiF comes out bond order 4 here, well above its real, essentially single, mostly-ionic bond. The page flags this directly whenever the electronegativity gap is large, rather than silently producing a number that looks precise but isn't meaningful. This is the same "own the model's limits" approach used for Be₂'s zero bond order in the homonuclear sibling.

## Good pairs to try

- **C–O**: isoelectronic with N₂, comes out bond order 3 and diamagnetic — matches real CO. The deep σ(2s) MO is about 92% oxygen, illustrating the oxygen lone-pair character real photoelectron spectroscopy assigns to it.
- **N–O and C–N**: both come out bond order 2.5 with one unpaired electron, matching their identity as well-known odd-electron radicals.
- **Li–F**: bond order comes out over-stated (see above) — a good discussion point for why simple MO bond-order counting struggles with strongly ionic bonds.
