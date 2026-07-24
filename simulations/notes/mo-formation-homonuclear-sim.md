## Teaching Notes

This simulation shows the complete valence molecular-orbital (MO) diagram for a period-2 homonuclear diatomic — all the MOs built from 2s and 2p atomic orbitals at once, filled with the correct number of electrons for whichever molecule you pick, from Li₂ to F₂. It's a companion to the 1s-1s and s/p-overlap simulations, but trades their single-orbital-pair focus (and, in the s/p-overlap case, its potential-energy curve) for the full picture used to predict bond order and magnetism.

## Building the diagram

Two 2s orbitals combine head-on to give σ(2s) (bonding) and σ*(2s) (antibonding), exactly like the 1s-1s case. Two 2p orbitals aligned along the bond axis combine head-on to give σ(2p)/σ*(2p); the two pairs of 2p orbitals perpendicular to the axis combine side-on to give a doubly-degenerate π(2p)/π*(2p) pair — one bonding, one antibonding, each existing as two orbitals at right angles to each other. Only the 2s/2p (valence) orbitals are shown; the 1s core is left out entirely, since it stays non-bonding and its filled bonding/antibonding pair cancels exactly in the bond-order sum regardless.

## s–p mixing

σ(2s) and σ(2p) share the same symmetry, so when their atomic energies are close enough they genuinely mix — and this pushes σ(2p) *above* π(2p) in energy. That's the case for Li₂ through N₂, where the 2s–2p atomic energy gap is still small (real values, not estimates: 0.7 eV for Li₂ up to 12.4 eV for N₂). The gap widens across the row as nuclear charge increases — reaching 16.5 eV at O₂ and 27.6 eV at F₂ — and past a certain point mixing can no longer overcome it, restoring the "obvious" order with σ(2p) below π(2p). Use the toggle to switch between the two orderings for any molecule; the stats row shows the actual gap for whichever element is selected.

Bond order is usually unaffected by which ordering you pick — σ(2p) and π(2p) tend to be either both empty or both completely full regardless of fill order. The exception is when the electron count lands *between* the two:

- **B₂** (2 electrons to place): with mixing, they go one each into the degenerate π(2p) pair (Hund's rule) → paramagnetic, matching experiment. Without mixing, both pair up in σ(2p) → wrongly predicted diamagnetic.
- **C₂** (4 electrons to place): with mixing, all four fill the doubly-degenerate π(2p) pair, two each, fully paired → diamagnetic, matching experiment. Without mixing, two pair up in σ(2p) first and the remaining two split across π(2p) → wrongly predicted paramagnetic.

Same bond order either way for both molecules — only the magnetism prediction flips, which is exactly why the real ordering matters.

## Bond order and filling

Electrons fill the six valence levels lowest-energy-first (Aufbau), two per orbital, with the two degenerate π levels filled singly before pairing (Hund's rule) — the same arrows-in-boxes picture used for atomic orbitals. Bond order is:

$$\text{bond order} = \frac{(\text{electrons in bonding MOs}) - (\text{electrons in antibonding MOs})}{2}$$

Selecting each species shows this play out across the row: Li₂ (bond order 1) → Be₂ (0 — only very weakly bound in reality, beyond what this simple picture predicts) → B₂ (1, paramagnetic with mixing) → C₂ (2) → N₂ (3, the familiar triple bond) → O₂ (2, paramagnetic — the classic case simple Lewis structures get wrong) → F₂ (1).

## Reading the diagram

Atomic 2s and 2p levels sit either side (labelled with the element, 2p drawn as three parallel lines since a free atom's three 2p orbitals are degenerate), the six molecular levels sit in the middle, connected by faint correlation lines — bonding levels in one colour, antibonding in another. The vertical axis is real electron energy in eV, not a schematic placeholder: both the AO positions and the six MO levels are computed (see the "Model notes" panel for how), so the *spacing* between levels is genuine too — notice how compressed Li₂'s whole valence manifold is compared with F₂'s, or how far below the 2p-derived set σ*(2s) sits for N₂, matching its real photoelectron spectrum. Click any level to see its actual shape in the panel on the right: the contour plot uses that molecule's real bond length and an orbital exponent derived from Slater's rules for that specific element, so the size and spread of the orbital genuinely changes as you move across the row. The "Model notes & honesty check" panel goes into the details of exactly what's real data, what's a standard approximation (Wolfsberg–Helmholz), and what's a calibrated simplification (the s–p mixing coupling strength).
