## Teaching notes

### Suggested use

Open with methane, which is where the simulation starts. Before saying anything about rules, drag one of the hydrogens well away from where it sits and hold it there. The other three shift while you hold it, and when you let go the whole molecule springs back to exactly the arrangement it started in. Press **Shake** to throw all four off at once; it recovers just the same. Nothing in the code knows the word "tetrahedral" — the shape is what four mutually repelling charges settle into when they are free to move on a sphere.

That is worth establishing before the shapes themselves, because it is the part students most often miss. A tetrahedron in a textbook looks like a fact to memorise. Here it is an outcome, and one you can disturb and watch re-form.

Then work along the molecule row, which is in order of how many electron pairs the central atom has: one, two, three, four, five, six. Ask for a prediction before each click. Two useful pauses:

At **CH<sub>4</sub>**, ask why the four hydrogens do not simply sit at the corners of a square, 90&deg; apart. Most students will have drawn methane flat at some point. Nothing stops you dragging all four hydrogens roughly into a plane to try it — they will not stay.

At **NH<sub>3</sub>**, ask for the bond angle before revealing it. Ammonia has four electron pairs, exactly as methane does, so a reasonable first answer is 109.5&deg;. It reads 107&deg;. Water, with the same four pairs, reads 104.5&deg;. Those two numbers are the evidence that a lone pair is not simply a bonding pair without an atom on the end, and they are worth dwelling on before any explanation is offered.

**PCl<sub>5</sub>** repays some time. It is the first molecule in the row with two different bond angles, and the reason is worth drawing out rather than stating: five points cannot be spread evenly over a sphere, so two of them have to be different from the other three.

The last entry, **AX<sub>n</sub>E<sub>m</sub>**, is not a substance. Two sliders set the number of bonding and lone pairs, up to six between them, and the model builds whatever those pairs settle into. It is the quickest way to work through the whole VSEPR table in one place, and it reaches the shapes that need five or six pairs — the see-saw at four bonding and one lone, the T-shape at three and two, the square plane at four and two — which are hard to picture from a flat diagram. Worth asking students to predict the shape from the two numbers before releasing the slider.

Where the lone pairs sit is not looked up. The model costs every way of placing them on the arrangement and keeps the cheapest, which is how it puts a lone pair in a trigonal bipyramid on the equator rather than at a pole, and puts two in an octahedron opposite each other.

Drag the empty space to turn any molecule round. Lone pairs can be dragged too, and they relax back like everything else.

### Where the shapes come from

We start from one claim: the electron pairs around a central atom repel each other, so they end up as far apart as they can get. That is the whole of VSEPR, and everything in this simulation follows from it.

For two pairs the answer is immediate. Two charges free to move on a sphere go to opposite poles, 180&deg; apart, and carbon dioxide is linear. Notice, though, what we are counting. Carbon in CO<sub>2</sub> has four bonding pairs, two in each double bond — but the two pairs of a C=O double bond point the same way, and cannot separate from each other. They act as a single region of charge. This is why we count *regions* rather than pairs, and it is the most common place for a prediction to go wrong.

Three regions give a flat triangle at 120&deg;, as in BH<sub>3</sub>. Four is where it gets worth arguing about. If we stay in a plane, four charges give 90&deg; each. But we are not confined to a plane, and lifting two of them out of it lets all four get further apart: 109.5&deg;, the tetrahedral angle. You can test this directly in the simulation by dragging the hydrogens of methane towards a square arrangement and releasing them.

So far every pair has held an atom, and the shape of the molecule has been the same as the arrangement of the pairs. Ammonia breaks that. Nitrogen has four pairs, so the pairs are still arranged tetrahedrally, but one of them is a lone pair with no atom on the end. When we name a shape we are describing where the *atoms* are, and three atoms plus a nitrogen make a trigonal pyramid, not a tetrahedron. Water is the same argument run twice: four pairs, tetrahedral arrangement, two atoms, and the shape we name is bent.

### Lone pairs and bond angles

Ammonia is 107&deg; and water 104.5&deg;, both smaller than methane's 109.5&deg;, and all three have four electron pairs on the central atom. If the four pairs were equivalent the angle would be the same in all three, so they are not equivalent: a lone pair presses harder on its neighbours than a bonding pair does.

Two things make that plausible. A bonding pair is held between two nuclei, so it is drawn away from the central atom; a lone pair is attracted by one nucleus only and stays closer in. And a bonding pair is stretched out along the bond, while a lone pair is fatter near the atom it belongs to. Both give a lone pair more presence close to the central atom, where the crowding is.

Here we should be careful about what the simulation is and is not doing. For methane, carbon dioxide, borane, phosphorus pentachloride and sulfur hexafluoride the model is genuinely predicting: equal charges repelling on a sphere produce 109.5&deg;, 180&deg;, 120&deg;, and 90&deg; with 120&deg;, and it would produce them whatever we did. For ammonia and water it is not predicting. The strength of the lone pair has been set for each molecule to whatever reproduces the measured angle, because VSEPR tells us the angle should shrink but gives us no way of working out by how much. The shapes are a result; those two angles are an input.

There is also more going on than lone pairs. Nitrogen trifluoride, NF<sub>3</sub>, has the same single lone pair as ammonia, so counting pairs predicts a similar angle. It is 102.5&deg;, noticeably tighter than ammonia's 107&deg;. Fluorine is far more electronegative than hydrogen and draws each bonding pair away from the nitrogen; with the bonding pairs held further off, they press on each other less and the lone pair wins more of the argument. Counting lone pairs cannot see this coming, because both molecules have exactly one.

### Five electron pairs

Two, three, four and six pairs all have a symmetrical answer, and in every one of them each position is equivalent to every other. Five does not. Set the simulation to PCl<sub>5</sub> and look at the two angle readings: 90&deg; and 120&deg;. Three of the chlorines sit in a triangle round the middle, 120&deg; apart, and two sit above and below at 90&deg; to that triangle. The two axial positions and the three equatorial ones are genuinely different places to be, with different numbers of close neighbours.

This is not a limitation of the model. There is no way to place five points evenly on a sphere, so the best arrangement has to be an uneven one. Six pairs recovers the symmetry: the octahedron of SF<sub>6</sub> puts every fluorine in an identical position with four neighbours at 90&deg; and one opposite at 180&deg;.

### Looking ahead

The first thing that changes at university is the reason. VSEPR says electron pairs repel, and it is natural to read that as ordinary electrostatic repulsion between like charges. That is not really it. The dominant effect is the Pauli exclusion principle: two electrons with the same spin cannot occupy the same region, so pairs of electrons keep out of each other's way whether or not we account for their charge. The geometry VSEPR predicts is right far more often than the reason it gives for it.

You will also meet a second language for the same shapes. Hybridisation describes methane's four equivalent bonds as sp<sup>3</sup>, boron's three as sp<sup>2</sup>, and carbon dioxide's two as sp — and Bent's rule, which says that s character concentrates in bonds to less electronegative atoms, handles the NF<sub>3</sub> problem above rather better than counting lone pairs does. Molecular orbital theory goes further again and treats the whole molecule at once, which is the only approach that explains why water is bent and beryllium hydride is linear in terms of orbital energies rather than repulsion. The molecular orbital simulations on this site are the starting point for that.

It is worth knowing where VSEPR breaks, and phosphine is the clearest case. PH<sub>3</sub> has the same AX<sub>3</sub>E arrangement as ammonia, so VSEPR predicts something close to 107&deg;. The measured angle is 93.3&deg;, and H<sub>2</sub>S is 92&deg; against water's 104.5&deg;. These are close to 90&deg;, which is what you would expect if the bonds used almost pure p orbitals with the lone pair sitting in a largely unmixed s orbital. Going down a group, the s and p orbitals of the central atom become more different in energy and mix less, and the tetrahedral picture stops applying. VSEPR gives no hint that this is coming.

### Suggested questions

**Q1.** Carbon in CO<sub>2</sub> is surrounded by four bonding pairs of electrons. Methane's carbon is also surrounded by four. Why is one linear and the other tetrahedral?

<details class="qa">
<summary>Show answer</summary>

What matters is the number of *regions* of electron density, not the number of pairs. In CO<sub>2</sub> the two pairs of each C=O double bond point in the same direction and cannot get away from each other, so they behave as one region. Carbon therefore has two regions to separate, and two regions go to opposite sides: 180&deg;. Methane's four pairs are in four separate bonds pointing four different ways, so there are four regions to separate, and the best they can do in three dimensions is 109.5&deg;.

</details>

**Q2.** Methane, ammonia and water all have four electron pairs on the central atom, but their bond angles are 109.5&deg;, 107&deg; and 104.5&deg;. Explain the trend.

<details class="qa">
<summary>Show answer</summary>

If all four pairs were equivalent, all three molecules would have the tetrahedral angle of 109.5&deg;, as methane does. The angle falls as bonding pairs are replaced by lone pairs, so a lone pair must repel more strongly than a bonding pair.

A bonding pair is shared between two nuclei and so is pulled away from the central atom, while a lone pair is held by one nucleus only and stays closer in, where it crowds its neighbours more. Ammonia has one lone pair and drops by about 2.5&deg;; water has two and drops by about 5&deg;.

Notice that this reasoning gives the right order but not the size of the drop. VSEPR tells us the angle should close, not by how much, which is why the measured values have to be looked up rather than worked out.

</details>

**Q3.** PCl<sub>5</sub> has two different bond angles but SF<sub>6</sub> has only one kind of neighbouring angle. Explain why, and predict where a lone pair would sit in SF<sub>4</sub>, which has four bonding pairs and one lone pair.

<details class="qa">
<summary>Show answer</summary>

Six points can be placed on a sphere so that every one has an identical set of neighbours, which is the octahedron: four neighbours at 90&deg; and one opposite at 180&deg;. Five points cannot be arranged evenly at all, so the best arrangement is the trigonal bipyramid, in which the three equatorial positions and the two axial positions are different from each other. The equatorial positions have two close neighbours at 120&deg; and two at 90&deg;; the axial positions have three at 90&deg;.

A lone pair takes up more room than a bonding pair, so it will go wherever it is least crowded — the equatorial position, with only two neighbours at 90&deg; instead of three. This leaves SF<sub>4</sub> with the see-saw shape.

You can check this on the AX<sub>n</sub>E<sub>m</sub> entry by setting four bonding pairs and one lone pair. Nothing tells the model which position to use; it tries them all and keeps the cheapest, and the lone pair ends up equatorial.

</details>

**Q4.** PH<sub>3</sub> has one lone pair and three bonding pairs on the phosphorus, exactly as NH<sub>3</sub> does on the nitrogen. VSEPR therefore predicts a similar bond angle for both. Ammonia measures 107&deg; and phosphine measures 93.3&deg;. What does this tell us about the model?

<details class="qa">
<summary>Show answer</summary>

It tells us that VSEPR is a useful rule for predicting shapes but not a real account of bonding. Counting electron pairs correctly identifies both molecules as trigonal pyramidal, and for ammonia the predicted angle is close. For phosphine it is wrong by nearly 14&deg;, and nothing in the electron-pair counting warns us of it.

An angle near 90&deg; is what we would expect if the three P&ndash;H bonds used almost pure p orbitals, which are at 90&deg; to one another, with the lone pair in a largely unmixed s orbital. In nitrogen the 2s and 2p orbitals are close enough in energy to mix thoroughly and give something near the tetrahedral arrangement; in phosphorus the 3s and 3p are further apart and mix much less. VSEPR has no way of knowing about orbital energies, so it cannot see this difference coming.

</details>
