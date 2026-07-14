## Teaching notes

The **Maxwell–Boltzmann distribution** describes the spread of molecular speeds in a gas at a given temperature. Only a fraction of molecules have enough kinetic energy to react — this is the basis for the effect of temperature on reaction rate.

### Key equation

The fraction of molecules with speed between $v$ and $v + dv$ is:

$$
f(v) = 4\pi \left(\frac{m}{2\pi k_B T}\right)^{3/2} v^2 \, e^{-\frac{mv^2}{2k_B T}}
$$

where:

- $m$ — mass of one molecule
- $k_B$ — Boltzmann constant
- $T$ — absolute temperature (K)

### Things to point out

- The curve is **not symmetric** — it has a long tail towards high speeds.
- As $T$ increases, the peak shifts right and flattens, but the area under the curve stays constant (the total number of molecules is fixed).
- Only molecules with energy greater than the activation energy, $E_a$, can react on collision. Raising the temperature increases the proportion of molecules in this high-energy tail — this is why rate increases sharply with temperature (Arrhenius equation, $k = Ae^{-E_a/RT}$).

### Suggested questions

**Q1.** Sketch how the curve changes if you double the absolute temperature.

<details class="qa">
<summary>Show answer</summary>

The peak shifts to a **higher speed** and becomes lower and broader. The area under the curve stays the same, since it always represents the total number of molecules (100%).

</details>

**Q2.** Why does a small increase in temperature cause a large increase in reaction rate?

<details class="qa">
<summary>Show answer</summary>

Reaction rate depends exponentially on temperature (the Arrhenius equation, $k = Ae^{-E_a/RT}$), because only molecules in the high-energy tail beyond $E_a$ can react. A small rise in $T$ shifts the whole distribution only slightly, but it disproportionately increases the fraction of molecules out in that tail — so the rate jumps by a much larger factor than the temperature change itself.

</details>

**Q3.** How would the curve differ for a heavier gas at the same temperature?

<details class="qa">
<summary>Show answer</summary>

At the same temperature, all gases have the same *average kinetic energy*. Since $KE = \frac{1}{2}mv^2$, a heavier molecule needs a lower speed for the same energy — so a heavier gas has a curve shifted to **lower speeds**, and it's taller and narrower (less spread out) than a lighter gas's curve.

</details>
