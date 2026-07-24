/* =========================================================
   PAGES
   The site shell (index.html) has a single mount point for
   ordinary content pages. Each entry below points at an HTML
   fragment (just the inner markup, no <section> wrapper) and an
   optional init() to run once that fragment is in the DOM — e.g.
   to populate a list from the data in data.js.

   To add a new page (a quizzes page, a links page, ...):
     1. Create pages/<id>.html with the page's inner markup.
     2. Add an entry here. Set hidden:true to leave it out of the
        nav bar while still reachable at #<id>.
   Nothing else needs to change — the nav bar and router are both
   driven by this list.
   ========================================================= */

const PAGES = [
  { id: "home", label: "Home", fragment: "pages/home.html", init: renderFeatured },
  { id: "sims", label: "Simulations", fragment: "pages/sims.html", init: renderSimCategories },
  { id: "resources", label: "Resources", fragment: "pages/resources.html", init: renderResourceCategories },
  // { id: "quizzes", label: "Quizzes", fragment: "pages/quizzes.html", init: renderQuizCategories },
  { id: "about", label: "About", fragment: "pages/about.html" }

];

/* =========================================================
   RENDERING
   ========================================================= */

function uniq(a){ return [...new Set(a)]; }

// A sim shows a "New" badge for this many days after its `added` date.
const NEW_BADGE_DAYS = 30;

function isNewSim(s) {
  if (!s.added) return false;
  const ageMs = Date.now() - Date.parse(s.added);
  return ageMs >= 0 && ageMs < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

function newBadge(s) {
  return isNewSim(s) ? `<span class="new-badge">New</span>` : "";
}

function renderSimCategories() {
  const topics = uniq(simulations.map(s => s.topic));
  const html = topics.map((topic, i) => {
    const items = simulations.filter(s => s.topic === topic);
    const rows = items.map(s => `
      <li>
        <button class="item-row" onclick="openSim('${s.id}')">
          <span class="item-main">
            <span class="item-title">${s.title}</span>${newBadge(s)}<br>
            <span class="item-desc">${s.desc}</span>
          </span>
          <span class="level-tag">${s.level}</span>
          <span class="open-hint">Open &rarr;</span>
        </button>
      </li>`).join("");
    return `
      <details class="category" ${i === 0 ? "open" : ""}>
        <summary>
          <span class="arrow">&#9654;</span>
          <span>${topic}</span>
          <span class="count">${items.length} simulation${items.length>1?"s":""}</span>
        </summary>
        <ul class="cat-list">${rows}</ul>
      </details>`;
  }).join("");
  document.getElementById("simCategories").innerHTML = html;
}

function renderResourceCategories() {
  const html = resources.map((g, i) => {
    const rows = g.items.map(it => `
      <li>
        <div class="res-row">
          <span class="item-main">
            <span class="item-title">${it.title}</span><br>
            <span class="item-desc">${it.desc}</span>
          </span>
          ${it.file
            ? `<a class="dl" href="${it.file}" download>${it.type}</a>`
            : `<span class="dl disabled" title="Add a file path in the data to enable">${it.type}</span>`}
        </div>
      </li>`).join("");
    return `
      <details class="category" ${i === 0 ? "open" : ""}>
        <summary>
          <span class="arrow">&#9654;</span>
          <span>${g.topic}</span>
          <span class="count">${g.items.length} item${g.items.length>1?"s":""}</span>
        </summary>
        <ul class="cat-list">${rows}</ul>
      </details>`;
  }).join("");
  document.getElementById("resourceCategories").innerHTML = html;
}

function renderFeatured() {
  const featured = simulations.filter(s => s.featured);
  document.getElementById("featuredList").innerHTML = featured.map(s => `
    <li>
      <button class="linkish" onclick="openSim('${s.id}')">
        <span>${s.title}</span>${newBadge(s)}
        <span class="meta">${s.topic} · ${s.level}</span>
      </button>
    </li>`).join("");
}

/* ---------- Simulation viewer ---------- */
function renderSim(id) {
  const s = simulations.find(x => x.id === id);
  if (!s) { renderPage("home"); return; }
  document.title = `${s.title} - chemistr.io`;
  document.getElementById("viewerTitle").textContent = s.title;
  const frame = document.getElementById("viewerFrame");
  if (s.file) {
    const iframeEl = document.createElement('iframe');
    iframeEl.src = s.file;
    iframeEl.scrolling = 'no';
    iframeEl.style.cssText = 'width:100%;border:0;display:block;';
    frame.innerHTML = '';
    frame.appendChild(iframeEl);
  } else {
    frame.innerHTML = `
      <div class="placeholder-sim">
        <div>
          <h2>${s.title}</h2>
          <p style="max-width:440px;margin:0 auto;">
            The simulation will load here. To connect it, set the
            <code>file</code> field for <code>"${s.id}"</code> in the data to the
            path of your simulation's HTML file.
          </p>
        </div>
      </div>`;
  }
  loadNotes(s);
  showViewer();
}

/* ---------- Teaching notes (Markdown + LaTeX) ---------- */
const MATH_DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "$", right: "$", display: false },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true }
];

async function loadNotes(s) {
  const sidebar = document.getElementById("notesSidebar");
  const toggle = document.getElementById("notesToggle");
  const content = document.getElementById("notesContent");
  sidebar.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  if (!s.notes) {
    sidebar.style.display = "none";
    content.innerHTML = "";
    return;
  }
  sidebar.style.display = "";
  content.innerHTML = "<p>Loading notes&hellip;</p>";
  try {
    const res = await fetch(s.notes);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const md = await res.text();
    content.innerHTML = marked.parse(md);
    if (window.renderMathInElement) {
      renderMathInElement(content, { delimiters: MATH_DELIMITERS, throwOnError: false });
    }
  } catch (err) {
    content.innerHTML = "<p>Teaching notes couldn't be loaded.</p>";
  }
}

function toggleNotes() {
  const sidebar = document.getElementById("notesSidebar");
  const open = sidebar.classList.toggle("open");
  document.getElementById("notesToggle").setAttribute("aria-expanded", String(open));
}

/* =========================================================
   PAGE LOADING
   Fragments are fetched over HTTP (this needs a local/static web
   server, same as the notes and simulation files already do) and
   cached in memory so repeat visits to a page are instant.
   ========================================================= */

const pageCache = {};

function fetchFragment(page) {
  return fetch(page.fragment)
    .then(res => res.text())
    .then(html => { pageCache[page.id] = html; return html; });
}

function prefetchPages() {
  PAGES.forEach(p => { if (!(p.id in pageCache)) fetchFragment(p); });
}

/* ---------- Navigation ----------
   The URL hash tracks what's on screen (#sims, #resources, #sim/<id>, ...)
   so a refresh or back/forward restores the same view instead of
   always landing on Home. */

function parseHash() {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) return { page: "home" };
  const [first, second] = hash.split("/");
  if (first === "sim" && second) return { page: "viewer", simId: second };
  if (PAGES.some(p => p.id === first)) return { page: first, section: second };
  return { page: "home" };
}

function applyRoute() {
  const route = parseHash();
  if (route.page === "viewer") renderSim(route.simId);
  else renderPage(route.page, route.section);
}

// Public entry points used by onclick handlers: they just change the
// hash; the hashchange listener (and initial applyRoute call) does the
// actual rendering, so back/forward and manual URL edits work too.
function go(page) {
  const target = page === "home" ? "" : "#" + page;
  if (location.hash === target || (target === "" && !location.hash)) {
    applyRoute();
  } else {
    location.hash = target;
  }
}

function openSim(id) {
  const target = "#sim/" + id;
  if (location.hash === target) applyRoute();
  else location.hash = target;
}

// Guards against a slow fragment fetch resolving after a newer
// navigation has already started, which would otherwise clobber it.
let navToken = 0;

async function renderPage(id, section) {
  const page = PAGES.find(p => p.id === id) || PAGES.find(p => p.id === "home");
  const token = ++navToken;

  document.getElementById("page-viewer").classList.remove("active");
  const html = pageCache[page.id] !== undefined ? pageCache[page.id] : await fetchFragment(page);
  if (token !== navToken) return;

  const mount = document.getElementById("pageMount");
  mount.innerHTML = html;
  mount.classList.add("active");
  if (page.init) page.init();
  document.title = page.id === "home" ? "chemistr.io" : `${page.label} - chemistr.io`;

  document.querySelectorAll(".nav-links button").forEach(b =>
    b.classList.toggle("active", b.dataset.nav === page.id));
  document.getElementById("navLinks").classList.remove("open");

  // Deep link to a specific collapsible section (e.g. #about/contact):
  // open it if it's a <details> and scroll it into view, offset for the
  // sticky header, instead of resetting to the top of the page.
  const target = section && document.getElementById(section);
  if (target) {
    if (target.tagName === "DETAILS") target.open = true;
    const y = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: Math.max(y, 0) });
    return;
  }
  window.scrollTo({ top: 0 });
}

function showViewer() {
  document.getElementById("pageMount").classList.remove("active");
  document.getElementById("page-viewer").classList.add("active");
  document.querySelectorAll(".nav-links button").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-nav="sims"]').classList.add("active");
  window.scrollTo({ top: 0 });
}

function renderNav() {
  document.getElementById("navLinks").innerHTML = PAGES
    .filter(p => !p.hidden)
    .map(p => `<button data-nav="${p.id}" onclick="go('${p.id}')">${p.label}</button>`)
    .join("");
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

window.addEventListener("hashchange", applyRoute);

/* ---------- Iframe height via postMessage ---------- */
window.addEventListener('message', (e) => {
  if (!(e.data && e.data.type === 'simHeight')) return;
  const iframe = document.querySelector('#viewerFrame iframe');
  if (!iframe) return;
  if (isViewerFullscreen()) applyFullscreenZoom(iframe, e.data.height);
  else iframe.style.height = e.data.height + 'px';
});

/* ---------- Full screen ----------
   A simulation caps its own content at an intrinsic width (see the
   `.wrap` rule in each simulation file) and just centres itself
   within whatever container it's given, so stretching the iframe to
   fill the screen still leaves it floating in blank space if the
   screen is wider than that cap. Instead, while fullscreen we size
   the iframe to the simulation's own natural width and scale the
   whole thing up with a CSS transform, so it zooms in to fill the
   screen instead of stretching into empty margins. Simulations
   without a recognisable `.wrap` max-width just fall back to a
   plain 100% stretch, same as before. */
const EXPAND_PATH = "M1 5V1h4M9 1h4v4M13 9v4h-4M5 13H1V9";
const COMPRESS_PATH = "M5 1v4H1M13 5H9V1M9 13v-4h4M1 9h4v4";

function toggleFullscreen() {
  const frame = document.getElementById('viewerFrame');
  if (!document.fullscreenElement) {
    (frame.requestFullscreen || frame.webkitRequestFullscreen).call(frame);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }
}

function isViewerFullscreen() {
  const frame = document.getElementById('viewerFrame');
  return document.fullscreenElement === frame || document.webkitFullscreenElement === frame;
}

function getNaturalContentWidth(iframe) {
  try {
    const doc = iframe.contentDocument;
    const wrap = doc && doc.querySelector('.wrap');
    const mw = wrap && parseFloat(getComputedStyle(wrap).maxWidth);
    return mw && isFinite(mw) ? mw : null;
  } catch (err) {
    return null; // cross-origin iframe — can't inspect it, so don't zoom
  }
}

// Reads the simulation's own rendered height directly rather than
// waiting for its postMessage('simHeight') report: each simulation
// implements that report differently (some debounce a window resize
// listener, some use a ResizeObserver, timings vary), so waiting on
// it to land before zooming in was unreliable — most simulations
// just sat at their unscaled natural size instead of filling the
// screen. Reading contentDocument's scrollHeight forces a synchronous
// layout flush of the iframe's document, so as long as the width has
// already been set, this reflects the height at that width immediately.
function measureNaturalContentHeight(iframe) {
  try {
    const doc = iframe.contentDocument;
    if (!doc) return null;
    const h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
    return h || null;
  } catch (err) {
    return null; // cross-origin iframe — can't inspect it
  }
}

// The iframe is `position: absolute; top: 50%; left: 50%` (see
// site.css) so its own top-left sits at the container's centre; it
// then needs pulling back by half its own size to actually centre
// it. That pull-back used to be a `translate(-50%, -50%)`, but a
// percentage translate is resolved against the iframe's own
// just-changed width/height, and Firefox is more prone than Chromium
// to resolving that against a not-yet-settled box mid-transition,
// throwing the centring off. Since the target width/height are
// already known values here, offsetWidth/offsetHeight (which force a
// layout flush, so they reflect the size we just set) let us pull
// back by an exact pixel amount instead, leaving nothing for either
// engine to get wrong.
function centerTransform(iframe) {
  return 'translate(' + (-iframe.offsetWidth / 2) + 'px, ' + (-iframe.offsetHeight / 2) + 'px)';
}

function applyFullscreenZoom(iframe, height) {
  const naturalW = getNaturalContentWidth(iframe);
  if (!naturalW) {
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.transform = centerTransform(iframe);
    return;
  }
  iframe.style.width = naturalW + 'px';
  iframe.style.height = height + 'px';
  // Measure the actual fullscreen container rather than trusting
  // window.innerWidth/innerHeight: some browsers briefly disagree
  // between the two during the fullscreen transition, which would
  // scale the iframe relative to a different box than the one it's
  // actually centred in, throwing the zoom off-centre.
  const box = document.getElementById('viewerFrame').getBoundingClientRect();
  const scale = Math.min(box.width / naturalW, box.height / height);
  iframe.style.transform = centerTransform(iframe) + ' scale(' + scale + ')';
}

document.addEventListener('fullscreenchange', onFullscreenChange);
document.addEventListener('webkitfullscreenchange', onFullscreenChange);

function onFullscreenChange() {
  updateFsButton();
  const iframe = document.querySelector('#viewerFrame iframe');
  if (!iframe) return;
  if (isViewerFullscreen()) {
    const naturalW = getNaturalContentWidth(iframe);
    if (naturalW) {
      // Set the width first so the height measured just below already
      // reflects layout at that width, then zoom immediately — see
      // measureNaturalContentHeight() for why we don't wait on the
      // simulation's own postMessage height report here.
      iframe.style.width = naturalW + 'px';
      const height = measureNaturalContentHeight(iframe);
      if (height) applyFullscreenZoom(iframe, height);
      else iframe.style.transform = centerTransform(iframe);
    }
  } else {
    iframe.style.width = '100%';
    iframe.style.transform = 'none';
  }
}

function updateFsButton() {
  const active = !!document.fullscreenElement;
  document.getElementById('fsLabel').textContent = active ? 'Exit full screen' : 'Full screen';
  document.getElementById('fsIcon').querySelector('path').setAttribute('d', active ? COMPRESS_PATH : EXPAND_PATH);
}

/* ---------- Init ---------- */
renderNav();
applyRoute();
prefetchPages();
