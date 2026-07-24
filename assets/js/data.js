/* =========================================================
   CONTENT DATA
   Add a simulation: add an object to `simulations`.
     - topic groups it into a collapsible category
     - file: path to your simulation's HTML (leave "" for a placeholder)
     - added: "YYYY-MM-DD" the sim was published (optional). Shows a
       "New" badge next to it on the sims list and home page for
       NEW_BADGE_DAYS days afterwards, then stops on its own — no
       need to remember to remove a flag later.
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
   ========================================================= */

const simulations = [
  { id:"phase-transitions-sim", title:"State Changes", topic:"Kinetic Theory of Matter", level:"GCSE",
    desc:"Simulations of particles and their state changes.", featured:true, file:"simulations/phase-transitions-sim.html", notes:"simulations/notes/phase-transitions-sim.md" },
  { id:"rates-collision-sim", title:"Collision Theory", topic:"Rates/Kinetics", level:"GCSE",
    desc:"How concentration, temperature and surface area affect the rate of reaction shown using collision theory", featured:true, file:"simulations/rates-collision-sim.html",
    notes:"simulations/notes/rates-collision-sim.md" },
  { id:"maxwell-boltzmann", title:"Maxwell–Boltzmann Distribution", topic:"Rates/Kinetics", level:"A-level",
    desc:"Distribution of molecular speeds and how it shifts with temperature.", featured:true, file:"simulations/mb-sim.html",
    notes:"simulations/notes/maxwell-boltzmann.md" },

  // { id:"rates-collision", title:"Collision Theory & Rates", topic:"Kinetics", level:"GCSE",
  //   desc:"How concentration, temperature and catalysts affect the rate of reaction.", featured:false, file:"", notes:"" },
  { id:"eqm-sim", title:"Chemical Equilibrium", topic:"Equilibrium", level:"A-level",
    desc:"Concentration, rate and reaction quotient over time. Allows equilibrium to be disturbed to see how it is restored.", featured:true, file:"simulations/eqm-sim.html", notes:"" },
  // { id:"le-chatelier", title:"Le Chatelier's Principle", topic:"Equilibrium", level:"A-level",
  //   desc:"Shift a reversible reaction by changing pressure, concentration and temperature.", featured:false, file:"", notes:"" },
  { id:"diffusion-tube-sim", title:"HCl and NH3 Diffusion Tube", topic:"Kinetic Theory of Matter", level:"GCSE",
    desc:"Animated diffusion tube for the reaction between hydrogen chloride and ammonia. Temperature, air particles and reactant particles can be adjusted.", featured:true, file:"simulations/diffusion-tube-sim.html", notes:"" },
  { id:"ph-curve-sim", title:"Acid–Base Titration", topic:"Acids & Bases", level:"A-level",
    desc:"Pick the substances in the burette and conical flask (HCl, H2SO4, ethanoic acid, NaOH, ammonia), run a virtual titration and plot the pH curve.", featured:true, file:"simulations/ph-curve-sim.html",
    notes:"simulations/notes/ph-curve-sim.md", added:"2026-07-24" },
    { id:"curly-arrows-sim", title:"Organic Mechanisms", topic:"Organic", level:"A-Level",
    desc:"Interactive diagrams of organic reaction mechanisms on the A-Level syllabus. Shows the actual products for incorrect arrows.", featured:true, file:"simulations/curly-arrows-sim.html", notes:"" },
    { id:"ao-density-sim", title:"Atomic Orbitals Density", topic:"Quantum", level:"Pre-University",
    desc:"Density plots of atomic orbitals as electron positions are sampled.", featured:true, file:"simulations/ao-density-sim.html",
    notes:"simulations/notes/ao-density-sim.md" },
    { id:"mo-formation-sim", title:"Molecular Orbital Formation - Hydrogen", topic:"Quantum", level:"Pre-University",
    desc:"Formation of molecular orbitals from two 1s orbitals.", featured:true, file:"simulations/mo-formation-sim.html",
    notes:"simulations/notes/mo-formation-sim.md", added:"2026-07-23" },
    { id:"mo-formation-sp-sim", title:"Molecular Orbital Formation - s and p Orbitals", topic:"Quantum", level:"Pre-University",
    desc:"Formation of molecular orbitals from two 1s and 2p orbitals.", featured:true, file:"simulations/mo-formation-sp-sim.html",
    notes:"simulations/notes/mo-formation-sp-sim.md", added:"2026-07-23" },
    { id:"mo-formation-homonuclear-sim", title:"Molecular Orbital Formation - Homonuclear Diatomic Molecules", topic:"Quantum", level:"Pre-University",
    desc:"Molecular orbital diagrams for Period 2 homonuclear diatomic molecules.", featured:true, file:"simulations/mo-formation-homonuclear-sim.html",
    notes:"simulations/notes/mo-formation-homonuclear-sim.md", added:"2026-07-23" },
    { id:"mo-formation-heteronuclear-sim", title:"Molecular Orbital Formation - Heteronuclear Diatomic Molecules", topic:"Quantum", level:"Pre-University",
    desc:"Molecular orbital diagrams for Period 2 heteronuclear diatomic molecules — pick any two elements.", featured:true, file:"simulations/mo-formation-heteronuclear-sim.html",
    notes:"simulations/notes/mo-formation-heteronuclear-sim.md", added:"2026-07-24" },
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
];
