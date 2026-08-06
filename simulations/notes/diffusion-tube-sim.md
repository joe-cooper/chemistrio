## Teaching notes

### Suggested use

This simulates the GCSE demonstration of diffusion of hydrogen chloride and ammonia gases in a long tube. It is not designed as a replacement for the actual demonstration. If possible, perform the demonstration and then use this simulation to model what is happening on a particle-level.

Press Start with the default settings and watch where the ring of NH₄Cl (grey dots) forms. Turn on "Expected position" in the legend to compare where it ends up against the theoretical prediction from Graham's law. the two should agree quite well, though it is not perfect due to the relatively small number of particles used in the simulation. Clicking "Air (N₂/O₂)" on the legend will show the air particles.

The temperature slider allows the temperature of the system to be changed. At higher temperatures, particles will have more kinetic energy so will diffuse faster. The ring should form in roughly the same place as before as the ratio of their diffusion rates stays the same.

The air density slider allows the number of air particles to be increased or decreased. Removing all the air shows how much it slows the diffusion rate of the reactants. 

### What is happening

When hydrogen chloride and ammonia react, they produce solid ammonium chloride. In the demonstration, the ammonium chloride looks like white smoke when it forms. This can be shown by holding bottles of concentrated hydrochloric acid and ammonia close to each other.

Useful questions to ask before starting the demonstration are "where will the white smoke appear?" and "when will it appear?" This can help find misconceptions to address later. 

#### Where the smoke appears

Both gases start at opposite ends of a horizontal tube at the same time, so a first guess might be that they meet halfway. This assumes the particles diffuse at the same rate as they are at the same temperature so they will have the same kinetic energy. While the initial part of this reasoning is true, it misses that kinetic energy is not the same as velocity. The equation for kinetic energy ($K.E.$) helps reveal this:

$$ K.E. = \frac{1}{2} m v^2$$

The kinetic energy depends on both the mass ($m$) and velocity ($v$) of the particle. If the particles had the same mass, then they would have the same velocity for the same kinetic energy. However, ammonia has a much smaller molar mass (17 g/mol) than hydrogen chloride (36.5 g/mol). Since they are at the same temperature and have the same kinetic energy, the lighter ammonia molecules must be travelling faster. Hence in the time taken before the two reactants meet, ammonia will have travelled further and the white smoke will appear further from the ammonia end and closer to the hydrogen chloride end.

#### When the smoke appears

The particles are travelling very quickly at any given moment but it takes a long time for them to diffuse to the centre. This is because the reactant particles are not the only substances in the tube; it is full of air. The reactant particles collide with the air particles and change direction very frequently which means the overall diffusion is much slower than the speed of an individual particle. If the air was removed, the white smoke would form much quicker.



### Key equation

The ratio of average speeds of two gases at the same temperature is given by **Graham's law of diffusion**:

$$
\frac{v_{\text{NH}_3}}{v_{\text{HCl}}} = \sqrt{\frac{M_{\text{HCl}}}{M_{\text{NH}_3}}}
$$

where $M$ is the molar mass of each gas. Since the two gases start their journeys at the same moment and react on contact, the distance each has covered when they meet is proportional to its speed, so the ring forms at the fraction of the tube's length

$$
\frac{v_{\text{NH}_3}}{v_{\text{NH}_3} + v_{\text{HCl}}} \approx 59\%
$$

of the way along from the NH₃ end — i.e. much nearer the HCl end, exactly as the simulation shows.

### Suggested questions

**Q1.** Predict, using Graham's law, roughly what fraction of the tube's length from the NH₃ end the ring would form at if HCl were replaced with hydrogen bromide, HBr ($M = 81$ g mol⁻¹).

<details class="qa">
<summary>Show answer</summary>

$$
\frac{v_{\text{NH}_3}}{v_{\text{NH}_3}+v_{\text{HBr}}} = \frac{\sqrt{81}}{\sqrt{17}+\sqrt{81}} = \frac{9}{4.12+9} \approx 69\%
$$

A bit further than the NH₃/HCl case (roughly 69% rather than 59%) — HBr is heavier still than HCl, so the ring shifts further towards the HBr end. Even so, the shift is modest compared with how much heavier HBr is than HCl (more than double the molar mass), because the square root compresses large mass differences into much smaller speed differences.

</details>

**Q2.** Two students argue about the diffusion tube experiment. Student A says "the ring forms nearer the HCl end because HCl is denser and sinks." Student B says "it's because NH₃ molecules move faster." Who is right, and what's wrong with the other explanation?

<details class="qa">
<summary>Show answer</summary>

Student B is right. The ring position is set purely by relative *speeds*, which come from the mass difference via Graham's law — nothing to do with density or sinking. Student A's explanation doesn't hold up: the tube is horizontal, and even if it were vertical, gases mix by diffusion far faster than they separate by density, so a "denser gas sinks" argument doesn't explain a *ring position* at all — it would just predict HCl pooling at the bottom.

</details>

**Q3.** In this simulation, increasing temperature makes the ring form sooner but not somewhere very different. Explain why, and suggest one thing about the real experiment that *would* shift the ring's position.

<details class="qa">
<summary>Show answer</summary>

Temperature increases the speed of *every* gas particle by the same factor ($v \propto \sqrt{T}$), so both NH₃ and HCl speed up together — their ratio, and hence the ring position, is unchanged. What would shift the position is anything that changes the *relative* masses or starting distances involved — for example, using a different acid (changing $M_{\text{HCl}}$), or setting up the cotton wool plugs at unequal distances from the ends of the tube.

</details>
