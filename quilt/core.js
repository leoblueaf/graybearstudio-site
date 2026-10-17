// Hitherto Prayer Quilt: shared engine (dates, checks, fabrics, renderer, Firebase access).
import { CONFIG } from "./config.js";

const SDK = "https://www.gstatic.com/firebasejs/11.0.2/";

// ---------------------------------------------------------------- dates (Eastern)
const ET = "America/New_York";
export function easternDate(d = new Date()) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: ET, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
  const g = t => p.find(x => x.type === t).value;
  return `${g("year")}-${g("month")}-${g("day")}`;
}
export function isDateStr(s) { return /^20\d\d-[01]\d-[0-3]\d$/.test(s || ""); }
export function dateFromStr(s) { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d, 12)); }
export function longDate(s) { return dateFromStr(s).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }); }
export function shortDate(s) { return dateFromStr(s).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }); }
export function fullDate(s) { return dateFromStr(s).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }); }
export function addDays(s, n) { const d = dateFromStr(s); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
// Advent: from the fourth Sunday before Christmas through December 25.
export function adventStart(year) {
  const xmas = new Date(Date.UTC(year, 11, 25, 12));
  const back = xmas.getUTCDay() === 0 ? 7 : xmas.getUTCDay();
  const lastSun = new Date(xmas); lastSun.setUTCDate(25 - back);
  lastSun.setUTCDate(lastSun.getUTCDate() - 21);
  return lastSun.toISOString().slice(0, 10);
}
export function isAdvent(s) { const y = +s.slice(0, 4); return s >= adventStart(y) && s <= `${y}-12-25`; }
export function isChristmas(s) { return s.slice(5) === "12-25"; }
// When today's quilt closes, in the visitor's own time.
export function closesLocal() {
  const today = easternDate();
  for (let h = 0; h < 48; h++) {
    const t = new Date(Date.now() + h * 3600e3);
    t.setMinutes(0, 0, 0);
    if (easternDate(t) !== today) return t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return "";
}

// ---------------------------------------------------------------- squares
const ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function newCode() { const a = crypto.getRandomValues(new Uint8Array(6)); return [...a].map(x => ALPHA[x % ALPHA.length]).join(""); }
export const MAX_TEXT = 280, MAX_INIT = 6, DAY_CAP = 1800;
export const FABRICS = ["Linen", "Gingham", "Ticking stripe", "Polka dot", "Calico", "Chevron", "Herringbone"];

// The page's own checks. The Firestore rules repeat the hard ones.
const CONTACT = [/https?:/i, /www\./i, /[a-z0-9]\.(com|org|net|io|co|us|info|biz|app|me|ly|gov|edu|tv|xyz|church|online|site)([^a-z]|$)/i,
  /[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}/i, /\d{3}[^a-z0-9]{0,3}\d{3}[^a-z0-9]{0,2}\d{4}/i, /(^|\D)\d{3}[ .-]\d{4}(\D|$)/];
export function hasContact(t) { return CONTACT.some(r => r.test(t)); }
const CRISIS = ["kill myself", "killing myself", "end my life", "ending my life", "want to die", "wanna die", "suicide", "suicidal",
  "hurt myself", "hurting myself", "self harm", "self-harm", "don't want to live", "dont want to live", "do not want to live",
  "overdose", "take my own life", "better off dead", "cut myself", "cutting myself"];
export function hasCrisis(t) { const s = t.toLowerCase().replace(/\s+/g, " "); return CRISIS.some(w => s.includes(w)); }
const BLOCKED = ["fuck", "shit", "bitch", "bastard", "cunt", "dick", "pussy", "cock", "porn", "sex", "nude", "nudes", "whore", "slut",
  "rape", "nazi", "kill you", "kill him", "kill her", "kill them", "shoot", "bomb", "hate you", "retard", "fag", "nigg", "crypto",
  "bitcoin", "giveaway", "dm me", "follow me", "onlyfans", "telegram", "whatsapp", "venmo", "cashapp", "cash app", "paypal"];
export function hasBlocked(t) {
  const s = " " + t.toLowerCase().replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ") + " ";
  return BLOCKED.some(w => w.includes(" ") ? s.includes(" " + w + " ") || s.includes(" " + w) : new RegExp(`\\b${w}`).test(s));
}
const OK_CAPS = new Set(("God Jesus Christ Holy Spirit Lord Father Son Saint St Mother Heavenly Almighty Amen Bible Church Christmas Advent " +
  "Easter Lent Sunday Monday Tuesday Wednesday Thursday Friday Saturday January February March April May June July August September October " +
  "November December Savior Saviour Messiah King Emmanuel Immanuel Mary Joseph Thank Thanks Please Pray Prayer Dear Our My We I " +
  "New York San Los Las North South East West Fort Mount Lake Grand Great United States County City Kingdom America American Army Navy " +
  "Air Force Marines Coast Guard Pastor Father Sister Brother Aunt Uncle Grandma Grandpa Mom Dad Dr Mr Mrs Ms Psalm Psalms Romans Genesis " +
  "Matthew Mark Luke John Acts Isaiah Proverbs").split(" "));
// Two capitalized words in a row, neither on the allowlist, looks like a full name.
export function looksLikeFullName(t) {
  const words = t.replace(/[^A-Za-z' ]+/g, " ").split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    if (/^[A-Z][a-z']{1,}$/.test(a) && /^[A-Z][a-z']{2,}$/.test(b) && !OK_CAPS.has(a) && !OK_CAPS.has(b)) return true;
  }
  return false;
}
export function cleanInitials(s) { return (s || "").replace(/[^A-Za-z.& ]/g, "").slice(0, MAX_INIT).toUpperCase().trim(); }

// ---------------------------------------------------------------- local memory (this device)
const LS = "hq.v1";
function readLS() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } }
function writeLS(v) { try { localStorage.setItem(LS, JSON.stringify(v)); } catch { /* private mode */ } }
export const mine = {
  get(day) { return (readLS().mine || {})[day] || null; },
  set(day, code, held = false) { const v = readLS(); v.mine = v.mine || {}; v.mine[day] = { code, held }; writeLS(v); },
  clear(day) { const v = readLS(); if (v.mine) delete v.mine[day]; writeLS(v); },
  knotted(day, code) { return !!((readLS().knots || {})[day + ":" + code]); },
  setKnot(day, code) { const v = readLS(); v.knots = v.knots || {}; v.knots[day + ":" + code] = 1; writeLS(v); },
  reported(day, code) { return !!((readLS().reports || {})[day + ":" + code]); },
  setReport(day, code) { const v = readLS(); v.reports = v.reports || {}; v.reports[day + ":" + code] = 1; writeLS(v); },
  draft() { return readLS().draft || null; },
  saveDraft(d) { const v = readLS(); v.draft = d; writeLS(v); },
};

// ---------------------------------------------------------------- Firebase
let fb = null;
export function configured() { return !!(CONFIG.firebase && CONFIG.firebase.apiKey); }
export async function firebase() {
  if (fb) return fb;
  if (!configured()) throw new Error("not-configured");
  const [app, fs, auth, ac] = await Promise.all([
    import(SDK + "firebase-app.js"), import(SDK + "firebase-firestore.js"),
    import(SDK + "firebase-auth.js"), import(SDK + "firebase-app-check.js")]);
  const a = app.initializeApp(CONFIG.firebase);
  if (CONFIG.recaptchaSiteKey) {
    ac.initializeAppCheck(a, { provider: new ac.ReCaptchaEnterpriseProvider(CONFIG.recaptchaSiteKey), isTokenAutoRefreshEnabled: true });
  }
  fb = { app: a, fs, authMod: auth, db: fs.getFirestore(a), auth: auth.getAuth(a) };
  return fb;
}
export async function anonUser() {
  const f = await firebase();
  await f.auth.authStateReady();
  if (f.auth.currentUser) return f.auth.currentUser;
  return (await f.authMod.signInAnonymously(f.auth)).user;
}
export async function getDay(day) {
  const { fs, db } = await firebase();
  const s = await fs.getDoc(fs.doc(db, "days", day));
  return s.exists() ? (s.data().squares || []) : [];
}
export async function getCounters(day) {
  const { fs, db } = await firebase();
  const s = await fs.getDoc(fs.doc(db, "counters", day));
  const d = s.exists() ? s.data() : {};
  return { knots: d.knots || {}, reports: d.reports || {}, refs: d.refs || {}, kept: d.kept || {} };
}
export async function getDayCounts() {
  const { fs, db } = await firebase();
  const s = await fs.getDoc(fs.doc(db, "meta", "days"));
  return s.exists() ? (s.data().counts || {}) : {};
}
export const REPORT_LIMIT = 3;
export function isHidden(code, c) { return (c.reports[code] || 0) >= REPORT_LIMIT && !c.kept[code]; }

// ---------------------------------------------------------------- fabrics and renderer
const DEEP = ["#6B2F3A", "#3D4A6B", "#5F6B4E", "#7A5A3A", "#4A3A4F", "#8A4B3A", "#2F4B4B"];
const LIGHT = ["#EFE6D2", "#E8D9B5", "#F2E9DC", "#E3D3C0", "#D9C9A3", "#EDE1C8"];
function hash(n) { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); return (n ^ (n >>> 15)) >>> 0; }
function rnd(seed) { let s = hash(seed) || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 10000) / 10000; }; }
function dayNum(day) { return Math.floor(dateFromStr(day).getTime() / 864e5); }
export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = f < 0 ? 0 : 255, p = Math.abs(f); r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return `rgb(${r},${g},${b})`;
}
export function spiral(n) {
  const out = [[0, 0]]; let r = 1;
  while (out.length < n) {
    for (let x = -r; x <= r; x++) out.push([x, -r]);
    for (let y = -r + 1; y <= r; y++) out.push([r, y]);
    for (let x = r - 1; x >= -r; x--) out.push([x, r]);
    for (let y = r - 1; y > -r; y--) out.push([-r, y]);
    r++;
  }
  return out.slice(0, n);
}
const CROSS = [[.40, .08], [.60, .08], [.60, .28], [.82, .28], [.82, .44], [.60, .44], [.60, .94], [.40, .94], [.40, .44], [.18, .44], [.18, .28], [.40, .28]];
const STAR = (() => {
  const p = [];
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 8;
    const tip = i % 2 === 0, lower = i === 8;
    const rr = tip ? (lower ? .47 : (i % 4 === 0 ? .38 : .26)) : .11;
    p.push([.5 + Math.cos(a) * rr, .46 + Math.sin(a) * rr]);
  }
  return p;
})();
export function motifFor(day) { return isAdvent(day) ? STAR : CROSS; }
function inPoly(u, v, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (((yi > v) !== (yj > v)) && (u < (xj - xi) * (v - yi) / (yj - yi) + xi)) c = !c;
  }
  return c;
}
// Lay out a day: positions by arrival order, colours by position against the motif.
export function layout(day, count) {
  const pos = spiral(Math.max(count, 1));
  const R = pos.reduce((m, [x, y]) => Math.max(m, Math.abs(x), Math.abs(y)), 0);
  const poly = motifFor(day), dn = dayNum(day);
  const cells = pos.slice(0, count).map(([gx, gy], i) => {
    const r = rnd(dn * 7919 + i * 31 + 1);
    const u = (gx + R + .5) / (2 * R + 1), v = (gy + R + .5) / (2 * R + 1);
    const light = inPoly(u, v, poly) ? true : r() < .06;
    const base = light ? LIGHT[Math.floor(r() * LIGHT.length)] : DEEP[Math.floor(r() * DEEP.length)];
    return { gx, gy, base, seed: dn * 100003 + i };
  });
  return { R, cells, poly };
}
const TILE = 128;
const fabricCache = new Map();
export function fabricTile(kind, base, seed) {
  const key = kind + base + (seed % 5);
  if (fabricCache.has(key)) return fabricCache.get(key);
  const r = rnd(seed % 5 + 7), c = document.createElement("canvas"); c.width = c.height = TILE; const x = c.getContext("2d");
  x.fillStyle = base; x.fillRect(0, 0, TILE, TILE);
  const hi = shade(base, .28), lo = shade(base, -.22);
  if (kind === 0) { for (let i = 0; i < TILE; i += 2) { x.fillStyle = i % 4 ? hi : lo; x.globalAlpha = .12; x.fillRect(0, i, TILE, 1); x.fillRect(i, 0, 1, TILE); } }
  if (kind === 1) { const s = 10; x.globalAlpha = .35; x.fillStyle = hi; for (let i = 0; i < TILE; i += s * 2) { x.fillRect(i, 0, s, TILE); x.fillRect(0, i, TILE, s); } }
  if (kind === 2) { const s = 7; x.globalAlpha = .4; x.fillStyle = hi; for (let i = 0; i < TILE; i += s * 2) x.fillRect(i, 0, s * .5, TILE); }
  if (kind === 3) { x.globalAlpha = .55; x.fillStyle = hi; const s = 11; for (let i = 0; i < TILE + s; i += s) for (let j = 0; j < TILE + s; j += s) { x.beginPath(); x.arc(i + ((j / s) % 2 ? s / 2 : 0), j, 1.9, 0, 7); x.fill(); } }
  if (kind === 4) { for (let k = 0; k < 26; k++) { const px = r() * TILE, py = r() * TILE; x.globalAlpha = .55; x.fillStyle = k % 3 ? hi : lo; for (let p = 0; p < 5; p++) { const a = p / 5 * 6.283; x.beginPath(); x.arc(px + Math.cos(a) * 2.4, py + Math.sin(a) * 2.4, 1.5, 0, 7); x.fill(); } } }
  if (kind === 5) { x.globalAlpha = .4; x.strokeStyle = hi; x.lineWidth = 3; for (let j = -8; j < TILE + 8; j += 12) { x.beginPath(); for (let i = 0; i <= TILE; i += 12) x.lineTo(i, j + ((i / 12) % 2 ? 6 : 0)); x.stroke(); } }
  if (kind === 6) { x.globalAlpha = .3; x.strokeStyle = hi; x.lineWidth = 1.2; for (let i = 0; i < TILE; i += 8) for (let j = 0; j < TILE; j += 8) { x.beginPath(); if (((i / 8) + (j / 8)) % 2) { x.moveTo(i, j); x.lineTo(i + 8, j + 8); } else { x.moveTo(i + 8, j); x.lineTo(i, j + 8); } x.stroke(); } }
  x.globalAlpha = 1;
  fabricCache.set(key, c);
  return c;
}
export function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

// Draw a whole quilt flat (thumbnails, saved images). `squares` may be null (count only).
export function drawFlat(ctx, day, count, squares, x0, y0, side, opts = {}) {
  const L = layout(day, count), n = 2 * L.R + 1, cs = side / n;
  ctx.fillStyle = opts.muslin || cssVar("--muslin"); ctx.fillRect(x0, y0, side, side);
  L.cells.forEach((c, i) => {
    const px = x0 + (c.gx + L.R) * cs, py = y0 + (c.gy + L.R) * cs;
    if (squares && squares[i] && cs > 10) ctx.drawImage(fabricTile(squares[i].fabric || 0, c.base, c.seed), px, py, cs + .4, cs + .4);
    else { ctx.fillStyle = c.base; ctx.fillRect(px, py, cs + .4, cs + .4); }
    if (cs > 6) { ctx.strokeStyle = opts.seam || "#FBF7EE"; ctx.lineWidth = Math.max(.4, cs * .03); ctx.strokeRect(px, py, cs, cs); }
  });
  if (count > 0) {
    ctx.save(); ctx.strokeStyle = opts.gold || "#8A6718"; ctx.globalAlpha = .55; ctx.lineWidth = Math.max(1, side * .004);
    ctx.setLineDash([Math.max(3, side * .012), Math.max(2, side * .008)]); ctx.beginPath();
    L.poly.forEach(([u, v], i) => { const X = x0 + u * side, Y = y0 + v * side; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
    ctx.closePath(); ctx.stroke(); ctx.restore();
  }
  ctx.strokeStyle = isChristmas(day) ? (opts.gold || "#8A6718") : (opts.oxblood || "#6B2F3A");
  ctx.lineWidth = Math.max(1.5, side * .012); ctx.strokeRect(x0, y0, side, side);
}

export function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
