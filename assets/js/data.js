/* =========================================================
   CONTENT DATA
   Add a simulation: add an object to `simulations`.
     - topic groups it into a collapsible category. The categories
       appear on the sims page in the order given by `topicOrder`
       below; any topic missing from that list is appended after the
       listed ones, in the order it first appears in `simulations`.
     - file: path to your simulation's HTML (leave "" for a placeholder)
     - added: "YYYY-MM-DD" the sim was published (optional). Shows a
       "New" badge next to it on the sims list and home page for
       NEW_BADGE_DAYS days afterwards, then stops on its own — no
       need to remember to remove a flag later.
     - tour: true to show a "Take the tour" button in the viewer bar
       for a simulation that calls ChemTour.init(...) in its own
       script (see assets/js/tour.js).
     - seoTitle: a shorter stand-in for `title`, used only in the
       <title> tag that scripts/build-seo-pages.js generates. Set it
       when the real title would push that tag past ~60 characters
       and get truncated in search results; the on-page heading and
       the site's own lists always use `title`. The build prints a
       warning listing any titles that are still over.
     - notes: path to a Markdown file with teaching notes for the
       viewer's "Teaching notes" panel (leave "" to hide the panel).
       LaTeX is supported inside notes files: use $...$ for inline
       maths and $$...$$ for display maths.
       For a question with its answer hidden behind a "show answer"
       toggle, write plain HTML directly in the .md file:
         <details class="qa">
         <summary>Show answer</summary>

         The answer, in **Markdown** with $LaTeX$ if needed.

         </details>
       The blank lines around the answer are required — they're what
       makes the Markdown parser treat that line as its own paragraph
       (and so still render bold/italic/maths) instead of swallowing
       it as part of the raw <details> HTML.
   Add a resource: add an object to `resources`.
     - file: path to the PDF (leave "" to disable the download link)
     - url: link to an external website instead of a file — opens in a
       new tab rather than downloading. If both are set, url wins.
       e.g. { title:"RSC Periodic Table", type:"Website", desc:"...",
              url:"https://www.rsc.org/periodic-table" }
   ========================================================= */

// Order of the collapsible topic categories on the sims page. The
// first one is opened by default. A topic not listed here still shows
// up, after these, so a typo can't hide a simulation.
const topicOrder = [
  "Kinetic Theory of Matter",
    "Atomic Structure",
      "Bonding & Structure",
        "Organic",
        "Acids & Bases",
  "Rates/Kinetics",
  "Equilibrium",



  "Quantum",

];

const simulations = [
  { id:"phase-transitions-sim", title:"State Changes", topic:"Kinetic Theory of Matter", level:"GCSE",
    desc:"Simulations of particles and their state changes.", featured:true, file:"/simulations/phase-transitions-sim.html", notes:"/simulations/notes/phase-transitions-sim.md", tour:true },
  { id:"rates-collision-sim", title:"Collision Theory", topic:"Rates/Kinetics", level:"GCSE",
    desc:"How concentration, temperature and surface area affect the rate of reaction shown using collision theory", file:"/simulations/rates-collision-sim.html",
    notes:"/simulations/notes/rates-collision-sim.md" },
  { id:"maxwell-boltzmann", title:"Maxwell–Boltzmann Distribution", topic:"Rates/Kinetics", level:"A-level",
    desc:"Distribution of molecular speeds and how it shifts with temperature.", featured:true, file:"/simulations/mb-sim.html",
    notes:"/simulations/notes/maxwell-boltzmann.md" },

  // { id:"rates-collision", title:"Collision Theory & Rates", topic:"Kinetics", level:"GCSE",
  //   desc:"How concentration, temperature and catalysts affect the rate of reaction.", featured:false, file:"", notes:"" },
  { id:"eqm-sim", title:"Chemical Equilibrium", topic:"Equilibrium", level:"A-level",
    desc:"See how concentrations, rates and the reaction quotient change over time for different equilibria. Allows the equilibrium to be disturbed to see how it is restored.", featured:true, file:"/simulations/eqm-sim.html", notes:"" },
  // { id:"le-chatelier", title:"Le Chatelier's Principle", topic:"Equilibrium", level:"A-level",
  //   desc:"Shift a reversible reaction by changing pressure, concentration and temperature.", featured:false, file:"", notes:"" },
  { id:"diffusion-tube-sim", title:"HCl and NH3 Diffusion Tube", topic:"Kinetic Theory of Matter", level:"GCSE",
    desc:"Animated diffusion tube for the reaction between hydrogen chloride and ammonia. Temperature, air particles and reactant particles can be adjusted.", file:"/simulations/diffusion-tube-sim.html", notes:"/simulations/notes/diffusion-tube-sim.md" },
  { id:"brownian-motion-sim", title:"Brownian Motion", topic:"Kinetic Theory of Matter", level:"GCSE",
    desc:"Brown's 1827 experiment of a pollen grain moving on the surface of water.", file:"/simulations/brownian-motion-sim.html", notes:"/simulations/notes/brownian-motion-sim.md", added:"2026-08-04" },
  { id:"covalent-bonding-sim", title:"Covalent Bonding", topic:"Bonding & Structure", level:"GCSE",
    desc:"Drag atoms together to share electrons and build simple molecules. Dot-and-cross diagrams form as the outer shells overlap, and each atom stops bonding once its outer shell is full.", file:"/simulations/covalent-bonding-sim.html", notes:"", added:"2026-09-19" },
  { id:"giant-structures-sim", title:"Simple Molecules and Giant Structures", seoTitle:"Molecules vs Giant Structures", topic:"Bonding & Structure", level:"GCSE",
    desc:"A simple, 2D illustration of the different between simple and giant structures.Zoom out from a single particle to a whole crystal, side by side, and trace the connections between particles through the lattice.", file:"/simulations/giant-structures-sim.html", notes:"", added:"2026-09-13" },
  { id:"molecule-shapes-sim", title:"Shapes of Molecules (VSEPR)", topic:"Bonding & Structure", level:"A-level",
    desc:"Shapes of simple molecules up to six electron pairs. Electron pairs can be moved to show their repulsion. Bond angles and geometries calculated using VSEPR theory.", featured:true, file:"/simulations/molecule-shapes-sim.html",
    notes:"/simulations/notes/molecule-shapes-sim.md", added:"2026-08-06", tour:true },
  { id:"ph-curve-sim", title:"Acid–Base Titration", topic:"Acids & Bases", level:"A-level",
    desc:"Run a virtual titration for a range of acids, alkalis and indicators, and plot the pH curve.", featured:true, file:"/simulations/ph-curve-sim.html",
    notes:"/simulations/notes/ph-curve-sim.md", added:"2026-07-24" },
  { id:"buffer-sim", title:"Buffer Solutions", topic:"Acids & Bases", level:"A-level",
    desc:"Add acid or base to a buffer and and compare to water and an unbuffered solution.", featured:true, file:"/simulations/buffer-sim.html",
    notes:"/simulations/notes/buffer-sim.md", added:"2026-07-27", tour:true },
  { id:"weak-acid-sim", title:"Weak Acid pH — Approximation vs Exact", seoTitle:"Weak Acid pH Calculations", topic:"Acids & Bases", level:"A-level",
    desc:"Compare the simplifying assumption [H+]=[A-], [HA]=[HA]0 against the exact pH for a weak acid. Ka and acid concentration can be varied.", featured:true, file:"/simulations/weak-acid-sim.html",
    notes:"/simulations/notes/weak-acid-sim.md", added:"2026-07-27" },
    { id:"curly-arrows-sim", title:"Organic Mechanisms", topic:"Organic", level:"A-Level",
    desc:"Interactive diagrams of organic reaction mechanisms on the A-Level syllabus and beyond. Shows the actual products for incorrect arrows.", featured:true, file:"/simulations/curly-arrows-sim.html", notes:"/simulations/notes/curly-arrows-sim.md" },
    { id:"ao-density-sim", title:"Atomic Orbitals Density", seoTitle:"Atomic Orbitals", topic:"Quantum", level:"Pre-University",
    desc:"Density plots of atomic orbitals as electron positions are sampled.", file:"/simulations/ao-density-sim.html",
    notes:"/simulations/notes/ao-density-sim.md" },
    { id:"mo-formation-sim", title:"Molecular Orbital Formation - Hydrogen", seoTitle:"Molecular Orbitals: Hydrogen", topic:"Quantum", level:"Pre-University",
    desc:"Formation of molecular orbitals from two 1s orbitals for hydrogen and helium molecules.", file:"/simulations/mo-formation-sim.html",
    notes:"/simulations/notes/mo-formation-sim.md", added:"2026-07-23" },
    { id:"mo-formation-sp-sim", title:"Molecular Orbital Formation - s and p Orbitals", seoTitle:"Molecular Orbitals: s and p", topic:"Quantum", level:"Pre-University",
    desc:"Formation of molecular orbitals from two 1s and 2p orbitals.", file:"/simulations/mo-formation-sp-sim.html",
    notes:"/simulations/notes/mo-formation-sp-sim.md", added:"2026-07-23" },
    { id:"mo-formation-homonuclear-sim", title:"Molecular Orbital Formation - Homonuclear Diatomic Molecules", seoTitle:"Molecular Orbitals: Homonuclear", topic:"Quantum", level:"Pre-University",
    desc:"Molecular orbital diagrams for H₂ and the Period 2 homonuclear diatomic molecules.", featured:true, file:"/simulations/mo-formation-homonuclear-sim.html",
    notes:"/simulations/notes/mo-formation-homonuclear-sim.md", added:"2026-07-23" },
    { id:"mo-formation-heteronuclear-sim", title:"Molecular Orbital Formation - Heteronuclear Diatomic Molecules", seoTitle:"Molecular Orbitals: Heteronuclear", topic:"Quantum", level:"Pre-University",
    desc:"Molecular orbital diagrams for Period 2 heteronuclear diatomic molecules.",  file:"/simulations/mo-formation-heteronuclear-sim.html",
    notes:"/simulations/notes/mo-formation-heteronuclear-sim.md", added:"2026-07-24" },
  { id:"electronic-structure-sim", title:"Electronic Structure", topic:"Atomic Structure", level:"GCSE",
    desc:"Electron shell diagram for every element up to calcium. Step from one element to the next to watch the shells fill by the 2,8,8 rule, see how the outer shell fixes the group, and add or remove electrons to form ions.", file:"/simulations/electronic-structure-sim.html", notes:"", added:"2026-09-20" },
  { id:"electron-config-sim", title:"Electron Configuration", topic:"Atomic Structure", level:"A-level",
    desc:"Orbital energy-level diagram for every element up to krypton. Step from one element to the next to watch electrons fill shells, sub-shells and orbitals by the Aufbau principle and Hund's rule, and add or remove electrons to form ions.", featured:true, file:"/simulations/electron-config-sim.html", notes:"", added:"2026-09-16" },
    { id:"ms-deflection-sim", title:"Mass Spectrometry - Deflection", seoTitle:"Mass Spectrometry - Deflection", topic:"Atomic Structure", level:"A-Level",
    desc:"Simulation of deflection-based mass spectrometry.",  file:"/simulations/ms-deflection-sim.html",
    notes:"", added:"2026-09-16" },
];

const resources = [
  // { topic:"Formulae & Equations (Edexcel IGCSE)", items:[
  //   { title:"Structured Workbook", type:"PDF", desc:"Worked examples and graded practice.", file:"" },
  //   { title:"Extension Booklet", type:"PDF", desc:"Harder content for stretch and challenge.", file:"" },
  //   { title:"Single-sheet Handout", type:"PDF", desc:"Minimal one-page classroom reference.", file:"" }
  // ]},
  // { topic:"Kinetics", items:[
  //   { title:"Rates of Reaction — Practice Set", type:"PDF", desc:"Exam-style questions on factors affecting rate.", file:"" },
  //   { title:"Maxwell–Boltzmann Worksheet", type:"PDF", desc:"Accompanies the distribution simulation.", file:"" }
  // ]},
  // { topic:"Equilibrium", items:[
  //   { title:"Equilibrium Problem Booklet", type:"PDF", desc:"Kc and Le Chatelier problems with answers.", file:"" }
  // ]},
  // { topic:"Competition Preparation", items:[
  //   { title:"C3L6 Extension Notes", type:"PDF", desc:"Beyond-A-level topics for the Cambridge Chemistry Challenge.", file:"" }
  // ]}
  { topic:"Recommended Books", items:[
    { title:"Why Chemical Reactions Happen by Keeler and Wothers", type:"Visit Website", desc:"Excellent pre-university transition textbook for A-Level students", url:"https://global.oup.com/academic/product/why-chemical-reactions-happen-9780199249732?cc=gb&lang=en&"}
  ]},
  { topic:"Useful Links", items:[
    { title:"Cambridge Chemistry Challenge Lower Sixth", type:"Visit Website", desc:"Extension competition for Lower Sixth students.", url:"https://www.c3l6.com"},
    { title:"UK Chemistry Olympiad", type:"Visit Website", desc:"Extension competition for Upper Sixth students.", url:"https://www.rsc.org/competitions/uk-chemistry-olympiad/"},
  ]}
];

// Lets scripts/build-seo-pages.js read this data with plain `require()`
// without loading it as a browser script (where `module` is undefined).
if (typeof module !== "undefined") module.exports = { simulations, resources, topicOrder };
