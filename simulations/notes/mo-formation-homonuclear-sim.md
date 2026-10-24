## Teaching notes

This simulation shows the complete valence molecular-orbital (MO) diagram for a homonuclear diatomic: all the MOs built from its valence atomic orbitals at once, filled with the correct number of electrons for whichever molecule you pick, from H₂ through the period-2 row up to F₂. It is a companion to the 1s-1s and s/p-overlap simulations. Those focus on a single orbital pair, and in the s/p-overlap case on its potential-energy curve; this one gives the full picture used to predict bond order and magnetism.

H₂ is the simplest case: just σ(1s)/σ*(1s), with no 2p and no mixing. Li₂ and Be₂ have real 2s/2p atomic orbitals but no 2p valence electrons, so σ(2p)/π(2p) are dropped from their diagrams entirely rather than shown empty. B₂ through F₂ are where the full six-level 2s/2p diagram, and the s–p mixing toggle, actually apply.

## Building the diagram

Two 2s orbitals combine head-on to give σ(2s) (bonding) and σ*(2s) (antibonding), exactly like the 1s-1s case. Two 2p orbitals aligned along the bond axis combine head-on to give σ(2p)/σ*(2p). The two pairs of 2p orbitals perpendicular to the axis combine side-on to give a doubly-degenerate π(2p)/π*(2p) pair, one bonding and one antibonding, each existing as two orbitals at right angles to each other. Only the 2s/2p valence orbitals are shown. The 1s core is left out entirely, since it stays non-bonding and its filled bonding/antibonding pair cancels exactly in the bond-order sum regardless.

## s–p mixing

σ(2s) and σ(2p) share the same symmetry, so when their atomic energies are close enough they mix, and that mixing pushes σ(2p) *above* π(2p) in energy. This is the case for Li₂ through N₂, where the 2s–2p atomic energy gap is still small (real values rather than estimates: 0.7 eV for Li₂ up to 12.4 eV for N₂). The gap widens across the row as nuclear charge increases, reaching 16.5 eV at O₂ and 27.6 eV at F₂, and past a certain point mixing can no longer overcome it. That restores the obvious order, with σ(2p) below π(2p). Use the toggle to switch between the two orderings for any molecule; the stats row shows the gap for whichever element is selected.

Bond order is usually unaffected by which ordering you pick, since σ(2p) and π(2p) tend to be either both empty or both completely full whatever the fill order. The exception is when the electron count lands *between* the two:

- **B₂** has 2 electrons to place. With mixing, they go one each into the degenerate π(2p) pair by Hund's rule, making B₂ paramagnetic, which matches experiment. Without mixing, both pair up in σ(2p) and the prediction comes out diamagnetic.
- **C₂** has 4 electrons to place. With mixing, all four fill the doubly-degenerate π(2p) pair, two each and fully paired, giving diamagnetic, which matches experiment. Without mixing, two pair up in σ(2p) first and the remaining two split across π(2p), giving a paramagnetic prediction.

Both molecules come out with the same bond order either way. Only the magnetism prediction flips, which is exactly why the real ordering matters.

## Bond order and filling

Electrons fill the six valence levels lowest-energy-first (Aufbau), two per orbital, with the two degenerate π levels filled singly before pairing (Hund's rule). It is the same arrows-in-boxes picture used for atomic orbitals. Bond order is:

$$\text{bond order} = \frac{(\text{electrons in bonding MOs}) - (\text{electrons in antibonding MOs})}{2}$$

Selecting each species in turn shows this play out across the row:

- Li₂, bond order 1
- Be₂, bond order 0, and only very weakly bound in reality, beyond what this simple picture predicts
- B₂, bond order 1, paramagnetic with mixing
- C₂, bond order 2
- N₂, bond order 3, the familiar triple bond
- O₂, bond order 2 and paramagnetic, the classic case simple Lewis structures get wrong
- F₂, bond order 1

## Reading the diagram

Atomic 2s and 2p levels sit either side, labelled with the element, with 2p drawn as three parallel lines since a free atom's three 2p orbitals are degenerate. The six molecular levels sit in the middle, connected by faint correlation lines, bonding levels in one colour and antibonding in another.

The vertical axis is real electron energy in eV rather than a schematic placeholder. Both the AO positions and the six MO levels are computed, as the "Model notes" panel explains, so the *spacing* between levels carries information too. Notice how compressed Li₂'s whole valence manifold is compared with F₂'s, or how far below the 2p-derived set σ*(2s) sits for N₂, matching its real photoelectron spectrum.

Click any level to see its shape in the panel on the right. The contour plot uses that molecule's real bond length and an orbital exponent derived from Slater's rules for that specific element, so the size and spread of the orbital change as you move across the row. The "Model notes & assumptions" panel goes into exactly what is real data, what is a standard approximation (Wolfsberg–Helmholz), and what is a calibrated simplification (the s–p mixing coupling strength).
