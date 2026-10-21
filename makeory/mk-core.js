/* Makeory demo core: config, icons, product art, seed data, manufacturing adapters, router, store.
   Everything here is simulated. No network calls, no payment, no manufacturer contact. */
"use strict";
window.MK = window.MK || {};
(function (MK) {

/* ---------------- config ---------------- */
MK.CONFIG = {
  platformFeeRate: 0.15,          // Makeory fee as a share of the customer price. Change here only.
  currency: "USD",
  demoProfile: { name: "Sam Rivera", initials: "SR", handle: "samrivera" },
};

/* ---------------- tiny helpers ---------------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = m => (m < 0 ? "-$" : "$") + (Math.abs(m) / 100).toFixed(2);
const toMinor = d => Math.round((+d || 0) * 100);
const uid = p => p + "_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
const days = n => n === 1 ? "1 day" : n + " days";
const fmtDate = t => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const ago = t => { const s = (Date.now() - t) / 1000; if (s < 60) return "just now"; if (s < 3600) return Math.round(s / 60) + " min ago"; if (s < 86400) return Math.round(s / 3600) + " h ago"; return Math.round(s / 86400) + " d ago"; };
function hash(str) { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let s = hash(seed) || 1; return () => (s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909), (s >>> 0) / 4294967296); }
Object.assign(MK, { esc, money, toMinor, uid, days, fmtDate, ago, hash, rng });

/* ---------------- icons (Lucide-style strokes, inlined) ---------------- */
const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="16" cy="16" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
  shirt: '<path d="M20.4 6.6 16 4a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.5 1.2l1.2 3.6a1 1 0 0 0 1.3.6L7 11.5V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8.5l1.4.5a1 1 0 0 0 1.3-.6l1.2-3.6a1 1 0 0 0-.5-1.2Z"/>',
  cube: '<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkc: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  alert: '<path d="m10.3 3.9-8.4 14A2 2 0 0 0 3.6 21h16.8a2 2 0 0 0 1.7-3.1l-8.4-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  factory: '<path d="M2 20V9l6 4V9l6 4V4h6v16Z"/><path d="M6 17h2M11 17h2M16 17h2"/>',
  store: '<path d="M3 9 4.5 4h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M10 20v-5h4v5"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  truck: '<path d="M1 3h15v13H1Z"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  rotate: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v13H5a2 2 0 0 1-2-2V5"/><path d="M16 13h.01"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
};
MK.ic = (name, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || ""}</svg>`;
MK.markSvg = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 18V7l7 6 7-6v11" fill="none" stroke="#F8F7F3" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="5" r="1.6" fill="#789584"/></svg>`;

/* ---------------- product art (illustrated renders, generated as SVG) ---------------- */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = amt < 0 ? 0 : 255, t = Math.abs(amt);
  r = Math.round((f - r) * t + r); g = Math.round((f - g) * t + g); b = Math.round((f - b) * t + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
MK.shade = shade;
function motif(kind, x, y, s, c, c2, seed) {
  const R = rng(seed);
  if (kind === "orbit") return `<g transform="translate(${x} ${y})"><circle r="${s * .42}" fill="none" stroke="${c2}" stroke-width="${s * .035}"/><circle r="${s * .26}" fill="${c2}" opacity=".9"/><circle cx="${s * .42}" cy="0" r="${s * .07}" fill="${c}"/><circle cx="${-s * .3}" cy="${-s * .3}" r="${s * .045}" fill="${c2}"/></g>`;
  if (kind === "wave") { let d = ""; for (let i = 0; i < 4; i++) { const yy = y - s * .3 + i * s * .2; d += `<path d="M${x - s * .45} ${yy} q ${s * .225} ${-s * .14} ${s * .45} 0 t ${s * .45} 0" fill="none" stroke="${c2}" stroke-width="${s * .045}" stroke-linecap="round" opacity="${1 - i * .18}"/>`; } return d; }
  if (kind === "mountain") return `<g transform="translate(${x} ${y})"><circle cx="${s * .18}" cy="${-s * .2}" r="${s * .1}" fill="${c2}"/><path d="M${-s * .45} ${s * .3} L${-s * .12} ${-s * .18} L${s * .05} ${s * .05} L${s * .2} ${-s * .06} L${s * .45} ${s * .3}Z" fill="${c2}"/></g>`;
  if (kind === "leaf") return `<g transform="translate(${x} ${y}) rotate(-20)"><path d="M0 ${-s * .42} C ${s * .32} ${-s * .2} ${s * .32} ${s * .22} 0 ${s * .42} C ${-s * .32} ${s * .22} ${-s * .32} ${-s * .2} 0 ${-s * .42}Z" fill="${c2}"/><path d="M0 ${-s * .36} V ${s * .4}" stroke="${c}" stroke-width="${s * .03}"/></g>`;
  if (kind === "grid") { let g = ""; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g += `<rect x="${x - s * .36 + i * s * .26}" y="${y - s * .36 + j * s * .26}" width="${s * .2}" height="${s * .2}" rx="${s * .03}" fill="${c2}" opacity="${.45 + R() * .55}"/>`; return g; }
  if (kind === "star") { let d = ""; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, r = i % 2 ? s * .17 : s * .42; d += (i ? "L" : "M") + (x + Math.cos(a) * r).toFixed(1) + " " + (y + Math.sin(a) * r).toFixed(1); } return `<path d="${d}Z" fill="${c2}"/>`; }
  if (kind === "type") return `<text x="${x}" y="${y + s * .12}" text-anchor="middle" font-family="Manrope,system-ui,sans-serif" font-weight="800" font-size="${s * .34}" fill="${c2}" letter-spacing="-1">${esc(MK._artTitle || "MAKE")}</text>`;
  return `<circle cx="${x}" cy="${y}" r="${s * .35}" fill="${c2}"/>`;
}
function textOn(t, x, y, size, fill, anchor = "middle", w = 800) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Manrope,system-ui,sans-serif" font-weight="${w}" font-size="${size}" fill="${fill}" letter-spacing="-.5">${esc(t)}</text>`;
}
/* spec: {kind, c1 (main), c2 (accent), bg, title, motif, image(dataURL optional), view(0..2)} */
MK.art = function (spec) {
  const s = Object.assign({ kind: "box", c1: "#3659D9", c2: "#F2C14E", bg: "#EEEDE6", title: "", motif: "orbit", view: 0 }, spec);
  const id = "a" + (hash(JSON.stringify([s.kind, s.c1, s.c2, s.title, s.view, (s.image || "").length])) % 1e8);
  MK._artTitle = (s.title || "").split(" ")[0].slice(0, 6).toUpperCase();
  const img = (x, y, w, h, clip) => s.image ? `<clipPath id="${id}${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/></clipPath><image href="${s.image}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}${clip})"/>` : "";
  const dark = shade(s.c1, -.28), light = shade(s.c1, .18), sh = `<ellipse cx="200" cy="338" rx="120" ry="14" fill="#000" opacity=".08"/>`;
  let body = "";
  const v = s.view;
  switch (s.kind) {
    case "box": case "cardgame": case "tabletop": {
      const tilt = v === 1 ? 14 : 0;
      body = `${sh}<g transform="rotate(${-tilt} 200 210)"><path d="M92 150 L200 112 L318 150 L210 190Z" fill="${light}"/><path d="M92 150 L210 190 L210 318 L92 278Z" fill="${s.c1}"/><path d="M210 190 L318 150 L318 280 L210 318Z" fill="${dark}"/>
      <g transform="matrix(1 .339 0 1 92 150)"><rect x="14" y="16" width="90" height="96" rx="6" fill="${shade(s.c1, .08)}"/>${s.image ? img(14, 16, 90, 96, "b") : motif(s.motif, 59, 54, 70, s.c1, s.c2, s.title)}<text x="59" y="104" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="10.5" fill="#fff">${esc((s.title || "").toUpperCase().slice(0, 18))}</text></g></g>`;
      break;
    }
    case "deck": {
      const card = (rot, dx, front) => `<g transform="translate(${200 + dx} 205) rotate(${rot})"><rect x="-62" y="-90" width="124" height="180" rx="12" fill="${front ? "#FFFFFF" : s.c1}" stroke="${front ? "#E5E5DF" : dark}" stroke-width="2"/>${front ? (s.image ? img(-52, -80, 104, 160, "d") : motif(s.motif, 0, -6, 92, s.c1, s.c1 === s.c2 ? light : s.c1, s.title) + `<text x="-48" y="-62" font-family="Manrope,sans-serif" font-weight="800" font-size="16" fill="${s.c1}">7</text>`) : `<rect x="-50" y="-78" width="100" height="156" rx="8" fill="none" stroke="${s.c2}" stroke-width="2"/>${motif("star", 0, 0, 60, s.c1, s.c2, "x")}`}</g>`;
      body = `${sh}${card(-14, -46, false)}${card(-3, -10, false)}${card(9, 34, true)}`;
      break;
    }
    case "board": {
      let tiles = ""; const R = rng(s.title + "b");
      for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { const e = i === 0 || j === 0 || i === 5 || j === 5; tiles += `<rect x="${102 + i * 33}" y="${102 + j * 33}" width="30" height="30" rx="5" fill="${e ? (R() > .5 ? s.c2 : light) : "#FBFAF6"}" opacity="${e ? .95 : 1}"/>`; }
      body = `${sh}<g transform="rotate(${v === 1 ? 0 : -8} 200 200)"><rect x="88" y="88" width="224" height="224" rx="18" fill="${s.c1}"/>${tiles}${s.image ? img(150, 150, 100, 100, "bd") : `<circle cx="200" cy="200" r="34" fill="${s.c1}"/>${motif(s.motif, 200, 200, 50, s.c1, s.c2, s.title)}`}<circle cx="118" cy="118" r="9" fill="${dark}"/><circle cx="282" cy="250" r="9" fill="#fff" stroke="${dark}" stroke-width="3"/></g>`;
      break;
    }
    case "book": case "journal": case "workbook": case "childrens": case "hardcover": {
      const band = s.kind === "journal";
      body = `${sh}<g transform="translate(${v === 1 ? 10 : 0} 0)"><path d="M132 74 h134 a8 8 0 0 1 8 8 v244 a8 8 0 0 1 -8 8 H132Z" fill="${s.c1}"/><rect x="118" y="74" width="20" height="260" rx="4" fill="${dark}"/><rect x="264" y="80" width="8" height="248" fill="#F4F1E8"/>
      ${s.image ? img(146, 90, 112, 170, "bk") : `<rect x="146" y="92" width="112" height="112" rx="8" fill="${light}" opacity=".5"/>${motif(s.motif, 202, 148, 96, s.c1, s.c2, s.title)}`}
      ${textOn((s.title || "Untitled").slice(0, 16), 202, 236, 15, "#fff")}${textOn(s.sub || "", 202, 256, 10, shade(s.c1, .55), "middle", 600)}
      ${band ? `<rect x="244" y="74" width="9" height="260" fill="${s.c2}"/>` : ""}</g>`;
      break;
    }
    case "tee": case "hoodie": {
      const hood = s.kind === "hoodie";
      const path = hood ? "M138 92 Q200 60 262 92 L326 130 L304 196 L276 184 L276 334 L124 334 L124 184 L96 196 L74 130Z" : "M150 84 Q200 112 250 84 L326 120 L302 186 L272 172 L272 334 L128 334 L128 172 L98 186 L74 120Z";
      body = `${sh}<path d="${path}" fill="${s.c1}"/>${hood ? `<path d="M160 96 Q200 150 240 96" fill="none" stroke="${dark}" stroke-width="6"/><path d="M150 262 h100 v40 h-100Z" fill="${dark}" opacity=".35"/>` : `<path d="M150 84 Q200 112 250 84" fill="none" stroke="${dark}" stroke-width="5"/>`}
      ${s.image ? img(160, 140, 80, 90, "t") : motif(s.motif, 200, 182, 74, s.c1, s.c2, s.title)}`;
      break;
    }
    case "tote":
      body = `${sh}<path d="M160 120 C160 60 240 60 240 120" fill="none" stroke="${dark}" stroke-width="9"/><path d="M110 120 H290 L300 334 H100Z" fill="${s.c1}"/>${s.image ? img(150, 170, 100, 110, "to") : motif(s.motif, 200, 226, 100, s.c1, s.c2, s.title)}`;
      break;
    case "mug":
      body = `${sh}<path d="M282 160 c46 0 46 96 0 96" fill="none" stroke="${dark}" stroke-width="16"/><rect x="110" y="120" width="176" height="210" rx="20" fill="${s.c1}"/><ellipse cx="198" cy="122" rx="88" ry="14" fill="${dark}"/>${s.image ? img(140, 170, 116, 110, "m") : motif(s.motif, 198, 224, 96, s.c1, s.c2, s.title)}`;
      break;
    case "poster":
      body = `${sh}<rect x="104" y="64" width="192" height="262" rx="6" fill="#2A2E2B"/><rect x="116" y="76" width="168" height="238" fill="${shade(s.c1, .72)}"/>${s.image ? img(116, 76, 168, 238, "p") : `<circle cx="200" cy="168" r="52" fill="${s.c2}"/><path d="M116 314 L176 220 L216 262 L246 228 L284 314Z" fill="${s.c1}"/>`}`;
      break;
    case "object": default: {
      const R = rng(s.title + "o"); const k = (R() * 3) | 0;
      if (s.image) body = `${sh}<image href="${s.image}" x="40" y="30" width="320" height="320" preserveAspectRatio="xMidYMid meet"/>`;
      else if (k === 0) body = `${sh}<path d="M128 150 L200 118 L272 150 L252 318 L148 318Z" fill="${s.c1}"/><path d="M200 118 L272 150 L252 318 L200 300Z" fill="${dark}"/><path d="M128 150 L200 182 L272 150 L200 118Z" fill="${light}"/><path d="M200 182 V300" stroke="${shade(s.c1, -.12)}" stroke-width="2"/><path d="M168 140 q10 -50 30 -70 M206 132 q20 -40 46 -52" stroke="${s.c2}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
      else if (k === 1) body = `${sh}<ellipse cx="200" cy="314" rx="78" ry="16" fill="${dark}"/><path d="M196 310 L196 170" stroke="${dark}" stroke-width="10"/><path d="M120 176 Q200 70 280 176Z" fill="${s.c1}"/><path d="M200 108 Q258 120 280 176 L200 176Z" fill="${dark}" opacity=".55"/><ellipse cx="200" cy="178" rx="40" ry="8" fill="${s.c2}"/>`;
      else body = `${sh}<path d="M106 300 L200 254 L294 300 L200 346Z" fill="${dark}"/><path d="M106 300 V200 L200 154 V254Z" fill="${s.c1}"/><path d="M200 154 L294 200 V300 L200 254Z" fill="${shade(s.c1, -.15)}"/><path d="M106 200 L200 154 L294 200 L200 246Z" fill="${light}"/><circle cx="200" cy="200" r="22" fill="${s.c2}"/>`;
    }
  }
  return `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(s.title || s.kind)} illustration" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="${s.bg}"/>${body}</svg>`;
};

/* ---------------- categories, templates ---------------- */
MK.CATS = [
  { id: "games", name: "Games", blurb: "Create card games, tabletop games, and board games.", icon: "dice", art: { kind: "deck", c1: "#3659D9", c2: "#F2C14E", bg: "#E9ECF5", title: "Starfall", motif: "orbit" } },
  { id: "books", name: "Books", blurb: "Create journals, children's books, workbooks, and publications.", icon: "book", art: { kind: "book", c1: "#56705F", c2: "#F1D7A6", bg: "#EEF1EA", title: "Field Journal", motif: "mountain" } },
  { id: "apparel", name: "Apparel & Merchandise", blurb: "Create clothing, accessories, and personalized gifts.", icon: "shirt", art: { kind: "tee", c1: "#202522", c2: "#E9B872", bg: "#F3EEE4", title: "Tide", motif: "wave" } },
  { id: "objects", name: "3D Objects", blurb: "Create original physical products and prototypes.", icon: "cube", art: { kind: "object", c1: "#C9734A", c2: "#789584", bg: "#F4ECE6", title: "Facet", motif: "leaf" } },
];
MK.SUBTYPES = {
  games: [
    { id: "cardgame", name: "Card game", kind: "box", d: "A boxed card game with rules" },
    { id: "deck", name: "Custom deck", kind: "deck", d: "A standalone deck of cards" },
    { id: "board", name: "Board game", kind: "board", d: "Board, cards and pieces" },
    { id: "tabletop", name: "Tabletop kit", kind: "box", d: "Tokens, tiles and components" },
  ],
  books: [
    { id: "paperback", name: "Paperback", kind: "book" }, { id: "hardcover", name: "Hardcover", kind: "book" },
    { id: "journal", name: "Journal", kind: "journal" }, { id: "workbook", name: "Workbook", kind: "book" }, { id: "childrens", name: "Children's book", kind: "book" },
  ],
  apparel: [
    { id: "tee", name: "T-shirt", kind: "tee", area: [12, 16] }, { id: "hoodie", name: "Hoodie", kind: "hoodie", area: [12, 14] },
    { id: "tote", name: "Tote bag", kind: "tote", area: [12, 12] }, { id: "mug", name: "Mug", kind: "mug", area: [8.5, 3.5] },
  ],
  objects: [{ id: "object", name: "3D object", kind: "object" }],
};
MK.PALETTE = ["#3659D9", "#202522", "#789584", "#C9734A", "#E9B872", "#8E5A9B", "#2F7A7B", "#B8443A", "#F1EDE3", "#D8DFF7"];

/* ---------------- seed marketplace (fictional creators, demo only) ---------------- */
const C = (id, name, bio) => ({ id, name, bio, demo: true });
MK.CREATORS = {
  ada: C("ada", "Ada Kestrel", "Illustrator and game designer making small-box games about the sea and the sky."),
  northfold: C("northfold", "Northfold Games", "A two-person tabletop studio that tests every game at a kitchen table first."),
  wren: C("wren", "Wren & Ink", "Hand-lettered journals and planners for people who still write things down."),
  lowtide: C("lowtide", "Low Tide Studio", "Screen-print style apparel inspired by coastlines."),
  paper: C("paper", "Paper Orbit Press", "Picture books and workbooks for curious kids."),
  mesa: C("mesa", "Mesa Form Lab", "Faceted planters, lamps and desk objects, designed in 3D and printed on demand."),
  marigold: C("marigold", "Marigold Print House", "Art prints and posters with bold, simple shapes."),
};
const prod = (o) => Object.assign({ customizable: false, variants: [], gallery: 3 }, o);
MK.SEED = [
  prod({ slug: "starfall-card-game", title: "Starfall", creator: "ada", cat: "games", kind: "box", price: 3400, c1: "#2B3A8C", c2: "#F2C14E", bg: "#E9ECF5", motif: "orbit",
    desc: "A 20-minute card game for 2 to 4 players. Chart constellations, trade stars and race the dawn.", variants: ["Standard edition", "With score pad"], materials: "Linen-finish card stock, rigid two-part box", method: "Printed cards and box", provider: "gamecrafter", prodDays: [10, 14], shipDays: [5, 8] }),
  prod({ slug: "tidecaller-deck", title: "Tidecaller Deck", creator: "ada", cat: "games", kind: "deck", price: 2200, c1: "#2F7A7B", c2: "#F1EDE3", bg: "#E6F0EF", motif: "wave", customizable: true,
    desc: "A 54-card illustrated deck with tide-themed suits. Works with any standard card game.", variants: ["Poker size", "Tarot size"], materials: "Smooth card stock, tuck box", method: "Printed cards", provider: "gamecrafter", prodDays: [7, 10], shipDays: [5, 8] }),
  prod({ slug: "harbor-lights-board-game", title: "Harbor Lights", creator: "northfold", cat: "games", kind: "board", price: 5800, c1: "#3659D9", c2: "#E9B872", bg: "#ECEEF6", motif: "star",
    desc: "Build lighthouses and guide ships home in this cooperative board game for 1 to 4 players.", variants: ["Base game"], materials: "Folding board, wooden pawns, cards, rulebook", method: "Printed board and components", provider: "gamecrafter", prodDays: [14, 21], shipDays: [5, 8] }),
  prod({ slug: "pocket-dungeon-kit", title: "Pocket Dungeon Kit", creator: "northfold", cat: "games", kind: "tabletop", price: 2600, c1: "#8E5A9B", c2: "#F2C14E", bg: "#F1EBF3", motif: "grid",
    desc: "Modular tiles, tokens and a solo campaign that fits in a jacket pocket.", variants: ["Kit"], materials: "Chipboard tiles, tokens, mini box", method: "Printed components", provider: "gamecrafter", prodDays: [10, 14], shipDays: [5, 8] }),
  prod({ slug: "slow-mornings-journal", title: "Slow Mornings", creator: "wren", cat: "books", kind: "journal", price: 2400, c1: "#56705F", c2: "#F1D7A6", bg: "#EEF1EA", motif: "leaf", sub: "A 90-day journal", customizable: true,
    desc: "A 90-day guided morning journal with prompts, trackers and plenty of blank space.", variants: ["Lined", "Dot grid"], materials: "Hardcover, 160 pages, cream paper", method: "Print on demand book", provider: "lulu", prodDays: [3, 5], shipDays: [4, 7] }),
  prod({ slug: "the-quiet-planner", title: "The Quiet Planner", creator: "wren", cat: "books", kind: "book", price: 2800, c1: "#202522", c2: "#E9B872", bg: "#F2EFE8", motif: "grid", sub: "Undated, 12 months",
    desc: "An undated planner built around weekly reflection rather than endless lists.", variants: ["Paperback", "Hardcover"], materials: "6 x 9 in, 220 pages", method: "Print on demand book", provider: "lulu", prodDays: [3, 5], shipDays: [4, 7] }),
  prod({ slug: "moon-for-milo", title: "A Moon for Milo", creator: "paper", cat: "books", kind: "childrens", price: 1800, c1: "#3659D9", c2: "#F2C14E", bg: "#EAEEFA", motif: "orbit", sub: "Picture book",
    desc: "A bedtime picture book about a boy who keeps the moon in his pocket.", variants: ["Paperback"], materials: "8.5 x 8.5 in, 32 pages, full color", method: "Print on demand book", provider: "lulu", prodDays: [3, 6], shipDays: [4, 7] }),
  prod({ slug: "low-tide-tee", title: "Low Tide Tee", creator: "lowtide", cat: "apparel", kind: "tee", price: 3200, c1: "#202522", c2: "#E9B872", bg: "#F3EEE4", motif: "wave", customizable: true,
    desc: "A heavyweight cotton tee with a sunset wave print on the chest.", variants: ["S", "M", "L", "XL", "2XL"], materials: "100% cotton", method: "Direct-to-garment print", provider: "printful", prodDays: [2, 5], shipDays: [3, 6] }),
  prod({ slug: "drift-hoodie", title: "Drift Hoodie", creator: "lowtide", cat: "apparel", kind: "hoodie", price: 5400, c1: "#789584", c2: "#F1EDE3", bg: "#ECF0EC", motif: "mountain",
    desc: "A soft fleece hoodie with a mountain-and-sun print.", variants: ["S", "M", "L", "XL"], materials: "Cotton-poly fleece", method: "Direct-to-garment print", provider: "printful", prodDays: [2, 5], shipDays: [3, 6] }),
  prod({ slug: "first-light-mug", title: "First Light Mug", creator: "marigold", cat: "apparel", kind: "mug", price: 1900, c1: "#F1EDE3", c2: "#C9734A", bg: "#F4ECE6", motif: "orbit", customizable: true,
    desc: "An 11 oz ceramic mug printed with a sunrise mark.", variants: ["11 oz", "15 oz"], materials: "Glossy ceramic", method: "Sublimation print", provider: "printify", prodDays: [2, 4], shipDays: [3, 6] }),
  prod({ slug: "facet-planter", title: "Facet Planter", creator: "mesa", cat: "objects", kind: "object", price: 3800, c1: "#C9734A", c2: "#789584", bg: "#F4ECE6", motif: "leaf",
    desc: "A faceted desk planter with a hidden drainage tray.", variants: ["Terracotta", "Sage", "Ink"], materials: "Plant-based PLA", method: "3D printing (FDM)", provider: "treatstock", prodDays: [4, 7], shipDays: [4, 8] }),
  prod({ slug: "orbit-desk-lamp", title: "Orbit Desk Lamp", creator: "mesa", cat: "objects", kind: "object", price: 7600, c1: "#202522", c2: "#E9B872", bg: "#EFEEE8", motif: "orbit",
    desc: "A small desk lamp shade with a printed base. Lighting kit sold separately.", variants: ["Ink", "Ivory"], materials: "PETG shade, PLA base", method: "3D printing (FDM)", provider: "treatstock", prodDays: [5, 9], shipDays: [4, 8] }),
  prod({ slug: "sunset-shapes-print", title: "Sunset Shapes", creator: "marigold", cat: "prints", kind: "poster", price: 2900, c1: "#C9734A", c2: "#F2C14E", bg: "#F6EFE7", motif: "orbit",
    desc: "A giclée art print of overlapping sunset shapes.", variants: ["12 x 16 in", "18 x 24 in"], materials: "Archival matte paper", method: "Giclée print", provider: "prodigi", prodDays: [2, 4], shipDays: [3, 7] }),
];
MK.seedArt = (p, view = 0) => MK.art({ kind: p.kind, c1: p.c1, c2: p.c2, bg: p.bg, title: p.title, motif: p.motif, sub: p.sub, image: p.image, view });
MK.CAT_LABEL = { games: "Games", books: "Books", apparel: "Apparel & Merch", objects: "3D Objects", prints: "Art Prints" };

/* ---------------- manufacturing adapters (mock) ----------------
   Read-only shape mirrors the brief's ManufacturerAdapter. Every figure is ILLUSTRATIVE and
   computed locally; none is a real quote from the named company. */
const cap = (o) => Object.assign({ supportsSingleUnit: true, supportsQuotes: true, supportsPrototypes: true, supportsAutomatedOrders: true, supportsTracking: true, regions: ["US", "EU", "UK", "CA", "AU"], demoOnly: true }, o);
const PROVIDERS = {
  gamecrafter: { name: "The Game Crafter", short: "Game Crafter", docs: "https://www.thegamecrafter.com/developer/", method: "Printed cards, boards, boxes and components",
    blurb: "Custom card games, board games and tabletop components in small runs.", status: "Integration candidate. API keys documented as free; resale and marketplace terms to confirm.",
    cap: cap({ providerId: "gamecrafter", categories: ["games"], fileFormats: ["PNG", "PDF"] }) },
  lulu: { name: "Lulu", short: "Lulu", docs: "https://lulu.apidocumentation.com/", method: "Print on demand books",
    blurb: "Paperback and hardcover books, journals, workbooks and picture books.", status: "Integration candidate. Sandbox available; use only when configured safely.",
    cap: cap({ providerId: "lulu", categories: ["books"], fileFormats: ["PDF"] }) },
  printful: { name: "Printful", short: "Printful", docs: "https://developers.printful.com/docs/", method: "DTG, embroidery and sublimation",
    blurb: "Apparel and merchandise with catalogs, variants, print files and tracking.", status: "Integration candidate. Demo uses mock data only.",
    cap: cap({ providerId: "printful", categories: ["apparel"], fileFormats: ["PNG", "JPG"] }) },
  printify: { name: "Printify", short: "Printify", docs: "https://developers.printify.com/", method: "Print on demand through a print-provider network",
    blurb: "Alternative merchandise network for catalog browsing, variants and fulfillment.", status: "Integration candidate. Demo uses mock data only.",
    cap: cap({ providerId: "printify", categories: ["apparel"], fileFormats: ["PNG", "JPG"] }) },
  prodigi: { name: "Prodigi", short: "Prodigi", docs: "https://www.prodigi.com/print-api/docs/reference/", method: "Giclée prints, posters, stationery",
    blurb: "Art prints, wall decor, stationery and personalized gifts.", status: "Integration candidate. Sandbox available.",
    cap: cap({ providerId: "prodigi", categories: ["prints", "apparel"], fileFormats: ["PNG", "JPG", "PDF"] }) },
  treatstock: { name: "Treatstock", short: "Treatstock", docs: "", method: "3D printing network (FDM, SLA, SLS)",
    blurb: "3D printed objects and prototypes through a manufacturing network.", status: "Mock adapter only. API pricing, permissions and availability must be confirmed.",
    cap: cap({ providerId: "treatstock", categories: ["objects"], fileFormats: ["STL", "3MF"], supportsAutomatedOrders: false, supportsTracking: false }) },
};
MK.PROVIDERS = PROVIDERS;

/* illustrative unit-cost models, in cents */
function unitCost(pid, p) {
  const s = p.spec || {};
  if (pid === "gamecrafter") {
    const cards = +s.cards || 54, comp = (s.components || []).length;
    let c = 400 + cards * 9 + comp * 140 + (p.subtype === "board" ? 900 : 0) + (p.subtype === "cardgame" || p.subtype === "tabletop" ? 350 : 0);
    return c;
  }
  if (pid === "lulu") {
    const pages = +s.pages || 120, hard = s.binding === "Casewrap hardcover" || p.subtype === "hardcover", color = s.interior === "Full color";
    return Math.round((hard ? 900 : 300) + pages * (color ? 6.5 : 1.4));
  }
  if (pid === "printful" || pid === "printify") {
    const base = { tee: 1250, hoodie: 2550, tote: 1350, mug: 900 }[p.subtype] || 1200;
    return pid === "printify" ? Math.round(base * .9) : base;
  }
  if (pid === "prodigi") return 1100;
  if (pid === "treatstock") {
    const vol = +s.volumeCm3 || 120, rate = { PLA: 11, PETG: 13, Resin: 34, Nylon: 42 }[s.material] || 12;
    return Math.round(600 + vol * rate * (s.finish === "Sanded & painted" ? 1.6 : 1));
  }
  return 1500;
}
const SHIP = { gamecrafter: [799, 5, 9], lulu: [499, 4, 8], printful: [479, 3, 6], printify: [450, 4, 8], prodigi: [550, 3, 7], treatstock: [899, 4, 9] };
const PROD = { gamecrafter: [10, 15], lulu: [3, 6], printful: [2, 5], printify: [3, 6], prodigi: [2, 4], treatstock: [4, 9] };
const MIN = { gamecrafter: 1, lulu: 1, printful: 1, printify: 1, prodigi: 1, treatstock: 1 };

function makeAdapter(pid) {
  const d = PROVIDERS[pid];
  return {
    id: pid,
    getCapabilities: () => d.cap,
    listProducts: async () => [],
    validateDesign: async (project) => MK.validate(project, pid),
    getQuote: async (req) => {
      const unit = unitCost(pid, req.project), qty = Math.max(1, req.quantity | 0);
      const breaks = qty >= 50 ? .78 : qty >= 10 ? .88 : 1;
      const u = Math.round(unit * breaks), sh = SHIP[pid][0] + Math.max(0, qty - 1) * Math.round(SHIP[pid][0] * .18);
      return { providerId: pid, illustrative: true, unitMinor: u, quantity: qty, shippingMinor: sh, totalMinor: u * qty + sh, productionDays: PROD[pid], shippingDays: [SHIP[pid][1], SHIP[pid][2]], minQuantity: MIN[pid], at: Date.now() };
    },
    getOrderStatus: async () => ({ state: "DEMO_NOT_SUBMITTED" }),
  };
}
MK.ADAPTERS = Object.fromEntries(Object.keys(PROVIDERS).map(k => [k, makeAdapter(k)]));
/* Production order submission is a separate interface, disabled in the demo. */
MK.ProductionOrderGateway = { submit() { throw new Error("Production orders are disabled in the Makeory demo. No manufacturer is contacted."); } };

/* router: provider-neutral matching on structured requirements */
MK.matchProviders = function (project) {
  const req = MK.requirements(project);
  return Object.values(MK.ADAPTERS).map(a => {
    const c = a.getCapabilities(); const reasons = [];
    if (!c.categories.includes(req.category)) reasons.push("Does not make " + (MK.CAT_LABEL[req.category] || req.category).toLowerCase());
    if (req.fileType && !c.fileFormats.includes(req.fileType)) reasons.push("Needs " + c.fileFormats.join("/") + " files");
    if (req.quantity === 1 && !c.supportsSingleUnit) reasons.push("No single units");
    return { adapter: a, cap: c, compatible: reasons.length === 0, reasons };
  });
};
MK.requirements = function (p) {
  const s = p.spec || {};
  return { category: p.cat, material: s.material || null, dimensions: s.dims || null, quantity: s.qty || 1, fileType: p.cat === "objects" ? (s.fileType || "STL") : p.cat === "books" ? "PDF" : null, printingMethod: null, shippingDestination: "US", customization: false };
};

/* simulated validation, per category; returns {items:[{level,text}], ok} */
MK.validate = function (p, pid) {
  const s = p.spec || {}, out = [];
  const add = (level, text) => out.push({ level, text });
  add("info", "Simulated check in this demo. A live integration would validate with " + (PROVIDERS[pid] ? PROVIDERS[pid].name : "the manufacturer") + " before production.");
  if (!p.title || p.title.trim().length < 2) add("err", "Give the product a name.");
  if (p.cat === "games") {
    const cards = +s.cards || 0;
    if (p.subtype !== "board" && (cards < 18 || cards > 300)) add("err", "Card count must be between 18 and 300.");
    else add("ok", cards + " cards fit a standard " + (cards > 120 ? "large" : "small") + " deck box.");
    if (!s.boxArt && !s.cardArt) add("warn", "Using template artwork. Upload your own box and card art at 300 DPI for production.");
    else add("ok", "Custom artwork attached. Confirm 1/8 in (3 mm) bleed on every edge.");
    if (!s.rulebook && p.subtype !== "deck") add("warn", "No rulebook uploaded yet.");
    add("warn", "A mockup is not automatically production ready. Final print files need bleed, safe area and color checks.");
  }
  if (p.cat === "books") {
    const pages = +s.pages || 0, hard = s.binding === "Casewrap hardcover";
    if (pages < 24 || pages > 800) add("err", "Page count must be between 24 and 800.");
    else if (hard && pages < 24) add("err", "Hardcovers need at least 24 pages.");
    else add("ok", pages + " pages works with " + (s.binding || "perfect bound") + ".");
    if (pages % 2) add("warn", "Odd page count. Most printers add a blank page to make it even.");
    if (s.binding === "Saddle stitch" && pages > 48) add("err", "Saddle stitch supports up to 48 pages in this demo. Choose perfect bound.");
    if (!s.interior) add("warn", "No interior PDF uploaded. Interior must be a single PDF at the trim size plus bleed.");
    else add("ok", "Interior file received: " + s.interior + " (structure not inspected in the demo).");
    add("ok", "Cover size: " + MK.coverDims(s).text + ".");
  }
  if (p.cat === "apparel") {
    if (!s.artLoaded) add("warn", "Using sample artwork. Upload your own PNG for a real print file.");
    if (s.dpi && s.dpi < 150) add("err", "Artwork prints at about " + s.dpi + " DPI. Use at least 150, ideally 300.");
    else if (s.dpi) add("ok", "Artwork prints at about " + s.dpi + " DPI.");
    if (s.outside) add("err", "Part of the artwork is outside the printable area.");
    else add("ok", "Artwork sits inside the printable area.");
  }
  if (p.cat === "objects") {
    const d = s.dims || [0, 0, 0];
    if (Math.max(...d) > 250) add("err", "Largest side is over 250 mm, beyond the build volume assumed here.");
    else add("ok", "Fits a 250 mm build volume (" + d.map(v => v.toFixed(0)).join(" x ") + " mm).");
    if (Math.min(...d) < 2) add("warn", "A dimension under 2 mm may be too thin to print.");
    add("warn", "Not an engineering check. Wall thickness, overhangs and safety are not verified in the demo.");
  }
  return { ok: !out.some(o => o.level === "err"), items: out };
};
MK.coverDims = function (s) {
  const trim = (s.trim || "6 x 9 in").match(/([\d.]+) x ([\d.]+)/) || [0, 6, 9];
  const w = +trim[1], h = +trim[2], pages = +s.pages || 120;
  const spine = s.binding === "Saddle stitch" ? 0 : +(pages * 0.0025 + (s.binding === "Casewrap hardcover" ? .25 : .06)).toFixed(2);
  const bleed = .125, fw = +(w * 2 + spine + bleed * 2).toFixed(2), fh = +(h + bleed * 2).toFixed(2);
  return { spine, fw, fh, text: fw + " x " + fh + " in with a " + spine + " in spine (illustrative)" };
};

/* earnings math, all integer cents */
MK.earnings = function (priceMinor, mfgMinor, shipMinor, rate = MK.CONFIG.platformFeeRate) {
  const fee = Math.round(priceMinor * rate);
  return { price: priceMinor, mfg: mfgMinor, ship: shipMinor, fee, rate, net: priceMinor - mfgMinor - shipMinor - fee };
};

/* ---------------- store: IndexedDB with in-memory fallback ---------------- */
const DB = "makeory-demo", ST = "kv";
let idb = null;
function openDB() {
  return new Promise(res => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(ST);
      r.onsuccess = () => { idb = r.result; res(); };
      r.onerror = () => res();
    } catch (e) { res(); }
  });
}
function idbGet(k) { return new Promise(res => { if (!idb) return res(undefined); try { const q = idb.transaction(ST).objectStore(ST).get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); } catch (e) { res(undefined); } }); }
function idbSet(k, v) { if (!idb) return; try { idb.transaction(ST, "readwrite").objectStore(ST).put(v, k); } catch (e) { } }
function idbClear() { return new Promise(res => { if (!idb) return res(); try { const t = idb.transaction(ST, "readwrite"); t.objectStore(ST).clear(); t.oncomplete = res; t.onerror = res; } catch (e) { res(); } }); }

const KEYS = ["projects", "listings", "cart", "orders", "saved", "activity", "sales"];
MK.S = {};
function seedState() {
  const now = Date.now(), d = 864e5;
  return {
    projects: [
      { id: "p_lantern", title: "Lantern Keepers", cat: "games", subtype: "cardgame", status: "Quote Ready", created: now - 6 * d, updated: now - 2 * d,
        spec: { desc: "A push-your-luck card game about keeping the harbor lit.", cards: 72, cardBack: "Starburst", board: "None", components: ["Score pad", "Wooden tokens"], c1: "#2F7A7B", c2: "#F2C14E", motif: "star" }, quote: null },
      { id: "p_sketch", title: "Sketch Weekly", cat: "books", subtype: "journal", status: "Draft", created: now - 3 * d, updated: now - 3 * d,
        spec: { author: "Sam Rivera", pages: 120, trim: "6 x 9 in", binding: "Casewrap hardcover", interior: "", c1: "#8E5A9B", c2: "#F1D7A6", motif: "leaf" } },
    ],
    listings: [], cart: [], orders: [], saved: [],
    activity: [{ t: now - 2 * d, text: "Viewed illustrative quotes for Lantern Keepers" }, { t: now - 3 * d, text: "Started a journal: Sketch Weekly" }, { t: now - 6 * d, text: "Created Lantern Keepers" }],
    sales: [],
  };
}
MK.load = async function () {
  await openDB();
  const seeded = await idbGet("seeded");
  if (!seeded) { Object.assign(MK.S, seedState()); KEYS.forEach(k => idbSet(k, MK.S[k])); idbSet("seeded", 1); return; }
  for (const k of KEYS) { const v = await idbGet(k); MK.S[k] = v == null ? seedState()[k] : v; }
};
MK.save = function (...ks) { (ks.length ? ks : KEYS).forEach(k => idbSet(k, MK.S[k])); };
MK.reset = async function () { await idbClear(); Object.keys(MK.S).forEach(k => delete MK.S[k]); Object.assign(MK.S, seedState()); KEYS.forEach(k => idbSet(k, MK.S[k])); idbSet("seeded", 1); };
MK.log = function (text) { MK.S.activity.unshift({ t: Date.now(), text }); MK.S.activity = MK.S.activity.slice(0, 30); MK.save("activity"); };

/* all marketplace products = seed + this browser's published listings */
MK.products = function () {
  const mine = MK.S.listings.filter(l => l.published).map(l => {
    const pr = MK.S.projects.find(p => p.id === l.projectId) || {}; const s = pr.spec || {};
    return { slug: l.slug, title: l.title, creator: "me", cat: pr.cat, kind: MK.kindOf(pr), price: l.priceMinor, c1: s.c1, c2: s.c2, bg: MK.bgOf(s.c1), motif: s.motif, image: s.previewImage, sub: s.author,
      desc: l.description, variants: l.variants && l.variants.length ? l.variants : ["Standard"], materials: l.materials || "See listing", method: (PROVIDERS[l.providerId] || {}).method || "", provider: l.providerId, prodDays: PROD[l.providerId] || [5, 10], shipDays: [(SHIP[l.providerId] || [0, 4, 8])[1], (SHIP[l.providerId] || [0, 4, 8])[2]], tags: l.tags, mine: true, customizable: false };
  });
  return MK.SEED.concat(mine);
};
MK.creatorOf = (p) => p.creator === "me" ? { id: "me", name: MK.CONFIG.demoProfile.name + " (you)", bio: "Your demo storefront." } : MK.CREATORS[p.creator];
MK.kindOf = (pr) => { const st = (MK.SUBTYPES[pr.cat] || []).find(x => x.id === pr.subtype); return st ? st.kind : "object"; };
MK.bgOf = (c) => c ? shade(c, .86) : "#EEEDE6";
MK.projectArt = (pr, view) => { const s = pr.spec || {}; return MK.art({ kind: MK.kindOf(pr), c1: s.c1 || "#3659D9", c2: s.c2 || "#F2C14E", bg: MK.bgOf(s.c1 || "#3659D9"), title: pr.title, motif: s.motif || "orbit", sub: s.author, image: s.previewImage, view }); };
MK.STATES = ["Draft", "Design Ready", "Quote Ready", "Prototype Requested", "Publish Ready", "Published"];
MK.advance = function (pr, state) { if (MK.STATES.indexOf(state) > MK.STATES.indexOf(pr.status) || state === "Published" || pr.status === "Published" && state === "Publish Ready") pr.status = state; pr.updated = Date.now(); };

})(window.MK);
