/* Makeory demo app: routing, layout and every page except the four editors (mk-editors.js). */
"use strict";
(function (MK) {
const { esc, money, ic, S } = MK;
const pi = location.pathname.indexOf("/demo/makeory");
const BASE = (pi >= 0 ? location.pathname.slice(0, pi) : "") + "/demo/makeory";
MK.BASE = BASE;
const L = (p) => BASE + (p === "/" ? "/" : p);
MK.L = L;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
MK.$ = $; MK.$$ = $$;

/* ---------------- routing ---------------- */
const ROUTES = [
  [/^\/$/, "home"], [/^\/explore\/?$/, "explore"], [/^\/explore\/([\w-]+)\/?$/, "product"], [/^\/create\/?$/, "create"],
  [/^\/studio\/?$/, "studio"], [/^\/studio\/new\/(games|books|apparel|objects)\/?$/, "editor"], [/^\/studio\/projects\/([\w-]+)\/?$/, "project"],
  [/^\/studio\/projects\/([\w-]+)\/manufacture\/?$/, "manufacture"], [/^\/studio\/projects\/([\w-]+)\/publish\/?$/, "publish"],
  [/^\/studio\/earnings\/?$/, "earnings"], [/^\/checkout\/?$/, "checkout"], [/^\/orders\/?$/, "orders"], [/^\/manufacturers\/?$/, "manufacturers"],
  [/^\/how-it-works\/?$/, "how"], [/^\/about\/?$/, "about"], [/^\/terms\/?$/, "terms"], [/^\/privacy\/?$/, "privacy"],
];
function current() {
  let p = location.pathname.slice(BASE.length) || "/";
  p = p.replace(/index\.html$/, "");
  if (!p.startsWith("/")) p = "/" + p;
  for (const [re, name] of ROUTES) { const m = p.match(re); if (m) return { name, args: m.slice(1), path: p }; }
  return { name: "notfound", args: [], path: p };
}
MK.go = function (path, replace) { history[replace ? "replaceState" : "pushState"](null, "", L(path)); render(); window.scrollTo(0, 0); };
MK.q = () => new URLSearchParams(location.search);

document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  const h = a.getAttribute("href");
  if (h.startsWith(BASE + "/") || h === BASE) { e.preventDefault(); history.pushState(null, "", h); render(); if (!h.includes("#")) window.scrollTo(0, 0); }
});
window.addEventListener("popstate", render);

/* ---------------- shell ---------------- */
MK.toast = function (msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600); };
const cartCount = () => S.cart.reduce((n, i) => n + i.qty, 0);
function header(r) {
  const on = (n) => r.name === n || (n === "explore" && r.name === "product") || (n === "studio" && ["studio", "editor", "project", "manufacture", "publish", "earnings"].includes(r.name)) ? " on" : "";
  return `<div class="strip"><div class="wrap"><span><b>Demo only.</b> No payments, no manufacturer orders, no payouts. Products and creators are fictional.</span><button type="button" data-act="reset">Reset demo</button></div></div>
  <header class="hd"><div class="wrap">
  <a class="logo" href="${L("/")}"><span class="mark">${MK.markSvg}</span>Makeory</a>
  <nav class="nav" aria-label="Main"><a class="${on("explore")}" href="${L("/explore")}">Explore</a><a class="${on("create")}" href="${L("/create")}">Create</a><a class="${on("how")}" href="${L("/how-it-works")}">How It Works</a><a class="${on("studio")}" href="${L("/studio")}">Creator Studio</a></nav>
  <div class="tools">
   <button class="ib" type="button" data-act="search" aria-label="Search">${ic("search")}</button>
   <a class="ib" href="${L("/explore?saved=1")}" aria-label="Saved items">${ic("heart")}${S.saved.length ? `<span class="n">${S.saved.length}</span>` : ""}</a>
   <a class="ib" href="${L("/checkout")}" aria-label="Shopping bag">${ic("bag")}${cartCount() ? `<span class="n">${cartCount()}</span>` : ""}</a>
   <a class="ib" href="${L("/studio")}" aria-label="Demo profile: ${esc(MK.CONFIG.demoProfile.name)}"><span class="avatar">${MK.CONFIG.demoProfile.initials}</span></a>
   <button class="ib menu-btn" type="button" data-act="menu" aria-label="Menu">${ic("menu")}</button>
  </div></div></header>
  <div class="search-pop" id="searchPop" hidden><div class="wrap"><form id="searchForm" style="display:flex;gap:10px;width:100%" role="search"><label class="sr" for="sq">Search products</label><input id="sq" class="inp" placeholder="Search games, books, apparel, objects" autocomplete="off"><button class="btn pri">Search</button></form></div></div>
  <div class="mnav" id="mnav" hidden><div class="wrap"><a href="${L("/explore")}">Explore</a><a href="${L("/create")}">Create</a><a href="${L("/how-it-works")}">How It Works</a><a href="${L("/studio")}">Creator Studio</a><a href="${L("/orders")}">Demo orders</a></div></div>`;
}
function footer() {
  return `<footer class="ft"><div class="wrap">
  <a class="logo" href="${L("/")}"><span class="mark">${MK.markSvg}</span>Makeory</a>
  <div class="links"><a href="${L("/about")}">About Makeory</a><a href="${L("/how-it-works")}">How It Works</a><a href="${L("/manufacturers")}">Manufacturers</a><a href="${L("/how-it-works#creators")}">Creator Information</a><a href="${L("/terms")}">Demo Terms</a><a href="${L("/privacy")}">Privacy</a><a href="mailto:hello@graybearstudio.com">Contact</a></div>
  <p class="fine">Makeory is a concept demonstration by GrayBear Studio. Imagine it. Make it. Sell it. Every product, creator, price, quote and order on this site is simulated. Manufacturer names describe possible future integration candidates only. No partnership, endorsement or affiliation with any of them is implied, and none of them has been contacted by this demo.</p>
  </div></footer>`;
}

/* ---------------- shared bits ---------------- */
const isSaved = (slug) => S.saved.includes(slug);
function pcard(p) {
  const c = MK.creatorOf(p) || {};
  return `<div class="card pc"><a href="${L("/explore/" + p.slug)}" style="text-decoration:none;color:inherit;display:flex;flex-direction:column"><div class="art">${MK.seedArt(p)}</div>
  <div class="t"><b>${esc(p.title)}</b><span class="meta">${esc(c.name || "")} · ${esc(MK.CAT_LABEL[p.cat] || "")}</span><span class="price">${money(p.price)}</span></div></a>
  ${p.customizable ? `<span class="tag badge sage">Customizable</span>` : p.mine ? `<span class="tag badge blue">Your listing</span>` : ""}
  <button class="fav${isSaved(p.slug) ? " on" : ""}" type="button" data-act="fav" data-slug="${p.slug}" aria-pressed="${isSaved(p.slug)}" aria-label="${isSaved(p.slug) ? "Remove from saved" : "Save"} ${esc(p.title)}">${ic("heart")}</button></div>`;
}
MK.pcard = pcard;
const pipeline = (st) => `<div class="pipeline" aria-label="Project status">${MK.STATES.map((x, i) => { const k = MK.STATES.indexOf(st); return `<span class="${i < k ? "done" : i === k ? "cur" : ""}">${x}</span>`; }).join("")}</div>`;
MK.pipeline = pipeline;
const statusBadge = (st) => `<span class="badge ${st === "Published" ? "sage" : st === "Draft" ? "" : "blue"}">${esc(st)}</span>`;
MK.statusBadge = statusBadge;
const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map((it, i) => i < items.length - 1 ? `<a href="${L(it[1])}">${esc(it[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page" style="color:var(--ink);font-weight:600">${esc(it[0])}</span>`).join("")}</nav>`;
MK.crumbs = crumbs;
const proj = (id) => S.projects.find(p => p.id === id);
MK.proj = proj;

/* ---------------- pages ---------------- */
const V = {};
V.home = () => {
  const feat = MK.products().slice(0, 12);
  const tiles = [MK.SEED[0], MK.SEED[4], MK.SEED[7], MK.SEED[10]];
  const pos = [["4%", "6%", "52%"], ["50%", "0%", "44%"], ["0%", "52%", "44%"], ["46%", "46%", "52%"]];
  const ada = MK.SEED.filter(p => p.creator === "ada").concat(MK.SEED.filter(p => p.creator === "northfold").slice(0, 1));
  return `<section class="hero"><div class="wrap grid">
  <div><p class="eyebrow">Create. Make. Sell.</p><h1 style="margin-top:14px">What will you make?</h1>
  <p class="lede">Turn an idea into something real. Design your product, find a manufacturer, and make it for yourself, or sell it to the world.</p>
  <div class="btns"><a class="btn pri" href="${L("/create")}">Start Creating ${ic("arrow")}</a><a class="btn" href="${L("/explore")}">Explore Marketplace</a></div>
  <p class="small muted" style="margin-top:18px;display:flex;gap:8px;align-items:center">${ic("lock")} Selling is optional. Make one just for you.</p></div>
  <div class="hero-art" aria-hidden="true">${tiles.map((p, i) => `<div class="tile" style="left:${pos[i][0]};top:${pos[i][1]};width:${pos[i][2]};aspect-ratio:1">${MK.seedArt(p, i % 2)}</div>`).join("")}</div>
  </div></section>
  <section class="section"><div class="wrap"><div class="shead"><div><p class="eyebrow">Start with a category</p><h2 style="margin-top:8px">Four ways to make something</h2></div></div>
  <div class="cats">${MK.CATS.map(c => `<a class="card cat" href="${L("/studio/new/" + c.id)}"><div class="art">${MK.art(c.art)}</div><div class="t"><h3>${esc(c.name)}</h3><p class="muted">${esc(c.blurb)}</p><span class="go">Open the editor ${ic("arrow")}</span></div></a>`).join("")}</div></div></section>
  <section class="section"><div class="wrap"><div class="shead"><div><p class="eyebrow">How Makeory works</p><h2 style="margin-top:8px">From idea to object in three steps</h2></div><a class="btn sm" href="${L("/how-it-works")}">Learn more</a></div>
  <div class="steps">${[["1", "Create", "Design or upload your idea."], ["2", "Make", "Find a compatible manufacturer and preview production costs."], ["3", "Sell", "Keep it private or publish it to the marketplace."]].map(s => `<div class="card step"><div class="k">${s[0]}</div><h3>${s[1]}</h3><p class="muted" style="margin-top:6px">${s[2]}</p></div>`).join("")}</div></div></section>
  <section class="section"><div class="wrap"><div class="shead"><div><p class="eyebrow">Featured on the marketplace</p><h2 style="margin-top:8px">Made by creators</h2></div><a class="btn sm" href="${L("/explore")}">View all</a></div>
  <div class="pgrid">${feat.map(pcard).join("")}</div></div></section>
  <section class="section"><div class="wrap"><div class="card spot"><div><span class="badge demo">Demonstration example</span><h2 style="margin-top:14px">Creator spotlight: Ada Kestrel</h2><p class="muted" style="margin-top:10px">${esc(MK.CREATORS.ada.bio)} Ada is a fictional creator used to show how a storefront could look.</p>
  <div class="btns" style="margin-top:18px"><a class="btn" href="${L("/explore?creator=ada")}">See Ada's products</a></div></div>
  <div class="pgrid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${ada.slice(0, 3).map(pcard).join("")}</div></div></div></section>
  <section class="section"><div class="wrap"><div class="cta"><h2 style="color:#fff">Your next idea deserves to exist.</h2><p style="opacity:.75;max-width:520px">Make one for yourself, or put it in front of everyone. Selling is always optional.</p><a class="btn pri" href="${L("/create")}">Create Something ${ic("arrow")}</a></div></div></section>`;
};
V.explore = () => {
  const q = MK.q(); const term = (q.get("q") || "").toLowerCase(), cat = q.get("cat") || "all", price = q.get("price") || "all", sort = q.get("sort") || "featured", saved = q.get("saved") === "1", creator = q.get("creator");
  let items = MK.products();
  if (saved) items = items.filter(p => isSaved(p.slug));
  if (creator) items = items.filter(p => p.creator === creator);
  if (cat !== "all") items = items.filter(p => p.cat === cat);
  if (term) items = items.filter(p => (p.title + " " + p.desc + " " + (MK.creatorOf(p) || {}).name + " " + (p.tags || []).join(" ")).toLowerCase().includes(term));
  const PR = { all: [0, 1e9], u25: [0, 2500], "25-50": [2500, 5000], o50: [5000, 1e9] };
  items = items.filter(p => p.price >= PR[price][0] && p.price < PR[price][1]);
  if (sort === "low") items.sort((a, b) => a.price - b.price); else if (sort === "high") items.sort((a, b) => b.price - a.price); else if (sort === "az") items.sort((a, b) => a.title.localeCompare(b.title));
  const link = (k, v) => { const n = new URLSearchParams(location.search); if (v == null) n.delete(k); else n.set(k, v); const s = n.toString(); return L("/explore" + (s ? "?" + s : "")); };
  const all = MK.products(); const count = (c) => c === "all" ? all.length : all.filter(p => p.cat === c).length;
  return `<div class="wrap">${crumbs([["Home", "/"], [saved ? "Saved" : "Explore", "/explore"]])}<div class="explore">
  <aside class="filters" aria-label="Filters"><div><h4>Category</h4><div class="fl">${["all", "games", "books", "apparel", "objects", "prints"].map(c => `<a href="${link("cat", c === "all" ? null : c)}" style="text-decoration:none"><button tabindex="-1" class="${cat === c ? "on" : ""}">${c === "all" ? "Everything" : MK.CAT_LABEL[c]}<span class="muted">${count(c)}</span></button></a>`).join("")}</div></div>
  <div><h4>Price</h4><div class="fl">${[["all", "Any price"], ["u25", "Under $25"], ["25-50", "$25 to $50"], ["o50", "$50 and up"]].map(([k, n]) => `<a href="${link("price", k === "all" ? null : k)}" style="text-decoration:none"><button tabindex="-1" class="${price === k ? "on" : ""}">${n}</button></a>`).join("")}</div></div>
  <div class="note">${ic("info")}<span>Demo products. No real purchase will occur.</span></div></aside>
  <div><h1 style="font-size:clamp(28px,3.4vw,40px)">${saved ? "Saved products" : creator ? esc((MK.CREATORS[creator] || {}).name || "Creator") : "Explore the marketplace"}</h1>
  <form class="toolbar" id="exForm" role="search" style="margin-top:16px"><label class="sr" for="exq">Search</label><input id="exq" class="inp" name="q" value="${esc(q.get("q") || "")}" placeholder="Search products or creators">
  <label class="sr" for="exs">Sort</label><select id="exs" class="inp" style="max-width:200px" name="sort">${[["featured", "Featured"], ["low", "Price: low to high"], ["high", "Price: high to low"], ["az", "Name: A to Z"]].map(([k, n]) => `<option value="${k}"${sort === k ? " selected" : ""}>${n}</option>`).join("")}</select>
  ${saved || creator || term || cat !== "all" || price !== "all" ? `<a class="btn sm ghost" href="${L("/explore")}">Clear all</a>` : ""}<span class="muted small" style="margin-left:auto">${items.length} product${items.length === 1 ? "" : "s"}</span></form>
  ${items.length ? `<div class="pgrid">${items.map(pcard).join("")}</div>` : `<div class="card empty">${ic(saved ? "heart" : "search")}<h3>${saved ? "Nothing saved yet" : "No products match"}</h3><p class="muted">${saved ? "Tap the heart on any product to keep it here." : "Try a different search or clear the filters."}</p><a class="btn" href="${L("/explore")}">Browse everything</a></div>`}
  </div></div></div>`;
};
V.explore.mount = () => {
  const f = $("#exForm"); if (!f) return;
  const apply = () => { const n = new URLSearchParams(location.search); const qv = $("#exq").value.trim(); qv ? n.set("q", qv) : n.delete("q"); const sv = $("#exs").value; sv !== "featured" ? n.set("sort", sv) : n.delete("sort"); const s = n.toString(); MK.go("/explore" + (s ? "?" + s : ""), true); };
  f.addEventListener("submit", (e) => { e.preventDefault(); apply(); });
  $("#exs").addEventListener("change", apply);
};
let pdView = 0, pdQty = 1, pdVariant = 0;
V.product = (slug) => {
  const p = MK.products().find(x => x.slug === slug); if (!p) return V.notfound();
  const c = MK.creatorOf(p) || {}, pr = MK.PROVIDERS[p.provider] || {};
  const views = [MK.seedArt(p, 0), MK.seedArt(p, 1), MK.art({ kind: p.kind, c1: p.c1, c2: p.c2, bg: MK.shade(p.c2 || "#F2C14E", .8), title: p.title, motif: p.motif, sub: p.sub, image: p.image })];
  const more = MK.products().filter(x => x.creator === p.creator && x.slug !== p.slug).slice(0, 4);
  return `<div class="wrap">${crumbs([["Home", "/"], ["Explore", "/explore"], [MK.CAT_LABEL[p.cat] || "", "/explore?cat=" + p.cat], [p.title, "/explore/" + p.slug]])}
  <div class="pd"><div class="gal"><div class="main" id="pdMain">${views[pdView % 3]}</div><div class="thumbs" role="group" aria-label="Gallery">${views.map((v, i) => `<button type="button" class="${i === pdView % 3 ? "on" : ""}" data-act="pdview" data-i="${i}" aria-label="View ${i + 1}">${v}</button>`).join("")}</div></div>
  <div style="display:flex;flex-direction:column;gap:18px">
   <div><span class="badge demo">Demo product. No real purchase will occur.</span><h1 style="font-size:clamp(30px,4vw,46px);margin-top:12px">${esc(p.title)}</h1><p class="muted" style="margin-top:6px">by <a href="${L("/explore?creator=" + p.creator)}">${esc(c.name)}</a> · ${esc(MK.CAT_LABEL[p.cat] || "")}</p></div>
   <div style="font:800 28px var(--fh)">${money(p.price)}</div>
   <p style="font-size:16px">${esc(p.desc)}</p>
   ${p.variants.length > 1 ? `<div class="field"><span>Variant</span><div class="chips" role="radiogroup">${p.variants.map((v, i) => `<button type="button" class="chip${i === pdVariant ? " on" : ""}" role="radio" aria-checked="${i === pdVariant}" data-act="pdvar" data-i="${i}">${esc(v)}</button>`).join("")}</div></div>` : ""}
   <div class="btns" style="align-items:center"><div class="qty" aria-label="Quantity"><button type="button" data-act="pdqty" data-d="-1" aria-label="Fewer">−</button><span aria-live="polite">${pdQty}</span><button type="button" data-act="pdqty" data-d="1" aria-label="More">+</button></div>
   <button class="btn pri" type="button" data-act="addcart" data-slug="${p.slug}" style="flex:1">${ic("bag")} Add to Cart</button>
   <button class="btn" type="button" data-act="fav" data-slug="${p.slug}" aria-pressed="${isSaved(p.slug)}">${ic("heart")} ${isSaved(p.slug) ? "Saved" : "Save Product"}</button></div>
   <div class="card pad"><dl class="specs"><dt>Materials</dt><dd>${esc(p.materials)}</dd><dt>Manufacturing</dt><dd>${esc(p.method)}${pr.name ? " · " + esc(pr.name) + " (integration candidate)" : ""}</dd><dt>Production</dt><dd>About ${p.prodDays[0]} to ${p.prodDays[1]} business days (estimate)</dd><dt>Shipping</dt><dd>About ${p.shipDays[0]} to ${p.shipDays[1]} business days after production (estimate)</dd>${p.tags && p.tags.length ? `<dt>Tags</dt><dd>${p.tags.map(esc).join(", ")}</dd>` : ""}</dl></div>
   <div class="card pad" style="display:flex;gap:14px;align-items:center"><span class="avatar" style="width:44px;height:44px;font-size:15px">${esc((c.name || "?").slice(0, 1))}</span><div><b>${esc(c.name)}</b>${c.demo ? ` <span class="badge demo">Fictional creator</span>` : ""}<p class="muted small" style="margin-top:3px">${esc(c.bio || "")}</p></div></div>
  </div></div>
  ${more.length ? `<section class="section" style="padding-top:0"><div class="shead"><h2>More from ${esc(c.name)}</h2></div><div class="pgrid">${more.map(pcard).join("")}</div></section>` : ""}</div>`;
};
V.create = () => `<div class="wrap page"><p class="eyebrow">Create</p><h1 style="margin-top:10px;font-size:clamp(32px,4.4vw,52px)">What are you making?</h1><p class="muted" style="margin-top:12px;max-width:640px;font-size:17px">Pick a category to open its editor. Your project stays private in your studio until you choose to publish it.</p>
  <div class="cats" style="margin-top:30px">${MK.CATS.map(c => `<a class="card cat" href="${L("/studio/new/" + c.id)}"><div class="art">${MK.art(c.art)}</div><div class="t"><h3>${esc(c.name)}</h3><p class="muted">${esc(c.blurb)}</p><p class="small muted" style="margin-top:6px">${MK.SUBTYPES[c.id].map(s => s.name).join(" · ")}</p><span class="go">Start ${ic("arrow")}</span></div></a>`).join("")}</div>
  <div class="note sage" style="margin-top:26px">${ic("lock")}<span>Making something just for yourself? That is a first-class path here. You can order a single copy without ever listing it for sale.</span></div></div>`;

/* studio */
function salesFor(listingId) { return S.sales.filter(s => s.listingId === listingId && s.t <= Date.now()); }
MK.salesFor = salesFor;
V.studio = () => {
  const published = S.listings.filter(l => l.published);
  const allSales = S.sales.filter(s => s.t <= Date.now());
  const rev = allSales.reduce((n, s) => n + s.netMinor * s.qty, 0);
  return `<div class="wrap studio">${crumbs([["Creator Studio", "/studio"]])}
  <div class="shead" style="margin-top:14px"><div><p class="eyebrow">Creator Studio</p><h1 style="font-size:clamp(28px,3.6vw,42px);margin-top:8px">Welcome back, ${esc(MK.CONFIG.demoProfile.name.split(" ")[0])}.</h1></div><a class="btn pri" href="${L("/create")}">${ic("plus")} Create New Product</a></div>
  <div class="stats"><div class="card stat"><span class="muted small">Saved projects</span><b>${S.projects.length}</b></div><div class="card stat"><span class="muted small">Published listings</span><b>${published.length}</b></div><div class="card stat"><span class="muted small">Simulated orders</span><b>${S.orders.length + allSales.length}</b></div><div class="card stat"><span class="muted small">Simulated earnings</span><b>${money(rev)}</b></div></div>
  <section style="margin-top:28px"><div class="shead"><h2>Your projects</h2><a class="btn sm" href="${L("/studio/earnings")}">${ic("chart")} Earnings</a></div>
  ${S.projects.length ? `<div class="projects">${S.projects.slice().sort((a, b) => b.updated - a.updated).map(p => `<div class="card proj"><a class="art" href="${L("/studio/projects/" + p.id)}" aria-label="Open ${esc(p.title)}">${MK.projectArt(p)}</a><div class="t">
  <div class="row"><b style="font:700 16px var(--fh)">${esc(p.title || "Untitled")}</b>${statusBadge(p.status)}</div><span class="small muted">${esc(MK.CAT_LABEL[p.cat])} · ${esc((MK.SUBTYPES[p.cat].find(s => s.id === p.subtype) || {}).name || "")} · Edited ${MK.fmtDate(p.updated)}</span>
  <div class="acts"><a class="btn sm" href="${L("/studio/new/" + p.cat + "?id=" + p.id)}">${ic("edit")} Edit</a><a class="btn sm" href="${L("/studio/projects/" + p.id + "/manufacture")}">${ic("factory")} Manufacture</a><a class="btn sm" href="${L("/studio/projects/" + p.id + "/publish")}">${ic("store")} Publish</a></div></div></div>`).join("")}</div>` : `<div class="card empty">${ic("sparkle")}<h3>No projects yet</h3><p class="muted">Start with a game, a book, apparel or a 3D object.</p><a class="btn pri" href="${L("/create")}">Create something</a></div>`}</section>
  <div class="cols" style="margin-top:28px"><div class="card pad"><h3>Published listings</h3>${published.length ? `<div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Listing</th><th>Price</th><th>Simulated sales</th><th></th></tr></thead><tbody>${published.map(l => `<tr><td><a href="${L("/explore/" + l.slug)}">${esc(l.title)}</a></td><td>${money(l.priceMinor)}</td><td>${salesFor(l.id).reduce((n, s) => n + s.qty, 0)}</td><td><a class="btn sm" href="${L("/studio/projects/" + l.projectId + "/publish")}">Manage</a></td></tr>`).join("")}</tbody></table></div>` : `<p class="muted" style="margin-top:8px">Nothing published. Everything you make stays private until you publish it.</p>`}
  <h3 style="margin-top:22px">Demo orders you placed</h3>${S.orders.length ? `<p class="muted small" style="margin-top:6px">${S.orders.length} demo order${S.orders.length === 1 ? "" : "s"}. <a href="${L("/orders")}">View order history</a></p>` : `<p class="muted" style="margin-top:8px">None yet.</p>`}</div>
  <div class="card pad"><h3>Recent activity</h3><div class="feed" style="margin-top:8px">${S.activity.slice(0, 8).map(a => `<div><span>${esc(a.text)}</span><time>${MK.ago(a.t)}</time></div>`).join("") || `<p class="muted">Nothing yet.</p>`}</div></div></div></div>`;
};
V.project = (id) => {
  const p = proj(id); if (!p) return V.notfound();
  const s = p.spec || {}, st = MK.SUBTYPES[p.cat].find(x => x.id === p.subtype) || {};
  const rows = [["Category", MK.CAT_LABEL[p.cat]], ["Format", st.name]];
  if (p.cat === "games") rows.push(["Cards", s.cards], ["Card back", s.cardBack], ["Board", s.board], ["Components", (s.components || []).join(", ") || "None"], ["Rulebook", s.rulebook || "Not uploaded"]);
  if (p.cat === "books") rows.push(["Author", s.author], ["Trim size", s.trim], ["Pages", s.pages], ["Binding", s.binding], ["Interior", s.interior || "Not uploaded"]);
  if (p.cat === "apparel") rows.push(["Color", s.colorName], ["Sizes", (s.sizes || []).join(", ")], ["Artwork", s.artLoaded ? "Uploaded" : "Sample artwork"]);
  if (p.cat === "objects") rows.push(["Model", s.fileName || "Sample model"], ["Size", s.dims ? s.dims.map(v => v.toFixed(0)).join(" x ") + " mm" : "n/a"], ["Material", s.material], ["Color", s.colorName], ["Finish", s.finish]);
  const lst = S.listings.find(l => l.projectId === p.id);
  return `<div class="wrap studio">${crumbs([["Creator Studio", "/studio"], ["Projects", "/studio"], [p.title || "Untitled", "/studio/projects/" + p.id]])}
  <div class="pd" style="padding-top:18px"><div class="gal"><div class="main">${MK.projectArt(p)}</div></div>
  <div style="display:flex;flex-direction:column;gap:18px"><div>${statusBadge(p.status)}<h1 style="font-size:clamp(28px,3.8vw,44px);margin-top:12px">${esc(p.title || "Untitled")}</h1><p class="muted" style="margin-top:6px">Private project · created ${MK.fmtDate(p.created)} · edited ${MK.ago(p.updated)}</p></div>
  ${pipeline(p.status)}
  <div class="card pad"><dl class="specs">${rows.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(r[1] == null ? "" : r[1])}</dd>`).join("")}${p.quote ? `<dt>Selected quote</dt><dd>${esc(MK.PROVIDERS[p.quote.providerId].name)}: ${money(p.quote.unitMinor)} per unit (illustrative)</dd>` : ""}</dl></div>
  <div class="btns"><a class="btn" href="${L("/studio/new/" + p.cat + "?id=" + p.id)}">${ic("edit")} Edit design</a><a class="btn pri" href="${L("/studio/projects/" + p.id + "/manufacture")}">${ic("factory")} Manufacture</a><a class="btn" href="${L("/studio/projects/" + p.id + "/publish")}">${ic("store")} ${lst && lst.published ? "Manage listing" : "Publish"}</a></div>
  <div class="btns"><button class="btn sm ghost" type="button" data-act="dupproj" data-id="${p.id}">Duplicate</button><button class="btn sm ghost" type="button" data-act="delproj" data-id="${p.id}" style="color:var(--err)">${ic("trash")} Delete project</button></div>
  </div></div></div>`;
};

/* manufacture: compare, choose, private order */
let mfg = { id: null, provider: null, qty: 1, dest: "US", step: 1 };
const DESTS = { US: ["United States", "Sample address: 100 Example Ave, Springfield, IL"], CA: ["Canada", "Sample address: 200 Sample St, Halifax, NS"], UK: ["United Kingdom", "Sample address: 3 Demo Road, Bristol"], DE: ["Germany", "Sample address: Beispielstrasse 4, Berlin"] };
MK.DESTS = DESTS;
V.manufacture = (id) => {
  const p = proj(id); if (!p) return V.notfound();
  if (mfg.id !== id) mfg = { id, provider: (p.quote && p.quote.providerId) || null, qty: 1, dest: "US", step: 1 };
  const matches = MK.matchProviders(p), ok = matches.filter(m => m.compatible);
  if (!mfg.provider && ok[0]) mfg.provider = ok[0].adapter.id;
  const req = MK.requirements(p);
  return `<div class="wrap studio">${crumbs([["Creator Studio", "/studio"], [p.title || "Untitled", "/studio/projects/" + p.id], ["Manufacture", ""]])}
  <div class="shead" style="margin-top:14px"><div><p class="eyebrow">Manufacture</p><h1 style="font-size:clamp(28px,3.6vw,42px);margin-top:8px">Find a manufacturer</h1><p class="muted" style="margin-top:8px">Compatible partners for ${esc(p.title)}, with illustrative estimates.</p></div>${statusBadge(p.status)}</div>
  <div class="note" style="margin-bottom:18px">${ic("alert")}<span><b>Demo quotes.</b> Every price below is an illustrative estimate computed in your browser. None is a real quote from the company named, and no manufacturer is contacted.</span></div>
  <div class="cols"><div style="display:flex;flex-direction:column;gap:14px">
   <div class="card pad"><h3>Design requirements</h3><dl class="specs" style="margin-top:12px"><dt>Category</dt><dd>${esc(MK.CAT_LABEL[req.category])}</dd><dt>File type</dt><dd>${esc(req.fileType || "PNG artwork")}</dd>${req.material ? `<dt>Material</dt><dd>${esc(req.material)}</dd>` : ""}${req.dimensions ? `<dt>Dimensions</dt><dd>${req.dimensions.map(v => v.toFixed(0)).join(" x ")} mm</dd>` : ""}<dt>Destination</dt><dd>${esc(DESTS[mfg.dest][0])}</dd></dl></div>
   <div id="quotes" class="quotes"><div class="card pad muted">Comparing manufacturers…</div></div>
   ${matches.filter(m => !m.compatible).length ? `<details class="card pad"><summary style="cursor:pointer;font-weight:600">Not compatible (${matches.filter(m => !m.compatible).length})</summary><div class="vlist" style="margin-top:12px">${matches.filter(m => !m.compatible).map(m => `<div class="vrow">${ic("x")}<span><b>${esc(MK.PROVIDERS[m.adapter.id].name)}</b>: ${esc(m.reasons.join("; "))}</span></div>`).join("")}</div></details>` : ""}
  </div>
  <div class="card panel" style="position:sticky;top:86px"><h3>Order privately</h3><p class="muted small">Make it for yourself without publishing. This places a demo order only.</p>
   <div class="field"><span>Quantity</span><div class="qty"><button type="button" data-act="mfqty" data-d="-1" aria-label="Fewer">−</button><span id="mfq">${mfg.qty}</span><button type="button" data-act="mfqty" data-d="1" aria-label="More">+</button></div><small>Unit prices drop at 10 and 50 in this demo model.</small></div>
   <label class="field"><span>Ship to (sample destination)</span><select class="inp" id="mfdest">${Object.entries(DESTS).map(([k, v]) => `<option value="${k}"${k === mfg.dest ? " selected" : ""}>${v[0]}</option>`).join("")}</select><small id="mfaddr">${esc(DESTS[mfg.dest][1])}</small></label>
   <div id="mfsum" class="sum"></div>
   <button class="btn pri" type="button" data-act="mforder">${ic("box")} Review demo order</button>
   <a class="btn" href="${L("/studio/projects/" + p.id + "/publish")}">${ic("store")} Or publish and sell</a></div></div></div>`;
};
V.manufacture.mount = async (id) => {
  const p = proj(id); if (!p) return;
  const box = $("#quotes"); const matches = MK.matchProviders(p).filter(m => m.compatible);
  if (!matches.length) { box.innerHTML = `<div class="card pad">No compatible manufacturer in this demo.</div>`; return; }
  const qs = await Promise.all(matches.map(m => m.adapter.getQuote({ project: p, quantity: mfg.qty, destination: mfg.dest })));
  const vals = await Promise.all(matches.map(m => m.adapter.validateDesign(p)));
  box.innerHTML = qs.map((q, i) => { const pr = MK.PROVIDERS[q.providerId], sel = mfg.provider === q.providerId, v = vals[i];
    return `<div class="card quote${sel ? " sel" : ""}"><div class="first"><b style="font:700 16px var(--fh)">${esc(pr.name)}</b><div class="small muted">${esc(pr.method)}</div><span class="badge demo" style="margin-top:8px">Illustrative estimate</span></div>
    <div><div class="k">Unit cost</div><div class="v">${money(q.unitMinor)}</div></div><div><div class="k">Shipping</div><div class="v">${money(q.shippingMinor)}</div></div><div><div class="k">Production</div><div class="v">${q.productionDays[0]} to ${q.productionDays[1]} d</div></div><div><div class="k">Total for ${q.quantity}</div><div class="v">${money(q.totalMinor)}</div></div>
    <button class="btn sm ${sel ? "pri" : ""}" type="button" data-act="pickmfg" data-p="${q.providerId}" aria-pressed="${sel}">${sel ? ic("check") + " Selected" : "Select"}</button>
    <div style="grid-column:1/-1;display:flex;gap:12px;flex-wrap:wrap" class="small"><span class="muted">Min. quantity ${q.minQuantity} · ships in about ${q.shippingDays[0]} to ${q.shippingDays[1]} d · files: ${pr.cap.fileFormats.join(", ")}</span>${v.ok ? `<span class="badge sage">${ic("check")} Simulated check passed</span>` : `<span class="badge warn">${ic("alert")} ${v.items.filter(x => x.level === "err").length} issue(s) to fix</span>`}</div></div>`; }).join("");
  const q = qs.find(x => x.providerId === mfg.provider) || qs[0]; mfg.provider = q.providerId; mfg._q = q;
  $("#mfsum").innerHTML = `<div><span>${esc(MK.PROVIDERS[q.providerId].name)} · ${q.quantity} x ${money(q.unitMinor)}</span><span>${money(q.unitMinor * q.quantity)}</span></div><div><span>Shipping estimate</span><span>${money(q.shippingMinor)}</span></div><div class="tot"><span>Estimated total</span><span>${money(q.totalMinor)}</span></div>`;
  if (!p.quote || p.quote.providerId !== q.providerId || p.quote.quantity !== q.quantity) { p.quote = q; MK.advance(p, "Quote Ready"); MK.save("projects"); }
  $("#mfdest").onchange = (e) => { mfg.dest = e.target.value; $("#mfaddr").textContent = DESTS[mfg.dest][1]; V.manufacture.mount(id); };
};

/* publish */
let pub = null;
V.publish = (id) => {
  const p = proj(id); if (!p) return V.notfound();
  let l = S.listings.find(x => x.projectId === id);
  const matches = MK.matchProviders(p).filter(m => m.compatible);
  if (!pub || pub.projectId !== id) {
    pub = l ? JSON.parse(JSON.stringify(l)) : { id: MK.uid("l"), projectId: id, slug: (p.title || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + id.slice(-4), title: p.title, description: (p.spec || {}).desc || "", tags: [], variants: [], providerId: (p.quote && p.quote.providerId) || (matches[0] && matches[0].adapter.id), priceMinor: 0, published: false };
    if (!pub.variants.length) pub.variants = p.cat === "apparel" ? ((p.spec || {}).sizes || ["M"]) : [(MK.SUBTYPES[p.cat].find(s => s.id === p.subtype) || {}).name || "Standard"];
  }
  const v = MK.validate(p, pub.providerId);
  const variantOpts = p.cat === "apparel" ? ["XS", "S", "M", "L", "XL", "2XL"] : p.cat === "books" ? ["Paperback", "Hardcover"] : p.cat === "objects" ? ["Standard", "Gift box"] : [(MK.SUBTYPES[p.cat].find(s => s.id === p.subtype) || {}).name || "Standard", "Deluxe"];
  return `<div class="wrap studio">${crumbs([["Creator Studio", "/studio"], [p.title || "Untitled", "/studio/projects/" + p.id], ["Publish", ""]])}
  <div class="shead" style="margin-top:14px"><div><p class="eyebrow">Publish and sell</p><h1 style="font-size:clamp(28px,3.6vw,42px);margin-top:8px">${l && l.published ? "Manage your listing" : "Create a listing"}</h1><p class="muted" style="margin-top:8px">Products stay private unless you publish them. You can unpublish at any time.</p></div>${statusBadge(p.status)}</div>
  <div class="editor" style="padding-top:0"><div style="display:flex;flex-direction:column;gap:16px">
   <div class="card pad"><h3>1. Basic requirements</h3><div class="vlist" style="margin-top:12px">${v.items.map(it => `<div class="vrow ${it.level === "ok" ? "ok" : it.level === "info" ? "" : it.level}">${ic(it.level === "ok" ? "checkc" : it.level === "info" ? "info" : "alert")}<span>${esc(it.text)}</span></div>`).join("")}</div>${!v.ok ? `<a class="btn sm" style="margin-top:12px" href="${L("/studio/new/" + p.cat + "?id=" + p.id)}">Fix in the editor</a>` : ""}</div>
   <div class="card pad"><h3>2. Manufacturer</h3><div class="chips" style="margin-top:12px" role="radiogroup">${matches.map(m => `<button type="button" class="chip${pub.providerId === m.adapter.id ? " on" : ""}" data-act="pubprov" data-p="${m.adapter.id}" role="radio" aria-checked="${pub.providerId === m.adapter.id}">${esc(MK.PROVIDERS[m.adapter.id].name)}</button>`).join("")}</div><p class="small muted" style="margin-top:10px" id="pubProd"></p></div>
   <div class="card panel"><h3>3. Listing details</h3>
    <label class="field"><span>Product title</span><input class="inp" id="pt" value="${esc(pub.title)}" maxlength="60"></label>
    <label class="field"><span>Description</span><textarea class="inp" id="pdsc" maxlength="600" placeholder="What is it, who is it for, what makes it yours?">${esc(pub.description)}</textarea></label>
    <div class="grid2"><label class="field"><span>Category</span><select class="inp" id="pcat" disabled><option>${esc(MK.CAT_LABEL[p.cat])}</option></select><small>Set by the product type.</small></label>
    <label class="field"><span>Tags</span><input class="inp" id="ptags" value="${esc(pub.tags.join(", "))}" placeholder="cozy, strategy, gift"><small>Comma separated.</small></label></div>
    <div class="field"><span>Variants</span><div class="chips">${variantOpts.map(o => `<button type="button" class="chip${pub.variants.includes(o) ? " on" : ""}" data-act="pubvar" data-v="${esc(o)}" aria-pressed="${pub.variants.includes(o)}">${esc(o)}</button>`).join("")}</div></div></div>
   <div class="card panel"><h3>4. Price and earnings</h3><div id="calc"></div></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px;position:sticky;top:86px"><div class="card pad"><h3>Storefront preview</h3><div id="pubPrev" style="margin-top:12px;max-width:300px"></div></div>
   <div class="card panel">${l && l.published ? `<div class="note sage">${ic("checkc")}<span>Published to the demo marketplace in this browser.</span></div><div class="btns"><button class="btn pri" type="button" data-act="pubsave">Save changes</button><a class="btn" href="${L("/explore/" + l.slug)}">View listing</a></div><button class="btn" type="button" data-act="unpub" style="color:var(--err)">Unpublish</button>`
     : `<button class="btn pri" type="button" data-act="pubgo" ${v.ok ? "" : "disabled"}>${ic("store")} Publish to demo marketplace</button><button class="btn" type="button" data-act="pubsave">Save as Publish Ready</button>${v.ok ? "" : `<p class="small" style="color:var(--err)">Fix the requirement issues first.</p>`}`}
   <p class="small muted">Publishing here only adds the product to this browser's demo marketplace. Nobody else can see or buy it.</p></div></div></div></div>`;
};
async function calcMount(container, opts) {
  const st = { price: opts.price, mfg: opts.mfg, ship: opts.ship };
  const draw = () => {
    const e = MK.earnings(st.price, st.mfg, st.ship);
    container.innerHTML = `<div class="grid2"><label class="field"><span>Selling price ($)</span><input class="inp" type="number" min="0" step="0.5" id="cP" value="${(st.price / 100).toFixed(2)}"></label>
    <label class="field"><span>Manufacturing cost ($)</span><input class="inp" type="number" min="0" step="0.5" id="cM" value="${(st.mfg / 100).toFixed(2)}"></label>
    <label class="field"><span>Shipping cost ($)</span><input class="inp" type="number" min="0" step="0.5" id="cS" value="${(st.ship / 100).toFixed(2)}"></label>
    <div class="field"><span>Makeory fee</span><div class="inp" style="display:flex;align-items:center;background:#FBFBF8">${Math.round(e.rate * 100)}% of the price</div></div></div>
    <div class="ledger" style="margin-top:14px" aria-live="polite"><div><span>Customer price</span><span>${money(e.price)}</span></div><div><span>Manufacturing</span><span>-${money(e.mfg)}</span></div><div><span>Shipping</span><span>-${money(e.ship)}</span></div><div><span>Makeory fee</span><span>-${money(e.fee)}</span></div><div class="tot${e.net < 0 ? " neg" : ""}"><span>Creator earnings</span><span>${money(e.net)}</span></div></div>
    ${e.net < 0 ? `<div class="note err" style="margin-top:12px">${ic("alert")}<span>At this price you would lose ${money(-e.net)} on every sale. Raise the price or lower costs.</span></div>` : ""}
    <p class="small muted" style="margin-top:10px">Simplified illustration. Payment processing fees, taxes, refunds and other production costs are not included.</p>`;
    ["cP", "cM", "cS"].forEach((k, i) => { const el = $("#" + k, container); el.addEventListener("input", () => { st[["price", "mfg", "ship"][i]] = Math.max(0, MK.toMinor(el.value)); const pos = el.selectionStart; opts.onChange && opts.onChange(st); refresh(); }); });
  };
  const refresh = () => { const e = MK.earnings(st.price, st.mfg, st.ship); const led = $(".ledger", container); const vals = $$(".ledger span:last-child", container); [e.price, -e.mfg, -e.ship, -e.fee].forEach((x, i) => vals[i].textContent = i ? "-" + money(-x) : money(x)); vals[4].textContent = money(e.net); vals[4].parentElement.classList.toggle("neg", e.net < 0); let w = container.querySelector(".note.err"); if (e.net < 0) { if (!w) { w = document.createElement("div"); w.className = "note err"; w.style.marginTop = "12px"; led.after(w); } w.innerHTML = ic("alert") + `<span>At this price you would lose ${money(-e.net)} on every sale. Raise the price or lower costs.</span>`; } else if (w) w.remove(); };
  draw();
}
MK.calcMount = calcMount;
V.publish.mount = async (id) => {
  const p = proj(id); if (!p || !pub) return;
  const q = await MK.ADAPTERS[pub.providerId].getQuote({ project: p, quantity: 1 });
  $("#pubProd").textContent = `Illustrative production estimate: ${money(q.unitMinor)} per unit plus about ${money(q.shippingMinor)} shipping, ${q.productionDays[0]} to ${q.productionDays[1]} days to make.`;
  if (!pub.priceMinor) pub.priceMinor = Math.ceil(((q.unitMinor + q.shippingMinor) * 1.9) / 100) * 100;
  pub.mfgMinor = pub.mfgMinor || q.unitMinor; pub.shipMinor = pub.shipMinor || q.shippingMinor;
  const prev = () => { const s = p.spec || {}; $("#pubPrev").innerHTML = MK.pcard({ slug: pub.slug, title: $("#pt").value || "Untitled", creator: "me", cat: p.cat, kind: MK.kindOf(p), price: pub.priceMinor, c1: s.c1, c2: s.c2, bg: MK.bgOf(s.c1), motif: s.motif, image: s.previewImage, sub: s.author, mine: true }).replace(/<a href="[^"]*"/, '<a href="#" tabindex="-1" onclick="return false"').replace(/<button class="fav[\s\S]*?<\/button>/, ""); };
  calcMount($("#calc"), { price: pub.priceMinor, mfg: pub.mfgMinor, ship: pub.shipMinor, onChange: (st) => { pub.priceMinor = st.price; pub.mfgMinor = st.mfg; pub.shipMinor = st.ship; prev(); } });
  $("#pt").addEventListener("input", prev); prev();
};
function readPub() { pub.title = $("#pt").value.trim() || "Untitled"; pub.description = $("#pdsc").value.trim(); pub.tags = $("#ptags").value.split(",").map(t => t.trim()).filter(Boolean).slice(0, 8); }
function storePub(published) {
  const p = proj(pub.projectId); readPub(); pub.published = published; pub.updated = Date.now();
  const i = S.listings.findIndex(x => x.projectId === pub.projectId); const copy = JSON.parse(JSON.stringify(pub));
  if (i >= 0) S.listings[i] = copy; else S.listings.push(copy);
  if (published) {
    if (!S.sales.some(s => s.listingId === pub.id)) { const e = MK.earnings(pub.priceMinor, pub.mfgMinor, pub.shipMinor); const now = Date.now(); [[45e3, 1], [3 * 36e5, 2], [26 * 36e5, 1], [3 * 864e5, 1]].forEach(([dt, q]) => S.sales.push({ id: MK.uid("s"), listingId: pub.id, t: now + dt, qty: q, priceMinor: pub.priceMinor, netMinor: e.net })); }
    MK.advance(p, "Published"); MK.log("Published " + pub.title + " to the demo marketplace");
  } else { if (p.status === "Published") p.status = "Publish Ready"; else MK.advance(p, "Publish Ready"); MK.log((S.listings[i] && S.listings[i].published === false ? "Saved listing for " : "Prepared a listing for ") + pub.title); }
  MK.save("listings", "projects", "sales");
}

V.earnings = () => {
  const sales = S.sales.filter(s => s.t <= Date.now()).sort((a, b) => b.t - a.t);
  const tot = sales.reduce((n, s) => n + s.netMinor * s.qty, 0), gross = sales.reduce((n, s) => n + s.priceMinor * s.qty, 0);
  const pending = S.sales.filter(s => s.t > Date.now()).length;
  return `<div class="wrap studio">${crumbs([["Creator Studio", "/studio"], ["Earnings", "/studio/earnings"]])}
  <div class="shead" style="margin-top:14px"><div><p class="eyebrow">Earnings</p><h1 style="font-size:clamp(28px,3.6vw,42px);margin-top:8px">Simulated earnings</h1><p class="muted" style="margin-top:8px">Sales below are generated by the demo after you publish. No money moves and no payouts exist.</p></div></div>
  <div class="stats"><div class="card stat"><span class="muted small">Simulated sales</span><b>${sales.reduce((n, s) => n + s.qty, 0)}</b></div><div class="card stat"><span class="muted small">Customer revenue</span><b>${money(gross)}</b></div><div class="card stat"><span class="muted small">Your simulated earnings</span><b>${money(tot)}</b></div><div class="card stat"><span class="muted small">Payouts</span><b style="font-size:17px;margin-top:12px">Not available in demo</b></div></div>
  <div class="cols" style="margin-top:20px"><div class="card pad"><h3>Sales ledger</h3>${sales.length ? `<div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>When</th><th>Listing</th><th>Qty</th><th>Price</th><th>Your earnings</th></tr></thead><tbody>${sales.map(s => { const l = S.listings.find(x => x.id === s.listingId) || {}; return `<tr><td>${MK.ago(s.t)}</td><td>${esc(l.title || "Removed listing")} <span class="badge demo">Simulated</span></td><td>${s.qty}</td><td>${money(s.priceMinor)}</td><td style="font-weight:700;color:${s.netMinor < 0 ? "var(--err)" : "inherit"}">${money(s.netMinor * s.qty)}</td></tr>`; }).join("")}</tbody></table></div>` : `<p class="muted" style="margin-top:8px">No simulated sales yet. Publish a project and the demo will generate a few sales over time.</p>`}${pending ? `<p class="small muted" style="margin-top:10px">${pending} more simulated sale${pending === 1 ? "" : "s"} will appear over the coming hours and days.</p>` : ""}</div>
  <div class="card panel"><h3>Earnings calculator</h3><p class="small muted">Try any price. The default is the example from the brief.</p><div id="calc"></div></div></div></div>`;
};
V.earnings.mount = () => calcMount($("#calc"), { price: 4000, mfg: 2000, ship: 500 });

/* cart + checkout */
let coDone = null, coDest = "US";
V.checkout = () => {
  if (coDone) { const o = coDone; coDone = null; return `<div class="wrap"><div class="card done-card"><div class="ok">${ic("check")}</div><h2>Your demo order is complete.</h2><p class="muted">No payment was processed.</p><p class="small muted">Order ${esc(o.id.toUpperCase())} · ${o.items.length} item${o.items.length === 1 ? "" : "s"} · ${money(o.totalMinor)}</p><div class="btns" style="justify-content:center"><a class="btn pri" href="${L("/orders")}">View demo orders</a><a class="btn" href="${L("/explore")}">Keep exploring</a></div></div></div>`; }
  const items = S.cart.map(c => ({ c, p: MK.products().find(p => p.slug === c.slug) })).filter(x => x.p);
  const sub = items.reduce((n, x) => n + x.p.price * x.c.qty, 0), ship = items.length ? 599 + Math.max(0, items.length - 1) * 250 : 0;
  return `<div class="wrap">${crumbs([["Home", "/"], ["Bag and checkout", "/checkout"]])}<h1 style="font-size:clamp(28px,3.6vw,42px);margin-top:14px">Your bag</h1>
  ${items.length ? `<div class="co"><div class="card pad">${items.map(({ c, p }, i) => `<div class="li"><a class="art" href="${L("/explore/" + p.slug)}">${MK.seedArt(p)}</a><div><b>${esc(p.title)}</b><div class="small muted">${esc(c.variant || "")} · ${esc((MK.creatorOf(p) || {}).name || "")}</div><div class="qty" style="height:38px;margin-top:8px"><button type="button" data-act="cq" data-i="${i}" data-d="-1" aria-label="Fewer" style="height:36px">−</button><span>${c.qty}</span><button type="button" data-act="cq" data-i="${i}" data-d="1" aria-label="More" style="height:36px">+</button></div></div>
   <div style="text-align:right"><b>${money(p.price * c.qty)}</b><br><button class="btn sm ghost" type="button" data-act="crm" data-i="${i}" style="margin-top:6px">Remove</button></div></div>`).join("")}</div>
  <div class="card panel"><h3>Order summary</h3><label class="field"><span>Ship to (sample destination)</span><select class="inp" id="codest">${Object.entries(DESTS).map(([k, v]) => `<option value="${k}"${k === coDest ? " selected" : ""}>${v[0]}</option>`).join("")}</select><small>${esc(DESTS[coDest][1])}. No real address is collected.</small></label>
   <div class="sum"><div><span>Subtotal</span><span>${money(sub)}</span></div><div><span>Estimated shipping</span><span>${money(ship)}</span></div><div><span>Tax</span><span class="muted">Not calculated in demo</span></div><div class="tot"><span>Total</span><span>${money(sub + ship)}</span></div></div>
   <div class="note">${ic("lock")}<span>No payment provider is connected and no card details are requested.</span></div>
   <button class="btn pri" type="button" data-act="coplace">Complete demo checkout</button></div></div>`
  : `<div class="card empty" style="margin:24px 0 60px">${ic("bag")}<h3>Your bag is empty</h3><p class="muted">Add something from the marketplace to try the demo checkout.</p><a class="btn pri" href="${L("/explore")}">Explore products</a></div>`}</div>`;
};
V.orders = () => `<div class="wrap page">${crumbs([["Home", "/"], ["Demo orders", "/orders"]])}<h1 style="font-size:clamp(28px,3.6vw,42px);margin-top:14px">Demo order history</h1><p class="muted" style="margin-top:8px">Orders here were simulated. No payment was taken and no manufacturer was contacted.</p>
  ${S.orders.length ? `<div style="display:flex;flex-direction:column;gap:14px;margin-top:22px">${S.orders.slice().reverse().map(o => `<div class="card pad"><div class="row" style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><div><b style="font:700 16px var(--fh)">Order ${esc(o.id.toUpperCase())}</b> <span class="badge ${o.type === "private" ? "blue" : ""}">${o.type === "private" ? "Private manufacturing" : "Marketplace"}</span><div class="small muted" style="margin-top:4px">${MK.fmtDate(o.t)} · ship to ${esc((DESTS[o.dest] || ["?"])[0])}</div></div><b>${money(o.totalMinor)}</b></div>
  <div class="small" style="margin-top:12px;display:flex;flex-direction:column;gap:4px">${o.items.map(i => `<span>${i.qty} x ${esc(i.title)}${i.variant ? " (" + esc(i.variant) + ")" : ""}${i.provider ? " · " + esc(MK.PROVIDERS[i.provider].name) + " (not contacted)" : ""}</span>`).join("")}</div>
  <div class="pipeline" style="margin-top:12px"><span class="cur">Demo order created</span><span>Not submitted to manufacturer</span><span>No tracking</span></div></div>`).join("")}</div>` : `<div class="card empty" style="margin-top:22px">${ic("box")}<h3>No demo orders yet</h3><p class="muted">Check out from your bag, or order one of your own projects privately.</p><div class="btns"><a class="btn" href="${L("/explore")}">Explore</a><a class="btn" href="${L("/studio")}">Creator Studio</a></div></div>`}</div>`;

/* info pages */
V.manufacturers = () => `<div class="wrap page"><p class="eyebrow">Manufacturers</p><h1 style="margin-top:10px;font-size:clamp(32px,4.4vw,52px)">The manufacturing network</h1><p class="muted" style="margin-top:12px;max-width:720px;font-size:17px">Makeory is designed to route each product to a compatible manufacturer through interchangeable adapters. These companies are integration candidates for a future version. In this demo every adapter is a mock, and none of them has been contacted.</p>
  <div class="note" style="margin:22px 0">${ic("alert")}<span>Before any live integration, each partner must be verified for API availability and pricing, third-party platform and resale permission, product creation, quotes, prototype orders, automated fulfillment, tracking, and refund and defect procedures.</span></div>
  <div class="mfg">${Object.entries(MK.PROVIDERS).map(([k, p]) => `<div class="card pad"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3>${esc(p.name)}</h3><span class="badge demo">Mock adapter</span></div><p class="muted">${esc(p.blurb)}</p>
  <div class="caps">${p.cap.categories.map(c => `<span class="badge blue">${esc(MK.CAT_LABEL[c])}</span>`).join("")}${p.cap.fileFormats.map(f => `<span class="badge">${f}</span>`).join("")}</div>
  <div class="vlist small">${[["Single units", p.cap.supportsSingleUnit], ["Quotes", p.cap.supportsQuotes], ["Prototypes", p.cap.supportsPrototypes], ["Automated orders", p.cap.supportsAutomatedOrders], ["Tracking", p.cap.supportsTracking]].map(([n, v]) => `<div class="vrow ${v ? "ok" : ""}">${ic(v ? "check" : "minus")}<span>${n}${v ? "" : ": to be confirmed"}</span></div>`).join("")}</div>
  <p class="small muted">${esc(p.status)}</p>${p.docs ? `<a class="small" href="${p.docs}" target="_blank" rel="noopener">Developer documentation</a>` : ""}</div>`).join("")}</div></div>`;
V.how = () => `<div class="wrap page"><div class="prose"><p class="eyebrow">How it works</p><h1 style="font-size:clamp(32px,4.4vw,52px)">The creator focuses on the product. Makeory handles the path to production.</h1>
  <p class="muted" style="font-size:17px">You never need to understand manufacturing APIs. Here is what happens behind each step.</p>
  <h2>1. Create</h2><p>Pick a category and design in the browser: a card game, a book, a shirt or a 3D object. Use a template or upload your own artwork, PDFs or models. Every project saves privately to your Creator Studio.</p>
  <h2>2. Make</h2><p>Makeory reads your product's requirements (category, size, material, file type, quantity, destination) and shows every compatible manufacturer side by side, with production time, shipping and an estimated cost. Checks run before anything is made, so problems show up while you can still fix them.</p>
  <h2>3. Sell, or don't</h2><p>Order one copy for yourself and stop there. Or publish it: set your own price, see exactly what you would earn, and list it on the marketplace. When someone buys, Makeory sends the order to the manufacturer and the product ships to them.</p>
  <h2 id="creators">For creators</h2><ul><li>You own what you make. Publishing grants Makeory the right to display and sell it, nothing more.</li><li>You set the price. Makeory's fee is ${Math.round(MK.CONFIG.platformFeeRate * 100)}% of the customer price in this demo, shown before you publish.</li><li>Manufacturing and shipping costs are deducted per sale, so there is no inventory to buy up front.</li><li>You can unpublish a listing at any time.</li><li>In a live version, earnings would follow a reserve period after shipping, before payout.</li></ul>
  <div class="note">${ic("info")}<span>This page describes the intended product. In the demo, quotes are illustrative, orders are simulated and no money moves.</span></div>
  <div class="btns"><a class="btn pri" href="${L("/create")}">Start creating</a><a class="btn" href="${L("/manufacturers")}">See manufacturers</a></div></div></div>`;
V.about = () => `<div class="wrap page"><div class="prose"><p class="eyebrow">About Makeory</p><h1 style="font-size:clamp(32px,4.4vw,52px)">Remove the distance between having an idea and holding it.</h1>
  <p style="font-size:17px">Most good ideas never become objects. Not because they are bad, but because the path from a sketch to a box on someone's doorstep runs through file specs, minimum orders, supplier emails and up-front inventory.</p>
  <p>Makeory is a creative studio, a manufacturing network and a marketplace in one place. It is built for the person making one gift as much as for the person building a business: the same tools, the same transparency about costs, and complete respect for who owns the work.</p>
  <p>Games and books come first, then apparel and merchandise, then 3D objects, original inventions and more advanced products as the manufacturing network grows. The website comes first; native apps may follow.</p>
  <div class="note">${ic("info")}<span>Makeory is a concept by GrayBear Studio, shown here as an interactive demonstration. It is not a live service.</span></div></div></div>`;
V.terms = () => `<div class="wrap page"><div class="prose"><h1 style="font-size:clamp(30px,4vw,46px)">Demo terms</h1><ul><li>This site is a demonstration. Nothing can be bought, sold, manufactured or paid out.</li><li>Products, creators, prices, quotes, sales and orders are simulated. Any resemblance to real people or products is coincidental.</li><li>Manufacturer names identify possible future integration candidates only. No partnership, endorsement or affiliation is implied, and no manufacturer is contacted.</li><li>Do not upload anything you do not have the right to use. Uploads stay in your own browser.</li><li>The demo may change or be taken down at any time.</li></ul></div></div>`;
V.privacy = () => `<div class="wrap page"><div class="prose"><h1 style="font-size:clamp(30px,4vw,46px)">Privacy</h1><p>Everything you do in this demo stays in your own browser, stored with IndexedDB. Nothing is sent to GrayBear Studio or to any manufacturer.</p><ul><li>No account, no sign-in, no payment details.</li><li>Uploaded images, PDFs and 3D models are read by your browser only.</li><li>No analytics, no advertising and no tracking cookies.</li><li>Fonts load from Google Fonts, and the 2D and 3D editors load open-source libraries (Konva, three.js) from public CDNs, which can see a normal web request.</li><li>Reset the demo at any time with the button at the top of every page. That deletes everything stored.</li></ul></div></div>`;
V.notfound = () => `<div class="wrap"><div class="card empty" style="margin:48px 0">${ic("search")}<h3>That page is not part of the demo</h3><p class="muted">It may have been deleted or reset.</p><a class="btn pri" href="${L("/")}">Go home</a></div></div>`;

/* ---------------- actions ---------------- */
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const a = b.dataset.act, r = current();
  if (a === "reset") { if (!confirmReset()) return; await MK.reset(); pub = null; mfg = { id: null }; MK.toast("Demo reset"); MK.go("/"); return; }
  if (a === "search") { const p = $("#searchPop"); p.hidden = !p.hidden; if (!p.hidden) $("#sq").focus(); return; }
  if (a === "menu") { const m = $("#mnav"); m.hidden = !m.hidden; return; }
  if (a === "fav") { e.preventDefault(); const s = b.dataset.slug; S.saved = isSaved(s) ? S.saved.filter(x => x !== s) : [...S.saved, s]; MK.save("saved"); MK.toast(isSaved(s) ? "Saved" : "Removed from saved"); render(true); return; }
  if (a === "pdview") { pdView = +b.dataset.i; render(true); return; }
  if (a === "pdvar") { pdVariant = +b.dataset.i; render(true); return; }
  if (a === "pdqty") { pdQty = Math.max(1, Math.min(20, pdQty + +b.dataset.d)); render(true); return; }
  if (a === "addcart") { const p = MK.products().find(x => x.slug === b.dataset.slug); const variant = p.variants[pdVariant] || ""; const ex = S.cart.find(c => c.slug === p.slug && c.variant === variant); if (ex) ex.qty += pdQty; else S.cart.push({ slug: p.slug, variant, qty: pdQty }); MK.save("cart"); MK.toast("Added to your bag"); pdQty = 1; render(true); return; }
  if (a === "cq") { const c = S.cart[+b.dataset.i]; c.qty = Math.max(1, Math.min(20, c.qty + +b.dataset.d)); MK.save("cart"); render(true); return; }
  if (a === "crm") { S.cart.splice(+b.dataset.i, 1); MK.save("cart"); render(true); return; }
  if (a === "coplace") { const items = S.cart.map(c => { const p = MK.products().find(x => x.slug === c.slug); return p && { title: p.title, slug: p.slug, variant: c.variant, qty: c.qty, priceMinor: p.price, provider: p.provider }; }).filter(Boolean); const sub = items.reduce((n, i) => n + i.priceMinor * i.qty, 0); const o = { id: MK.uid("o").slice(0, 10), t: Date.now(), type: "market", dest: coDest, items, totalMinor: sub + 599 + Math.max(0, items.length - 1) * 250 }; S.orders.push(o); S.cart = []; MK.save("orders", "cart"); MK.log("Placed demo marketplace order " + o.id.toUpperCase()); coDone = o; render(); window.scrollTo(0, 0); return; }
  if (a === "pickmfg") { mfg.provider = b.dataset.p; V.manufacture.mount(r.args[0]); return; }
  if (a === "mfqty") { mfg.qty = Math.max(1, Math.min(250, mfg.qty + +b.dataset.d)); $("#mfq").textContent = mfg.qty; V.manufacture.mount(r.args[0]); return; }
  if (a === "mforder") { const p = proj(r.args[0]); const q = mfg._q; if (!q) return; const v = await MK.ADAPTERS[q.providerId].validateDesign(p); showOrderReview(p, q, v); return; }
  if (a === "mfconfirm") { const p = proj(r.args[0]); const q = mfg._q; try { MK.ProductionOrderGateway.submit(); } catch (err) { /* expected: production is disabled */ }
    const o = { id: MK.uid("o").slice(0, 10), t: Date.now(), type: "private", dest: mfg.dest, items: [{ title: p.title, qty: q.quantity, priceMinor: q.unitMinor, provider: q.providerId }], totalMinor: q.totalMinor };
    S.orders.push(o); MK.advance(p, "Prototype Requested"); MK.log("Requested a demo prototype of " + p.title); MK.save("orders", "projects");
    $("#modalRoot").innerHTML = ""; MK.$("#main").innerHTML = `<div class="wrap view"><div class="card done-card"><div class="ok">${ic("check")}</div><h2>Demo order created.</h2><p class="muted">No payment was taken and no manufacturer was contacted.</p><p class="small muted">${q.quantity} x ${esc(p.title)} · ${esc(MK.PROVIDERS[q.providerId].name)} (illustrative) · ${money(q.totalMinor)}</p><div class="btns" style="justify-content:center"><a class="btn pri" href="${L("/orders")}">View demo orders</a><a class="btn" href="${L("/studio/projects/" + p.id)}">Back to project</a></div></div></div>`; window.scrollTo(0, 0); return; }
  if (a === "closemodal") { $("#modalRoot").innerHTML = ""; return; }
  if (a === "pubprov") { readPub(); pub.providerId = b.dataset.p; pub.mfgMinor = 0; pub.shipMinor = 0; render(true); return; }
  if (a === "pubvar") { readPub(); const v = b.dataset.v; pub.variants = pub.variants.includes(v) ? pub.variants.filter(x => x !== v) : [...pub.variants, v]; if (!pub.variants.length) pub.variants = [v]; render(true); return; }
  if (a === "pubgo") { storePub(true); MK.toast("Published to the demo marketplace"); const sl = pub.slug; pub = null; MK.go("/explore/" + sl); return; }
  if (a === "pubsave") { const was = (S.listings.find(x => x.projectId === pub.projectId) || {}).published; storePub(!!was); MK.toast(was ? "Listing updated" : "Saved. Status: Publish Ready"); render(true); return; }
  if (a === "unpub") { storePub(false); MK.toast("Unpublished. It is private again."); render(true); return; }
  if (a === "delproj") { const p = proj(b.dataset.id); if (!window.confirm("Delete " + (p.title || "this project") + "? This only affects the demo.")) return; S.projects = S.projects.filter(x => x.id !== p.id); const l = S.listings.find(x => x.projectId === p.id); S.listings = S.listings.filter(x => x.projectId !== p.id); if (l) S.sales = S.sales.filter(s => s.listingId !== l.id); MK.log("Deleted " + (p.title || "a project")); MK.save(); MK.go("/studio"); return; }
  if (a === "dupproj") { const p = proj(b.dataset.id); const c = JSON.parse(JSON.stringify(p)); c.id = MK.uid("p"); c.title = (p.title || "Untitled") + " copy"; c.status = "Draft"; c.created = c.updated = Date.now(); c.quote = null; S.projects.push(c); MK.log("Duplicated " + p.title); MK.save("projects"); MK.go("/studio/projects/" + c.id); return; }
});
function confirmReset() { try { return window.confirm("Reset the demo? This deletes your projects, listings, bag and demo orders in this browser."); } catch (e) { return true; } }
function showOrderReview(p, q, v) {
  $("#modalRoot").innerHTML = `<div style="position:fixed;inset:0;background:rgba(32,37,34,.45);z-index:70;display:grid;place-items:center;padding:16px" data-act="closemodal"><div class="card panel" style="max-width:520px;width:100%;max-height:90vh;overflow:auto" role="dialog" aria-modal="true" aria-label="Review demo order" onclick="event.stopPropagation()">
  <h2 style="font-size:24px">Review demo order</h2><div class="sum"><div><span>${esc(p.title)}</span><span>${q.quantity} x ${money(q.unitMinor)}</span></div><div><span>Manufacturer</span><span>${esc(MK.PROVIDERS[q.providerId].name)} (illustrative)</span></div><div><span>Ship to</span><span>${esc(DESTS[mfg.dest][0])} (sample)</span></div><div><span>Estimated time</span><span>${q.productionDays[0] + q.shippingDays[0]} to ${q.productionDays[1] + q.shippingDays[1]} days</span></div><div class="tot"><span>Estimated total</span><span>${money(q.totalMinor)}</span></div></div>
  <div class="vlist">${v.items.filter(i => i.level !== "info").map(it => `<div class="vrow ${it.level}">${ic(it.level === "ok" ? "checkc" : "alert")}<span>${esc(it.text)}</span></div>`).join("")}</div>
  <div class="note">${ic("lock")}<span>Confirming creates a demo order only. No payment is taken and no manufacturer is contacted.</span></div>
  <div class="btns"><button class="btn pri" type="button" data-act="mfconfirm" style="flex:1">Confirm demo order</button><button class="btn" type="button" data-act="closemodal">Cancel</button></div></div></div>`;
}
document.addEventListener("change", (e) => { if (e.target.id === "codest") { coDest = e.target.value; render(true); } });
document.addEventListener("submit", (e) => { if (e.target.id === "searchForm") { e.preventDefault(); const v = $("#sq").value.trim(); $("#searchPop").hidden = true; MK.go("/explore" + (v ? "?q=" + encodeURIComponent(v) : "")); } });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#modalRoot").innerHTML) $("#modalRoot").innerHTML = ""; });

/* ---------------- render ---------------- */
let lastPath = "";
function render(keep) {
  const r = current();
  if (r.path !== lastPath) { pdView = 0; pdQty = 1; pdVariant = 0; if (!r.path.includes("/publish")) pub = null; lastPath = r.path; }
  if (MK.editorCleanup) { MK.editorCleanup(); MK.editorCleanup = null; }
  const y = window.scrollY;
  $("#hdr").innerHTML = header(r);
  let html;
  if (r.name === "editor") html = MK.editorView(r.args[0], MK.q().get("id"));
  else html = (V[r.name] || V.notfound)(...r.args);
  $("#main").innerHTML = `<div class="view">${html}</div>`;
  if (!keep) $("#main").firstElementChild.classList.add("view"); else $("#main").firstElementChild.classList.remove("view");
  const titles = { home: "Makeory: Imagine it. Make it. Sell it.", explore: "Explore", product: "Product", create: "Create", studio: "Creator Studio", editor: "Editor", project: "Project", manufacture: "Manufacture", publish: "Publish", earnings: "Earnings", checkout: "Bag and checkout", orders: "Demo orders", manufacturers: "Manufacturers", how: "How it works", about: "About", terms: "Demo terms", privacy: "Privacy" };
  document.title = (r.name === "home" ? "" : (titles[r.name] || "Makeory") + " · ") + "Makeory demo";
  if (r.name === "editor") MK.editorMount(r.args[0], MK.q().get("id"));
  else if (V[r.name] && V[r.name].mount) V[r.name].mount(...r.args);
  if (keep) window.scrollTo(0, y);
  else if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
}
MK.render = render;

(async function boot() {
  const red = new URLSearchParams(location.search).get("r");
  if (red && red.startsWith(BASE)) history.replaceState(null, "", red);
  await MK.load();
  render();
})();
})(window.MK);
