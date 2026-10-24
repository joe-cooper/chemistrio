## Teaching notes

## How to use

Move the target temperature slider to adjust the temperature (average kinetic energy) of the particles. As you increase it, you will see the particles begin to show liquid behaviour (moving past each other) and then gaseous behaviour (moving apart from each other).

You can use the temperature sweep to automatically increase the temperature at a steady rate. This will also plot a heating curve on the graph. Please note that due to the small number of particles and 2D nature of the simulation, the heating curve will not look like the expected one.

You can adjust the parameters using the sliders. The particle count will add or remove particles from the simulation. The interaction strength controls the force of attraction between the particles. Gravity helps keep the solid and liquid masses at the bottom of the simulation. Cohesion gently pulls the particles together to allow for condensation when decreasing the temperature.

## How the simulation works

Every pair of particles interacts through the Lennard-Jones potential

$$U(r) = 4ε[(\frac{σ}{r})^{12} − (\frac{σ}{r})^6],$$

which repels particles strongly at short range and attracts them weakly out to a few particle diameters. This is the standard model for how neutral atoms such as argon interact, and it is the only force in the simulation. There is no separate "solid" or "gas" rule built in.

The temperature slider doesn't move particles directly. It sets a target average kinetic energy, and a thermostat nudges the real kinetic energy towards that target each step, in the same way a heat bath exchanges energy with a system. Positions then evolve under Newton's second law (velocity-Verlet integration), so melting, flowing and evaporating all emerge from the competition between thermal energy and the attractive forces between particles.

State is classified using two physical order parameters, the same ones used in real molecular simulations. The first is the Lindemann parameter δ, the root-mean-square displacement of particles from their original lattice sites divided by the lattice spacing; it is small in a solid and large once particles diffuse away from fixed sites. The second is the mean coordination number, how many neighbours each particle has within 1.5σ; it is around 6 in a close-packed solid or liquid and near zero once a particle is alone in the gas phase.

The two parameters together give the state:

- mean coordination below 2 means a gas, with particles mostly isolated
- high coordination with $δ < 1.0$ means a solid, with particles vibrating about fixed sites
- high coordination with $δ ≥ 1.0$ means a liquid, with particles flowing past each other but staying cohesive

Textbook references quote δ ≈ 0.1–0.15 as the bulk-solid melting threshold. A cluster this small, though, vibrates with much larger amplitude than a bulk crystal even while its coordination stays fully intact, because small clusters are floppier than bulk solids. That is a finite-size effect rather than a flaw in the model, so the threshold used here was recalibrated against this simulation's own coordination data instead of being borrowed from the literature.

The temperature is also shown in Kelvin using argon's real Lennard-Jones parameters (ε/kB ≈ 120 K) to give a physical sense of scale. This is a small cluster of about 100 particles in a vacuum rather than a bulk liquid at atmospheric pressure, so the temperature at which it visibly melts or evaporates won't exactly match argon's textbook melting and boiling points. The underlying physics is the same, though: the competition between attraction and thermal energy is what sets those real transition temperatures too.

Particle count rebuilds the lattice at a new size, applied when you release the slider.

Interaction strength (ε) scales how deep the attractive well is. Turn it down to model a weakly bound substance such as a noble gas, which melts and evaporates at low temperature, or up to model something more strongly bound such as a metal, which stays solid at much higher T. The temperature axis itself doesn't move when you change ε, and that is the point: the same thermal energy now competes against a different bond strength.

Gravity adds a constant downward force on top of the interparticle forces. Turn it up and the solid or liquid packs down harder against the floor; turn it to zero and the cluster floats freely, held together by nothing but its own attraction.

Start Temperature Sweep resets to a cold solid and then adds kinetic energy at a constant rate, mimicking a constant-power heater. Because the energy input is constant, any energy that goes into breaking intermolecular bonds during a phase transition is not available to raise the kinetic temperature, so T* plateaus on the heating curve. The width of each plateau is proportional to the latent heat for that transition. In this Lennard-Jones system, evaporation absorbs roughly 20–25× more energy than melting, so the boiling plateau is much wider than the melting plateau, exactly as in real substances.
