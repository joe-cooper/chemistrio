/* =========================================================
   Guided walkthrough ("tour") engine
   Shared by any simulation that wants a step-by-step, Next/Previous
   walkthrough of its own controls. Include this after theme.js.

   A simulation opts in by calling, at the end of its own script:
     ChemTour.init([
       { target: '#someSlider', title: '...', body: '...',
         before: (dir) => { ... optionally change a parameter ... } },
       { target: null, title: '...', body: '...' },   // no spotlight
       ...
     ]);

   `target` is a CSS selector resolved in this document; `null` shows a
   plain centred card with no spotlight (intro/outro steps). `before`
   runs every time the step becomes active, in either direction, so a
   step can demonstrate its point by driving the sim's own controls --
   e.g. set a slider's value and dispatch the same 'input' event a
   real drag would fire, reusing the sim's existing recompute path
   with no extra hook needed inside the sim itself.

   Like theme.js, this only injects its own floating trigger button
   when running standalone (window.self === window.top); when embedded
   in the site's viewer iframe, the parent page's own "Take the tour"
   button in the viewer bar calls ChemTour.start() directly.
   ========================================================= */
(function () {
  "use strict";

  var steps = [];
  var current = -1;
  var els = null; // overlay/card built lazily on first start()
  var styleBuilt = false;

  function buildStyle() {
    if (styleBuilt) return;
    styleBuilt = true;
    var style = document.createElement("style");
    style.textContent =
      "#tour-spotlight{position:fixed;z-index:9997;border-radius:6px;" +
      "box-shadow:0 0 0 9999px rgba(0,0,0,.6), 0 0 0 2px var(--gold), 0 0 14px 2px var(--gold);" +
      "pointer-events:none;transition:top .2s,left .2s,width .2s,height .2s;}" +
      "#tour-card{position:fixed;z-index:9998;max-width:320px;background:var(--surface);" +
      "color:var(--text);border:1px solid var(--border);border-radius:8px;" +
      "padding:14px 16px;font-family:var(--font);box-shadow:0 8px 28px rgba(0,0,0,.35);" +
      "transition:top .2s,left .2s;}" +
      "#tour-card h3{margin:0 0 6px;font-size:14px;font-weight:600;color:var(--gold);}" +
      "#tour-card p{margin:0;font-size:12.5px;line-height:1.55;color:var(--text);}" +
      "#tour-card .tour-foot{display:flex;align-items:center;gap:8px;margin-top:12px;}" +
      "#tour-card .tour-count{font-family:var(--mono);font-size:10.5px;color:var(--muted-dim);}" +
      "#tour-card .tour-spacer{flex:1;}" +
      "#tour-card button{font-family:var(--font);font-weight:600;font-size:11.5px;" +
      "letter-spacing:.02em;cursor:pointer;border-radius:4px;padding:6px 11px;" +
      "border:1px solid var(--border);background:transparent;color:var(--muted);" +
      "transition:color .15s,border-color .15s,background .15s;}" +
      "#tour-card button:hover{color:var(--text);border-color:var(--muted-dim);}" +
      "#tour-card button.tour-primary{background:var(--text);color:var(--bg);border-color:var(--text);}" +
      "#tour-card button.tour-primary:hover{opacity:.85;}" +
      "#tour-card button:disabled{opacity:.35;cursor:default;}" +
      "#tour-trigger-btn{position:fixed;right:16px;bottom:16px;z-index:9996;" +
      "font-family:var(--font);font-weight:600;font-size:12px;letter-spacing:.02em;" +
      "padding:9px 14px;border-radius:99px;background:var(--surface);color:var(--text);" +
      "border:1px solid var(--border);cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25);" +
      "transition:border-color .15s,color .15s;}" +
      "#tour-trigger-btn:hover{border-color:var(--gold);color:var(--gold);}";
    document.head.appendChild(style);
  }

  function buildDom() {
    var spotlight = document.createElement("div");
    spotlight.id = "tour-spotlight";
    spotlight.style.display = "none";

    var card = document.createElement("div");
    card.id = "tour-card";
    card.style.display = "none";
    card.innerHTML =
      '<h3 id="tour-title"></h3><p id="tour-body"></p>' +
      '<div class="tour-foot">' +
      '<button type="button" id="tour-prev">&larr; Back</button>' +
      '<span class="tour-count" id="tour-count"></span>' +
      '<span class="tour-spacer"></span>' +
      '<button type="button" id="tour-skip">Skip</button>' +
      '<button type="button" id="tour-next" class="tour-primary">Next</button>' +
      "</div>";

    document.body.appendChild(spotlight);
    document.body.appendChild(card);

    els = {
      spotlight: spotlight,
      card: card,
      title: card.querySelector("#tour-title"),
      body: card.querySelector("#tour-body"),
      count: card.querySelector("#tour-count"),
      prev: card.querySelector("#tour-prev"),
      next: card.querySelector("#tour-next"),
      skip: card.querySelector("#tour-skip"),
    };

    els.prev.addEventListener("click", function () { go(current - 1); });
    els.next.addEventListener("click", function () {
      if (current >= steps.length - 1) stop(); else go(current + 1);
    });
    els.skip.addEventListener("click", stop);

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    document.addEventListener("keydown", function (e) {
      if (current < 0) return;
      if (e.key === "Escape") stop();
      else if (e.key === "ArrowRight") els.next.click();
      else if (e.key === "ArrowLeft" && current > 0) go(current - 1);
    });
  }

  // `step.target` is either a single CSS selector, an array of selectors (spotlighting
  // the union of all of them at once), or null/undefined for a plain centred card.
  function getTargets(step) {
    if (!step.target) return [];
    var selectors = Array.isArray(step.target) ? step.target : [step.target];
    var out = [];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el) out.push(el);
    }
    return out;
  }

  function unionRect(elements) {
    var rects = elements.map(function (el) { return el.getBoundingClientRect(); });
    var top = Math.min.apply(null, rects.map(function (r) { return r.top; }));
    var left = Math.min.apply(null, rects.map(function (r) { return r.left; }));
    var right = Math.max.apply(null, rects.map(function (r) { return r.right; }));
    var bottom = Math.max.apply(null, rects.map(function (r) { return r.bottom; }));
    return { top: top, left: left, right: right, bottom: bottom, width: right - left, height: bottom - top };
  }

  function reposition() {
    if (current < 0 || !els) return;
    var step = steps[current];
    var targets = getTargets(step);
    var pad = 6;

    if (targets.length) {
      var r = unionRect(targets);
      els.spotlight.style.display = "block";
      els.spotlight.style.top = (r.top - pad) + "px";
      els.spotlight.style.left = (r.left - pad) + "px";
      els.spotlight.style.width = (r.width + pad * 2) + "px";
      els.spotlight.style.height = (r.height + pad * 2) + "px";
    } else {
      els.spotlight.style.display = "none";
    }

    var cw = els.card.offsetWidth || 320, ch = els.card.offsetHeight || 140;
    var vw = window.innerWidth, vh = window.innerHeight;
    var top, left;
    if (targets.length) {
      var rr = unionRect(targets);
      var spaceBelow = vh - rr.bottom, spaceAbove = rr.top;
      if (spaceBelow >= ch + 16 || spaceBelow >= spaceAbove) {
        top = Math.min(rr.bottom + 14, vh - ch - 10);
      } else {
        top = Math.max(rr.top - ch - 14, 10);
      }
      left = rr.left + rr.width / 2 - cw / 2;
      left = Math.max(10, Math.min(left, vw - cw - 10));
    } else {
      top = (vh - ch) / 2;
      left = (vw - cw) / 2;
    }
    els.card.style.top = top + "px";
    els.card.style.left = left + "px";
  }

  function go(i) {
    if (i < 0 || i >= steps.length) return;
    current = i;
    var step = steps[current];
    var targets = getTargets(step);

    if (typeof step.before === "function") step.before();

    if (targets.length) {
      var r = unionRect(targets);
      var fits = r.top >= 0 && r.bottom <= window.innerHeight;
      if (!fits) targets[0].scrollIntoView({ block: "center", behavior: "auto" });
    }

    els.title.textContent = step.title || "";
    els.body.textContent = step.body || "";
    els.count.textContent = (current + 1) + " / " + steps.length;
    els.prev.disabled = current === 0;
    els.next.textContent = current === steps.length - 1 ? "Done" : "Next →";
    els.card.style.display = "block";

    requestAnimationFrame(reposition);
  }

  function start() {
    if (!steps.length) return;
    if (!els) { buildStyle(); buildDom(); }
    go(0);
  }

  function stop() {
    current = -1;
    if (els) {
      els.card.style.display = "none";
      els.spotlight.style.display = "none";
    }
  }

  function init(stepList) {
    steps = stepList || [];
  }

  function buildTrigger() {
    // Only the standalone document gets a visible entry point -- inside
    // the site's viewer iframe, the parent's own viewer-bar button calls
    // ChemTour.start() instead, same split as theme.js's toggle button.
    if (window.self !== window.top) return;
    if (!steps.length) return;
    buildStyle();
    var btn = document.createElement("button");
    btn.id = "tour-trigger-btn";
    btn.type = "button";
    btn.textContent = "Walk me through";
    btn.addEventListener("click", start);
    document.body.appendChild(btn);
  }

  window.ChemTour = { init: init, start: start, stop: stop };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildTrigger);
  } else {
    buildTrigger();
  }
})();
