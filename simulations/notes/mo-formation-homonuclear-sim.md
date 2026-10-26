## Teaching notes

This simulation shows the complete valence molecular-orbital (MO) diagram for a homonuclear diatomic: all the MOs built from its valence atomic orbitals at once, filled with the correct number of electrons for whichever molecule you pick, from H₂ through the period-2 row up to F₂. It is a companion to the 1s-1s and s/p-overlap simulations. Those focus on a single orbital pair, and the 1s-1s one also on its potential-energy curve; this one gives the full picture used to predict bond order and magnetism.

H₂ is the simplest case: just σ(1s)/σ*(1s), with no 2p and no mixing. Li₂ and Be₂ have 2s and 2p atomic orbitals but no 2p valence electrons, so σ(2p)/π(2p) are dropped from their diagrams entirely rather than shown empty. B₂ through F₂ are where the full six-level 2s/2p diagram, and the s–p mixing toggle, actually apply.

## Building the diagram

Two 2s orbitals combine head-on to give σ(2s) (bonding) and σ*(2s) (antibonding), exactly like the 1s-1s case. Two 2p orbitals aligned along the bond axis combine head-on to give σ(2p)/σ*(2p). The two pairs of 2p orbitals perpendicular to the axis combine side-on to give a doubly-degenerate π(2p)/π*(2p) pair, one bonding and one antibonding, each existing as two orbitals at right angles to each other. Only the 2s/2p valence orbitals are shown. The 1s core is left out entirely, since it stays non-bonding and its filled bonding/antibonding pair cancels exactly in the bond-order sum regardless.

## s–p mixing

σ(2s) and σ(2p) share the same symmetry, so when their atomic energies are close enough they mix, and that mixing pushes σ(2p) *above* π(2p) in energy. This is the case for Li₂ through N₂, where the 2s–2p atomic energy gap is still small (from about 0.7 eV for Li₂ up to 12.4 eV for N₂). The gap widens across the row as nuclear charge increases, reaching 16.5 eV at O₂ and 27.6 eV at F₂, and past a certain point mixing can no longer overcome it. That restores the obvious order, with σ(2p) below π(2p). Use the toggle to switch between the two orderings for any molecule; the stats row shows the gap for whichever element is selected.

Bond order is usually unaffected by which ordering you pick, since σ(2p) and π(2p) tend to be either both empty or both completely full whatever the fill order. The exception is when the electron count lands *between* the two:

- **B₂** has 2 electrons to place. With mixing, they go one each into the degenerate π(2p) pair by Hund's rule, making B₂ paramagnetic, which matches experiment. Without mixing, both pair up in σ(2p) and the prediction comes out diamagnetic.
- **C₂** has 4 electrons to place. With mixing, all four fill the doubly-degenerate π(2p) pair, two each and fully paired, giving diamagnetic, which matches experiment. Without mixing, two pair up in σ(2p) first and the remaining two split across π(2p), giving a paramagnetic prediction.

Both molecules come out with the same bond order either way. Only the magnetism prediction changes, which is why the ordering matters.

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

The vertical axis is electron energy in eV. Both the AO positions and the six MO levels are calculated, as the model notes below explain, so the *spacing* between levels carries information too. Notice how compressed Li₂'s whole valence manifold is compared with F₂'s, or how far below the 2p-derived set σ*(2s) sits for N₂, which matches its photoelectron spectrum.

Click any level to see its shape in the panel on the right. The contour plot uses that molecule's experimental bond length and an orbital exponent derived from Slater's rules for that specific element, so the size and spread of the orbital change as you move across the row. The model notes below set out which inputs are experimental data, which are standard approximations (Wolfsberg–Helmholz), and which is a calibrated simplification (the strength of the s–p mixing).

## Model notes and assumptions

**Orbital exponents.** Each period 2 element's 2s and 2p orbitals share one Slater exponent, ζ = Z<sub>eff</sub>/2, where Z<sub>eff</sub> = Z − [0.85 × 2 for the 1s electrons + 0.35 × (v − 1) for the other valence electrons]. This gives ζ = 0.65 (Li), 0.975 (Be), 1.3 (B), 1.625 (C), 1.95 (N), 2.275 (O) and 2.6 (F). The carbon value is the one used in the s/p-overlap simulation. Slater's rules do not distinguish 2s from 2p, so one exponent stands in for both. This is a simplification, since more accurate calculations give 2p a larger exponent than 2s. Hydrogen has no core to screen its electron, so its 1s exponent is simply ζ = 1.

**Bond lengths.** Each molecule is drawn at its experimental bond length: H₂ 0.741 Å, Li₂ 2.673 Å, Be₂ 2.45 Å, B₂ 1.590 Å, C₂ 1.243 Å, N₂ 1.098 Å, O₂ 1.208 Å, F₂ 1.412 Å. The same lengths are used for the overlap integrals behind the energies.

**Atomic orbital energies.** The 2s and 2p reference lines are valence-orbital ionisation energies, in eV, from Gray's *Electrons and Chemical Bonding* (1964): Li 2s −5.46; Be 2s −9.30; B −14.01/−8.31; C −19.47/−10.66; N −25.54/−13.14; O −32.36/−15.87; F −46.37/−18.72. Lithium and beryllium have no 2p electron to measure, so their 2p energies are estimated. From B to F, the effective nuclear charge felt by a 2p electron, worked back from each energy using E = −13.6 × (Z<sub>eff</sub>/2)², rises almost linearly with atomic number. Extending that line gives about −4.7 eV for Li and −6.4 eV for Be. Hydrogen's 1s energy is the exact value, −13.6 eV. The 2s–2p gap grows from about 0.7 eV at Li₂ to 27.6 eV at F₂, and the s–p mixing described below depends on that trend.

**Molecular orbital energies.** For two identical atomic orbitals with energy H<sub>ii</sub> and overlap S, the secular equation for non-orthogonal orbitals gives E<sub>bond</sub> = (H<sub>ii</sub> + H<sub>ij</sub>)/(1 + S) and E<sub>anti</sub> = (H<sub>ii</sub> − H<sub>ij</sub>)/(1 − S). S is calculated numerically, as in the s/p-overlap simulation, at each molecule's bond length and exponent. H<sub>ij</sub> comes from the Wolfsberg–Helmholz approximation, H<sub>ij</sub> = K·S·H<sub>ii</sub> with K = 1.75, the usual extended Hückel constant. This is done separately for the σ(2s), σ(2p) and π(2p) pairs, giving the six energies plotted on the axis. For Li₂ and Be₂ the 2p levels are still calculated but are not drawn, since they are never occupied.

**s–p mixing.** σ(2s) and σ(2p) have the same symmetry (σ<sub>g</sub>), and so do σ\*(2s) and σ\*(2p) (σ<sub>u</sub>). Each pair is allowed to interact as an avoided crossing: the two mixed energies sit at the midpoint of the unmixed pair ± √(halfGap² + V²), where halfGap is half the unmixed separation. The coupling V is built in the Wolfsberg–Helmholz way from the 2s–2p overlap between the two atoms, and the same V is used for both pairs. A model this simple gives no independent value for the overall size of V, so it is scaled once, to reproduce the textbook ordering: σ(2p) above π(2p) for Li₂ to N₂, and below it for O₂ and F₂. Mixing the antibonding pair never changes a bond order or magnetism prediction, because σ\*(2p) is never partly filled in this row. Its most visible effect is in Li₂, where σ\*(2s) drops below σ(2p), and Li₂ has too few electrons to occupy either. In the shape panel, σ(2p) is always drawn as the unmixed head-on 2p + 2p combination: mixing changes its energy but not its drawn shape.

**The 2s radial node.** The 2s orbitals in the shape panel include their radial node, (1 − ζr)e<sup>−ζr</sup>, which shows as a small nodal circle around each nucleus. H₂ has no such node, since its orbitals are 1s. The overlap integrals used for the energies use nodeless functions. With the nodal form, S changes enough at the longer bond lengths of Li₂, Be₂ and B₂ to upset the scaling of the s–p mixing and give the wrong magnetism for B₂. The orbital shape you see and the energies you read therefore come from two slightly different approximations to the same orbital.

**The "Model" diatomic.** Courses usually introduce s–p mixing with a generic period 2 diagram that is not tied to any element. The "Model" option (A₂) does this, using round-number inputs: ζ = 1.625, a bond length of 1.40 Å, and 2s and 2p energies of −17.0 and −9.5 eV. The 7.5 eV gap puts it in the same range as B₂ and C₂, where mixing changes the filling order. It goes through the same calculation as the other molecules, so nothing in its diagram is placed by hand. With 8 valence electrons, mixing off fills σ(2p) before π(2p), leaving two unpaired electrons in π(2p), so the prediction is paramagnetic. Mixing on fills π(2p) completely, and the prediction is diamagnetic. The bond order is 2 either way, so the toggle changes only the magnetism, as it does for C₂.

**Comparison with experiment.** For N₂, σ\*(2s) lies below the whole 2p-derived bonding set. This matches N₂'s photoelectron spectrum: a He(I) spectrum shows σ<sub>g</sub>(2p), π<sub>u</sub>(2p) and σ<sub>u</sub>\*(2s), and σ<sub>g</sub>(2s) is too deep to ionise. F₂'s 2p-derived levels are bunched into a narrow band compared with its σ(2s)/σ\*(2s) split, because 2p–2p overlap is small at F₂'s bond length. This is part of the reason the F–F bond is unusually weak. Be₂ has bond order 0 here, while real Be₂ is very weakly bound, by a few kJ mol⁻¹, through dispersion-type effects the model does not include.
