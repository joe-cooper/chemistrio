## Teaching notes

Choose a buffer system and set the concentrations of its acid form and base form (this sets both the pH and the ratio), then either drag the **volume added** slider or press **Run**. The x-axis is bidirectional and centred on zero: dragging left computes what happens if you add that much **HCl**, dragging right computes what happens if you add that much **NaOH** — both starting from the same untouched buffer recipe, plotted together so you can compare a buffer's response to acid and to base on one picture. At whatever point you've reached, the same titrant is applied identically to three vessels at once: the **buffer**, a beaker of **pure water**, and a solution of unbuffered strong acid or base that has been chosen to start at **exactly the buffer's own pH**. Watching all three respond to the same addition is the point — the buffer barely moves while the other two swing wildly, on either side.

Note that the left and right halves are two independent "what if" calculations sharing one starting buffer and one axis, not one continuous experiment — moving from the HCl side back through zero to the NaOH side doesn't mean "the HCl got neutralised first." Each point on the curve is worked out fresh from the original recipe, the same way any titration curve is, just with both directions of titrant drawn on the same graph instead of two separate ones.

### Why the "same starting pH" comparison matters

Comparing a buffer only against water is the classic classroom demo, but it mixes two effects together: water starts at pH 7, while most buffers don't. The **same-pH curve** removes that confound — it starts at the identical pH to the buffer and receives the identical additions to the identical volume, so any difference that appears between the buffer curve and the same-pH curve is caused by nothing except the presence of the conjugate acid/base pair. This is the more rigorous test of "does buffering actually work," and it's what the **buffering factor** stat quantifies directly: how many times smaller the buffer's pH change is, compared with what an otherwise-identical unbuffered solution would have done.

### Henderson–Hasselbalch, made visible

The recipe card shows both the **Henderson–Hasselbalch prediction**, pH = pK<sub>a</sub> + log([base]/[acid]), and the **exact model pH** side by side. They agree closely across most of the useful range — try setting the two concentration sliders equal (ratio 1:1) and check the exact pH matches the system's pK<sub>a</sub>. Push the ratio to an extreme (e.g. 20:1) or drop both concentrations very low, and the two numbers start to drift apart — a direct, visible demonstration of where the textbook approximation quietly assumes the buffer components are far more concentrated than any [H⁺] or [OH⁻] shift caused by water itself, and where that assumption stops holding.

### Buffer capacity has a hard limit — on both sides independently

A buffer's flat region isn't infinite, and it has a *separate* limit in each direction. Every mole of acid added consumes one mole of the base form (and vice versa for base added), so the HCl-side capacity bar and the NaOH-side capacity bar in the recipe card empty independently — pushing hard on the HCl side doesn't touch the NaOH-side reserve at all. Once a side's reserve runs out, that side's **capacity point** marker on the graph lights up, and the curve bends up or down on that half just as sharply as the two unbuffered curves. Try raising the titrant concentration slider: at low concentration neither side's capacity is exceeded across the full ±20 cm³ range shown, but at high concentration you can watch the flat middle region end abruptly, on one or both sides.

### The three systems

- **Ethanoic acid / sodium ethanoate** (pK<sub>a</sub> 4.76) — the standard A-level weak-acid buffer.
- **Ammonia / ammonium chloride** (pK<sub>a</sub> 9.25) — the standard A-level weak-base buffer; note the ratio still reads as [base]/[acid] = [NH₃]/[NH₄⁺].
- **Sodium dihydrogenphosphate / disodium hydrogenphosphate** (pK<sub>a</sub> 7.21) — a real buffer used constantly in biology and biochemistry labs (it's the phosphate half of PBS, "phosphate-buffered saline"), and a useful bridge to why living systems can hold pH close to 7.4 despite constantly producing acidic and basic waste products.

### Suggested use

1. Leave the defaults (ethanoic acid/sodium ethanoate, both 0.10 mol dm⁻³, 25 cm³, titrant 0.5 mol dm⁻³) and press Run. Watch the animation sweep from full HCl on the left, through the untouched buffer at the centre, to full NaOH on the right — the buffer's curve stays comparatively flat across the middle while the water and same-pH curves crash almost immediately on both sides.
2. Drag the slider to a small volume on the HCl side (e.g. −1 cm³) and check the stats panel: note how much smaller ΔpH is for the buffer than for the same-pH curve, and read off the buffering factor. Repeat on the NaOH side.
3. Raise the titrant concentration to 2 mol dm⁻³ and re-run. Find the volumes at which each capacity bar empties and each half of the buffer curve breaks away from flat.
4. Set the two concentration sliders to a 10:1 ratio and check the exact-model pH against pK<sub>a</sub> ± 1 — the usual "buffers work over pK<sub>a</sub> ± 1" rule of thumb.
5. Switch to the ammonia system to see a weak-base buffer: its flat region now sits up near pH 9.25, but the same symmetric picture (HCl on the left, NaOH on the right) still applies.
6. Switch to the phosphate system and reduce both concentrations to their minimum. Compare how much sooner each side's capacity is used up than the default 0.10 mol dm⁻³ ethanoic acid buffer, at the same titrant concentration.

### Key ideas

- A buffer resists pH change because the added H⁺ or OH⁻ reacts with a large reservoir of the conjugate species already present, rather than accumulating freely in solution — an unbuffered solution has no such reservoir, so the same small addition directly sets its [H⁺].
- Henderson–Hasselbalch, pH = pK<sub>a</sub> + log([base]/[acid]), shows that pH depends only on the **ratio** of the two forms, not on the absolute concentrations — but **capacity** (how much acid or base the buffer can absorb before failing) depends on the absolute amounts present.
- Buffering is most effective when [base] ≈ [acid], i.e. pH ≈ pK<sub>a</sub>; the practical working range is usually quoted as pK<sub>a</sub> ± 1, because outside that the ratio becomes so lopsided that one component nears exhaustion for only a small addition.
- Every buffer has a finite capacity, and a separate one in each direction: the base form is the reserve against acid, the acid form is the reserve against base, and each can be used up independently of the other.
- Comparing against a solution that starts at the *same* pH isolates the effect of the conjugate pair itself, rather than mixing it up with the effect of starting at a different pH.

### Suggested questions

**Q1.** A student adds a few drops of dilute HCl to a beaker of water and to a beaker of ethanoic acid/sodium ethanoate buffer, both starting at the same volume. The water's pH crashes; the buffer's barely moves. Explain why, in terms of what happens to the H⁺ ions in each case.

<details class="qa">
<summary>Show answer</summary>

In water, there is nothing to react with the added H⁺ apart from a negligible amount of OH⁻, so almost all of it stays as free H⁺, and because the total volume is small, even a tiny number of moles produces a large concentration change. In the buffer, the added H⁺ instead reacts with the ethanoate ions (CH₃COO⁻ + H⁺ → CH₃COOH), converting some of the conjugate base into the weak acid rather than existing as free H⁺ — as long as there is still ethanoate left to react with, the free [H⁺], and hence the pH, changes only slightly.

</details>

**Q2.** Why does comparing the buffer to a solution that already starts at the same pH give more convincing evidence for "buffering" than comparing it to plain water?

<details class="qa">
<summary>Show answer</summary>

Comparing to water conflates two different things: water starts at a different pH from the buffer, so some of the apparent "resistance" could just be an artefact of the two solutions being different to begin with, rather than proof the buffering mechanism itself is doing anything. Matching the starting pH exactly means the only difference between the two solutions is the presence of the acid/conjugate-base pair — so any difference in how much their pH changes afterwards can only be due to that pair.

</details>

**Q3.** A buffer made from equal concentrations of ethanoic acid and sodium ethanoate is titrated with a large amount of strong acid. Describe and explain what eventually happens to the pH curve.

<details class="qa">
<summary>Show answer</summary>

Initially the pH falls only slightly, because the added H⁺ converts ethanoate ions into ethanoic acid, keeping free [H⁺] low. This continues only as long as ethanoate ions remain. Once all the ethanoate has been converted, there is no more conjugate base left to absorb further H⁺, so any additional acid added accumulates directly as free H⁺ — the pH then falls sharply, just as it would in an unbuffered solution.

</details>

**Q4.** Two ethanoic acid/sodium ethanoate buffers have the same pH but different total concentrations (one is ten times more concentrated than the other). Which one can absorb more added acid before its pH starts to change rapidly, and why?

<details class="qa">
<summary>Show answer</summary>

The more concentrated buffer. Both buffers have the same pH because Henderson–Hasselbalch depends only on the ratio [CH₃COO⁻]/[CH₃COOH], which is the same in both — but the more concentrated buffer contains ten times as many moles of ethanoate ion in the same volume, so it takes ten times as much added acid before that reserve is used up and the pH begins to change sharply.

</details>
