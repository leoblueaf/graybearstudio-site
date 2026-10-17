// Hitherto Prayer Quilt: David's review page. Google sign-in, one allowed account.
import * as Q from "./core.js";
import { CONFIG } from "./config.js";

const $ = id => document.getElementById(id);
const TODAY = Q.easternDate();
let F = null, day = TODAY;

function msg(t) { $("msg").textContent = t; $("msg").hidden = !t; }
function esc(s) { return Q.esc(s); }

async function signIn() {
  const p = new F.authMod.GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" });
  await F.authMod.signInWithPopup(F.auth, p);
}
async function start() {
  if (!Q.configured()) { msg("The quilt is not connected to Firebase yet."); return; }
  F = await Q.firebase();
  await F.auth.authStateReady();
  F.authMod.onAuthStateChanged(F.auth, u => {
    const ok = u && !u.isAnonymous && u.email === CONFIG.adminEmail;
    $("who").textContent = u && !u.isAnonymous ? u.email : "";
    $("signin").hidden = !!ok; $("signout").hidden = !(u && !u.isAnonymous); $("panel").hidden = !ok;
    if (u && !u.isAnonymous && !ok) msg("This account can't review the quilt. Sign in as " + CONFIG.adminEmail + ".");
    if (ok) { msg(""); loadAll(); }
  });
}
$("signin").onclick = () => signIn().catch(e => msg("Sign-in didn't finish: " + (e.code || e.message)));
$("signout").onclick = () => F.authMod.signOut(F.auth);
$("day").value = TODAY; $("day").max = TODAY;
$("day").onchange = () => { day = $("day").value || TODAY; loadDay(); };

async function loadAll() { await Promise.all([loadHeld(), loadDay()]); }

// ---------------------------------------------------------------- held
async function loadHeld() {
  const { fs, db } = F;
  const snap = await fs.getDocs(fs.collection(db, "held"));
  const rows = snap.docs.map(d => d.data()).sort((a, b) => a.at.toMillis() - b.at.toMillis());
  $("held-count").textContent = rows.length;
  $("held").innerHTML = rows.length ? rows.map(h => `<li><p class="lt">${esc(h.text)}</p>
    <p class="lm">${h.initials ? esc(h.initials) + " · " : ""}${esc(Q.shortDate(h.day))} · code ${h.code} · held for ${h.reason === "name" ? "a possible full name" : "a word on the watch list"}</p>
    <div class="row"><button class="btn small" data-approve="${h.code}">Approve</button><button class="btn small quiet" data-drop="${h.code}">Remove</button></div></li>`).join("")
    : `<li class="note">Nothing waiting.</li>`;
}
$("held").addEventListener("click", async e => {
  const a = e.target.closest("[data-approve]"), d = e.target.closest("[data-drop]");
  const { fs, db } = F;
  try {
    if (a) {
      const code = a.dataset.approve, ref = fs.doc(db, "held", code);
      await fs.runTransaction(db, async tx => {
        const h = (await tx.get(ref)).data(); if (!h) return;
        const sq = { code: h.code, text: h.text, initials: h.initials, fabric: h.fabric, at: h.at };
        tx.set(fs.doc(db, "days", h.day), { squares: fs.arrayUnion(sq) }, { merge: true });
        tx.set(fs.doc(db, "meta", "days"), { counts: { [h.day]: fs.increment(1) } }, { merge: true });
        tx.delete(ref);
      });
    }
    if (d) await fs.deleteDoc(fs.doc(db, "held", d.dataset.drop));
    await loadAll();
  } catch (err) { msg("That didn't go through: " + (err.code || err.message)); }
});

// ---------------------------------------------------------------- a day
async function loadDay() {
  const [sqs, c] = await Promise.all([Q.getDay(day), Q.getCounters(day)]);
  const knots = sqs.reduce((a, s) => a + (c.knots[s.code] || 0), 0);
  const refs = Object.entries(c.refs).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${esc(k)} ${v}`).join(", ") || "none";
  $("totals").innerHTML = `<li><b>${sqs.length}</b> squares</li><li><b>${knots}</b> knots</li><li>Referrals: ${refs}</li>`;
  const hidden = sqs.filter(s => Q.isHidden(s.code, c));
  const reported = sqs.filter(s => (c.reports[s.code] || 0) > 0 && !Q.isHidden(s.code, c) && !c.kept[s.code]);
  const row = (s, hiddenRow) => `<li><p class="lt">${esc(s.text)}</p><p class="lm">${s.initials ? esc(s.initials) + " · " : ""}code ${s.code} · ${c.reports[s.code] || 0} report(s) · ${c.knots[s.code] || 0} knot(s)</p>
    <div class="row">${hiddenRow ? `<button class="btn small" data-keep="${s.code}">Keep</button>` : ""}<button class="btn small quiet" data-remove="${s.code}">Remove</button></div></li>`;
  $("hidden").innerHTML = hidden.length ? hidden.map(s => row(s, true)).join("") : `<li class="note">No squares hidden by reports.</li>`;
  $("reported").innerHTML = reported.length ? reported.map(s => row(s, true)).join("") : `<li class="note">No other reported squares.</li>`;
  $("all").innerHTML = sqs.length ? sqs.slice().reverse().map(s => row(s, false)).join("") : `<li class="note">No squares on this day.</li>`;
  $("day-label").textContent = Q.longDate(day);
}
async function removeFrom(d, code) {
  const { fs, db } = F, ref = fs.doc(db, "days", d);
  let found = false;
  await fs.runTransaction(db, async tx => {
    const s = await tx.get(ref); const arr = s.exists() ? s.data().squares || [] : [];
    const i = arr.findIndex(x => x.code === code); if (i < 0) return;
    found = true; tx.update(ref, { squares: arr.slice(0, i).concat(arr.slice(i + 1)) });
  });
  if (found) await fs.setDoc(fs.doc(db, "meta", "days"), { counts: { [d]: fs.increment(-1) } }, { merge: true });
  return found;
}
document.addEventListener("click", async e => {
  const k = e.target.closest("[data-keep]"), r = e.target.closest("[data-remove]");
  if (!k && !r) return;
  const { fs, db } = F;
  try {
    if (k) await fs.setDoc(fs.doc(db, "counters", day), { kept: { [k.dataset.keep]: true } }, { merge: true });
    if (r) { if (!confirm("Remove this square from the quilt for good?")) return; await removeFrom(day, r.dataset.remove); }
    await loadDay();
  } catch (err) { msg("That didn't go through: " + (err.code || err.message)); }
});

// ---------------------------------------------------------------- remove by code
$("code-form").addEventListener("submit", async e => {
  e.preventDefault();
  const code = $("code").value.trim().toUpperCase(); if (!/^[A-Z0-9]{6}$/.test(code)) { msg("A square code has six letters and numbers."); return; }
  msg("Looking for " + code + "…");
  const counts = await Q.getDayCounts();
  const days = [...new Set([TODAY, ...Object.keys(counts)])].sort().reverse();
  for (const d of days) {
    const sqs = await Q.getDay(d);
    const s = sqs.find(x => x.code === code);
    if (s) {
      if (!confirm(`Remove this square from ${Q.longDate(d)}?\n\n"${s.text}"`)) { msg(""); return; }
      await removeFrom(d, code); msg(`Removed ${code} from ${Q.longDate(d)}.`); $("code").value = ""; loadDay(); return;
    }
  }
  const held = await F.fs.getDoc(F.fs.doc(F.db, "held", code));
  if (held.exists()) { await F.fs.deleteDoc(held.ref); msg(`Removed held square ${code}.`); loadHeld(); return; }
  msg(`No square with code ${code} was found.`);
});

// ---------------------------------------------------------------- clear a whole day (test cleanup)
$("clear-day").onclick = async () => {
  if (!confirm(`Delete EVERY square, knot and report on ${Q.longDate(day)}? Use this only to clear test squares.`)) return;
  const { fs, db } = F;
  try {
    for (const sub of ["k", "r"]) { const s = await fs.getDocs(fs.collection(db, "counters", day, sub)); for (const d of s.docs) await fs.deleteDoc(d.ref); }
    const a = await fs.getDocs(fs.collection(db, "days", day, "authors")); for (const d of a.docs) await fs.deleteDoc(d.ref);
    await fs.deleteDoc(fs.doc(db, "days", day)); await fs.deleteDoc(fs.doc(db, "counters", day));
    await fs.setDoc(fs.doc(db, "meta", "days"), { counts: { [day]: fs.deleteField() } }, { merge: true });
    msg(`Cleared ${Q.longDate(day)}. Devices that sewed a test square there can sew again that day.`); loadAll();
  } catch (err) { msg("That didn't go through: " + (err.code || err.message)); }
};

start().catch(e => msg(e.message));
