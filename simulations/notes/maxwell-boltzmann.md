## Teaching notes

At equilibrium, particles in a system have a particular distribution of speeds. This is described by the *Maxwell-Boltzmann* distribution. This arises from the elastic collisions between particles. The same distribution is reached regardless of the starting distribution of particle speeds.

### Suggested use

Run the simulation starting from a single speed and observe how the speeds of the particles spread out. Most particles have an intermediate speed and fewer have a high or low speed. Very few (but not zero) particles have a very high speed. Try the same starting from a uniform spread of speeds and observe the same behaviour.

The distribution of speeds at a given moment fluctuates rapidly, so it is not clear what the exact distribution is. Click on the empirical average line on the Speed Distribution histogram. This will average the number of particles with a given speed over time. It begins to get smooth over time. Now click on equilibrium curve to see the exact Maxwell-Boltzmann distribution. You should see a good match if you have left the simulation running for long enough.

There are some key features of the Maxwell-Boltzmann curve:

- The curve starts at the origin - no particles have zero energy.
- It reaches a maximum near the average speed of particles. The mean speed is slightly higher than the curve maximum (the modal speed) as the curve is not symmetric.
- The curve decreases to an asymptote at higher speeds. The curve never touches the $x$-axis.

You can run the simulation again with different numbers of particles and different initial speeds (corresponding to different temperatures). The same dsitribution is reached regardless of the starting conditions. The actual graphs will be stretched/squished, but the underlying behaviour is the same.

The Maxwell-Boltzmann distribution helps explain a few things about how the rate of a reaction changes with temperature:

- There is no 'minimum temperature' required for a reaction to happen. There is always part of the curve above the activation energy, though at low temperatures it will be very small.
- Increasing temperature increases the rate of reaction as the number of particles above the activation energy increases.
- Lowering the activation energy (i.e. through the use of a catalyst) has a similar effect - there are more particles with energy above the activation energy.

### Key equation

The fraction of molecules with speed between $v$ and $v + dv$ is:

$$
f(v) = 4\pi \left(\frac{m}{2\pi k_B T}\right)^{3/2} v^2 \, \mathrm{e}^{-\frac{mv^2}{2k_B T}}
$$

where:

- $m$ — mass of one molecule
- $k_B$ — Boltzmann constant
- $T$ — absolute temperature (K)

The $v^2$ term causes the curve to increase from the origin and the $\mathrm{e}^{-v^2}$ term causes the later decrease and asymptote.

The simulation is 2D so the equation is slightly different to the one that would apply to real-world 3D systems.

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
