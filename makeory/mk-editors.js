/* Makeory demo editors: games, books, apparel (Konva 2D canvas), 3D objects (three.js). */
"use strict";
(function (MK) {
const { esc, money, ic, S, $, $$ } = MK;
const L = MK.L;
const LIBS = {
  konva: "https://cdnjs.cloudflare.com/ajax/libs/konva/9.2.0/konva.min.js",
  three: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
  stl: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js",
  orbit: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js",
};
MK.LIBS = LIBS;
const loaded = {};
function loadScript(url) {
  if (!loaded[url]) loaded[url] = new Promise((res, rej) => { const s = document.createElement("script"); s.src = url; s.crossOrigin = "anonymous"; s.onload = res; s.onerror = () => { delete loaded[url]; rej(new Error("Could not load " + url)); }; document.head.appendChild(s); });
  return loaded[url];
}
function readFile(file, as) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; as === "buf" ? r.readAsArrayBuffer(file) : r.readAsDataURL(file); }); }
function shrink(dataURL, max = 700) {
  return new Promise(res => { const im = new Image(); im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); res({ url: c.toDataURL("image/png"), w: im.width, h: im.height }); }; im.onerror = () => res({ url: dataURL, w: 0, h: 0 }); im.src = dataURL; });
}

/* ---------- shared editor state ---------- */
let ed = null;          // working copy of the project
let dirty = false;
const DEFAULTS = {
  games: () => ({ subtype: "cardgame", title: "", spec: { desc: "", template: "starlight", c1: "#2B3A8C", c2: "#F2C14E", motif: "orbit", cards: 54, cardBack: "Starburst", board: "None", components: ["Score pad"], rulebook: "", boxArt: "", cardArt: "" } }),
  books: () => ({ subtype: "paperback", title: "", spec: { author: MK.CONFIG.demoProfile.name, c1: "#56705F", c2: "#F1D7A6", motif: "mountain", trim: "6 x 9 in", pages: 120, binding: "Perfect bound", interiorColor: "Black & white", interior: "", coverArt: "" } }),
  apparel: () => ({ subtype: "tee", title: "", spec: { colorName: "Ink", c1: "#202522", c2: "#E9B872", motif: "wave", sizes: ["S", "M", "L"], art: "", artLoaded: false, place: null } }),
  objects: () => ({ subtype: "object", title: "", spec: { fileName: "", fileType: "STL", material: "PLA", colorName: "Terracotta", c1: "#C9734A", c2: "#789584", finish: "Standard", qty: 1, dims: [86, 86, 92], volumeCm3: 118 } }),
};
const TEMPLATES = {
  starlight: { name: "Starlight", c1: "#2B3A8C", c2: "#F2C14E", motif: "orbit" },
  tide: { name: "Tide", c1: "#2F7A7B", c2: "#F1EDE3", motif: "wave" },
  grove: { name: "Grove", c1: "#56705F", c2: "#F1D7A6", motif: "leaf" },
  ember: { name: "Ember", c1: "#B8443A", c2: "#F2C14E", motif: "star" },
};
const GARMENT = { Ink: "#202522", White: "#F7F6F1", Sage: "#789584", Cobalt: "#3659D9", Sand: "#E6D7BC", Clay: "#C9734A" };
const FILAMENT = { Terracotta: "#C9734A", Ink: "#2A2E2B", Ivory: "#EDE8DC", Sage: "#789584", Cobalt: "#3659D9" };

MK.editorView = function (type, id) {
  const existing = id ? MK.proj(id) : null;
  if (!ed || ed._for !== (id || "new:" + type)) {
    ed = existing ? JSON.parse(JSON.stringify(existing)) : Object.assign({ id: null, cat: type, status: "Draft" }, DEFAULTS[type]());
    ed._for = id || "new:" + type; dirty = false;
  }
  const cat = MK.CATS.find(c => c.id === type);
  const subs = MK.SUBTYPES[type];
  return `<div class="wrap">${MK.crumbs([["Creator Studio", "/studio"], [existing ? (existing.title || "Untitled") : "New " + { games: "game", books: "book", apparel: "apparel", objects: "3D object" }[type], existing ? "/studio/projects/" + existing.id : ""], ["Editor", ""]])}
  <div class="shead" style="margin:14px 0 0"><div><p class="eyebrow">${esc(cat.name)} editor</p><h1 style="font-size:clamp(26px,3.4vw,38px);margin-top:8px">${existing ? "Edit " + esc(existing.title || "project") : { games: "Make a new game", books: "Make a new book", apparel: "Design apparel or merch", objects: "Make a 3D object" }[type]}</h1></div>
  <div class="btns"><span class="small muted" id="saveState" style="align-self:center">${existing ? "Saved" : "Not saved yet"}</span><button class="btn pri" type="button" data-ed="save">${ic("check")} Save project</button></div></div>
  <div class="editor"><div class="card stage"><div class="canvas" id="stage">${type === "apparel" ? `<div id="konva"></div>` : type === "objects" ? `<div id="three"></div>` : ""}</div><div class="bar" id="stagebar"></div></div>
  <div class="card panel" id="panel">
   <div class="field"><span>Format</span><div class="chips" role="radiogroup">${subs.map(s => `<button type="button" class="chip${ed.subtype === s.id ? " on" : ""}" role="radio" aria-checked="${ed.subtype === s.id}" data-ed="sub" data-v="${s.id}">${esc(s.name)}</button>`).join("")}</div></div>
   <label class="field"><span>${type === "books" ? "Book title" : "Product name"}</span><input class="inp" id="edTitle" maxlength="60" value="${esc(ed.title)}" placeholder="${{ games: "Harbor Lights", books: "My Field Journal", apparel: "Sunday Club Tee", objects: "Desk Planter" }[type]}"></label>
   <div id="edFields"></div>
   <hr><div><div class="lbl" style="margin-bottom:10px">Checks <span class="badge demo" style="margin-left:6px">Simulated</span></div><div class="vlist" id="edChecks"></div></div>
   <div class="note sage" id="edEst"></div>
   <div class="btns"><button class="btn pri" type="button" data-ed="save" style="flex:1">${ic("check")} Save project</button><button class="btn" type="button" data-ed="savemfg">${ic("factory")} Save and get quotes</button></div>
  </div></div></div>`;
};

/* ---------- field builders ---------- */
const sw = (key, map, cur) => `<div class="swatches" role="radiogroup">${Object.entries(map).map(([n, c]) => `<button type="button" class="sw${cur === n ? " on" : ""}" style="background:${c}" role="radio" aria-checked="${cur === n}" aria-label="${esc(n)}" title="${esc(n)}" data-ed="sw" data-k="${key}" data-v="${esc(n)}"></button>`).join("")}</div>`;
const colorSw = (key, cur) => `<div class="swatches" role="radiogroup">${MK.PALETTE.map(c => `<button type="button" class="sw${cur === c ? " on" : ""}" style="background:${c}" role="radio" aria-checked="${cur === c}" aria-label="Color ${c}" data-ed="color" data-k="${key}" data-v="${c}"></button>`).join("")}</div>`;
const drop = (id, accept, label, hint, file) => `<label class="drop" for="${id}">${ic("upload")}<span style="display:flex;flex-direction:column"><b style="font-size:14px">${esc(file || label)}</b><small class="muted">${esc(hint)}</small></span><input type="file" id="${id}" accept="${accept}"></label>`;
const sel = (id, opts, cur) => `<select class="inp" id="${id}">${opts.map(o => `<option${o === cur ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;

function fieldsGames() {
  const s = ed.spec, showBoard = ed.subtype === "board" || ed.subtype === "tabletop";
  return `<label class="field"><span>Game description</span><textarea class="inp" id="gDesc" maxlength="400" placeholder="How do you win? Who is it for?">${esc(s.desc)}</textarea></label>
  <div class="field"><span>Template</span><div class="chips">${Object.entries(TEMPLATES).map(([k, t]) => `<button type="button" class="chip${s.template === k ? " on" : ""}" data-ed="tpl" data-v="${k}"><span style="width:12px;height:12px;border-radius:50%;background:${t.c1};box-shadow:4px 0 0 ${t.c2}"></span>&nbsp;${esc(t.name)}</button>`).join("")}</div></div>
  <div class="grid2"><div class="field"><span>Main color</span>${colorSw("c1", s.c1)}</div><div class="field"><span>Accent</span>${colorSw("c2", s.c2)}</div></div>
  <div class="grid2"><div class="field"><span>Box artwork</span>${drop("gBox", "image/*", "Upload box art", "PNG or JPG", s.boxArt ? "Box art added" : "")}</div><div class="field"><span>Card artwork</span>${drop("gCard", "image/*", "Upload card art", "PNG or JPG", s.cardArt ? "Card art added" : "")}</div></div>
  ${ed.subtype !== "board" ? `<label class="field"><span>Card count: <b id="gCardsV">${s.cards}</b></span><input type="range" id="gCards" min="18" max="300" step="1" value="${s.cards}"><small>Standard decks are 52 to 54. Large boxes hold up to 300 cards.</small></label>` : ""}
  <div class="grid2"><label class="field"><span>Card backs</span>${sel("gBack", ["Starburst", "Solid", "Pattern grid", "Same as box art"], s.cardBack)}</label>${showBoard ? `<label class="field"><span>Board layout</span>${sel("gBoard", ["None", "Square track", "6 x 6 grid", "Hex map"], s.board)}</label>` : ""}</div>
  <div class="field"><span>Components</span><div class="chips">${["Dice", "Wooden tokens", "Score pad", "Sand timer", "Card sleeves", "Meeples"].map(c => `<button type="button" class="chip${(s.components || []).includes(c) ? " on" : ""}" data-ed="comp" data-v="${c}" aria-pressed="${(s.components || []).includes(c)}">${c}</button>`).join("")}</div></div>
  <div class="field"><span>Rulebook</span>${drop("gRules", "application/pdf", "Upload rulebook PDF", "Read in your browser only", s.rulebook)}</div>`;
}
function fieldsBooks() {
  const s = ed.spec;
  return `<label class="field"><span>Author or creator name</span><input class="inp" id="bAuthor" maxlength="40" value="${esc(s.author)}"></label>
  <div class="field"><span>Cover artwork</span>${drop("bCover", "image/*", "Upload cover art", "PNG or JPG at 300 DPI", s.coverArt ? "Cover art added" : "")}</div>
  <div class="grid2"><div class="field"><span>Cover color</span>${colorSw("c1", s.c1)}</div><div class="field"><span>Accent</span>${colorSw("c2", s.c2)}</div></div>
  <div class="grid2"><label class="field"><span>Trim size</span>${sel("bTrim", ["5 x 8 in", "5.5 x 8.5 in", "6 x 9 in", "8.5 x 8.5 in", "8.5 x 11 in"], s.trim)}</label><label class="field"><span>Page count</span><input class="inp" type="number" id="bPages" min="2" max="900" value="${s.pages}"></label></div>
  <div class="grid2"><label class="field"><span>Binding</span>${sel("bBind", ["Perfect bound", "Casewrap hardcover", "Saddle stitch", "Coil bound"], ed.subtype === "hardcover" ? "Casewrap hardcover" : s.binding)}</label><label class="field"><span>Interior</span>${sel("bInt", ["Black & white", "Full color"], s.interiorColor)}</label></div>
  <div class="field"><span>Interior file</span>${drop("bPdf", "application/pdf", "Upload interior PDF", "One PDF at trim size plus bleed", s.interior)}</div>`;
}
function fieldsApparel() {
  const s = ed.spec, st = MK.SUBTYPES.apparel.find(x => x.id === ed.subtype);
  return `<div class="field"><span>Blank color</span>${sw("colorName", GARMENT, s.colorName)}</div>
  ${ed.subtype === "mug" ? "" : `<div class="field"><span>Sizes to offer</span><div class="chips">${["XS", "S", "M", "L", "XL", "2XL"].map(z => `<button type="button" class="chip${s.sizes.includes(z) ? " on" : ""}" data-ed="size" data-v="${z}" aria-pressed="${s.sizes.includes(z)}">${z}</button>`).join("")}</div></div>`}
  <div class="field"><span>Artwork</span>${drop("aArt", "image/png,image/jpeg", "Upload artwork", "PNG with transparency works best", s.artLoaded ? "Your artwork is on the canvas" : "")}<div class="chips" style="margin-top:4px"><span class="small muted" style="align-self:center">Or try a sample:</span>${["Wave", "Sun", "Type"].map(n => `<button type="button" class="chip" data-ed="sample" data-v="${n}">${n}</button>`).join("")}</div></div>
  <p class="small muted">Printable area: ${st.area[0]} x ${st.area[1]} in. Drag to move, use the handles to scale and rotate.</p>`;
}
function fieldsObjects() {
  const s = ed.spec;
  return `<div class="field"><span>3D model</span>${drop("oFile", ".stl,.3mf", "Upload STL", "STL in millimeters. 3MF is not parsed in this demo.", s.fileName)}<button type="button" class="btn sm" data-ed="samplemodel" style="align-self:flex-start">Use the sample planter</button></div>
  <div class="grid2"><label class="field"><span>Material</span>${sel("oMat", ["PLA", "PETG", "Resin", "Nylon"], s.material)}</label><label class="field"><span>Finish</span>${sel("oFin", ["Standard", "Smooth", "Sanded & painted"], s.finish)}</label></div>
  <div class="field"><span>Color</span>${sw("colorName", FILAMENT, s.colorName)}</div>
  <label class="field"><span>Quantity</span><input class="inp" type="number" id="oQty" min="1" max="100" value="${s.qty}"></label>
  <div class="card pad" style="box-shadow:none;background:#FBFBF8"><dl class="specs" id="oDims"></dl></div>`;
}

/* ---------- previews ---------- */
function cardSvg(front, s, i) {
  const art = s.cardArt, back = s.cardBack;
  if (!front) {
    if (back === "Same as box art" && s.boxArt) return `<rect width="100" height="140" rx="9" fill="${s.c1}"/><clipPath id="cb${i}"><rect x="6" y="6" width="88" height="128" rx="6"/></clipPath><image href="${s.boxArt}" x="6" y="6" width="88" height="128" preserveAspectRatio="xMidYMid slice" clip-path="url(#cb${i})"/>`;
    const pat = back === "Pattern grid" ? Array.from({ length: 24 }, (_, k) => `<circle cx="${18 + (k % 4) * 21}" cy="${20 + ((k / 4) | 0) * 20}" r="4" fill="${s.c2}" opacity=".7"/>`).join("") : back === "Solid" ? "" : `<g transform="translate(50 70)">${Array.from({ length: 12 }, (_, k) => `<path d="M0 0 L0 -40" stroke="${s.c2}" stroke-width="3" transform="rotate(${k * 30})"/>`).join("")}<circle r="12" fill="${s.c2}"/></g>`;
    return `<rect width="100" height="140" rx="9" fill="${s.c1}"/><rect x="6" y="6" width="88" height="128" rx="6" fill="none" stroke="${s.c2}" stroke-width="1.5"/>${pat}`;
  }
  return `<rect width="100" height="140" rx="9" fill="#fff" stroke="#E5E5DF"/>${art ? `<clipPath id="cf${i}"><rect x="8" y="22" width="84" height="96" rx="5"/></clipPath><image href="${art}" x="8" y="22" width="84" height="96" preserveAspectRatio="xMidYMid slice" clip-path="url(#cf${i})"/>` : `<rect x="8" y="22" width="84" height="96" rx="5" fill="${MK.shade(s.c1, .82)}"/><circle cx="50" cy="70" r="${16 + (i % 3) * 5}" fill="${s.c1}"/><circle cx="${50 + (i % 2 ? 14 : -14)}" cy="58" r="6" fill="${s.c2}"/>`}<text x="10" y="16" font-family="Manrope,sans-serif" font-weight="800" font-size="11" fill="${s.c1}">${i + 1}</text><text x="50" y="132" text-anchor="middle" font-family="Inter,sans-serif" font-size="7" fill="#737A75">${esc((ed.title || "Card").slice(0, 18))}</text>`;
}
let gView = "box", bView = "cover";
function drawGames() {
  const s = ed.spec, kind = MK.kindOf(ed);
  const stage = $("#stage"); if (!stage) return;
  let svg;
  if (gView === "cards") {
    const n = Math.min(6, s.cards || 6);
    svg = `<svg viewBox="0 0 400 400" role="img" aria-label="Card preview"><rect width="400" height="400" fill="transparent"/>${Array.from({ length: n }, (_, i) => `<g transform="translate(${30 + (i % 3) * 120} ${30 + ((i / 3) | 0) * 180}) scale(1)"><svg width="100" height="140" viewBox="0 0 100 140">${cardSvg(i !== 0, s, i)}</svg></g>`).join("")}<text x="200" y="392" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" fill="#737A75">First card shows the back · ${s.cards} cards total</text></svg>`;
  } else if (gView === "board") {
    let cells = ""; const B = s.board;
    if (B === "6 x 6 grid") for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) cells += `<rect x="${74 + i * 42}" y="${74 + j * 42}" width="38" height="38" rx="5" fill="${(i + j) % 2 ? MK.shade(s.c1, .75) : "#FBFAF6"}"/>`;
    else if (B === "Hex map") for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { const x = 92 + i * 42 + (j % 2) * 21, y = 92 + j * 37; cells += `<polygon points="${[0, 1, 2, 3, 4, 5].map(k => (x + 20 * Math.cos(Math.PI / 3 * k + Math.PI / 6)).toFixed(1) + "," + (y + 20 * Math.sin(Math.PI / 3 * k + Math.PI / 6)).toFixed(1)).join(" ")}" fill="${(i * j) % 3 ? MK.shade(s.c1, .72) : s.c2}" stroke="#fff" stroke-width="2"/>`; }
    else if (B === "Square track") for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { if (i && j && i < 6 && j < 6) continue; cells += `<rect x="${70 + i * 38}" y="${70 + j * 38}" width="34" height="34" rx="5" fill="${(i + j) % 3 ? MK.shade(s.c1, .75) : s.c2}"/>`; }
    svg = B === "None" ? `<svg viewBox="0 0 400 400"><text x="200" y="200" text-anchor="middle" font-family="Inter,sans-serif" font-size="14" fill="#737A75">Choose a board layout to preview it</text></svg>` : `<svg viewBox="0 0 400 400" role="img" aria-label="Board preview"><rect x="56" y="56" width="288" height="288" rx="18" fill="${s.c1}"/>${cells}${s.boxArt ? "" : `<circle cx="200" cy="200" r="30" fill="${s.c2}" opacity=".9"/>`}</svg>`;
  } else svg = MK.art({ kind, c1: s.c1, c2: s.c2, bg: "transparent", title: ed.title || "Your game", motif: s.motif, image: s.boxArt });
  stage.innerHTML = svg;
  const tabs = [["box", "Packaging"], ["cards", "Cards"]].concat(ed.subtype === "board" || ed.subtype === "tabletop" ? [["board", "Board"]] : []);
  $("#stagebar").innerHTML = `<div class="seg" role="tablist">${tabs.map(([k, n]) => `<button type="button" role="tab" aria-selected="${gView === k}" class="${gView === k ? "on" : ""}" data-ed="gview" data-v="${k}">${n}</button>`).join("")}</div><span class="small muted">Mockup, not a print file</span>`;
}
function drawBooks() {
  const s = ed.spec, d = MK.coverDims(s), stage = $("#stage"); if (!stage) return;
  if (bView === "spread") {
    const W = 340, scale = W / d.fw, h = d.fh * scale, sp = Math.max(4, d.spine * scale), fw = (W - sp) / 2;
    stage.innerHTML = `<svg viewBox="0 0 400 400" role="img" aria-label="Flat cover with spine"><g transform="translate(30 ${200 - h / 2})"><rect width="${fw}" height="${h}" fill="${MK.shade(s.c1, -.1)}"/><rect x="${fw}" width="${sp}" height="${h}" fill="${MK.shade(s.c1, -.3)}"/><rect x="${fw + sp}" width="${fw}" height="${h}" fill="${s.c1}"/>
    ${s.coverArt ? `<clipPath id="fc"><rect x="${fw + sp + 10}" y="10" width="${fw - 20}" height="${h * .62}"/></clipPath><image href="${s.coverArt}" x="${fw + sp + 10}" y="10" width="${fw - 20}" height="${h * .62}" preserveAspectRatio="xMidYMid slice" clip-path="url(#fc)"/>` : ""}
    <text x="${fw + sp + fw / 2}" y="${h * .8}" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="13" fill="#fff">${esc((ed.title || "Title").slice(0, 18))}</text>
    <rect x="${scale * .125}" y="${scale * .125}" width="${W - scale * .25}" height="${h - scale * .25}" fill="none" stroke="#B3261E" stroke-dasharray="4 3" stroke-width="1" opacity=".6"/><text x="${W - 4}" y="${h - 6}" text-anchor="end" font-family="Inter,sans-serif" font-size="9" fill="#B3261E" opacity=".8">trim line</text>
    <text x="${fw / 2}" y="${h + 18}" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#737A75">Back</text><text x="${fw + sp / 2}" y="${h + 18}" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#737A75">Spine ${d.spine} in</text><text x="${fw + sp + fw / 2}" y="${h + 18}" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#737A75">Front</text></g></svg>`;
  } else stage.innerHTML = MK.art({ kind: MK.kindOf(ed), c1: s.c1, c2: s.c2, bg: "transparent", title: ed.title || "Your book", sub: s.author, motif: s.motif, image: s.coverArt });
  $("#stagebar").innerHTML = `<div class="seg" role="tablist">${[["cover", "Cover"], ["spread", "Full cover and spine"]].map(([k, n]) => `<button type="button" role="tab" aria-selected="${bView === k}" class="${bView === k ? "on" : ""}" data-ed="bview" data-v="${k}">${n}</button>`).join("")}</div><span class="small muted">${d.fw} x ${d.fh} in flat (illustrative)</span>`;
}

/* ---------- apparel: Konva ---------- */
let kz = null;
const GPATH = {
  tee: "M150 84 Q200 112 250 84 L326 120 L302 186 L272 172 L272 334 L128 334 L128 172 L98 186 L74 120Z",
  hoodie: "M138 92 Q200 60 262 92 L326 130 L304 196 L276 184 L276 334 L124 334 L124 184 L96 196 L74 130Z",
  tote: "M110 120 H290 L300 334 H100Z",
  mug: "M110 120 H286 V310 Q286 330 266 330 H130 Q110 330 110 310Z",
};
const AREA_PX = { tee: [140, 150, 120, 150], hoodie: [140, 140, 120, 125], tote: [130, 160, 140, 140], mug: [120, 170, 156, 90] }; // x, y, w, h in 400-space
function sampleArt(name, c2) {
  const c = document.createElement("canvas"); c.width = 1800; c.height = 1800; const g = c.getContext("2d");
  g.lineCap = "round";
  if (name === "Wave") { g.strokeStyle = c2; g.lineWidth = 90; for (let i = 0; i < 4; i++) { g.globalAlpha = 1 - i * .2; g.beginPath(); for (let x = 150; x <= 1650; x += 10) g.lineTo(x, 520 + i * 260 + Math.sin(x / 160) * 110); g.stroke(); } }
  else if (name === "Sun") { g.fillStyle = c2; g.beginPath(); g.arc(900, 900, 420, 0, Math.PI * 2); g.fill(); g.strokeStyle = c2; g.lineWidth = 70; for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; g.beginPath(); g.moveTo(900 + Math.cos(a) * 540, 900 + Math.sin(a) * 540); g.lineTo(900 + Math.cos(a) * 760, 900 + Math.sin(a) * 760); g.stroke(); } }
  else { g.fillStyle = c2; g.font = "800 360px Manrope, system-ui, sans-serif"; g.textAlign = "center"; g.fillText((ed.title || "MAKE").split(" ")[0].toUpperCase().slice(0, 6), 900, 1000); g.font = "600 120px Inter, system-ui, sans-serif"; g.fillText("EST. 2026", 900, 1200); }
  return c.toDataURL("image/png");
}
async function mountApparel() {
  const host = $("#konva"); if (!host) return;
  try { await loadScript(LIBS.konva); } catch (e) { host.innerHTML = `<div class="note warn" style="margin:20px">${ic("alert")}<span>The 2D canvas library could not load. Check your connection and reload.</span></div>`; return; }
  if (!document.body.contains(host)) return;
  const size = host.clientWidth || 500, k = size / 400;
  const stage = new Konva.Stage({ container: host, width: size, height: size });
  const base = new Konva.Layer(), art = new Konva.Layer(); stage.add(base, art);
  const st = ed.subtype, A = AREA_PX[st];
  const garmentColor = GARMENT[ed.spec.colorName] || "#202522";
  base.add(new Konva.Path({ data: GPATH[st], fill: garmentColor, scaleX: k, scaleY: k, shadowColor: "#000", shadowOpacity: .08, shadowBlur: 12, shadowOffsetY: 6 }));
  if (st === "tote") base.add(new Konva.Path({ data: "M160 120 C160 60 240 60 240 120", stroke: MK.shade(garmentColor, -.28), strokeWidth: 9 * k, scaleX: k, scaleY: k }));
  if (st === "mug") base.add(new Konva.Path({ data: "M286 160 c46 0 46 96 0 96", stroke: MK.shade(garmentColor, -.25), strokeWidth: 16, scaleX: k, scaleY: k }));
  const area = new Konva.Rect({ x: A[0] * k, y: A[1] * k, width: A[2] * k, height: A[3] * k, stroke: garmentColor === "#202522" || garmentColor === "#3659D9" ? "#F8F7F3" : "#3659D9", dash: [6, 5], strokeWidth: 1.5, opacity: .8, listening: false });
  base.add(area);
  base.add(new Konva.Text({ x: A[0] * k, y: (A[1] + A[3]) * k + 6, width: A[2] * k, align: "center", text: "Printable area", fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#737A75" }));
  const clip = new Konva.Group(); art.add(clip);
  const tr = new Konva.Transformer({ rotateEnabled: true, keepRatio: true, anchorSize: 10, borderStroke: "#3659D9", anchorStroke: "#3659D9", anchorFill: "#fff", rotationSnaps: [0, 90, 180, 270] });
  art.add(tr);
  let node = null;
  const evaluate = () => {
    if (!node) return;
    const box = node.getClientRect({ relativeTo: stage }), ax = A[0] * k, ay = A[1] * k, aw = A[2] * k, ah = A[3] * k;
    const out = box.x < ax - 1 || box.y < ay - 1 || box.x + box.width > ax + aw + 1 || box.y + box.height > ay + ah + 1;
    const inches = (node.width() * node.scaleX()) / aw * MK.SUBTYPES.apparel.find(x => x.id === st).area[0];
    const dpi = Math.round((node._natW || 600) / Math.max(.1, inches));
    ed.spec.outside = out; ed.spec.dpi = dpi;
    ed.spec.place = { x: node.x() / k, y: node.y() / k, w: node.width() * node.scaleX() / k, h: node.height() * node.scaleY() / k, r: node.rotation() };
    area.stroke(out ? "#B3261E" : (garmentColor === "#202522" || garmentColor === "#3659D9" ? "#F8F7F3" : "#3659D9")); base.batchDraw();
    $("#stagebar .info").innerHTML = `${ic(out || dpi < 150 ? "alert" : "check")} ${out ? "Outside printable area" : dpi < 150 ? "Low resolution: about " + dpi + " DPI" : "About " + dpi + " DPI at this size"}`;
    $("#stagebar .info").style.color = out || dpi < 150 ? "var(--err)" : "var(--sage-d)";
    checks();
  };
  const place = (url, natW) => {
    const im = new Image(); im.onload = () => {
      if (node) node.destroy();
      const pl = ed.spec.place, ratio = im.height / im.width;
      let w = A[2] * k * .8, h = w * ratio; if (h > A[3] * k * .9) { h = A[3] * k * .9; w = h / ratio; }
      node = new Konva.Image({ image: im, width: w, height: h, x: A[0] * k + A[2] * k / 2, y: A[1] * k + A[3] * k / 2, offsetX: w / 2, offsetY: h / 2, draggable: true });
      if (pl) { node.position({ x: pl.x * k, y: pl.y * k }); node.scale({ x: pl.w * k / w, y: pl.h * k / h }); node.rotation(pl.r); }
      node._natW = natW || ed.spec.natW || im.width;
      clip.add(node); tr.nodes([node]); art.draw();
      ["dragmove", "transform", "dragend", "transformend"].forEach(ev => node.on(ev, () => { evaluate(); if (ev.endsWith("end")) markDirty(); }));
      evaluate();
    };
    im.src = url;
  };
  kz = { stage, place, center: () => { if (!node) return; node.position({ x: A[0] * k + A[2] * k / 2, y: A[1] * k + A[3] * k / 2 }); node.rotation(0); art.draw(); evaluate(); markDirty(); }, rotate: () => { if (!node) return; node.rotation((node.rotation() + 90) % 360); art.draw(); evaluate(); markDirty(); }, fit: () => { if (!node) return; ed.spec.place = null; place(ed.spec.art, node._natW); markDirty(); } };
  $("#stagebar").innerHTML = `<div class="btns"><button class="btn sm" type="button" data-ed="kcenter">Center</button><button class="btn sm" type="button" data-ed="krot">${ic("rotate")} Rotate 90°</button><button class="btn sm" type="button" data-ed="kfit">Fit to area</button></div><span class="small info" style="display:flex;gap:6px;align-items:center"></span>`;
  if (!ed.spec.art) { ed.spec.art = sampleArt("Wave", ed.spec.c2 = garmentColor === "#F7F6F1" || garmentColor === "#E6D7BC" ? "#3659D9" : "#E9B872"); ed.spec.natW = 1800; }
  place(ed.spec.art, ed.spec.natW);
}

/* ---------- objects: three.js ---------- */
let tz = null;
async function mountThree() {
  const host = $("#three"); if (!host) return;
  try { await loadScript(LIBS.three); await Promise.all([loadScript(LIBS.stl), loadScript(LIBS.orbit)]); }
  catch (e) { host.innerHTML = `<div class="note warn" style="margin:20px">${ic("alert")}<span>The 3D viewer library could not load. Check your connection and reload.</span></div>`; return; }
  if (!document.body.contains(host)) return;
  const w = host.clientWidth || 500, h = host.clientHeight || 500;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setSize(w, h); host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, w / h, .1, 5000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d4c8, .9)); const dl = new THREE.DirectionalLight(0xffffff, .75); dl.position.set(1, 2, 1.4); scene.add(dl);
  const grid = new THREE.GridHelper(400, 20, 0xcfcfc7, 0xe5e5df); scene.add(grid);
  const controls = new THREE.OrbitControls(cam, renderer.domElement); controls.enableDamping = true;
  let mesh = null, raf = 0;
  const mat = () => new THREE.MeshStandardMaterial({ color: FILAMENT[ed.spec.colorName] || "#C9734A", roughness: ed.spec.finish === "Smooth" ? .35 : ed.spec.finish === "Sanded & painted" ? .5 : .7, metalness: 0, flatShading: ed.spec.material !== "Resin" });
  const show = (geom) => {
    if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); }
    geom.computeVertexNormals(); geom.computeBoundingBox();
    const bb = geom.boundingBox, c = new THREE.Vector3(); bb.getCenter(c); geom.translate(-c.x, -bb.min.y, -c.z); geom.computeBoundingBox();
    mesh = new THREE.Mesh(geom, mat()); scene.add(mesh);
    const sz = new THREE.Vector3(); geom.boundingBox.getSize(sz);
    ed.spec.dims = [sz.x, sz.y, sz.z];
    ed.spec.volumeCm3 = +(Math.abs(volume(geom)) / 1000).toFixed(1);
    const m = Math.max(sz.x, sz.y, sz.z); cam.position.set(m * 1.4, m * 1.1, m * 1.6); controls.target.set(0, sz.y / 2, 0); controls.update();
    grid.scale.setScalar(Math.max(.4, m / 200));
    dims(); checks(); est();
  };
  const loop = () => { raf = requestAnimationFrame(loop); controls.update(); renderer.render(scene, cam); };
  loop();
  tz = {
    show, recolor: () => { if (mesh) { mesh.material.dispose(); mesh.material = mat(); } },
    sample: () => { const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector2(30 + 14 * t + 4 * Math.sin(t * 3), t * 92)); } pts.unshift(new THREE.Vector2(0, 0)); pts.push(new THREE.Vector2(0, 92)); show(new THREE.LatheGeometry(pts, 7)); },
    snapshot: () => { try { renderer.render(scene, cam); return renderer.domElement.toDataURL("image/png"); } catch (e) { return ""; } },
    load: (buf) => { const g = new THREE.STLLoader().parse(buf); show(g); },
    dispose: () => { cancelAnimationFrame(raf); controls.dispose(); renderer.dispose(); },
  };
  $("#stagebar").innerHTML = `<span class="small muted">Drag to rotate · scroll or pinch to zoom</span><button class="btn sm" type="button" data-ed="resetcam">Reset view</button>`;
  if (ed.spec._stl) { try { tz.load(b64ToBuf(ed.spec._stl)); } catch (e) { tz.sample(); } } else tz.sample();
}
function volume(g) {
  const p = g.attributes.position, idx = g.index; let v = 0; const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const n = idx ? idx.count : p.count;
  for (let i = 0; i < n; i += 3) { const i0 = idx ? idx.getX(i) : i, i1 = idx ? idx.getX(i + 1) : i + 1, i2 = idx ? idx.getX(i + 2) : i + 2; a.fromBufferAttribute(p, i0); b.fromBufferAttribute(p, i1); c.fromBufferAttribute(p, i2); v += a.dot(b.clone().cross(c)) / 6; }
  return v;
}
const bufToB64 = (buf) => { let s = ""; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 32768) s += String.fromCharCode.apply(null, b.subarray(i, i + 32768)); return btoa(s); };
const b64ToBuf = (s) => { const bin = atob(s), b = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i); return b.buffer; };
function dims() { const d = ed.spec.dims || [0, 0, 0], el = $("#oDims"); if (!el) return; el.innerHTML = `<dt>Width</dt><dd>${d[0].toFixed(1)} mm</dd><dt>Height</dt><dd>${d[1].toFixed(1)} mm</dd><dt>Depth</dt><dd>${d[2].toFixed(1)} mm</dd><dt>Material use</dt><dd>About ${ed.spec.volumeCm3} cm³ if solid (estimate)</dd>`; }

/* ---------- checks + estimate ---------- */
function providerFor() { return { games: "gamecrafter", books: "lulu", apparel: "printful", objects: "treatstock" }[ed.cat]; }
function checks() {
  const el = $("#edChecks"); if (!el) return;
  ed.title = ($("#edTitle") || {}).value || ed.title;
  const v = MK.validate(ed, providerFor());
  el.innerHTML = v.items.filter(i => i.level !== "info").map(it => `<div class="vrow ${it.level === "ok" ? "ok" : it.level}">${ic(it.level === "ok" ? "checkc" : "alert")}<span>${esc(it.text)}</span></div>`).join("");
  return v;
}
async function est() {
  const el = $("#edEst"); if (!el) return;
  const q = await MK.ADAPTERS[providerFor()].getQuote({ project: ed, quantity: ed.cat === "objects" ? ed.spec.qty : 1 });
  el.innerHTML = `${ic("factory")}<span>Illustrative estimate from the ${esc(MK.PROVIDERS[providerFor()].name)} mock: <b>${money(q.unitMinor)}</b> per unit plus about ${money(q.shippingMinor)} shipping. Compare every partner on the next step.</span>`;
}
function markDirty() { dirty = true; const s = $("#saveState"); if (s) s.textContent = "Unsaved changes"; }
function redrawPreview() { if (ed.cat === "games") drawGames(); if (ed.cat === "books") drawBooks(); }
function refresh() { redrawPreview(); checks(); est(); }

/* ---------- save ---------- */
async function save(thenMfg) {
  ed.title = ($("#edTitle").value || "").trim() || "Untitled " + (MK.SUBTYPES[ed.cat].find(s => s.id === ed.subtype) || {}).name.toLowerCase();
  const s = ed.spec;
  if (ed.cat === "games") s.previewImage = s.boxArt || "";
  if (ed.cat === "books") s.previewImage = s.coverArt || "";
  if (ed.cat === "apparel") { s.previewImage = s.artLoaded || s.art ? (await shrink(s.art, 420)).url : ""; s.c1 = GARMENT[s.colorName]; }
  if (ed.cat === "objects") { s.previewImage = tz ? tz.snapshot() : s.previewImage || ""; s.c1 = FILAMENT[s.colorName]; }
  const v = MK.validate(ed, providerFor());
  const isNew = !ed.id;
  if (isNew) { ed.id = MK.uid("p"); ed.created = Date.now(); }
  ed.updated = Date.now();
  if (ed.status === "Draft" && v.ok) ed.status = "Design Ready";
  if (!v.ok && ["Design Ready"].includes(ed.status)) ed.status = "Draft";
  const clean = JSON.parse(JSON.stringify(ed)); delete clean._for;
  const i = S.projects.findIndex(p => p.id === ed.id); if (i >= 0) S.projects[i] = clean; else S.projects.push(clean);
  MK.log((isNew ? "Created " : "Saved ") + ed.title);
  try { MK.save("projects"); } catch (e) { MK.toast("Could not save in this browser"); return; }
  dirty = false; MK.toast(v.ok ? "Saved. Status: " + ed.status : "Saved as a draft. Fix the flagged checks next.");
  const id = ed.id; ed = null;
  MK.go(thenMfg ? "/studio/projects/" + id + "/manufacture" : "/studio/projects/" + id);
}

/* ---------- mount + events ---------- */
MK.editorMount = function (type) {
  const f = $("#edFields"); if (!f || !ed) return;
  f.innerHTML = `<div style="display:flex;flex-direction:column;gap:18px">${{ games: fieldsGames, books: fieldsBooks, apparel: fieldsApparel, objects: fieldsObjects }[type]()}</div>`;
  const on = (id, ev, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); };
  on("edTitle", "input", () => { ed.title = $("#edTitle").value; markDirty(); redrawPreview(); checks(); });
  const s = ed.spec;
  if (type === "games") {
    on("gDesc", "input", e => { s.desc = e.target.value; markDirty(); });
    on("gCards", "input", e => { s.cards = +e.target.value; $("#gCardsV").textContent = s.cards; markDirty(); refresh(); });
    on("gBack", "change", e => { s.cardBack = e.target.value; markDirty(); gView = "cards"; drawGames(); });
    on("gBoard", "change", e => { s.board = e.target.value; markDirty(); gView = "board"; refresh(); });
    on("gBox", "change", async e => { const fl = e.target.files[0]; if (!fl) return; s.boxArt = (await shrink(await readFile(fl), 900)).url; gView = "box"; markDirty(); MK.editorMount(type); refresh(); });
    on("gCard", "change", async e => { const fl = e.target.files[0]; if (!fl) return; s.cardArt = (await shrink(await readFile(fl), 600)).url; gView = "cards"; markDirty(); MK.editorMount(type); refresh(); });
    on("gRules", "change", e => { const fl = e.target.files[0]; if (!fl) return; s.rulebook = fl.name + " (" + Math.max(1, Math.round(fl.size / 1024)) + " KB)"; markDirty(); MK.editorMount(type); refresh(); });
  }
  if (type === "books") {
    on("bAuthor", "input", e => { s.author = e.target.value; markDirty(); drawBooks(); });
    on("bTrim", "change", e => { s.trim = e.target.value; markDirty(); refresh(); });
    on("bPages", "input", e => { s.pages = Math.max(0, +e.target.value | 0); markDirty(); refresh(); });
    on("bBind", "change", e => { s.binding = e.target.value; markDirty(); refresh(); });
    on("bInt", "change", e => { s.interiorColor = e.target.value; s.interior && markDirty(); refresh(); });
    on("bCover", "change", async e => { const fl = e.target.files[0]; if (!fl) return; s.coverArt = (await shrink(await readFile(fl), 900)).url; markDirty(); MK.editorMount(type); refresh(); });
    on("bPdf", "change", e => { const fl = e.target.files[0]; if (!fl) return; if (!/pdf$/i.test(fl.name)) { MK.toast("Interior must be a PDF"); return; } s.interior = fl.name + " (" + (fl.size / 1048576).toFixed(1) + " MB)"; markDirty(); MK.editorMount(type); refresh(); });
  }
  if (type === "apparel") {
    on("aArt", "change", async e => { const fl = e.target.files[0]; if (!fl) return; const raw = await readFile(fl); const sh = await shrink(raw, 1400); s.art = sh.url; s.natW = sh.w; s.artLoaded = true; s.place = null; markDirty(); kz && kz.place(s.art, sh.w); MK.$("#aArt").closest(".drop").querySelector("b").textContent = "Your artwork is on the canvas"; });
  }
  if (type === "objects") {
    on("oFile", "change", async e => { const fl = e.target.files[0]; if (!fl) return;
      if (/\.3mf$/i.test(fl.name)) { MK.toast("3MF is not parsed in this demo. Export as STL."); s.fileName = fl.name + " (not previewed)"; s.fileType = "3MF"; MK.editorMount(type); return; }
      if (fl.size > 12 * 1048576) { MK.toast("Keep STL files under 12 MB for the demo"); return; }
      const buf = await readFile(fl, "buf"); try { tz.load(buf); s.fileName = fl.name; s.fileType = "STL"; s._stl = fl.size < 3 * 1048576 ? bufToB64(buf) : ""; markDirty(); MK.$("#oFile").closest(".drop").querySelector("b").textContent = fl.name; } catch (err) { MK.toast("That file could not be read as STL"); } });
    on("oMat", "change", e => { s.material = e.target.value; tz && tz.recolor(); markDirty(); refresh(); });
    on("oFin", "change", e => { s.finish = e.target.value; tz && tz.recolor(); markDirty(); refresh(); });
    on("oQty", "input", e => { s.qty = Math.max(1, Math.min(100, +e.target.value | 0)); markDirty(); est(); });
    dims();
  }
  if (type === "apparel" && !kz) mountApparel();
  if (type === "objects" && !tz) mountThree();
  redrawPreview(); checks(); est();
  MK.editorCleanup = () => { if (tz) { tz.dispose(); tz = null; } if (kz) { kz.stage.destroy(); kz = null; } };
};
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ed]"); if (!b || !ed) return;
  const a = b.dataset.ed, v = b.dataset.v, s = ed.spec, type = ed.cat;
  const rebuild = () => { MK.editorMount(type); };
  if (a === "save") return save(false);
  if (a === "savemfg") return save(true);
  if (a === "sub") { ed.subtype = v; if (type === "books" && v === "hardcover") s.binding = "Casewrap hardcover"; if (type === "games" && v === "board" && s.board === "None") s.board = "Square track"; markDirty(); if (type === "apparel") { s.place = null; MK.render(true); return; } $$("[data-ed=sub]").forEach(x => { x.classList.toggle("on", x.dataset.v === v); x.setAttribute("aria-checked", x.dataset.v === v); }); rebuild(); return; }
  if (a === "tpl") { Object.assign(s, { template: v, c1: TEMPLATES[v].c1, c2: TEMPLATES[v].c2, motif: TEMPLATES[v].motif }); markDirty(); rebuild(); return; }
  if (a === "color") { s[b.dataset.k] = v; markDirty(); rebuild(); return; }
  if (a === "sw") { s[b.dataset.k] = v; markDirty(); if (type === "apparel") { s.c1 = GARMENT[v]; MK.render(true); return; } if (type === "objects") { tz && tz.recolor(); } rebuild(); return; }
  if (a === "comp") { s.components = s.components.includes(v) ? s.components.filter(x => x !== v) : [...s.components, v]; markDirty(); rebuild(); return; }
  if (a === "size") { s.sizes = s.sizes.includes(v) ? s.sizes.filter(x => x !== v) : [...s.sizes, v]; if (!s.sizes.length) s.sizes = [v]; markDirty(); rebuild(); return; }
  if (a === "sample") { const col = ["#F7F6F1", "#E6D7BC"].includes(GARMENT[s.colorName]) ? "#3659D9" : "#E9B872"; s.c2 = col; s.art = sampleArt(v, col); s.natW = 1800; s.artLoaded = false; s.place = null; markDirty(); kz && kz.place(s.art, 1800); return; }
  if (a === "kcenter") return kz && kz.center();
  if (a === "krot") return kz && kz.rotate();
  if (a === "kfit") return kz && kz.fit();
  if (a === "samplemodel") { s.fileName = ""; s._stl = ""; s.fileType = "STL"; tz && tz.sample(); markDirty(); rebuild(); return; }
  if (a === "resetcam") { tz && ed.spec._stl ? tz.load(b64ToBuf(ed.spec._stl)) : tz && tz.sample(); return; }
  if (a === "gview") { gView = v; drawGames(); return; }
  if (a === "bview") { bView = v; drawBooks(); return; }
});
window.addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
})(window.MK);
