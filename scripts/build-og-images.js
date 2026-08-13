#!/usr/bin/env node
/* =========================================================
   BUILD OG IMAGES
   Screenshots every simulation at 1200x630 and writes the result to
   assets/img/og/<id>.png, plus assets/img/og/default.png from the
   homepage. scripts/build-seo-pages.js then points each route's
   og:image / twitter:image at the matching file, so a link to any
   page previews as a picture of the thing itself rather than as a
   bare text card.

   Unlike build-seo-pages.js this needs a browser, so it isn't part of
   the normal build. Run it only when a simulation's appearance changes
   (or a new one is added), and commit the PNGs:

     node scripts/build-og-images.js
     node scripts/build-og-images.js buffer-sim ph-curve-sim   # a subset

   It serves the repo over a local HTTP port and drives headless Edge
   over the DevTools Protocol, both of which it starts and stops
   itself. Set CHROME_BIN to use a different Chromium build; the
   --screenshot command-line flag is deliberately not used, as it
   silently produces no file on these pages.
   ========================================================= */

const fs = require("fs");
const path = require("path");
const http = require("http");
const net = require("net");
const crypto = require("crypto");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets/img/og");
const WIDTH = 1200;
const HEIGHT = 630;
// Time to let a simulation draw its first frames before capturing.
const SETTLE_MS = 3500;

const { simulations } = require(path.join(ROOT, "assets/js/data.js"));

const BROWSER_CANDIDATES = [
  process.env.CHROME_BIN,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

function findBrowser() {
  const found = BROWSER_CANDIDATES.find(p => fs.existsSync(p));
  if (!found) throw new Error("No Chromium-based browser found. Set CHROME_BIN.");
  return found;
}

/* ---------- Static file server ---------- */

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".ico": "image/x-icon", ".md": "text/markdown",
  ".woff2": "font/woff2", ".xml": "application/xml",
};

function startServer() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(ROOT, url);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve(server)));
}

/* ---------- Minimal CDP client ----------
   A dependency-free WebSocket client, enough for the handful of
   DevTools commands used here: text frames, no fragmentation, no
   compression. Not a general-purpose implementation. */

class Socket {
  constructor(url) {
    const u = new URL(url);
    this.sock = net.connect(Number(u.port), u.hostname);
    this.buf = Buffer.alloc(0);
    this.handlers = [];
    this.nextId = 1;
    this.ready = new Promise(resolve => {
      this.sock.once("connect", () => {
        this.sock.write(
          `GET ${u.pathname}${u.search} HTTP/1.1\r\nHost: ${u.host}\r\n` +
          `Upgrade: websocket\r\nConnection: Upgrade\r\n` +
          `Sec-WebSocket-Key: ${crypto.randomBytes(16).toString("base64")}\r\n` +
          `Sec-WebSocket-Version: 13\r\n\r\n`);
      });
      this.sock.on("data", chunk => {
        this.buf = Buffer.concat([this.buf, chunk]);
        if (!this.open) {
          const i = this.buf.indexOf("\r\n\r\n");
          if (i < 0) return;
          this.open = true;
          this.buf = this.buf.slice(i + 4);
          resolve();
        }
        this.drain();
      });
    });
  }
  drain() {
    while (this.buf.length >= 2) {
      const masked = this.buf[1] & 0x80;
      let len = this.buf[1] & 0x7f, off = 2;
      if (len === 126) { len = this.buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { len = Number(this.buf.readBigUInt64BE(2)); off = 10; }
      if (masked) off += 4;
      if (this.buf.length < off + len) return;
      const payload = this.buf.slice(off, off + len).toString();
      this.buf = this.buf.slice(off + len);
      let msg; try { msg = JSON.parse(payload); } catch (e) { continue; }
      this.handlers.slice().forEach(h => h(msg));
    }
  }
  send(method, params) {
    const id = this.nextId++;
    const data = Buffer.from(JSON.stringify({ id, method, params: params || {} }));
    const mask = crypto.randomBytes(4);
    const masked = Buffer.from(data.map((b, i) => b ^ mask[i % 4]));
    let header;
    if (data.length < 126) header = Buffer.from([0x81, 0x80 | data.length]);
    else if (data.length < 65536) { header = Buffer.alloc(4); header[0] = 0x81; header[1] = 0xfe; header.writeUInt16BE(data.length, 2); }
    else { header = Buffer.alloc(10); header[0] = 0x81; header[1] = 0xff; header.writeBigUInt64BE(BigInt(data.length), 2); }
    this.sock.write(Buffer.concat([header, mask, masked]));
    return new Promise(resolve => {
      const h = m => {
        if (m.id !== id) return;
        this.handlers.splice(this.handlers.indexOf(h), 1);
        resolve(m.result);
      };
      this.handlers.push(h);
    });
  }
}

function getJson(port, route) {
  return new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port, path: route }, r => {
      let d = ""; r.on("data", c => d += c); r.on("end", () => resolve(JSON.parse(d)));
    }).on("error", reject);
  });
}

const wait = ms => new Promise(r => setTimeout(r, ms));

async function waitForBrowser(port) {
  for (let i = 0; i < 40; i++) {
    try { await getJson(port, "/json/version"); return; } catch (e) { await wait(400); }
  }
  throw new Error("Browser did not expose a DevTools port in time");
}

/* ---------- Build ---------- */

(async () => {
  const only = process.argv.slice(2);
  const targets = simulations
    .filter(s => s.file)
    .filter(s => only.length === 0 || only.includes(s.id))
    .map(s => ({ name: s.id, url: s.file }));

  if (only.length === 0) targets.unshift({ name: "default", url: "/" });
  if (targets.length === 0) {
    console.error("Nothing to do (unknown simulation id?)");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const server = await startServer();
  const sitePort = server.address().port;
  const cdpPort = 9400 + (process.pid % 500);
  const profile = path.join(require("os").tmpdir(), "chemistrio-og-" + process.pid);

  const browser = spawn(findBrowser(), [
    "--headless=new", "--disable-gpu", "--hide-scrollbars",
    "--no-first-run", "--no-default-browser-check",
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${cdpPort}`,
    "about:blank",
  ], { stdio: "ignore" });

  let failed = 0;
  try {
    await waitForBrowser(cdpPort);
    const page = (await getJson(cdpPort, "/json/list")).find(t => t.type === "page");
    const ws = new Socket(page.webSocketDebuggerUrl);
    await ws.ready;
    await ws.send("Page.enable");
    await ws.send("Emulation.setDeviceMetricsOverride", {
      width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false,
    });

    // theme.js and tour.js inject floating controls into every
    // simulation. They're chrome, not content, so they're hidden for
    // the capture rather than left sitting over the picture.
    await ws.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `document.addEventListener('DOMContentLoaded', () => {
        const s = document.createElement('style');
        s.textContent = '#theme-toggle-btn,#tour-trigger-btn{display:none !important;}';
        document.head.appendChild(s);
      });`,
    });

    for (const t of targets) {
      await ws.send("Page.navigate", { url: `http://127.0.0.1:${sitePort}${t.url}` });
      await wait(SETTLE_MS);
      const shot = await ws.send("Page.captureScreenshot", {
        format: "png",
        clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 },
      });
      if (!shot || !shot.data) { console.error("FAILED", t.name); failed++; continue; }
      const out = path.join(OUT_DIR, t.name + ".png");
      fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
      console.log("wrote", path.relative(ROOT, out).replace(/\\/g, "/"),
        `(${(fs.statSync(out).size / 1024).toFixed(0)} kB)`);
    }
  } finally {
    browser.kill();
    server.close();
    // Windows keeps the profile's files locked for a moment after the
    // browser exits, so give it a beat and don't fail the build over a
    // temp directory that couldn't be removed.
    await wait(1500);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  }

  process.exit(failed ? 1 : 0);
})();
