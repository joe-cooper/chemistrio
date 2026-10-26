## Teaching notes

This simulation shows how two atomic 1s orbitals combine to form molecular orbitals (MOs) as two nuclei are brought together, and how filling those MOs with electrons determines whether a diatomic species is expected to exist as a stable, bound molecule.

## Linear combination of atomic orbitals (LCAO)

When two atoms approach each other, their atomic orbitals overlap and combine. Quantum mechanically, the new molecular orbitals are built as sums and differences of the original atomic orbitals:

$$\psi_{\text{bonding}} = 1s_A + 1s_B \qquad \psi_{\text{antibonding}} = 1s_A - 1s_B$$

Combining the two 1s orbitals *in phase* (same sign) gives constructive interference between the nuclei. Extra electron density builds up in the internuclear region, and that is the **bonding orbital**, σ(1s). Combining them *out of phase* gives destructive interference: the wavefunction cancels exactly on the plane midway between the nuclei, producing a **node** with zero electron density there. This is the **antibonding orbital**, σ*(1s). It always lies higher in energy than the atomic orbitals it was built from, while the bonding orbital lies lower.

Use the two contour panels to see this directly. The bonding orbital shows a single continuous region of density, all one colour and phase, spanning both nuclei. The antibonding orbital shows a visible dashed nodal plane splitting the two lobes into opposite phases.

## Filling orbitals and bond order

Just like atomic orbitals, molecular orbitals are filled from lowest to highest energy (the Aufbau principle), with a maximum of two electrons per orbital. The **bond order** tells you the net number of bonds:

$$\text{bond order} = \frac{(\text{electrons in bonding orbitals}) - (\text{electrons in antibonding orbitals})}{2}$$

A bond order greater than zero means the species is predicted to be stable relative to the separated atoms; a bond order of zero means there is no net covalent bond. Use the electron-count buttons, or the preset species buttons, to see this play out:

- **H₂⁺**, 1 electron: bond order 0.5, a weak but real bond.
- **H₂**, 2 electrons: both go into σ(1s), giving bond order 1.
- **He₂⁺**, 3 electrons: 2 in σ(1s) and 1 in σ*(1s), giving bond order 0.5.
- **He₂**, 4 electrons: both orbitals full, giving bond order 0, which matches the fact that He₂ does not exist as a stable covalent molecule.

## Reading the diagrams

The **MO energy-level diagram** shows the two atomic 1s levels either side, and the split bonding and antibonding molecular levels in the middle, connected by correlation lines. It is the same style of diagram used for any diatomic MO scheme.

The **potential energy curve** shows how the total energy of the system changes with internuclear separation *R*. Species with a real bonding interaction show a minimum, which is the equilibrium bond length. Species with bond order 0, such as He₂, show no minimum at all; the curve simply gets less favourable as the atoms are pushed together.

Try the "Animate approach" button to watch the two nuclei come together continuously and see the orbitals, energy levels and curve update in real time. The model notes at the end of these notes explain which parts are quantitative predictions and which are qualitative approximations.

## Model notes and assumptions

**Orbital shapes.** The contour plots use hydrogen-like 1s functions, ψ₁ₛ ∝ e<sup>−Zr/a₀</sup>, combined as ψ<sub>±</sub> = 1s<sub>A</sub> ± 1s<sub>B</sub>. One electron shared between two nuclei is an exactly solvable problem, but the exact wavefunction needs prolate spheroidal coordinates and is not a simple sum of two atomic orbitals. The shapes here are the standard textbook approximation: right in every qualitative respect, including the node in σ\*, but not exact in detail. Switching to helium (Z = 2) contracts the clouds, as it should.

**Bond order.** Electrons fill σ(1s) and then σ\*(1s), two per level, and bond order = (electrons in σ − electrons in σ\*)/2.

**Energy levels.** The level energies come from the LCAO integrals J, K and S for one electron and two nuclei. They are worked out for Z = 1 and scaled to other nuclear charges using an exact relation: the electronic energy at charge Z and separation R is Z² times the Z = 1 energy at separation Z·R. The nuclear repulsion, together with the screening correction described below, is shared equally between the electrons present. Without that sharing, the bonding level of a helium species could sit above the atomic-orbital line, which a bonding orbital should never do. With it, both levels approach the atomic-orbital line at large R, and their occupation-weighted sum equals the total energy curve. Leaving nuclear repulsion out of the levels altogether would follow the strict textbook convention, but the antibonding level would then fall below the atomic-orbital line over most of the slider's range.

For H₂⁺ the model gives R<sub>e</sub> ≈ 1.32 Å and a well depth of 1.76 eV. The exact values are 1.06 Å and 2.79 eV, and the difference is the usual error of the simple LCAO treatment.

**Total energy and the screening correction.** Adding N one-electron energies to a single Z²/R repulsion term works when N ≤ Z, which covers H₂⁺. When N > Z it fails. Each electron's orbital energy includes an attraction to the far nucleus that falls off as 1/R, and with more electrons than one neutral atom can hold, there is not enough repulsion to cancel it. Uncorrected, the sum predicts He₂ to be bound by tens of eV.

At dissociation, though, one fragment can be a neutral atom and the other an ion, and a neutral atom and an ion do not interact at long range. The model subtracts Z·max(0, N−Z)/R to restore that limit, which leaves H₂⁺ unchanged. He₂⁺ then comes out at R<sub>e</sub> ≈ 1.11 Å and D<sub>e</sub> ≈ 2.07 eV, against experimental values of 1.08 Å and 2.47 eV, an error about the same size as for H₂⁺. He₂, with bond order 0, shows no well. The very weak binding He₂ does have comes from dispersion, which this model does not include.

**Why H₂ and H₂⁺ have the same bond length here.** Real H₂ has a shorter bond than H₂⁺ (0.74 Å against 1.06 Å), but the model gives both R<sub>e</sub> ≈ 1.32 Å. H₂'s total energy curve is exactly twice H₂⁺'s at every separation: the second electron goes into the same σ(1s) orbital, and the repulsion and correction terms double too. Doubling a curve makes its well twice as deep but does not move the minimum. The bond can only shorten if the orbital contracts when a second electron is added, and in this model the orbital shape is fixed. A variational treatment, in which the effective nuclear charge changes with the number of electrons, would show the contraction.

**Limitations.** There is no electron–electron repulsion within the molecule, so well depths are approximate: H₂ comes out at 3.53 eV against an experimental 4.52 eV. A quantitative treatment of more than one electron needs a method such as Hartree–Fock.
