## Teaching Notes

This simulation shows how two atomic 1s orbitals combine to form molecular orbitals (MOs) as two nuclei are brought together, and how filling those MOs with electrons determines whether a diatomic species is expected to exist as a stable, bound molecule.

## Linear combination of atomic orbitals (LCAO)

When two atoms approach each other, their atomic orbitals overlap and combine. Quantum mechanically, the new molecular orbitals are built as sums and differences of the original atomic orbitals:

$$\psi_{\text{bonding}} = 1s_A + 1s_B \qquad \psi_{\text{antibonding}} = 1s_A - 1s_B$$

Combining the two 1s orbitals *in phase* (same sign) gives constructive interference between the nuclei — extra electron density builds up in the internuclear region, which is the **bonding orbital**, σ(1s). Combining them *out of phase* gives destructive interference: the wavefunction cancels exactly on the plane midway between the nuclei, producing a **node** with zero electron density there. This is the **antibonding orbital**, σ*(1s), and it is always higher in energy than the atomic orbitals it was built from, while the bonding orbital is lower.

Use the two contour panels to see this directly: the bonding orbital shows a single continuous region of density (same colour/phase) spanning both nuclei, while the antibonding orbital shows a visible dashed nodal plane splitting the two lobes into opposite phases (colours).

## Filling orbitals and bond order

Just like atomic orbitals, molecular orbitals are filled from lowest to highest energy (the Aufbau principle), with a maximum of two electrons per orbital. The **bond order** tells you the net number of bonds:

$$\text{bond order} = \frac{(\text{electrons in bonding orbitals}) - (\text{electrons in antibonding orbitals})}{2}$$

A bond order greater than zero means the species is predicted to be stable relative to the separated atoms; a bond order of zero means there is no net covalent bond. Use the electron-count buttons (or the preset species buttons) to see this play out:

- **H₂⁺** (1 electron): bond order 0.5 — a weak but genuine bond.
- **H₂** (2 electrons): both go into σ(1s) — bond order 1.
- **He₂⁺** (3 electrons): 2 in σ(1s), 1 in σ*(1s) — bond order 0.5.
- **He₂** (4 electrons): both orbitals full — bond order 0, matching the fact that He₂ does not exist as a stable covalent molecule.

## Reading the diagrams

The **MO energy-level diagram** shows the two atomic 1s levels either side, and the split bonding/antibonding molecular levels in the middle, connected by correlation lines — the same style of diagram used for any diatomic MO scheme. The **potential energy curve** shows how the total energy of the system changes with internuclear separation *R*; species with a genuine bonding interaction show a minimum (an equilibrium bond length), while species with bond order 0 (like He₂) show no minimum at all — the curve simply gets less favourable as the atoms are pushed together.

Try the "Animate approach" button to watch the two nuclei come together continuously and see the orbitals, energy levels and curve update in real time. The "Model notes & honesty check" panel underneath goes into more detail on exactly what is and isn't a real quantitative prediction versus a qualitative approximation.
