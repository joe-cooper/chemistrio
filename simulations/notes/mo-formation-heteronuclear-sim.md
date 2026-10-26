## Teaching notes

This simulation is the heteronuclear companion to the Period 2 homonuclear MO diagram. Instead of a single element repeated on both sides, you pick Atom A and Atom B independently from hydrogen and Li–F and see the full valence MO diagram for that pair, including the polarisation that a mismatched pair produces.

## Differences from the homonuclear case

When both atoms are the same element, every bonding/antibonding pair is an exactly equal 50/50 mix, which is why the homonuclear diagram is left-right symmetric. Real atoms differ in electronegativity, so their 2s/2p energies differ too, and the maths that combines them (the non-orthogonal secular equation) is the more general case in which the two atomic orbitals do not contribute equally. Each molecular orbital ends up weighted towards whichever atom's atomic orbital already sat closer to it in energy, usually the more electronegative one for the bonding levels. This is the orbital-theory content behind the familiar statement that bonding electron density sits closer to the more electronegative atom, and here you can watch it come out of the calculation.

## Reading the diagram

Both atoms now get their own pair of reference lines (2s and 2p), generally at different heights, on the left (Atom A) and right (Atom B) of the diagram. The correlation lines connecting each atomic level to a molecular level fade or strengthen depending on how much of that molecular orbital belongs to that atom. A faint line means there is barely any character from that atom; a strong line means the MO is more or less that atom's orbital. Click any level to see its shape: the contour plot uses the experimental (or, for a few pairs, estimated) bond length and each atom's own orbital size, and the shape itself is visibly lopsided towards whichever atom the formula tag says dominates.

## Bond lengths

29 of the 36 possible pairs use experimental equilibrium bond lengths: all 8 homonuclear pairs, the 7 hydrides, and 14 of the 21 pairs of period 2 atoms. The remaining 7 are the pairings of Li or Be with Li–N that are not already covered: Li–Be, Li–B, Li–C, Li–N, Be–B, Be–C and Be–N. These are not well characterised experimentally, so the simulation falls back to the Schomaker–Stevenson estimate (single-bond covalent radii, corrected for electronegativity difference) and marks the bond-length readout with an asterisk. Checked against pairs with known lengths, the estimate tends to run long where the bond has multiple-bond character, which it has no way to know about. Bear that in mind for the marked pairs.

## Where this model breaks down

The simple bond-order count (bonding minus antibonding electrons, over 2) treats every bonding MO as fully bonding. When the two atomic energies are very far apart, a "bonding" combination can be barely changed by overlap, so it is really a lone pair on the more electronegative atom, and counting it as bonding overstates the bond. If the empty 2p orbitals of lithium and beryllium were included, LiF would come out with bond order 4 for this reason, although its bond is essentially single and mostly ionic. Leaving those orbitals out (see the model notes below) gives LiF bond order 1. Among pairs where both atoms are between B and F, the largest electronegativity difference is 1.94, for B–F, which is not enough to cause the problem. The page would warn about any such pair with a difference above 2.0.

## Good pairs to try

- **C–O**: isoelectronic with N₂, and it comes out bond order 3 and diamagnetic, matching real CO. The deep σ(2s) MO is about 92% oxygen, illustrating the oxygen lone-pair character that photoelectron spectroscopy assigns to it.
- **N–O and C–N**: both come out bond order 2.5 with one unpaired electron, matching their identity as well-known odd-electron radicals.
- **Li–F**: bond order 1. Lithium's 2s combines with fluorine's bond-axis 2p, and the bonding MO lies almost entirely on fluorine. A good discussion point for how MO theory describes a mostly ionic bond, and why the bond-order count can mislead for such bonds.

## Model notes and assumptions

**Atomic data.** Each atom uses the same data as in the homonuclear simulation, and its values do not change with its partner. The valence orbitals of each period 2 element share one Slater exponent: ζ = 0.65 (Li), 0.975 (Be), 1.3 (B), 1.625 (C), 1.95 (N), 2.275 (O), 2.6 (F). Hydrogen has ζ = 1. The atomic energies are valence-orbital ionisation energies from Gray's *Electrons and Chemical Bonding* (1964), and hydrogen's 1s energy is the exact value, −13.6 eV. Only the overlap integrals, and so the MO energies, depend on which two atoms are paired.

**Bond lengths.** Experimental values are from NIST's CCCBDB and, for the hydrides, Huber and Herzberg. The homonuclear pairs use the same lengths as the homonuclear simulation, with H–H 0.741 Å. Hydrides: Li–H 1.596 Å, Be–H 1.343 Å, B–H 1.232 Å, C–H 1.120 Å, N–H 1.036 Å, O–H 0.970 Å, F–H 0.917 Å. Other pairs: Li–O 1.688 Å, Li–F 1.564 Å, Be–O 1.331 Å, Be–F 1.361 Å, B–C 1.491 Å, B–N 1.325 Å, B–O 1.205 Å, B–F 1.267 Å, C–N 1.172 Å, C–O 1.128 Å, C–F 1.276 Å, N–O 1.154 Å, N–F 1.317 Å, O–F 1.354 Å. The seven estimated pairs use the Schomaker–Stevenson formula, d = r<sub>A</sub> + r<sub>B</sub> − 0.09|χ<sub>A</sub> − χ<sub>B</sub>| Å, with Pauling single-bond covalent radii and electronegativities. Against the known pairs, this is within 0.03–0.05 Å for near-single bonds such as O–F and Be–F, but 0.15–0.22 Å too long for pairs with multiple-bond character such as C–O, B–O and B–N.

**The secular equation for unequal atoms.** For atomic orbitals with energies H<sub>ii</sub> on atom A and H<sub>jj</sub> on atom B and overlap S, the determinant |H<sub>ii</sub>−E, H<sub>ij</sub>−ES; H<sub>ij</sub>−ES, H<sub>jj</sub>−E| = 0 gives a quadratic in E. H<sub>ij</sub> is the Wolfsberg–Helmholz estimate, H<sub>ij</sub> = K·S·(H<sub>ii</sub> + H<sub>jj</sub>)/2 with K = 1.75. Solving it gives the two energies and the LCAO coefficients c<sub>A</sub> and c<sub>B</sub>, which are unequal whenever the atoms differ. This is done separately for the σ(2s), σ(2p) and π(2p) pairs. Choosing the same element twice gives exactly the homonuclear simulation's numbers.

**Reading the coefficients.** The tag above the orbital panel shows c<sub>A</sub> and c<sub>B</sub> for the selected level. A bonding MO is weighted towards the atom whose atomic orbital was lower in energy to begin with, and its antibonding partner towards the other atom. In C–O, σ(2s) is about 92% oxygen, while σ\*(2s) is about 90% carbon. The correlation lines fade in proportion to |c|², so their strength shows which atom each MO mostly belongs to.

**s–p mixing.** Mixing is modelled as in the homonuclear simulation, with the coupling V built from the average of the two 2s–2p overlaps between the atoms, which differ for a heteronuclear pair, and the average of the four atomic energies. As there, mixing changes only the energies, and the shape panel always shows the unmixed combination. It applies only when both atoms are between B and F. With H, Li or Be in the pair there is no second σ combination for σ(2s) to mix with, so the toggle is disabled.

**Hydrogen, lithium and beryllium.** Atoms from B to F contribute four valence orbitals, 2s and three 2p. Hydrogen contributes only its 1s. Lithium and beryllium contribute only their 2s: their 2p orbitals are empty in the ground state and lie well above the 2s, so they are left out. A pair with one of these atoms therefore has five atomic orbitals, and a pair of them has two.

Two of these atoms together give a single σ/σ\* pair, calculated in the same way as σ(2s). H₂ and Li₂ come out with bond order 1 and Be₂ with bond order 0, as in simple MO theory. Real Be₂ is very weakly bound, by effects the model does not include.

When H, Li or Be is paired with an atom from B to F, its s orbital has no partner of π symmetry, so the heavier atom's two perpendicular 2p orbitals stay as non-bonding lone pairs, labelled "2p (n.b.)". The s orbital combines with the heavier atom's bond-axis 2p, and the heavier atom's 2s is left as a non-bonding pair, "2s (n.b.)". The 2p is the better partner because it is much closer in energy: oxygen's 2p (−15.9 eV) is 2.3 eV from hydrogen's 1s (−13.6 eV), while oxygen's 2s (−32.4 eV) is 18.8 eV away. This agrees with the usual description of the lowest valence MO of HF and H₂O as mostly a 2s lone pair on F or O. Non-bonding levels are left out of the bond-order count, so HF and LiF both come out with bond order 1.

**Filling.** The valence electrons fill whatever levels the pair has, lowest first, two per orbital, with the π pair filled singly before any pairing. C–N and N–O come out with bond order 2.5 and one unpaired electron, as expected for the radicals CN and NO. H–O and H–C come out with bond order 1 and one unpaired electron, like the OH and CH radicals.
