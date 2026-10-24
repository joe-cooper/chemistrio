## Teaching notes

This simulation is the heteronuclear companion to the Period 2 homonuclear MO diagram. Instead of a single element repeated on both sides, you pick Atom A and Atom B independently from Li–F and see the full valence MO diagram for that pair, including the polarisation that a mismatched pair produces.

## Differences from the homonuclear case

When both atoms are the same element, every bonding/antibonding pair is an exactly equal 50/50 mix, which is why the homonuclear diagram is left-right symmetric. Real atoms differ in electronegativity, so their 2s/2p energies differ too, and the maths that combines them (the non-orthogonal secular equation) is the more general case in which the two atomic orbitals do not contribute equally. Each molecular orbital ends up weighted towards whichever atom's atomic orbital already sat closer to it in energy, usually the more electronegative one for the bonding levels. This is the orbital-theory content behind the familiar statement that bonding electron density sits closer to the more electronegative atom, and here you can watch it come out of the calculation.

## Reading the diagram

Both atoms now get their own pair of reference lines (2s and 2p), generally at different heights, on the left (Atom A) and right (Atom B) of the diagram. The correlation lines connecting each atomic level to a molecular level fade or strengthen depending on how much of that molecular orbital belongs to that atom. A faint line means there is barely any character from that atom; a strong line means the MO is more or less that atom's orbital. Click any level to see its shape: the contour plot uses the real (or, for a few pairs, estimated) bond length and each atom's own orbital size, and the shape itself is visibly lopsided towards whichever atom the formula tag says dominates.

## Bond lengths

21 of the 28 possible pairs (7 homonuclear and 14 heteronuclear) use real experimental equilibrium bond lengths from NIST's CCCBDB. The remaining 7 are every pairing between {Li, Be} and {Li, Be, B, C, N} not already covered: Li–Be, Li–B, Li–C, Li–N, Be–B, Be–C and Be–N. These are not well characterised experimentally, so the simulation falls back to the Schomaker–Stevenson estimate (single-bond covalent radii, corrected for electronegativity difference) and marks the bond-length readout with an asterisk. Checked against the 14 known pairs, the estimate typically runs long for pairs that would have real multiple-bond character, since it has no way to know that in advance. Bear that in mind for the marked pairs too.

## Where this model breaks down

For pairs with a very large electronegativity gap, such as Li–F, Li–O, Be–F and Be–O, the simple bond-order count (bonding minus antibonding electrons, over 2) over-states the real bond order. When the atomic energies are this far apart, the "bonding" combinations barely differ from pure lone pairs on the more electronegative atom. LiF comes out bond order 4 here, well above its real bond, which is essentially single and mostly ionic. The page flags this whenever the electronegativity gap is large, rather than producing a number that looks precise but means little. Be₂'s zero bond order in the homonuclear version is handled the same way.

## Good pairs to try

- **C–O**: isoelectronic with N₂, and it comes out bond order 3 and diamagnetic, matching real CO. The deep σ(2s) MO is about 92% oxygen, illustrating the oxygen lone-pair character that photoelectron spectroscopy assigns to it.
- **N–O and C–N**: both come out bond order 2.5 with one unpaired electron, matching their identity as well-known odd-electron radicals.
- **Li–F**: the bond order comes out over-stated, as described above. A good discussion point for why simple MO bond-order counting struggles with strongly ionic bonds.
