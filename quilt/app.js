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
const cv = $("quilt"), ctx = cv.getContext("2d");
const CELL = 100;
let W = 0, H = 0, dpr = 1, cam = { x: 0, y: 0, s: 1 }, target = null, dirty = true;
function resize() {
  const b = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = b.width; H = b.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); dirty = true;
}
// Small quilts sit inside the stage with room around them instead of filling it.
function fitScale() { return Math.min(W, H) * .9 / ((2 * Math.max(L.R, 2) + 1) * CELL); }
function showAll(animate = true) { const t = { x: 0, y: 0, s: fitScale() }; if (animate && !reduce) target = t; else { cam = t; target = null; } dirty = true; }
function glideTo(i, s = 1.9) { const c = L.cells[i]; if (!c) return; const t = { x: c.gx * CELL, y: c.gy * CELL, s }; if (reduce) { cam = t; target = null; } else target = t; dirty = true; }

function matches(i) {
  if (!query) return true;
  const s = squares[i]; if (!visible(i)) return false;
  const q = query.toLowerCase();
  return s.text.toLowerCase().includes(q) || s.initials.toLowerCase().replace(/\W/g, "").includes(q.replace(/\W/g, "")) || s.code.toLowerCase() === q;
}

function wrapText(t, x, y, w, lh, maxLines) {
  const words = t.split(/\s+/); let line = "", n = 0;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > w && line) {
      if (n === maxLines - 1) { ctx.fillText(line.replace(/\W*$/, "") + "…", x, y); return; }
      ctx.fillText(line, x, y); y += lh; n++; line = word;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const muslin = Q.cssVar("--muslin"), seam = Q.cssVar("--seam"), gold = Q.cssVar("--gold-thread");
  const s = cam.s, size = CELL * s, ox = W / 2 - cam.x * s, oy = H / 2 - cam.y * s, R = L.R;
  const visibleRect = (px, py) => !(px > W || py > H || px + size < 0 || py + size < 0);
  // unsewn places in the current ring
  for (let gx = -R; gx <= R; gx++) for (let gy = -R; gy <= R; gy++) {
    const px = ox + (gx * CELL - CELL / 2) * s, py = oy + (gy * CELL - CELL / 2) * s;
    if (!visibleRect(px, py)) continue;
    ctx.fillStyle = muslin; ctx.fillRect(px, py, size, size);
    if (size > 6) { ctx.strokeStyle = seam; ctx.lineWidth = Math.max(.6, size * .03); ctx.strokeRect(px, py, size, size); }
  }
  if (!squares.length && loaded) {
    const px = ox - CELL / 2 * s, py = oy - CELL / 2 * s;
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(px + 4, py + 4, size - 8, size - 8); ctx.restore();
  }
  const detail = size >= 34, label = size >= 150;
  const myCode = (Q.mine.get(DAY) || {}).code;
  L.cells.forEach((c, i) => {
    const sq = squares[i]; if (!sq) return;
    const px = ox + (c.gx * CELL - CELL / 2) * s, py = oy + (c.gy * CELL - CELL / 2) * s;
    if (!visibleRect(px, py)) return;
    const hidden = !visible(i);
    ctx.globalAlpha = matches(i) ? 1 : .18;
    if (hidden) { ctx.fillStyle = muslin; ctx.fillRect(px, py, size, size); }
    else if (detail) ctx.drawImage(Q.fabricTile(sq.fabric || 0, c.base, c.seed), px, py, size, size);
    else { ctx.fillStyle = c.base; ctx.fillRect(px, py, size, size); }
    if (size > 6) { ctx.strokeStyle = seam; ctx.lineWidth = Math.max(.6, size * .03); ctx.strokeRect(px, py, size, size); }
    if (size > 40 && !hidden) {
      ctx.save(); ctx.setLineDash([size * .06, size * .05]); ctx.strokeStyle = Q.shade(c.base, .45); ctx.globalAlpha *= .55;
      ctx.lineWidth = Math.max(.8, size * .012); const m = size * .07; ctx.strokeRect(px + m, py + m, size - 2 * m, size - 2 * m); ctx.restore();
    }
    if (sq.code === myCode) { ctx.strokeStyle = gold; ctx.lineWidth = Math.max(2, size * .05); ctx.strokeRect(px + 1, py + 1, size - 2, size - 2); }
    if (i === selected) { ctx.strokeStyle = Q.cssVar("--ink"); ctx.lineWidth = Math.max(1.5, size * .025); ctx.strokeRect(px + 3, py + 3, size - 6, size - 6); }
    if (label) {
      const lw = size * .78, lh = size * .62, lx = px + (size - lw) / 2, ly = py + (size - lh) / 2;
      ctx.fillStyle = "rgba(251,247,238,.95)"; ctx.fillRect(lx, ly, lw, lh);
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "rgba(138,103,24,.6)"; ctx.lineWidth = 1; ctx.strokeRect(lx + 4, ly + 4, lw - 8, lh - 8); ctx.restore();
      const fs = Math.min(22, size * .085);
      ctx.fillStyle = "#242019"; ctx.font = `500 ${fs}px "Cormorant Garamond", Georgia, serif`;
      wrapText(hidden ? "Being reviewed" : sq.text, lx + lw * .1, ly + lh * .12 + fs, lw * .8, fs * 1.15, Math.max(1, Math.floor((lh * .7) / (fs * 1.15))));
      if (!hidden) {
        ctx.font = `600 ${Math.min(13, size * .05)}px Manrope, system-ui, sans-serif`; ctx.fillStyle = "#6B6255";
        if (sq.initials) ctx.fillText(sq.initials, lx + lw * .1, ly + lh - lh * .1);
        const k = counters.knots[sq.code] || 0;
        if (k) { ctx.textAlign = "right"; ctx.fillStyle = "#8A6718"; ctx.fillText(`${k} knot${k === 1 ? "" : "s"}`, lx + lw * .9, ly + lh - lh * .1); ctx.textAlign = "left"; }
      }
    }
    const k = counters.knots[sq.code] || 0;
    if (size > 50 && k && !hidden) {
      const n = Math.min(k, 5), r = Math.min(5, Math.max(1.6, size * .022));
      ctx.fillStyle = gold; for (let j = 0; j < n; j++) { ctx.beginPath(); ctx.arc(px + size - size * .1 - j * r * 2.6, py + size * .1, r, 0, 7); ctx.fill(); }
    }
  });
  ctx.globalAlpha = 1;
  const side = (2 * R + 1) * CELL, qx = ox - (R * CELL + CELL / 2) * s, qy = oy - (R * CELL + CELL / 2) * s;
  if (squares.length) {
    ctx.save(); ctx.strokeStyle = gold; ctx.globalAlpha = .55; ctx.lineWidth = Math.max(1.2, side * s * .004);
    ctx.setLineDash([Math.max(4, side * s * .012), Math.max(3, side * s * .008)]); ctx.beginPath();
    L.poly.forEach(([u, v], i) => { const X = qx + u * side * s, Y = qy + v * side * s; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
    ctx.closePath(); ctx.stroke(); ctx.restore();
  }
  ctx.strokeStyle = Q.isChristmas(DAY) ? gold : Q.cssVar("--binding");
  ctx.lineWidth = Math.max(2, side * s * .008); ctx.strokeRect(qx, qy, side * s, side * s);
  dirty = false;
}
function tick() {
  if (target) {
    const k = .16; cam.x += (target.x - cam.x) * k; cam.y += (target.y - cam.y) * k; cam.s *= Math.pow(target.s / cam.s, k);
    if (Math.abs(target.x - cam.x) < .5 && Math.abs(target.y - cam.y) < .5 && Math.abs(target.s / cam.s - 1) < .002) { cam = target; target = null; }
    dirty = true;
  }
  if (dirty) draw();
  requestAnimationFrame(tick);
}

// ---------------------------------------------------------------- gestures
const pointers = new Map(); let lastPinch = 0, moved = 0;
function zoomAt(f, sx, sy) {
  const wx = cam.x + (sx - W / 2) / cam.s, wy = cam.y + (sy - H / 2) / cam.s;
  const ns = Math.max(fitScale() * .6, Math.min(2.8, cam.s * f));
  cam.x = wx - (sx - W / 2) / ns; cam.y = wy - (sy - H / 2) / ns; cam.s = ns; target = null; dirty = true;
}
cv.addEventListener("wheel", e => { e.preventDefault(); const b = cv.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * .0015), e.clientX - b.left, e.clientY - b.top); }, { passive: false });
cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0; cv.classList.add("dragging"); target = null; $("hint").hidden = true; });
cv.addEventListener("pointermove", e => {
  if (!pointers.has(e.pointerId)) return; const p = pointers.get(e.pointerId);
  if (pointers.size === 1) { cam.x -= (e.clientX - p.x) / cam.s; cam.y -= (e.clientY - p.y) / cam.s; moved += Math.abs(e.clientX - p.x) + Math.abs(e.clientY - p.y); }
  p.x = e.clientX; p.y = e.clientY;
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y), r = cv.getBoundingClientRect();
    if (lastPinch) zoomAt(d / lastPinch, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); lastPinch = d; moved += 10;
  }
  dirty = true;
});
function up(e) {
  const was = pointers.size; pointers.delete(e.pointerId); if (pointers.size < 2) lastPinch = 0; cv.classList.remove("dragging");
  if (was === 1 && moved < 6) { const b = cv.getBoundingClientRect(); tap(e.clientX - b.left, e.clientY - b.top); }
}
cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
cv.addEventListener("keydown", e => {
  const step = 60 / cam.s, map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (map[e.key]) { cam.x += map[e.key][0]; cam.y += map[e.key][1]; dirty = true; e.preventDefault(); }
  if (e.key === "+" || e.key === "=") { zoomAt(1.4, W / 2, H / 2); e.preventDefault(); }
  if (e.key === "-") { zoomAt(1 / 1.4, W / 2, H / 2); e.preventDefault(); }
  if (e.key === "Enter") { const i = indexAt(W / 2, H / 2); if (i >= 0) select(i, true); }
});
function indexAt(sx, sy) {
  const wx = cam.x + (sx - W / 2) / cam.s, wy = cam.y + (sy - H / 2) / cam.s;
  const gx = Math.round(wx / CELL), gy = Math.round(wy / CELL);
  return L.cells.findIndex(c => c.gx === gx && c.gy === gy);
}
function tap(sx, sy) { const i = indexAt(sx, sy); if (i >= 0 && squares[i]) select(i, CELL * cam.s < 150); }
$("zin").onclick = () => zoomAt(1.6, W / 2, H / 2);
$("zout").onclick = () => zoomAt(1 / 1.6, W / 2, H / 2);
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
    counters.reports[sq.code] = (counters.reports[sq.code] || 0) + 1;
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
$("q").addEventListener("input", e => { query = e.target.value.trim(); dirty = true; renderList(); $("all-results").hidden = true; });
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
  const c = document.createElement("canvas"); c.width = c.height = 64; c.getContext("2d").drawImage(Q.fabricTile(i, ["#6B2F3A", "#3D4A6B", "#5F6B4E", "#7A5A3A", "#4A3A4F", "#8A4B3A", "#2F4B4B"][i], i), 0, 0, 64, 64);
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
  squares = sq; counters = c; L = Q.layout(DAY, squares.length);
  if (grew && !target && cam.s <= fitScale() * 1.05) showAll(false);
  stats(); renderList(); dirty = true;
  const m = Q.mine.get(DAY);
  $("mine").hidden = !(m && squares.some(s => s.code === m.code));
  if (selected >= 0 && squares[selected]) select(selected);
}
async function load() {
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
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { dirty = true; renderDays(); });
setInterval(() => { if (IS_TODAY && loaded && document.visibilityState === "visible") refresh().catch(() => { }); }, 180000);
resize(); showAll(false); stats(); requestAnimationFrame(tick);
document.fonts && document.fonts.ready.then(() => dirty = true);
load();
