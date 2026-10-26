## Teaching notes

Choose a substance for the **burette** (titrant) and the **conical flask** (analyte), set their concentrations and the flask volume, then press **Run** to titrate. The burette empties, the flask's colour shifts with universal indicator, and the pH curve builds up point by point as it goes. Drag the **volume added** slider at any time to scrub to a specific point instead.

### Reading the curve

The x-axis is a **fixed 0–50 cm³**, matching a standard burette's capacity, and it never rescales. Changing a concentration doesn't zoom the graph; it slides the steep jump left or right along that fixed scale, exactly as it would on paper with a real burette.

Two dashed gold lines mark the **titre** and **½ titre**. The titre is the volume at which moles of acid equivalents added equal moles of base equivalents originally in the flask, or vice versa. At ½ titre the pH equals the pK<sub>a</sub> of whichever weak species is present, which gives you a way to read K<sub>a</sub> straight off a graph instead of taking the formula on trust. If your choices push the titre past 50 cm³, the burette would run dry before reaching equivalence, and the stats panel says so directly.

### Combinations to try

- **Strong acid + strong base** (default: HCl in the flask, NaOH in the burette). Nearly flat until right at the titre, then an enormous jump of several pH units within a single drop, before flattening out again. Equivalence pH = 7.00 exactly.
- **Weak acid + strong base** (switch the flask to ethanoic acid). A shallower "buffer region" appears well before the titre, where pH resists change as acid and its conjugate base coexist. The jump at the titre is smaller, and the equivalence point sits **above** pH 7, since the leftover ethanoate ion is a weak base.
- **Weak base + strong acid** (ammonia in the flask, HCl in the burette). The mirror image, with the equivalence point **below** pH 7, because the leftover ammonium ion is a weak acid.
- **Diprotic acid** (H₂SO₄ in either vessel). Needs twice the moles of base to reach the titre, because each mole releases two H⁺. Concentrated H₂SO₄ also shows a little flattening near pH 2, from its much weaker second dissociation (HSO₄⁻ ⇌ H⁺ + SO₄²⁻). A shortcut that treats a diprotic acid as simply twice a monoprotic one misses that detail entirely.
- **Two acids, or two bases, in both vessels.** No neutralisation happens, so the curve drifts gently with dilution and never jumps. That is itself the useful result: a jump only appears when the two vessels can react with each other.

### Suitable indicator

The stats panel computes, from the model, how much the pH changes over a single 0.05 cm³ drop either side of the titre, and checks whether that range covers methyl orange (pH 3.1–4.4) or phenolphthalein (pH 8.2–10.0). For strong-strong titrations both work. For a weak acid with a strong base only phenolphthalein works, since methyl orange would change colour too early, well before the titre. For a weak base with a strong acid only methyl orange works. For anything without a sharp jump, neither does, and that is a limitation of indicator titrations in general.

### Suggested use

1. Leave the defaults (0.100 mol dm⁻³ HCl in the flask, 0.100 mol dm⁻³ NaOH in the burette, 25.0 cm³ flask) and press Run. Watch the pH sit near 1 for most of the run, then leap past 7 in a single drop.
2. Reset, switch the flask to ethanoic acid, and run again. Compare the shape: a flatter buffer region, a smaller jump, and an equivalence point you can read as being above 7.
3. Use the ½ titre marker to check a Ka or Kb calculation. Read the pH there, and confirm it matches the pKa given in the model notes below.
4. Try H₂SO₄ against NaOH and check the titre stat is double what the same concentration of HCl would need.
5. Set both vessels to acids (or both to bases) and confirm the curve has no jump at all. Then use the swap button to put the same two substances the other way round and see the mirror-image curve.

### Key ideas

- A titration's sharp jump happens because, right at the equivalence point, a single extra drop swings the solution from being dominated by one reactant to being dominated by the other. Away from that point there is a large buffering reservoir of unreacted material to absorb the change.
- The larger and steeper the jump, the more precisely the equivalence point can be found with an indicator or a pH meter. This is why strong-strong titrations are the easiest to do accurately, and why weak-weak titrations are essentially unusable with an indicator.
- For a weak acid or weak base, the pH at half-titre equals its pKa, or the pKa of its conjugate acid in the case of a base. This is the Henderson–Hasselbalch relationship, and here it is readable straight off the graph.
- The equivalence point of a weak acid against a strong base is above pH 7, and that of a weak base against a strong acid is below pH 7, because the leftover conjugate ion is itself a weak base or weak acid respectively.
- Choosing the right indicator means choosing one whose colour-change range falls inside the sharp jump, not simply one that changes colour somewhere near pH 7.

### Suggested questions

**Q1.** Why does the pH barely change for most of a strong acid + strong base titration, then leap by several units within a single drop right at the titre?

<details class="qa">
<summary>Show answer</summary>

Away from the titre there is a large excess of one reactant still present, and adding a small extra volume of titrant is a small change relative to that excess, so the pH moves only slightly. Right at the titre both reactants are almost completely consumed. A single extra drop now has no leftover reactant to swamp it, so it becomes the species that dominates the solution, causing a very large relative change in [H⁺], and hence in pH, for a tiny volume added.

</details>

**Q2.** A student titrates ethanoic acid (in the flask) with sodium hydroxide (in the burette) and finds the pH at the equivalence point is about 8.7, not 7.0. Why isn't it exactly neutral?

<details class="qa">
<summary>Show answer</summary>

At the equivalence point, essentially all the ethanoic acid has been converted to its conjugate base, ethanoate (CH₃COO⁻), dissolved in water. Ethanoate is a weak base: it takes a proton from water and releases OH⁻, so the solution at equivalence is slightly basic rather than neutral. The strong-acid/strong-base case gives exactly pH 7 only because neither Cl⁻ nor Na⁺ reacts with water at all.

</details>

**Q3.** Why does titrating sulfuric acid need twice the volume of the same concentration of sodium hydroxide as hydrochloric acid does, to reach the titre?

<details class="qa">
<summary>Show answer</summary>

Each mole of H₂SO₄ can release two moles of H⁺, since it is diprotic, while each mole of HCl releases only one. Reaching the titre means matching moles of OH⁻ added to moles of H⁺ available, so a given amount of H₂SO₄ needs twice as many moles of NaOH. At equal concentrations that means twice the volume, compared with the same molar amount of HCl.

</details>

**Q4.** If you set both the burette and the flask to acids, why is there no sharp jump anywhere in the curve?

<details class="qa">
<summary>Show answer</summary>

A sharp jump comes from a neutralisation reaction consuming one reactant faster than the other builds up, and specifically from one species running out. Two acids mixed together don't react with each other at all. Adding more acid to an acidic solution dilutes it and adds to the existing H⁺ gradually, with no special point where anything runs out, so the pH drifts smoothly instead of jumping.

</details>


## Model notes and assumptions

**Method.** The simulation solves one charge-balance equation for [H⁺] at every volume added, built from whichever species are present, in place of a separate formula for each type of titration. This is the systematic approach used in quantitative analytical chemistry, and it gives the textbook results for each combination without any of them being written in separately.

**Titre.** The titre is the volume at which the moles of H⁺ equivalents equal the moles of OH⁻ equivalents, counting 2 per mole for H₂SO₄ and 1 for everything else. With two acids or two bases there is no neutralisation, and this "titre" only marks where equal numbers of equivalents have been mixed.

**Constants (25 °C).** K<sub>w</sub> = 1.0×10⁻¹⁴; ethanoic acid K<sub>a</sub> = 1.74×10⁻⁵ (pK<sub>a</sub> = 4.76); ammonia K<sub>b</sub> = 1.8×10⁻⁵ (pK<sub>a</sub> of NH₄⁺ = 9.25). Sulfuric acid's first proton is treated as fully dissociated. Its second, HSO₄⁻ ⇌ H⁺ + SO₄²⁻, is treated as a weak equilibrium with K<sub>a2</sub> = 1.2×10⁻², which is why concentrated H₂SO₄ shows a little buffering near pH 2.

**Simplifications.** Activity coefficients are ignored, which is reasonable at the dilutions used in school titrations, and the temperature is fixed at 25 °C. The "jump per drop" reading always uses a 0.05 cm³ drop.
