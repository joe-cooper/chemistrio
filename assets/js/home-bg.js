// Faint decorative background for the homepage: drifting H2O molecules
// that gently collide and flicker a dashed hydrogen bond when a
// hydrogen atom of one molecule swings close to the oxygen of another.
// Purely cosmetic - no interaction, paused whenever the home page isn't
// visible so it costs nothing on other pages or tabs.
(function () {
  const ENABLED = false; // flip to true to re-enable the homepage background

  const canvas = document.getElementById("homeBgCanvas");
  if (!ENABLED || !canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  const BOND_ANGLE = (104.5 * Math.PI) / 180;
  const OH_LEN = 15;
  const R_O = 5.5;
  const R_H = 3;
  const COLLIDE_DIST = 30;
  const BOND_DIST = 85;
  const BOND_STRENGTH = 0.00004; // attractive accel scale, tapered by distance + alignment
  const TORQUE_STRENGTH = 0.000012; // restoring torque toward a linear O-H...O:lone-pair geometry
  const MAX_SPEED = 0.07;
  const MAX_VANGLE = 0.004;
  const DAMPING = 0.999;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0, height = 0, dpr = 1;
  let molecules = [];
  let rafId = null;
  let running = false;
  let lastT = 0;

  function themeColor(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeMolecule() {
    const speed = 0.012 + Math.random() * 0.018;
    const dir = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.0006,
    };
  }

  function initMolecules() {
    const count = Math.max(6, Math.min(16, Math.round((width * height) / 55000)));
    molecules = Array.from({ length: count }, makeMolecule);
  }

  function atomPositions(m) {
    const a1 = m.angle - BOND_ANGLE / 2;
    const a2 = m.angle + BOND_ANGLE / 2;
    return {
      ox: m.x, oy: m.y,
      h1x: m.x + Math.cos(a1) * OH_LEN, h1y: m.y + Math.sin(a1) * OH_LEN,
      h2x: m.x + Math.cos(a2) * OH_LEN, h2y: m.y + Math.sin(a2) * OH_LEN,
    };
  }

  // Nearest H...O approach between two molecules - the candidate a
  // hydrogen bond would form along. Each candidate also carries the
  // donor's H-offset angle (which of its two H's) so torque/alignment
  // can be computed against the actual O-H bond direction.
  function nearestHBond(atomsI, atomsJ) {
    const A = atomsI, B = atomsJ;
    const candidates = [
      { hx: A.h1x, hy: A.h1y, ox: B.ox, oy: B.oy, donor: "i", hOffset: -BOND_ANGLE / 2 },
      { hx: A.h2x, hy: A.h2y, ox: B.ox, oy: B.oy, donor: "i", hOffset: BOND_ANGLE / 2 },
      { hx: B.h1x, hy: B.h1y, ox: A.ox, oy: A.oy, donor: "j", hOffset: -BOND_ANGLE / 2 },
      { hx: B.h2x, hy: B.h2y, ox: A.ox, oy: A.oy, donor: "j", hOffset: BOND_ANGLE / 2 },
    ];
    let best = null, bestDist = Infinity;
    for (const c of candidates) {
      const d = Math.hypot(c.ox - c.hx, c.oy - c.hy);
      if (d < bestDist) { bestDist = d; best = c; }
    }
    return { best, bestDist };
  }

  // How close the approach is to an ideal linear hydrogen bond: the
  // donor O-H bond pointing straight at the acceptor O, and the
  // acceptor's lone-pair direction (opposite the bisector of its own
  // H-O-H) pointing straight back at the donor H. Both dot products
  // are 1 only when everything is collinear; each is clamped to 0 so
  // bonds approaching from the "wrong side" contribute nothing.
  function alignmentFactor(best, donorAngle, acceptorAngle) {
    const hAngle = donorAngle + best.hOffset;
    const donorVecX = Math.cos(hAngle), donorVecY = Math.sin(hAngle);
    const bondLen = Math.hypot(best.ox - best.hx, best.oy - best.hy) || 0.001;
    const bondVecX = (best.ox - best.hx) / bondLen, bondVecY = (best.oy - best.hy) / bondLen;
    const donorAlign = Math.max(0, donorVecX * bondVecX + donorVecY * bondVecY);

    const lonePairAngle = acceptorAngle + Math.PI;
    const lpVecX = Math.cos(lonePairAngle), lpVecY = Math.sin(lonePairAngle);
    const incomingVecX = -bondVecX, incomingVecY = -bondVecY;
    const acceptorAlign = Math.max(0, incomingVecX * lpVecX + incomingVecY * lpVecY);

    return { factor: donorAlign * acceptorAlign, hAngle, bondAngle: Math.atan2(bondVecY, bondVecX), lonePairAngle, incomingAngle: Math.atan2(incomingVecY, incomingVecX) };
  }

  function step(dt) {
    const margin = OH_LEN + R_O + 4;
    const atoms = molecules.map(atomPositions);
    const ax = new Array(molecules.length).fill(0);
    const ay = new Array(molecules.length).fill(0);
    const torque = new Array(molecules.length).fill(0);
    const bonds = [];

    for (let i = 0; i < molecules.length; i++) {
      for (let j = i + 1; j < molecules.length; j++) {
        const a = molecules[i], b = molecules[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;

        if (dist < COLLIDE_DIST) {
          // Elastic collision, equal masses: swap the velocity
          // component along the line of centres, then separate the
          // circles so they don't keep overlapping next frame.
          const nx = dx / dist, ny = dy / dist;
          const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
          const rvn = rvx * nx + rvy * ny;
          if (rvn < 0) {
            a.vx += rvn * nx; a.vy += rvn * ny;
            b.vx -= rvn * nx; b.vy -= rvn * ny;
          }
          const overlap = (COLLIDE_DIST - dist) / 2;
          a.x -= nx * overlap; a.y -= ny * overlap;
          b.x += nx * overlap; b.y += ny * overlap;
        } else {
          const { best, bestDist } = nearestHBond(atoms[i], atoms[j]);
          if (bestDist < BOND_DIST) {
            const donorIdx = best.donor === "i" ? i : j;
            const acceptorIdx = best.donor === "i" ? j : i;
            const donorAngle = molecules[donorIdx].angle;
            const acceptorAngle = molecules[acceptorIdx].angle;
            const align = alignmentFactor(best, donorAngle, acceptorAngle);
            const distFactor = 1 - bestDist / BOND_DIST;

            bonds.push({ best, bestDist, directionFactor: align.factor });

            // Attractive pull along the H...O line, scaled by how
            // linear the approach is - a broadside approach barely
            // pulls at all, a head-on one pulls at full strength.
            // Applied equal-and-opposite so momentum stays conserved.
            const ux = (best.ox - best.hx) / bestDist, uy = (best.oy - best.hy) / bestDist;
            const strength = BOND_STRENGTH * distFactor * align.factor;
            ax[donorIdx] += ux * strength; ay[donorIdx] += uy * strength;
            ax[acceptorIdx] -= ux * strength; ay[acceptorIdx] -= uy * strength;

            // Gentle restoring torque, independent of current
            // alignment, turning the donor's O-H to face the acceptor
            // O and the acceptor's lone pair to face back - this is
            // what makes near molecules swing into a linear geometry.
            const donorTorque = Math.sin(align.bondAngle - align.hAngle);
            const acceptorTorque = Math.sin(align.incomingAngle - align.lonePairAngle);
            torque[donorIdx] += donorTorque * TORQUE_STRENGTH * distFactor;
            torque[acceptorIdx] += acceptorTorque * TORQUE_STRENGTH * distFactor;
          }
        }
      }
    }

    for (let i = 0; i < molecules.length; i++) {
      const m = molecules[i];
      m.vx = (m.vx + ax[i] * dt) * DAMPING;
      m.vy = (m.vy + ay[i] * dt) * DAMPING;
      const speed = Math.hypot(m.vx, m.vy);
      if (speed > MAX_SPEED) { m.vx = (m.vx / speed) * MAX_SPEED; m.vy = (m.vy / speed) * MAX_SPEED; }

      m.vAngle += torque[i] * dt;
      if (m.vAngle > MAX_VANGLE) m.vAngle = MAX_VANGLE;
      if (m.vAngle < -MAX_VANGLE) m.vAngle = -MAX_VANGLE;

      m.x += m.vx * dt;
      m.y += m.vy * dt;
      m.angle += m.vAngle * dt;

      if (m.x < margin) { m.x = margin; m.vx = Math.abs(m.vx); }
      if (m.x > width - margin) { m.x = width - margin; m.vx = -Math.abs(m.vx); }
      if (m.y < margin) { m.y = margin; m.vy = Math.abs(m.vy); }
      if (m.y > height - margin) { m.y = height - margin; m.vy = -Math.abs(m.vy); }
    }

    return bonds;
  }

  function draw(bonds) {
    const oColor = themeColor("--accent", "#d9735f");
    const hColor = themeColor("--text", "#e6ebf2");
    const bondColor = themeColor("--gold", "#e0a68a");

    ctx.clearRect(0, 0, width, height);
    const atoms = molecules.map(atomPositions);

    // Hydrogen bonds first, so molecules draw on top of them.
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    for (const { best, bestDist, directionFactor } of bonds) {
      if (directionFactor < 0.05) continue;
      const t = (1 - bestDist / BOND_DIST) * directionFactor;
      ctx.globalAlpha = 0.05 + t * 0.4;
      ctx.strokeStyle = bondColor;
      ctx.beginPath();
      ctx.moveTo(best.hx, best.hy);
      ctx.lineTo(best.ox, best.oy);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Molecules.
    for (const a of atoms) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = hColor;
      ctx.beginPath(); ctx.arc(a.h1x, a.h1y, R_H, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(a.h2x, a.h2y, R_H, 0, Math.PI * 2); ctx.fill();

      ctx.globalAlpha = 0.5;
      ctx.fillStyle = oColor;
      ctx.beginPath(); ctx.arc(a.ox, a.oy, R_O, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(t) {
    if (!running) return;
    const dt = lastT ? Math.min(t - lastT, 50) : 16;
    lastT = t;
    const bonds = step(dt);
    draw(bonds);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    resize();
    if (!molecules.length) initMolecules();
    running = true;
    lastT = 0;
    if (reduceMotion) { draw([]); return; }
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  window.addEventListener("resize", () => {
    if (!running) return;
    resize();
  });
  document.addEventListener("visibilitychange", () => {
    if (!running) return;
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!reduceMotion) {
      lastT = 0;
      rafId = requestAnimationFrame(frame);
    }
  });

  window.homeBg = { start, stop };
})();
