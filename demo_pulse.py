"""The Pulse: a temporary, unlisted concept demo of a career-field communication hub (David, 17 Oct 2026).

Built at /demo/pulse/ in the studio frame. noindex, not in the sitemap, linked from nowhere.
To take it down: set PULSE_DEMO = False (the source stays here for later).
"""
PULSE_DEMO = True
HERE = "demo/pulse"
ACCENT = {"accent": ("#2F5A8C", "#8DB3E0")}

BODY = """
<div class="pv-banner"><div class="wrap">
<span><b>Concept demo.</b> Not an official Air Force website. Every issue, name and number here is sample data.</span>
<button type="button" class="pv-link" id="reset">Reset the demo</button>
</div></div>

<section class="pv-hero"><div class="wrap pv-hero-grid">
<div>
<h1>The Pulse</h1>
<p class="tag">Every issue raised gets an answer back.</p>
<p class="lede">One place for the whole career field to raise what is getting in the way, see who is working it, and hear what was decided. From the CFM to the FAC to the Council, and back out to every Airman.</p>
<div class="pv-actions"><a class="btn" href="#submit">Raise an issue</a><a class="btn pv-ghost" href="#loop">See how it moves</a></div>
<p class="pv-zulu" id="zulu" aria-label="Current Zulu time">0000Z</p>
</div>
<div class="pv-board" aria-labelledby="board-h">
<div class="pv-board-head"><h2 id="board-h">Issue board</h2><span>Select an issue to see its trail.</span></div>
<div class="pv-lanes" id="lanes"></div>
<div class="pv-board-foot">
<span class="pv-key"><i style="background:var(--pv-raised)"></i>Waiting on review</span>
<span class="pv-key"><i style="background:var(--app)"></i>With the FAC or Council</span>
<span class="pv-key"><i style="background:var(--pv-done)"></i>Decided and shared</span>
<span id="board-total"></span>
</div>
</div>
</div></section>

<section class="section" id="loop"><div class="wrap">
<h2>How an issue moves</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.4rem;font-size:1rem">Four stops, in this order. Nothing is closed until the answer has gone back to the people who raised it.</p>
<ol class="pv-loop">
<li class="pv-step"><div class="num" aria-hidden="true">1</div><h3>Raised</h3><p class="who">Any Airman, through the CFM</p><ul><li>Name the problem in a sentence</li><li>Say who it affects and how often</li><li>Suggest a fix if you have one</li></ul></li>
<li class="pv-step"><div class="num" aria-hidden="true">2</div><h3>Reviewed</h3><p class="who">Functional Advisory Council</p><ul><li>Checks it against field priorities</li><li>Shapes the recommendation</li><li>Forwards it to the Council</li></ul></li>
<li class="pv-step"><div class="num" aria-hidden="true">3</div><h3>Decided</h3><p class="who">CFM Council</p><ul><li>Weighs it against the field's other issues</li><li>Decides by consensus</li><li>Records the decision and owner</li></ul></li>
<li class="pv-step"><div class="num" aria-hidden="true">4</div><h3>Shared</h3><p class="who">The whole career field</p><ul><li>Decision published on The Pulse</li><li>Owner and date stay visible</li><li>Feedback reopens the loop</li></ul></li>
</ol>
<p class="pv-back">Feedback on a shared decision starts a new issue at step 1, linked to the old one.</p>
</div></section>

<section class="section" id="submit"><div class="wrap pv-two">
<div>
<h2>Raise an issue</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">Takes about two minutes. In this demo it lands on the issue board so you can follow it.</p>
<form class="pv-form" id="form" novalidate>
<label class="f" for="title">What is the problem?</label>
<input type="text" id="title" maxlength="90" placeholder="Shift-change checklists differ between sites">
<fieldset><legend>Who does it affect?</legend>
<div class="pv-choices">
<label><input type="radio" name="scope" value="One unit" checked> One unit</label>
<label><input type="radio" name="scope" value="Several units"> Several units</label>
<label><input type="radio" name="scope" value="Whole career field"> Whole career field</label>
</div></fieldset>
<div class="pv-pair">
<div><label class="f" for="area">Area</label>
<select id="area"><option>Training</option><option>Manning</option><option>Equipment</option><option>Procedures</option><option>Career development</option><option>Quality of life</option></select></div>
<div><label class="f" for="often">How often does it bite?</label>
<select id="often"><option>Every shift</option><option>Weekly</option><option>Monthly</option><option>Rarely, but badly</option></select></div>
</div>
<label class="f" for="fix">What would fix it? <span class="pv-hint" style="display:inline">(optional)</span></label>
<textarea id="fix" maxlength="400" placeholder="One standard checklist, owned by the field, with local annexes."></textarea>
<p class="pv-hint">Keep it unclassified and leave out names. The real version would route through your CFM.</p>
<div class="pv-row"><button class="btn" type="submit">Raise this issue</button><p class="pv-ok" id="ok" role="status"></p></div>
</form>
</div>
<div class="pv-tips">
<h3>What makes a strong submission</h3>
<div class="pv-tip"><b>A clear problem</b><p>One sentence anyone in the field would recognise. No acronyms the next base won't know.</p></div>
<div class="pv-tip"><b>The impact</b><p>Who it hits, how often, and what it costs in time, readiness or people.</p></div>
<div class="pv-tip"><b>A suggested fix</b><p>Optional, but issues with a proposed course of action move faster.</p></div>
<div class="pv-tip"><b>Priority comes later</b><p>The FAC ranks issues against each other. You only need to describe yours.</p></div>
</div>
</div></section>

<section class="section" id="roles"><div class="wrap">
<h2>Who does what</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">Each step has one owner, so an issue is never waiting on "someone".</p>
<div class="pv-roles">
<div class="pv-role"><b>Career Field Manager</b><p>Gathers issues from the field, checks them against field priorities and submits them to the FAC.</p></div>
<div class="pv-role"><b>Functional Advisory Council</b><p>Validates each issue, develops the recommendation and forwards it to the Council.</p></div>
<div class="pv-role"><b>CFM Council</b><p>Works the challenges across the enterprise, decides by consensus and assigns an owner and a date.</p></div>
<div class="pv-role"><b>Communication team</b><p>Turns each decision into a short, plain update and publishes it here and through the newsletter.</p></div>
<div class="pv-role"><b>Every Airman in the field</b><p>Stays informed, gives feedback on decisions and raises the next issue.</p></div>
</div>
<div class="pv-gov">
<div><h3>How the Council runs</h3><ul><li>Meets quarterly, and sooner when an issue can't wait</li><li>Decisions made by consensus</li><li>Minutes and action items published after each meeting</li><li>Progress reviewed at every meeting until each item closes</li></ul></div>
<div><h3>Keeping it honest</h3><ul><li>Every issue tracked from submission to closure</li><li>Time to answer measured and shown here</li><li>Lessons learned written up when an item closes</li><li>The process itself reviewed once a year</li></ul>
<div class="pv-metrics" aria-label="Sample measures"><div class="pv-metric"><b id="m-open">0</b><span>open issues</span></div><div class="pv-metric"><b id="m-closed">0</b><span>decided and shared</span></div><div class="pv-metric"><b>41</b><span>median days to an answer</span></div></div>
<p class="pv-hint" style="margin-top:0.4rem">Sample figures.</p></div>
</div>
</div></section>

<section class="section" id="news"><div class="wrap">
<h2>What changed</h2>
<div class="pv-news-grid">
<div class="pv-news">
<article><time>Sample, 2 weeks ago</time><h3>Council outcomes from the latest meeting</h3><p>Three issues decided, two sent back to the FAC for more data, one closed with no change and the reasons published.</p><span class="done">Decided and shared</span></article>
<article><time>Sample, 3 weeks ago</time><h3>New pathway for professional development</h3><p>A single page that maps courses, certifications and broadening jobs to each stage of a career in the field.</p><span class="done">Decided and shared</span></article>
<article><time>Sample, last month</time><h3>Training pathway update</h3><p>What changes for Airmen already in upgrade training, and what stays the same.</p><span class="done">Decided and shared</span></article>
</div>
<div class="pv-side">
<div class="pv-feature"><h3>Professional development pathways</h3><p>Where you are, where you could go next and what gets you there. Built from issues raised by the field.</p><a href="#loop">See how it was decided</a></div>
<div class="pv-box"><h3>Resources</h3><ul><li><a href="#roles">Council documents</a></li><li><a href="#roles">Policy updates</a></li><li><a href="#roles">Training materials</a></li><li><a href="#submit">Submission template</a></li></ul><p class="pv-hint" style="margin-top:0.6rem">In a real version these would point to the official repository.</p></div>
<div class="pv-box"><h3>Get the newsletter</h3><p class="pv-hint">One short email a month. In this demo nothing is sent.</p><form class="pv-signup" id="signup"><label class="sr" for="email" style="position:absolute;left:-9999px">Email</label><input type="text" id="email" placeholder="you@example.com"><button class="btn" type="submit">Subscribe</button></form><p class="pv-ok" id="sub-ok" role="status"></p></div>
</div>
</div>
</div></section>

<section class="pv-close"><div class="wrap">
<p class="motto">Integrate. Connect. Inform. Enable.</p>
<p>One team, one voice, one mission.</p>
<div class="pv-domains"><span>Air</span><span>Space</span><span>Cyber</span><span>Global operations</span></div>
<p class="pv-hint" style="max-width:60ch;margin:1.6rem auto 0">A concept demo of a career field communication hub. Not an official U.S. Air Force or Department of the Air Force website, not endorsed by either, and holding no real data. What you type stays in this browser and is cleared by "Reset the demo".</p>
</div></section>

<dialog class="pv-dialog" id="dlg" aria-labelledby="d-title"><div>
<h3 id="d-title"></h3>
<p class="pv-hint" id="d-meta"></p>
<p id="d-fix" style="margin:0"></p>
<ol class="pv-trail" id="d-trail"></ol>
<div class="pv-row" style="justify-content:flex-end"><button class="btn pv-ghost" type="button" id="d-advance">Move to next step</button><button class="btn" type="button" id="d-close">Close</button></div>
<p class="pv-hint">"Move to next step" is for the demo, to show how an issue travels.</p>
</div></dialog>
"""

SCRIPT = """<script>
(() => {
  const $ = id => document.getElementById(id);
  const STAGES = [["Raised", "With the CFM"], ["Reviewed", "With the FAC"], ["Decided", "CFM Council"], ["Shared", "Back to the field"]];
  const TRAIL = [["Raised", "Submitted to the CFM"], ["Reviewed", "Validated by the FAC, recommendation written"],
    ["Decided", "Council decision recorded, owner assigned"], ["Shared", "Published on The Pulse and in the newsletter"]];
  const SAMPLE = [
    { t: "Shift-change checklists differ between sites", a: "Procedures", s: "Whole career field", o: "Every shift", f: "One standard checklist owned by the field, with local annexes.", st: 0 },
    { t: "Upgrade training records live in three systems", a: "Training", s: "Whole career field", o: "Weekly", f: "Pick one system of record and migrate the rest.", st: 0 },
    { t: "Console chairs past service life at two units", a: "Equipment", s: "Several units", o: "Every shift", f: "", st: 1 },
    { t: "Broadening jobs are hard to find", a: "Career development", s: "Whole career field", o: "Rarely, but badly", f: "Publish open broadening jobs on The Pulse each quarter.", st: 1 },
    { t: "Night-shift meal options after 2200", a: "Quality of life", s: "Several units", o: "Every shift", f: "", st: 2 },
    { t: "New-arrival onboarding varies by unit", a: "Training", s: "Whole career field", o: "Monthly", f: "A field-wide first-30-days guide.", st: 3 },
    { t: "Promotion study guides out of date", a: "Career development", s: "Whole career field", o: "Rarely, but badly", f: "", st: 3 },
  ];
  const KEY = "pulse-demo.v1";
  let issues = null;
  try { issues = JSON.parse(localStorage.getItem(KEY)); } catch { }
  if (!Array.isArray(issues)) issues = SAMPLE.map((x, i) => ({ ...x, id: i + 1 }));
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(issues)); } catch { } };
  let fresh = null, open = null;
  function render() {
    const box = $("lanes"); box.innerHTML = "";
    STAGES.forEach(([name, sub], i) => {
      const list = issues.filter(x => x.st === i).sort((a, b) => b.id - a.id);
      const lane = document.createElement("div"); lane.className = "pv-lane";
      lane.innerHTML = `<div class="pv-lane-h"><span class="n">${list.length}</span><b>${name}</b><span>${sub}</span></div><div class="pv-cards"></div>`;
      list.forEach(x => {
        const b = document.createElement("button"); b.type = "button"; b.className = "pv-issue" + (x.id === fresh ? " new" : "");
        b.dataset.stage = i; b.textContent = x.t;
        const sm = document.createElement("small"); sm.textContent = `${x.a}, ${x.s.toLowerCase()}`; b.append(sm);
        b.onclick = () => show(x.id); lane.querySelector(".pv-cards").append(b);
      });
      box.append(lane);
    });
    const openN = issues.filter(x => x.st < 3).length;
    $("m-open").textContent = openN; $("m-closed").textContent = issues.length - openN;
    $("board-total").textContent = `${issues.length} issues on the board`;
  }
  function show(id) {
    const x = issues.find(i => i.id === id); if (!x) return; open = id;
    $("d-title").textContent = x.t;
    $("d-meta").textContent = `${x.a}. Affects ${x.s.toLowerCase()}, ${x.o.toLowerCase()}.`;
    $("d-fix").textContent = x.f ? "Suggested fix: " + x.f : "No fix suggested yet.";
    $("d-trail").innerHTML = TRAIL.map(([n, d], i) => `<li class="${i < x.st || x.st === 3 ? "done" : i === x.st ? "now" : ""}"><div><b>${n}</b><span>${d}</span></div></li>`).join("");
    $("d-advance").hidden = x.st >= 3;
    $("dlg").showModal();
  }
  $("d-close").onclick = () => $("dlg").close();
  $("dlg").addEventListener("click", e => { if (e.target === $("dlg")) $("dlg").close(); });
  $("d-advance").onclick = () => { const x = issues.find(i => i.id === open); if (!x) return; x.st = Math.min(3, x.st + 1); fresh = x.id; save(); render(); show(x.id); };
  $("form").addEventListener("submit", e => {
    e.preventDefault();
    const t = $("title").value.trim(), ok = $("ok");
    if (t.length < 6) { ok.className = "pv-ok bad"; ok.textContent = "Describe the problem in a few words first."; $("title").focus(); return; }
    const x = { id: Math.max(0, ...issues.map(i => i.id)) + 1, t, a: $("area").value, s: document.querySelector("input[name=scope]:checked").value, o: $("often").value, f: $("fix").value.trim(), st: 0 };
    issues.push(x); fresh = x.id; save(); render();
    ok.className = "pv-ok"; ok.textContent = "Raised. It's on the board under Raised.";
    $("form").reset();
    document.querySelector(".pv-board").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  });
  $("signup").addEventListener("submit", e => { e.preventDefault(); $("sub-ok").textContent = "Subscribed (demo only, nothing was sent)."; $("email").value = ""; });
  $("reset").onclick = () => { issues = SAMPLE.map((x, i) => ({ ...x, id: i + 1 })); fresh = null; try { localStorage.removeItem(KEY); } catch { } render(); };
  const zulu = () => { const d = new Date(); $("zulu").textContent = String(d.getUTCHours()).padStart(2, "0") + String(d.getUTCMinutes()).padStart(2, "0") + "Z"; };
  zulu(); setInterval(zulu, 15000); render();
})();
</script>"""


def build(page, write, href, accent_css, root):
    """Called from build.py. Writes /demo/pulse/ when PULSE_DEMO is on."""
    if not PULSE_DEMO:
        return
    import hashlib, os
    with open(os.path.join(root, "assets", "pulse.css"), "rb") as f:
        v = hashlib.sha1(f.read()).hexdigest()[:10]
    css = href(HERE, "assets").replace("index.html", "") + "pulse.css?v=" + v
    doc = page(HERE, "The Pulse · concept demo", BODY + SCRIPT, None,
               "Concept demo of a career field communication hub.")
    doc = doc.replace("</head>", f'<meta name="robots" content="noindex, nofollow">\n<link rel="stylesheet" href="{css}">\n'
                      + accent_css(ACCENT) + "\n</head>", 1)
    write(HERE, doc)
