// Hitherto Prayer Quilt: the public page.
import * as Q from "./core.js";

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const TODAY = Q.easternDate();
const DAY = Q.isDateStr(params.get("day")) && params.get("day") <= TODAY ? params.get("day") : TODAY;
const IS_TODAY = DAY === TODAY;
const DEEP_SQ = (params.get("sq") || "").toUpperCase();
(() => { const r = (params.get("ref") || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 30); if (r) try { sessionStorage.setItem("hq.ref", r); } catch { } })();
const REF = (() => { try { return sessionStorage.getItem("hq.ref") || ""; } catch { return ""; } })();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

let squares = [], counters = { knots: {}, reports: {}, refs: {}, kept: {} }, counts = {};
let L = Q.layout(DAY, 0), loaded = false, selected = -1, query = "", listView = false;

// ---------------------------------------------------------------- header
$("title").textContent = IS_TODAY ? "Today's quilt" : "The quilt for " + Q.longDate(DAY);
$("date").textContent = IS_TODAY ? Q.longDate(DAY) : "This quilt is finished. You can still read it and tie knots.";
document.title = (IS_TODAY ? "Today's quilt" : Q.fullDate(DAY)) + " · Hitherto Prayer Quilt";
if (!IS_TODAY) { $("add-form").hidden = true; $("closed").hidden = false; }

function visible(i) { return !Q.isHidden(squares[i].code, counters); }
function stats() {
  const n = squares.length, knots = squares.reduce((a, s) => a + (counters.knots[s.code] || 0), 0);
  const parts = [`<span><b>${n.toLocaleString()}</b> square${n === 1 ? "" : "s"}</span>`,
    `<span><b>${knots.toLocaleString()}</b> knot${knots === 1 ? "" : "s"} tied</span>`];
  if (IS_TODAY) { const t = Q.closesLocal(); parts.push(`<span>closes at midnight Eastern${t && !/12:00\s?AM/i.test(t) ? ` (${t} your time)` : ""}</span>`); }
  $("stats").innerHTML = parts.join("");
}

// ---------------------------------------------------------------- canvas + camera
// Map-style navigation: drag with momentum, pinch that zooms and moves together, smooth wheel zoom
// anchored at the pointer, double-click to zoom in, two-finger tap to zoom out.
const cv = $("quilt"), ctx = cv.getContext("2d");
const CELL = 100, MAX_S = 3;
let W = 0, H = 0, dpr = 1, dirty = true;
let cam = { x: 0, y: 0, s: 1 };          // what is on screen
let goal = null;                          // animated destination {x, y, s}
let zoomGoal = null;                      // smooth wheel zoom {s, ax, ay} anchored at a screen point
let vel = { x: 0, y: 0 };                 // momentum after a fling, world units per ms
let theme = {};
function readTheme() {
  theme = { muslin: Q.cssVar("--muslin"), seam: Q.cssVar("--seam"), gold: Q.cssVar("--gold-thread"),
            ink: Q.cssVar("--ink"), binding: Q.cssVar("--binding") };
  overview = null; dirty = true;
}
function resize() {
  const b = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = b.width; H = b.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); dirty = true;
}
// Small quilts sit inside the stage with room around them instead of filling it.
function fitScale() { return Math.min(W, H) * .9 / ((2 * Math.max(L.R, 2) + 1) * CELL); }
function minScale() { return fitScale() * .6; }
function clampS(s) { return Math.max(minScale(), Math.min(MAX_S, s)); }
function stop() { goal = null; zoomGoal = null; vel.x = vel.y = 0; }
function flyTo(t) { stop(); t.s = clampS(t.s); if (reduce) { cam = t; } else goal = t; dirty = true; }
function showAll(animate = true) { const t = { x: 0, y: 0, s: fitScale() }; if (animate) flyTo(t); else { stop(); cam = t; dirty = true; } }
function glideTo(i, s = 1.9) { const c = L.cells[i]; if (c) flyTo({ x: c.gx * CELL, y: c.gy * CELL, s }); }
function toWorld(sx, sy, c = cam) { return [c.x + (sx - W / 2) / c.s, c.y + (sy - H / 2) / c.s]; }
// Keep at least part of the quilt on screen.
function clampPan() {
  const half = (L.R + .5) * CELL, mx = half + (W / 2) / cam.s * .6, my = half + (H / 2) / cam.s * .6;
  cam.x = Math.max(-mx, Math.min(mx, cam.x)); cam.y = Math.max(-my, Math.min(my, cam.y));
}
function zoomAround(newS, sx, sy) {
  const [wx, wy] = toWorld(sx, sy); newS = clampS(newS);
  cam.s = newS; cam.x = wx - (sx - W / 2) / newS; cam.y = wy - (sy - H / 2) / newS; clampPan(); dirty = true;
}
function zoomBy(f, sx = W / 2, sy = H / 2) {
  const from = zoomGoal ? zoomGoal.s : cam.s;
  goal = null; vel.x = vel.y = 0;
  if (reduce) { zoomAround(from * f, sx, sy); return; }
  zoomGoal = { s: clampS(from * f), ax: sx, ay: sy }; dirty = true;
}

function matches(i) {
  if (!query) return true;
  const s = squares[i]; if (!visible(i)) return false;
  const q = query.toLowerCase();
  return s.text.toLowerCase().includes(q) || s.initials.toLowerCase().replace(/\W/g, "").includes(q.replace(/\W/g, "")) || s.code.toLowerCase() === q;
}

// ---- cached drawing pieces, so moving the quilt never re-does expensive work
let overview = null;            // the whole quilt drawn once, used when zoomed out
const labelCache = new Map();   // per-square reading label, drawn once per size bucket
function invalidate() { overview = null; labelCache.clear(); dirty = true; }
function buildOverview() {
  const n = 2 * L.R + 1, px = Math.max(4, Math.min(24, Math.floor(2048 / n)));
  const c = document.createElement("canvas"); c.width = c.height = n * px; const x = c.getContext("2d");
  x.fillStyle = theme.muslin; x.fillRect(0, 0, c.width, c.height);
  L.cells.forEach((cell, i) => {
    const sq = squares[i]; if (!sq) return;
    const X = (cell.gx + L.R) * px, Y = (cell.gy + L.R) * px;
    x.globalAlpha = matches(i) ? 1 : .18;
    if (!visible(i)) { x.fillStyle = theme.muslin; x.fillRect(X, Y, px, px); }
    else if (px >= 12) x.drawImage(Q.fabricTile(sq.fabric || 0, cell.base, cell.seed), X, Y, px, px);
    else { x.fillStyle = cell.base; x.fillRect(X, Y, px, px); }
  });
  x.globalAlpha = 1;
  if (px >= 6) { x.strokeStyle = theme.seam; x.lineWidth = Math.max(.5, px * .05); x.beginPath();
    for (let k = 0; k <= n; k++) { x.moveTo(k * px, 0); x.lineTo(k * px, n * px); x.moveTo(0, k * px); x.lineTo(n * px, k * px); } x.stroke(); }
  overview = { canvas: c, px, query, sel: selected };
}
function labelFor(i, size) {
  const bucket = size < 220 ? 180 : size < 320 ? 260 : 360, key = i + ":" + bucket + ":" + (counters.knots[squares[i].code] || 0) + ":" + visible(i);
  let c = labelCache.get(key); if (c) return c;
  const sq = squares[i], hidden = !visible(i), r = Math.min(2, dpr);
  const lw = bucket * .78, lh = bucket * .62;
  c = document.createElement("canvas"); c.width = Math.ceil(lw * r); c.height = Math.ceil(lh * r);
  const x = c.getContext("2d"); x.scale(r, r);
  x.fillStyle = "rgba(251,247,238,.96)"; x.fillRect(0, 0, lw, lh);
  x.setLineDash([3, 3]); x.strokeStyle = "rgba(138,103,24,.6)"; x.lineWidth = 1; x.strokeRect(4, 4, lw - 8, lh - 8); x.setLineDash([]);
  const fs = Math.min(22, bucket * .085), line = fs * 1.15, maxLines = Math.max(1, Math.floor((lh * .7) / line));
  x.fillStyle = "#242019"; x.font = `500 ${fs}px "Cormorant Garamond", Georgia, serif`;
  const words = (hidden ? "Being reviewed" : sq.text).split(/\s+/); let ln = "", n = 0, y = lh * .12 + fs;
  for (const w of words) {
    const test = ln ? ln + " " + w : w;
    if (x.measureText(test).width > lw * .8 && ln) {
      if (n === maxLines - 1) { x.fillText(ln.replace(/\W*$/, "") + "…", lw * .1, y); ln = ""; break; }
      x.fillText(ln, lw * .1, y); y += line; n++; ln = w;
    } else ln = test;
  }
  if (ln) x.fillText(ln, lw * .1, y);
  if (!hidden) {
    x.font = `600 ${Math.min(13, bucket * .05)}px Manrope, system-ui, sans-serif`; x.fillStyle = "#6B6255";
    if (sq.initials) x.fillText(sq.initials, lw * .1, lh * .9);
    const k = counters.knots[sq.code] || 0;
    if (k) { x.textAlign = "right"; x.fillStyle = "#8A6718"; x.fillText(`${k} knot${k === 1 ? "" : "s"}`, lw * .9, lh * .9); }
  }
  if (labelCache.size > 400) labelCache.clear();
  labelCache.set(key, c); return c;
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const s = cam.s, size = CELL * s, ox = W / 2 - cam.x * s, oy = H / 2 - cam.y * s, R = L.R;
  const side = (2 * R + 1) * CELL * s, qx = ox - (R * CELL + CELL / 2) * s, qy = oy - (R * CELL + CELL / 2) * s;
  const myCode = (Q.mine.get(DAY) || {}).code;
  if (size < 34) {
    // zoomed out: one cached picture of the whole quilt
    if (!overview || overview.query !== query) buildOverview();
    ctx.imageSmoothingEnabled = true; ctx.drawImage(overview.canvas, qx, qy, side, side);
  } else {
    ctx.fillStyle = theme.muslin; ctx.fillRect(qx, qy, side, side);
    // only the squares on screen
    const g0x = Math.max(-R, Math.floor((cam.x - W / 2 / s) / CELL)), g1x = Math.min(R, Math.ceil((cam.x + W / 2 / s) / CELL));
    const g0y = Math.max(-R, Math.floor((cam.y - H / 2 / s) / CELL)), g1y = Math.min(R, Math.ceil((cam.y + H / 2 / s) / CELL));
    const label = size >= 150;
    L.cells.forEach((c, i) => {
      if (c.gx < g0x || c.gx > g1x || c.gy < g0y || c.gy > g1y) return;
      const sq = squares[i]; if (!sq) return;
      const px = ox + (c.gx * CELL - CELL / 2) * s, py = oy + (c.gy * CELL - CELL / 2) * s, hidden = !visible(i);
      ctx.globalAlpha = matches(i) ? 1 : .18;
      if (hidden) { ctx.fillStyle = theme.muslin; ctx.fillRect(px, py, size, size); }
      else ctx.drawImage(Q.fabricTile(sq.fabric || 0, c.base, c.seed), px, py, size, size);
      if (size > 40 && !hidden) {
        if (!c.stitch) c.stitch = Q.shade(c.base, .45);
        ctx.setLineDash([size * .06, size * .05]); ctx.strokeStyle = c.stitch; ctx.globalAlpha *= .55;
        ctx.lineWidth = Math.max(.8, size * .012); const m = size * .07; ctx.strokeRect(px + m, py + m, size - 2 * m, size - 2 * m); ctx.setLineDash([]);
        ctx.globalAlpha = matches(i) ? 1 : .18;
      }
      if (label) { const l = labelFor(i, size), lw = size * .78, lh = size * .62; ctx.drawImage(l, px + (size - lw) / 2, py + (size - lh) / 2, lw, lh); }
      const k = counters.knots[sq.code] || 0;
      if (size > 50 && k && !hidden) {
        const n = Math.min(k, 5), r = Math.min(5, Math.max(1.6, size * .022));
        ctx.fillStyle = theme.gold; for (let j = 0; j < n; j++) { ctx.beginPath(); ctx.arc(px + size - size * .1 - j * r * 2.6, py + size * .1, r, 0, 7); ctx.fill(); }
      }
    });
    ctx.globalAlpha = 1;
    // seams as one path
    ctx.strokeStyle = theme.seam; ctx.lineWidth = Math.max(.6, size * .03); ctx.beginPath();
    for (let g = g0x - 1; g <= g1x; g++) { const X = ox + (g * CELL + CELL / 2) * s; if (g >= -R - 1 && g <= R) { ctx.moveTo(X, Math.max(qy, 0)); ctx.lineTo(X, Math.min(qy + side, H)); } }
    for (let g = g0y - 1; g <= g1y; g++) { const Y = oy + (g * CELL + CELL / 2) * s; if (g >= -R - 1 && g <= R) { ctx.moveTo(Math.max(qx, 0), Y); ctx.lineTo(Math.min(qx + side, W), Y); } }
    ctx.stroke();
  }
  // highlights drawn on top at any zoom
  const ring = (i, color, w, inset) => { const c = L.cells[i]; if (!c) return;
    const px = ox + (c.gx * CELL - CELL / 2) * s, py = oy + (c.gy * CELL - CELL / 2) * s;
    ctx.strokeStyle = color; ctx.lineWidth = Math.max(w, size * .05); ctx.strokeRect(px + inset, py + inset, size - 2 * inset, size - 2 * inset); };
  const mi = myCode ? squares.findIndex(q => q.code === myCode) : -1;
  if (mi >= 0) ring(mi, theme.gold, 2, 1);
  if (selected >= 0) ring(selected, theme.ink, 1.5, 3);
  if (!squares.length && loaded) {
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = theme.gold; ctx.lineWidth = 2;
    ctx.strokeRect(ox - CELL / 2 * s + 4, oy - CELL / 2 * s + 4, size - 8, size - 8); ctx.restore();
  }
  if (squares.length) {
    ctx.save(); ctx.strokeStyle = theme.gold; ctx.globalAlpha = .55; ctx.lineWidth = Math.min(3, Math.max(1.2, side * .004));
    ctx.setLineDash([Math.min(14, Math.max(4, side * .012)), Math.min(9, Math.max(3, side * .008))]); ctx.beginPath();
    L.poly.forEach(([u, v], i) => { const X = qx + u * side, Y = qy + v * side; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
    ctx.closePath(); ctx.stroke(); ctx.restore();
  }
  ctx.strokeStyle = Q.isChristmas(DAY) ? theme.gold : theme.binding;
  ctx.lineWidth = Math.min(8, Math.max(2, side * .008)); ctx.strokeRect(qx, qy, side, side);
  dirty = false;
}

let last = performance.now();
function tick(now) {
  const dt = Math.min(48, now - last); last = now;
  if (goal) { // glide: ease toward the destination, zooming out and back in on long trips
    const k = 1 - Math.pow(1 - .14, dt / 16.7);
    cam.x += (goal.x - cam.x) * k; cam.y += (goal.y - cam.y) * k; cam.s *= Math.pow(goal.s / cam.s, k);
    if (Math.abs(goal.x - cam.x) * cam.s < .3 && Math.abs(goal.y - cam.y) * cam.s < .3 && Math.abs(goal.s / cam.s - 1) < .002) { cam = { ...goal }; goal = null; }
    dirty = true;
  } else if (zoomGoal) { // smooth wheel or button zoom, the point under the pointer stays put
    const k = 1 - Math.pow(1 - .22, dt / 16.7), ns = cam.s * Math.pow(zoomGoal.s / cam.s, k);
    zoomAround(ns, zoomGoal.ax, zoomGoal.ay);
    if (Math.abs(zoomGoal.s / cam.s - 1) < .002) zoomGoal = null;
  } else if (vel.x || vel.y) { // momentum after a fling
    cam.x += vel.x * dt; cam.y += vel.y * dt; clampPan();
    const decay = Math.exp(-dt / 325); vel.x *= decay; vel.y *= decay;
    if (Math.hypot(vel.x, vel.y) * cam.s < .02) vel.x = vel.y = 0;
    dirty = true;
  }
  if (dirty) draw();
  requestAnimationFrame(tick);
}

// ---------------------------------------------------------------- gestures
const pointers = new Map();    // id -> {x, y}
let drag = null;               // one-finger drag state
let pinch = null;              // two-finger state
let moved = 0, downAt = 0, maxPointers = 0;
const samples = [];            // recent drag positions for fling velocity
function local(e) { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
function startDrag() {
  const [p] = [...pointers.values()]; drag = { x: p.x, y: p.y }; samples.length = 0; samples.push({ t: performance.now(), x: cam.x, y: cam.y });
}
function startPinch() {
  const [a, b] = [...pointers.values()];
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
  pinch = { d, s: cam.s, world: toWorld(mx, my) }; drag = null;
}
cv.addEventListener("pointerdown", e => {
  cv.setPointerCapture(e.pointerId); const [x, y] = local(e);
  pointers.set(e.pointerId, { x, y }); stop(); $("hint").hidden = true; cv.classList.add("dragging");
  if (pointers.size === 1) { moved = 0; downAt = performance.now(); maxPointers = 1; startDrag(); }
  if (pointers.size === 2) { maxPointers = 2; startPinch(); }
});
cv.addEventListener("pointermove", e => {
  const p = pointers.get(e.pointerId); if (!p) return;
  const [x, y] = local(e); moved += Math.abs(x - p.x) + Math.abs(y - p.y); p.x = x; p.y = y;
  if (pointers.size >= 2 && pinch) {
    const [a, b] = [...pointers.values()];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    const ns = clampS(pinch.s * d / pinch.d);
    cam.s = ns; cam.x = pinch.world[0] - (mx - W / 2) / ns; cam.y = pinch.world[1] - (my - H / 2) / ns; clampPan();
  } else if (drag) {
    cam.x -= (x - drag.x) / cam.s; cam.y -= (y - drag.y) / cam.s; drag.x = x; drag.y = y; clampPan();
    const t = performance.now(); samples.push({ t, x: cam.x, y: cam.y }); while (samples.length > 2 && t - samples[0].t > 90) samples.shift();
  }
  dirty = true;
});
function up(e) {
  if (!pointers.has(e.pointerId)) return;
  const [x, y] = local(e); pointers.delete(e.pointerId);
  if (pointers.size === 1) { pinch = null; startDrag(); return; } // lift one finger of a pinch: keep dragging, no jump
  cv.classList.remove("dragging");
  if (pointers.size) return;
  const quick = performance.now() - downAt < 300;
  if (maxPointers === 2 && moved < 12 && quick) { zoomBy(1 / 1.8, x, y); return; } // two-finger tap: zoom out
  if (maxPointers === 1 && moved < 8) { tap(x, y); return; }
  if (drag && samples.length >= 2 && e.type === "pointerup") { // fling
    const a = samples[0], b = samples[samples.length - 1], dt = b.t - a.t;
    if (dt > 0 && performance.now() - b.t < 60) { vel.x = (b.x - a.x) / dt; vel.y = (b.y - a.y) / dt; if (reduce) vel.x = vel.y = 0; }
  }
  drag = null; pinch = null;
}
cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
cv.addEventListener("dblclick", e => { const [x, y] = local(e); zoomBy(2, x, y); });
// wheel: a mouse wheel or trackpad pinch zooms at the pointer; a two-finger trackpad swipe moves the quilt
cv.addEventListener("wheel", e => {
  e.preventDefault(); const [x, y] = local(e);
  const lines = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? H : 1;
  const dx = e.deltaX * lines, dy = e.deltaY * lines;
  const trackpadPan = !e.ctrlKey && e.deltaMode === 0 && Math.abs(dx) > Math.abs(dy);
  if (trackpadPan) { stop(); cam.x += dx / cam.s; cam.y += dy / cam.s; clampPan(); dirty = true; return; }
  zoomBy(Math.exp(-dy * (e.ctrlKey ? .012 : .0022)), x, y);
}, { passive: false });
["gesturestart", "gesturechange"].forEach(n => cv.addEventListener(n, e => e.preventDefault()));
cv.addEventListener("keydown", e => {
  const step = 80 / cam.s, map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (map[e.key]) { flyTo({ x: cam.x + map[e.key][0], y: cam.y + map[e.key][1], s: cam.s }); e.preventDefault(); }
  if (e.key === "+" || e.key === "=") { zoomBy(1.5); e.preventDefault(); }
  if (e.key === "-") { zoomBy(1 / 1.5); e.preventDefault(); }
  if (e.key === "0") { showAll(); e.preventDefault(); }
  if (e.key === "Enter") { const i = indexAt(W / 2, H / 2); if (i >= 0) select(i, true); }
});
function indexAt(sx, sy) {
  const [wx, wy] = toWorld(sx, sy);
  const gx = Math.round(wx / CELL), gy = Math.round(wy / CELL);
  return L.cells.findIndex(c => c.gx === gx && c.gy === gy);
}
function tap(sx, sy) { const i = indexAt(sx, sy); if (i >= 0 && squares[i]) select(i, CELL * cam.s < 150); }
$("zin").onclick = () => zoomBy(1.8);
$("zout").onclick = () => zoomBy(1 / 1.8);
$("zall").onclick = () => showAll();
$("mine").onclick = () => { const m = Q.mine.get(DAY); const i = m ? squares.findIndex(s => s.code === m.code) : -1; if (i >= 0) select(i, true, 2.2); };

// ---------------------------------------------------------------- the square card
function select(i, zoom = false, s = 1.9) {
  selected = i; const sq = squares[i], hidden = !visible(i), my = (Q.mine.get(DAY) || {}).code === sq.code;
  $("card").hidden = false;
  $("c-label").textContent = my ? "Your square" : "A square on " + Q.longDate(DAY);
  $("c-text").textContent = hidden ? "This square is being reviewed." : sq.text;
  const k = counters.knots[sq.code] || 0;
  $("c-meta").textContent = hidden ? "" : (sq.initials ? sq.initials + " · " : "") + `${k} knot${k === 1 ? "" : "s"} tied`;
  $("c-code").textContent = hidden ? "" : "Square code " + sq.code;
  const tied = Q.mine.knotted(DAY, sq.code);
  $("knot").disabled = tied || hidden; $("knot").textContent = tied ? "You tied a knot" : "Tie a knot";
  $("knot").hidden = hidden; $("share-sq").hidden = hidden;
  $("report").hidden = hidden || my; $("report").disabled = Q.mine.reported(DAY, sq.code);
  $("report").textContent = Q.mine.reported(DAY, sq.code) ? "Reported" : "Report";
  $("remove").hidden = !my;
  $("reportbox").hidden = true; $("c-flash").hidden = true;
  if (zoom) glideTo(i, s);
  dirty = true;
}
function flashCard(t) { $("c-flash").textContent = t; $("c-flash").hidden = false; }
const OFFLINE = "The quilt can't be reached right now. Your words are still here; try again in a moment.";

async function tieKnot(i) {
  const sq = squares[i]; if (!sq || Q.mine.knotted(DAY, sq.code)) return;
  try {
    const user = await Q.anonUser(); const { fs, db } = await Q.firebase();
    const b = fs.writeBatch(db);
    b.set(fs.doc(db, "counters", DAY), { knots: { [sq.code]: fs.increment(1) }, k: sq.code }, { merge: true });
    b.set(fs.doc(db, "counters", DAY, "k", sq.code + "_" + user.uid), {});
    await b.commit();
    Q.mine.setKnot(DAY, sq.code);
    counters.knots[sq.code] = (counters.knots[sq.code] || 0) + 1;
    $("knot-anim").classList.remove("go"); void $("knot-anim").offsetWidth; $("knot-anim").classList.add("go");
  } catch (e) {
    if (String(e.code || "").includes("permission")) { Q.mine.setKnot(DAY, sq.code); }
    else { flashCard(OFFLINE); return; }
  }
  stats(); if (selected === i) select(i); renderList(); dirty = true;
}
$("knot").onclick = () => tieKnot(selected);
$("report").onclick = () => { $("reportbox").hidden = false; $("reportbox").querySelector("input").focus(); };
$("report-send").onclick = async () => {
  const sq = squares[selected]; if (!sq) return;
  try {
    const user = await Q.anonUser(); const { fs, db } = await Q.firebase();
    const b = fs.writeBatch(db);
    b.set(fs.doc(db, "counters", DAY), { reports: { [sq.code]: fs.increment(1) }, k: sq.code }, { merge: true });
    b.set(fs.doc(db, "counters", DAY, "r", sq.code + "_" + user.uid), {});
    await b.commit();
    counters.reports[sq.code] = (counters.reports[sq.code] || 0) + 1; invalidate();
  } catch (e) { if (!String(e.code || "").includes("permission")) { flashCard(OFFLINE); return; } }
  Q.mine.setReport(DAY, sq.code);
  const i = selected; select(i); flashCard("Thank you. We'll take a look."); renderList(); dirty = true;
};
$("report-cancel").onclick = () => { $("reportbox").hidden = true; };
$("remove").onclick = async () => {
  const sq = squares[selected]; if (!sq) return;
  if (!confirmRemove()) return;
  try {
    await Q.anonUser(); const { fs, db } = await Q.firebase(); const ref = fs.doc(db, "days", DAY);
    await fs.runTransaction(db, async tx => {
      const s = await tx.get(ref); const arr = s.exists() ? s.data().squares || [] : [];
      const i = arr.findIndex(x => x.code === sq.code); if (i < 0) return;
      tx.update(ref, { squares: arr.slice(0, i).concat(arr.slice(i + 1)), rm: i });
    });
    $("card").hidden = true; selected = -1; await refresh(); flash("Your square has been removed.");
  } catch (e) { flashCard(OFFLINE); }
};
let removeArmed = false;
function confirmRemove() {
  if (removeArmed) { removeArmed = false; return true; }
  removeArmed = true; $("remove").textContent = "Tap again to remove it for good";
  setTimeout(() => { removeArmed = false; $("remove").textContent = "Remove my square"; }, 5000);
  return false;
}

// ---------------------------------------------------------------- sharing and images
function linkFor(code) { const u = new URL(location.origin + location.pathname); u.searchParams.set("day", DAY); if (code) u.searchParams.set("sq", code); return u.toString(); }
async function share(url, el) {
  const data = { title: "Hitherto Prayer Quilt", text: "Pray with us on today's Hitherto Prayer Quilt.", url };
  try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(url); el.textContent = "Link copied"; setTimeout(() => el.textContent = el.dataset.label, 2500); } catch { prompt("Copy this link", url); }
}
$("share-sq").onclick = e => share(linkFor(squares[selected].code), e.currentTarget);
$("share-quilt").onclick = e => share(linkFor(""), e.currentTarget);
$("save-img").onclick = () => {
  const c = document.createElement("canvas"); c.width = 1600; c.height = 1760; const x = c.getContext("2d");
  x.fillStyle = "#F7F2E8"; x.fillRect(0, 0, c.width, c.height);
  const vis = squares.map((s, i) => visible(i) ? s : { fabric: 0 });
  Q.drawFlat(x, DAY, squares.length, vis, 100, 100, 1400, { muslin: "#EDE5D3", seam: "#FBF7EE", gold: "#8A6718", oxblood: "#6B2F3A" });
  x.fillStyle = "#242019"; x.font = '600 52px "Cormorant Garamond", Georgia, serif'; x.textAlign = "center";
  x.fillText(`Hitherto Prayer Quilt · ${Q.fullDate(DAY)} · ${squares.length.toLocaleString()} square${squares.length === 1 ? "" : "s"}`, 800, 1625);
  x.fillStyle = "#6B6255"; x.font = '500 30px Manrope, system-ui, sans-serif'; x.fillText("graybearstudio.com/hitherto/quilt", 800, 1685);
  c.toBlob(async blob => {
    const file = new File([blob], `hitherto-quilt-${DAY}.png`, { type: "image/png" });
    try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Hitherto Prayer Quilt" }); return; } } catch (e) { if (e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, "image/png");
};

// ---------------------------------------------------------------- search and list view
$("q").addEventListener("input", e => { query = e.target.value.trim(); overview = null; dirty = true; renderList(); $("all-results").hidden = true; });
$("search-all").onclick = async () => {
  const q = query.toLowerCase(); const box = $("all-results");
  if (!q) { $("q").focus(); return; }
  box.hidden = false; box.innerHTML = "<p class='note'>Searching every quilt…</p>";
  try {
    const days = [...new Set([TODAY, ...Object.keys(counts)])].sort().reverse();
    const hits = [];
    for (const d of days) {
      const [sqs, c] = await Promise.all([Q.getDay(d), Q.getCounters(d)]);
      sqs.forEach(s => { if (!Q.isHidden(s.code, c) && (s.text.toLowerCase().includes(q) || s.initials.toLowerCase().replace(/\W/g, "").includes(q.replace(/\W/g, "")) || s.code.toLowerCase() === q)) hits.push([d, s]); });
    }
    box.innerHTML = hits.length ? `<p class="note">${hits.length} square${hits.length === 1 ? "" : "s"} found</p><ul class="results">` +
      hits.slice(0, 100).map(([d, s]) => `<li><a href="${Q.esc(linkFor(s.code).replace("day=" + DAY, "day=" + d))}"><span class="rd">${Q.esc(Q.shortDate(d))}</span> ${Q.esc(s.text)}${s.initials ? ` <span class="ri">${Q.esc(s.initials)}</span>` : ""}</a></li>`).join("") + "</ul>"
      : "<p class='note'>No squares match that search.</p>";
  } catch { box.innerHTML = `<p class="note">${OFFLINE}</p>`; }
};
$("listview").onclick = () => {
  listView = !listView; $("listview").setAttribute("aria-pressed", listView);
  $("list").hidden = !listView; $("stage").hidden = listView; renderList();
};
function renderList() {
  if (!listView) return;
  const box = $("list");
  const items = squares.map((s, i) => [s, i]).filter(([, i]) => visible(i) && matches(i)).reverse();
  if (!items.length) { box.innerHTML = `<p class="note">${squares.length ? "No squares match." : "Today's quilt is waiting for its first square."}</p>`; return; }
  box.innerHTML = `<ol class="sqlist" reversed>` + items.map(([s, i]) => {
    const k = counters.knots[s.code] || 0, tied = Q.mine.knotted(DAY, s.code), my = (Q.mine.get(DAY) || {}).code === s.code;
    return `<li><p class="lt">${Q.esc(s.text)}</p><p class="lm">${my ? "<b>Your square</b> · " : ""}${s.initials ? Q.esc(s.initials) + " · " : ""}${k} knot${k === 1 ? "" : "s"} tied · code ${s.code}</p>
      <div class="row"><button class="btn small" data-knot="${i}" ${tied ? "disabled" : ""}>${tied ? "You tied a knot" : "Tie a knot"}</button>
      <button class="link" data-open="${i}">Show on the quilt</button></div></li>`;
  }).join("") + "</ol>";
}
$("list").addEventListener("click", e => {
  const k = e.target.closest("[data-knot]"), o = e.target.closest("[data-open]");
  if (k) tieKnot(+k.dataset.knot);
  if (o) { $("listview").click(); select(+o.dataset.open, true); $("stage").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); }
});

// ---------------------------------------------------------------- adding a square
const fab = $("fabrics");
Q.FABRICS.forEach((name, i) => {
  const l = document.createElement("label"); l.className = "swatch";
  const c = document.createElement("canvas"); c.width = c.height = 64; c.getContext("2d").drawImage(Q.fabricTile(i, ["#6B2F3A", "#3D4A6B", "#5F6B4E", "#7A5A3A", "#4A3A4F", "#8A4B3A", "#2F4B4B"][i % 7], i), 0, 0, 64, 64);
  l.innerHTML = `<input type="radio" name="fabric" value="${i}" ${i === 0 ? "checked" : ""}><span class="sr">${name}</span>`;
  l.prepend(c); l.title = name; fab.append(l);
});
const ta = $("ptext");
const draft = Q.mine.draft(); if (draft && IS_TODAY) { ta.value = draft.text || ""; $("pinit").value = draft.initials || ""; }
function count() { $("count").textContent = `${ta.value.length} / ${Q.MAX_TEXT}`; }
count();
ta.addEventListener("input", () => { count(); Q.mine.saveDraft({ text: ta.value, initials: $("pinit").value }); $("crisis").hidden = true; $("namecheck").hidden = true; });
$("pinit").addEventListener("input", e => { const v = Q.cleanInitials(e.target.value); if (v !== e.target.value.toUpperCase().trim()) e.target.value = v; Q.mine.saveDraft({ text: ta.value, initials: e.target.value }); });
$("guidelines-btn").onclick = () => { const g = $("guidelines"); g.hidden = !g.hidden; $("guidelines-btn").setAttribute("aria-expanded", !g.hidden); };

function flash(t) { const f = $("flash"); f.textContent = t; f.hidden = false; }
async function sew(held = null) {
  const text = ta.value.trim().replace(/\s+/g, " "), initials = Q.cleanInitials($("pinit").value);
  const fabric = +(document.querySelector("input[name=fabric]:checked") || { value: 0 }).value;
  $("flash").hidden = true; $("crisis").hidden = true;
  if (!IS_TODAY) { flash("Squares can only be added to today's quilt."); return; }
  if (text.length < 3) { flash("Write a few words for your square first."); ta.focus(); return; }
  if (text.length > Q.MAX_TEXT) { flash(`Please keep your square to ${Q.MAX_TEXT} characters.`); return; }
  if (Q.hasCrisis(text)) { $("crisis").hidden = false; $("crisis").focus(); return; }
  if (Q.hasContact(text) || Q.hasContact(initials)) { flash("Squares can't include links, email addresses or phone numbers. Please remove them and try again."); return; }
  if (!$("consent").checked) { flash("Please tick the box to confirm you understand your square will be public."); return; }
  if (Q.mine.get(DAY)) { flash("You've already added a square to today's quilt. Come back tomorrow, or tie knots for other people's squares."); return; }
  if (!held && Q.hasBlocked(text)) held = "words";
  if (!held && Q.looksLikeFullName(text)) { $("namecheck").hidden = false; $("namecheck").querySelector("button").focus(); return; }
  if (squares.length >= Q.DAY_CAP) { flash("Today's quilt is full. Thank you. Come back tomorrow, or tie knots for the squares already sewn."); return; }
  $("sew").disabled = true; $("sew").textContent = "Sewing…";
  try {
    const user = await Q.anonUser(); const { fs, db } = await Q.firebase();
    const prior = await fs.getDoc(fs.doc(db, "days", DAY, "authors", user.uid));
    if (prior.exists()) { Q.mine.set(DAY, prior.data().code, prior.data().held); flash("You've already added a square to today's quilt. Come back tomorrow, or tie knots for other people's squares."); return; }
    const code = Q.newCode();
    const sq = { code, text, initials, fabric, at: fs.Timestamp.now() };
    const b = fs.writeBatch(db);
    if (held) {
      b.set(fs.doc(db, "held", code), { ...sq, day: DAY, reason: held });
      b.set(fs.doc(db, "days", DAY, "authors", user.uid), { code, held: true });
    } else {
      b.set(fs.doc(db, "days", DAY), { squares: fs.arrayUnion(sq) }, { merge: true });
      b.set(fs.doc(db, "days", DAY, "authors", user.uid), { code, held: false });
      b.set(fs.doc(db, "meta", "days"), { counts: { [DAY]: fs.increment(1) }, k: DAY }, { merge: true });
      // a church's referral link is counted only as a daily total, tied by the rules to this new square
      if (REF) b.set(fs.doc(db, "counters", DAY), { refs: { [REF]: fs.increment(1) }, k: REF }, { merge: true });
    }
    await b.commit();
    Q.mine.set(DAY, code, !!held); Q.mine.saveDraft(null);
    ta.value = ""; $("pinit").value = ""; count(); $("consent").checked = false; $("namecheck").hidden = true;
    if (held) { flash("Your square is being reviewed before it joins today's quilt. This usually means our automatic checks found something that may include private information or need a closer look."); return; }
    await refresh();
    const i = squares.findIndex(s => s.code === code);
    if (i >= 0) { select(i, true); $("stage").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); }
    flash("Your square is sewn into today's quilt. Look for the gold border.");
  } catch (e) {
    console.warn(e);
    flash(String(e.code || "").includes("permission")
      ? "Your square couldn't be sewn. Check that it has no links, email addresses or phone numbers, and try again."
      : OFFLINE);
  } finally { $("sew").disabled = false; $("sew").textContent = "Sew my square"; }
}
$("add-form").addEventListener("submit", e => { e.preventDefault(); sew(); });
$("name-edit").onclick = () => { $("namecheck").hidden = true; ta.focus(); };
$("name-review").onclick = () => sew("name");

// ---------------------------------------------------------------- past quilts
function renderDays() {
  const days = [...new Set([TODAY, ...Object.keys(counts)])].filter(Q.isDateStr).sort().reverse().slice(0, 60);
  const box = $("days"); box.innerHTML = "";
  days.forEach(d => {
    const a = document.createElement("a"); a.className = "day"; a.href = d === TODAY ? "./" : "./?day=" + d;
    if (d === DAY) a.setAttribute("aria-current", "page");
    const c = document.createElement("canvas"); c.width = c.height = 160; const x = c.getContext("2d");
    const n = d === DAY ? squares.length : (counts[d] || 0);
    Q.drawFlat(x, d, n, null, 6, 6, 148, { muslin: Q.cssVar("--muslin"), seam: Q.cssVar("--seam"), gold: Q.cssVar("--gold-thread"), oxblood: Q.cssVar("--binding") });
    const t = document.createElement("span"); t.textContent = d === TODAY ? "Today" : Q.shortDate(d);
    a.append(c, t); a.setAttribute("aria-label", `${d === TODAY ? "Today" : Q.longDate(d)}, ${n} square${n === 1 ? "" : "s"}`);
    box.append(a);
  });
}

// ---------------------------------------------------------------- loading
function setState(t) { $("state").textContent = t || ""; $("state").hidden = !t; }
async function refresh() {
  const [sq, c] = await Promise.all([Q.getDay(DAY), Q.getCounters(DAY)]);
  const grew = sq.length !== squares.length;
  squares = sq; counters = c; L = Q.layout(DAY, squares.length); invalidate();
  if (grew && !target && cam.s <= fitScale() * 1.05) showAll(false);
  stats(); renderList(); dirty = true;
  const m = Q.mine.get(DAY);
  $("mine").hidden = !(m && squares.some(s => s.code === m.code));
  if (selected >= 0 && squares[selected]) select(selected);
}
// Private preview: graybearstudio.com/hitherto/quilt/#preview fills today's quilt with sample squares
// in this browser only, to try navigation at scale. Nothing is read from or written to the database.
const PREVIEW = location.hash === "#preview";
function previewData(n = 900) {
  const words = ["For peace for M.", "For my mom's surgery on Tuesday.", "Thank you for the rain.", "For J., starting a new job.", "For rest for every caregiver.",
    "For our church's food pantry.", "For safe travel home.", "For courage at the exam.", "For a friend who is grieving.", "For patience with my kids."];
  return Array.from({ length: n }, (_, i) => ({ code: "PRV" + String(i).padStart(3, "0"), text: words[i % words.length] + " (sample)", initials: i % 3 ? "S." : "", fabric: i % 12, at: null }));
}
async function load() {
  if (PREVIEW) {
    squares = previewData(); counters = { knots: { PRV000: 3, PRV004: 1, PRV010: 7 }, reports: {}, refs: {}, kept: {} };
    L = Q.layout(DAY, squares.length); invalidate(); loaded = true; setState(""); stats(); showAll(false); renderDays();
    $("add-form").hidden = true; $("closed").hidden = false; $("closed").textContent = "Preview mode: sample squares in this browser only. Nothing here is saved.";
    return;
  }
  if (!Q.configured()) { setState(OFFLINE); stats(); renderDays(); return; }
  setState("Opening the quilt…");
  try {
    counts = await Q.getDayCounts().catch(() => ({}));
    await refresh(); loaded = true;
    setState(squares.length ? "" : (IS_TODAY ? "Today's quilt is waiting for its first square." : "No squares were sewn on this day."));
    showAll(false); renderDays();
    if (DEEP_SQ) { const i = squares.findIndex(s => s.code === DEEP_SQ); if (i >= 0) select(i, true, 2.2); }
    const m = Q.mine.get(DAY);
    if (m && m.held && IS_TODAY) flash("Your square is being reviewed before it joins today's quilt.");
  } catch (e) { console.warn(e); setState(OFFLINE); renderDays(); }
}
window.addEventListener("resize", () => { resize(); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readTheme(); renderDays(); });
setInterval(() => { if (IS_TODAY && loaded && document.visibilityState === "visible") refresh().catch(() => { }); }, 180000);
readTheme(); resize(); showAll(false); stats(); requestAnimationFrame(tick);
document.fonts && document.fonts.ready.then(() => { labelCache.clear(); dirty = true; });
load();
