## Teaching Notes

## How to use

Move the target temperature slider to adjust the temperature (average kinetic energy) of the particles. As you increase it, you will see the particles begin to show liquid behaviour (moving past each other) and then gaseous behaviour (moving apart from each other).

You can use the temperature sweep to automatically increase the temperature at a steady rate. This will also plot a heating curve on the graph. Please note that due to the small number of particles and 2D nature of the simulation, the heating curve will not look like the expected one.

You can adjust the parameters using the sliders. The particle count will add or remove particles from the simulation. The interaction strength controls the force of attraction between the particles. Gravity helps keep the sold and liquid masses at the bottom of the simulation. Cohesion gently pulls the particles together to allow for condensation when decreasing the temperature.

## How the simulation works

 Every pair of particles interacts through the Lennard-Jones potential 
 
 $$U(r) = 4ε[(\frac{σ}{r}\)^{12} − (\frac{σ}{r})^6],$$ 
 which repels particles strongly at short range and attracts them weakly out to a few particle diameters. This is the standard model for how neutral atoms (like argon) actually interact, and it's the only force in the simulation — there is no separate "solid" or "gas" rule built in.

The temperature slider doesn't move particles directly. It sets a target average kinetic energy, and a thermostat gently nudges the real kinetic energy toward that target each step — the same idea as a heat bath exchanging energy with the system. Positions then evolve under Newton's second law (velocity-Verlet integration), so everything you see — melting, flowing, evaporating — emerges from the competition between that thermal energy and the attractive forces between particles.

State is classified using two physical order parameters, the same ones used in real molecular simulations: the Lindemann parameter δ, the root-mean-square displacement of particles from their original lattice sites (divided by the lattice spacing) — small in a solid, large once particles diffuse away from fixed sites — and the mean coordination number, how many neighbours each particle has within 1.5σ — around 6 in a close-packed solid or liquid, near zero once a particle is alone in the gas phase. Textbook references quote δ ≈ 0.1–0.15 as the bulk-solid melting threshold, but a cluster this small genuinely vibrates with much larger amplitude than a bulk crystal does even while its coordination stays fully intact (small clusters are floppier than bulk solids — a real finite-size effect, not an error), so that threshold was recalibrated against this simulation's own coordination data rather than borrowed directly from the literature.

Mean coordination $< 2$ → gas (particles are mostly isolated)
Coordination high and $δ < 1.0$ → solid (particles vibrate about fixed sites)
Coordination high and $δ ≥ 1.0$ → liquid (particles flow past each other but stay cohesive)

The temperature is also shown in Kelvin using argon's real Lennard-Jones parameters (ε/kB ≈ 120 K) to give a physical sense of scale. Because this is a small cluster of ~100 particles in a vacuum, not a bulk liquid at atmospheric pressure, the temperature at which it visibly melts or evaporates won't exactly match argon's textbook melting/boiling points — but the underlying physics (attraction vs. thermal energy) is exactly the same competition that sets those real transition temperatures.

Particle count rebuilds the lattice at a new size (applied when you release the slider). Interaction strength (ε) scales how deep the attractive well is — turn it down to model a weakly-bound substance (like a noble gas) that melts and evaporates at low temperature, or up to model something more strongly bound (like a metal), which stays solid at much higher T. The temperature axis itself doesn't move when you change ε — that's the point: the same thermal energy now competes against a different bond strength. Gravity adds a constant downward force on top of the interparticle forces — turn it up and the solid/liquid packs down harder against the floor, turn it to zero and the cluster floats freely, held together by nothing but its own attraction. Start Temperature Sweep resets to a cold solid and then adds kinetic energy at a constant rate, mimicking a constant-power heater. Because the energy input is constant, any energy that goes into breaking intermolecular bonds during a phase transition isn't available to raise the kinetic temperature — so T* genuinely plateaus on the heating curve. The width of each plateau is proportional to the latent heat for that transition: in this Lennard-Jones system, evaporation absorbs roughly 20–25× more energy than melting, so the boiling plateau is much wider than the melting plateau, exactly as in real substances. 

