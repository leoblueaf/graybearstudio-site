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

<nav class="pv-subnav" aria-label="Sections"><div class="wrap">
<a href="#board-h">Issue board</a><a href="#loop">How it works</a><a href="#submit">Raise an issue</a><a href="#mentors">Mentors</a><a href="#boards">Message boards</a><a href="#news">What changed</a>
</div></nav>
<div class="pv-back" id="pv-back"><div class="wrap"><button type="button" id="pv-home">Home</button><span id="pv-where"></span></div></div>
<section class="pv-hero"><div class="wrap pv-hero-grid">
<div class="pv-home">
<h1>The Pulse</h1>
<p class="tag">Every issue raised gets an answer back.</p>
<p class="lede">One place for the whole career field to raise what is getting in the way, see who is working it, and hear what was decided. From the CFM to the FAC to the Council, and back out to every Airman.</p>
<nav class="pv-tiles" aria-label="Sections">
<a class="pv-tile pv-tile-main" href="#/submit"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span><span class="pv-tt">Raise an issue<small>Two minutes. It gets an answer back.</small></span></a>
<a class="pv-tile" href="#/board"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h4v14H4zM10 5h4v9h-4zM16 5h4v6h-4z"/></svg></span><span class="pv-tbadge" id="t-open"></span><span class="pv-tt">Issue board<small>See what is open</small></span></a>
<a class="pv-tile" href="#/loop"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/></svg></span><span class="pv-tt">How it works<small>From raised to answered</small></span></a>
<a class="pv-tile" href="#/mentors"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/></svg></span><span class="pv-tt">Find a mentor<small>Chiefs who will talk</small></span></a>
<a class="pv-tile" href="#/boards"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H9l-5 4zM8 9h8M8 12h5"/></svg></span><span class="pv-tt">Message boards<small>CFM and command news</small></span></a>
<a class="pv-tile" href="#/roles"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v6M5 21v-5h14v5M12 9H5v7M12 9h7v7M3 21h18"/></svg></span><span class="pv-tt">Who does what<small>CFM, FAC, Council</small></span></a>
<a class="pv-tile" href="#/news"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5zM8 10h8M8 14h8M8 18h5"/></svg></span><span class="pv-tt">What changed<small>Decisions shared back</small></span></a>
</nav>
<div class="pv-actions"><a class="btn" href="#submit">Raise an issue</a><a class="btn pv-ghost" href="#loop">See how it moves</a></div>
<p class="pv-zulu" id="zulu" aria-label="Current Zulu time">0000Z</p>
</div>
<div class="pv-board" aria-labelledby="board-h" data-screen="board">
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

<section class="section" id="loop" data-screen="loop"><div class="wrap">
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

<section class="section" id="submit" data-screen="submit"><div class="wrap pv-two">
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

<section class="section" id="roles" data-screen="roles"><div class="wrap">
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


<section class="section" id="mentors" data-screen="mentors"><div class="wrap">
<h2>Find a mentor</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">Chiefs who have volunteered to mentor. Read their profiles and ask for a conversation. Each Chief decides whether to accept.</p>
<div class="pv-filter" role="group" aria-label="Filter mentors by focus">
<button type="button" class="pv-chip" aria-pressed="true" data-focus="all">All</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Leadership">Leadership</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Career moves">Career moves</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Joint and broadening">Joint and broadening</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Training and evaluation">Training and evaluation</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Life and family">Life and family</button>
</div>
<div class="pv-mentors" id="mentor-list"></div>
<p class="pv-hint" style="margin-top:0.8rem">Sample profiles. In a real version each Chief writes their own profile and chooses how many mentees to take.</p>
<div class="pv-box pv-volunteer"><h3>Are you a Chief?</h3><p class="pv-hint" style="margin-top:0.3rem">Add your profile: your path, what you can help with, and how many people you can take on. You can pause it any time.</p><button type="button" class="btn pv-ghost" id="vol-btn" style="margin-top:0.7rem">Add my profile</button><p class="pv-ok" id="vol-ok" role="status"></p></div>
</div></section>

<section class="section" id="boards" data-screen="boards"><div class="wrap">
<h2>Message boards</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">Straight from the people who run the career field. The CFM board carries messages from the Career Field Manager, sent to every command or only the ones affected. Each command's board carries its MAJCOM Functional Manager's updates, plus any CFM message sent to that command.</p>
<div class="pv-tabs" role="tablist" aria-label="Message boards">
<button type="button" role="tab" id="tab-cf" aria-selected="true" aria-controls="panel-board">From the CFM</button>
<button type="button" role="tab" id="tab-mj" aria-selected="false" aria-controls="panel-board">Command boards (MFMs)</button>
</div>
<div id="panel-board" role="tabpanel" class="pv-board-panel">
<div class="pv-row pv-mj-pick" id="mj-pick" hidden><label class="f" for="mj">Your command</label><select id="mj"></select></div>
<details class="pv-composer" id="composer"><summary id="composer-sum">Post as the CFM</summary>
<form class="pv-form" id="post-form" novalidate style="margin-top:0.8rem">
<fieldset id="aud-box"><legend>Send to</legend>
<div class="pv-choices"><label><input type="radio" name="aud" value="all" checked> All commands</label><label><input type="radio" name="aud" value="some"> Selected commands</label></div>
<div class="pv-cmds" id="aud-cmds" hidden></div>
</fieldset>
<label class="f" for="p-title">Headline</label><input type="text" id="p-title" maxlength="90" placeholder="Annual training conference dates set">
<label class="f" for="p-body">Update</label><textarea id="p-body" maxlength="800" placeholder="What changed, who it affects, and what they should do."></textarea>
<div class="pv-pair"><div><label class="f" for="p-kind">Type</label><select id="p-kind"><option>News</option><option>Announcement</option><option>Recognition</option><option>Event</option></select></div>
<div><label class="f" for="p-photo">Photo (optional)</label><input type="file" id="p-photo" accept="image/*"></div></div>
<label class="pv-check"><input type="checkbox" id="p-pin"> Pin to the top of the board</label>
<div class="pv-row"><button class="btn" type="submit" id="post-btn">Post update</button><p class="pv-ok" id="post-ok" role="status"></p></div>
<p class="pv-hint">In the demo, posts stay in this browser and photos are not uploaded anywhere.</p>
</form></details>
<div class="pv-posts" id="posts"></div>
</div>
</div></section>

<section class="section" id="news" data-screen="news"><div class="wrap">
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

<section class="pv-close pv-home"><div class="wrap">
<p class="motto">Integrate. Connect. Inform. Enable.</p>
<p>One team, one voice, one mission.</p>
<div class="pv-domains"><span>Air</span><span>Space</span><span>Cyber</span><span>Global operations</span></div>
<p class="pv-hint" style="max-width:60ch;margin:1.6rem auto 0">A concept demo of a career field communication hub. Not an official U.S. Air Force or Department of the Air Force website, not endorsed by either, and holding no real data. What you type stays in this browser and is cleared by "Reset the demo".</p>
</div></section>


<dialog class="pv-dialog" id="m-dlg" aria-labelledby="m-title"><div>
<h3 id="m-title"></h3>
<p class="pv-hint" id="m-meta"></p>
<p id="m-bio" style="margin:0"></p>
<div class="pv-tags" id="m-tags"></div>
<form class="pv-form" id="m-form" novalidate style="padding:1rem">
<label class="f" for="m-msg">Why would you like to talk?</label>
<textarea id="m-msg" maxlength="500" placeholder="I'm a new 7-level weighing a broadening job and would value 30 minutes on how you decided."></textarea>
<div class="pv-pair"><div><label class="f" for="m-how">Best way to meet</label><select id="m-how"><option>Video call</option><option>Phone</option><option>In person if we're co-located</option></select></div>
<div><label class="f" for="m-when">When</label><select id="m-when"><option>In the next two weeks</option><option>This month</option><option>No rush</option></select></div></div>
<div class="pv-row" style="justify-content:flex-end"><button class="btn pv-ghost" type="button" id="m-close">Close</button><button class="btn" type="submit">Ask for a conversation</button></div>
<p class="pv-ok" id="m-ok" role="status"></p>
</form>
</div></dialog>
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
  $("reset").onclick = () => { issues = SAMPLE.map((x, i) => ({ ...x, id: i + 1 })); fresh = null; try { localStorage.removeItem(KEY); localStorage.removeItem("pulse-demo.posts.v2"); } catch { } posts = POSTS0.slice(); render(); renderPosts(); };
  const zulu = () => { const d = new Date(); $("zulu").textContent = String(d.getUTCHours()).padStart(2, "0") + String(d.getUTCMinutes()).padStart(2, "0") + "Z"; };

  // ---------------- mentors (sample)
  const MENTORS = [
    { n: "Chief M. Alvarez", y: 24, now: "Command Chief, sample wing", path: "Operations centers at four bases, two tours as a superintendent, one joint staff tour.", f: ["Leadership", "Joint and broadening"], open: 2, how: "Video call" },
    { n: "Chief R. Okafor", y: 22, now: "Superintendent, sample operations center", path: "Instructor, standardization and evaluation, then a career-broadening tour in personnel.", f: ["Training and evaluation", "Career moves"], open: 3, how: "Phone or video" },
    { n: "Chief D. Lindqvist", y: 26, now: "MAJCOM Functional Manager (sample)", path: "Overseas most of a career, two remote tours, and a dual-military family that made it work.", f: ["Life and family", "Career moves"], open: 1, how: "Video call" },
    { n: "Chief T. Nakamura", y: 23, now: "Senior enlisted leader, sample joint staff", path: "Moved from the ops floor to joint planning; happy to talk about writing, briefing and boards.", f: ["Joint and broadening", "Leadership"], open: 0, how: "Video call" },
    { n: "Chief S. Bennett", y: 21, now: "Chief, sample training squadron", path: "Built two upgrade-training programs from scratch and ran a schoolhouse.", f: ["Training and evaluation", "Leadership"], open: 2, how: "In person or video" },
    { n: "Chief A. Haddad", y: 25, now: "First sergeant turned superintendent (sample)", path: "Took a special duty mid-career and came back to the field. Ask about stepping away and back.", f: ["Career moves", "Life and family"], open: 4, how: "Phone" },
  ];
  let focus = "all";
  const initials = n => n.replace("Chief ", "").split(/[ .]+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2);
  function renderMentors() {
    const box = $("mentor-list"); box.innerHTML = "";
    MENTORS.filter(m => focus === "all" || m.f.includes(focus)).forEach((m, i) => {
      const c = document.createElement("article"); c.className = "pv-mentor";
      c.innerHTML = `<div class="pv-avatar" aria-hidden="true">${initials(m.n)}</div><div><h3></h3><p class="pv-hint"></p></div><p class="path"></p><div class="pv-tags"></div><div class="pv-row" style="justify-content:space-between"><span class="pv-open"></span><button type="button" class="btn pv-ghost">View profile</button></div>`;
      c.querySelector("h3").textContent = m.n;
      c.querySelector(".pv-hint").textContent = `${m.now}. ${m.y} years.`;
      c.querySelector(".path").textContent = m.path;
      c.querySelector(".pv-tags").innerHTML = m.f.map(t => `<span>${t}</span>`).join("");
      const o = c.querySelector(".pv-open"); o.textContent = m.open ? `Taking ${m.open} more mentee${m.open === 1 ? "" : "s"}` : "Not taking mentees right now"; o.classList.toggle("full", !m.open);
      c.querySelector("button").onclick = () => showMentor(MENTORS.indexOf(m));
      box.append(c);
    });
  }
  document.querySelectorAll(".pv-chip").forEach(b => b.onclick = () => {
    focus = b.dataset.focus; document.querySelectorAll(".pv-chip").forEach(x => x.setAttribute("aria-pressed", x === b)); renderMentors();
  });
  let mIdx = -1;
  function showMentor(i) {
    const m = MENTORS[i]; mIdx = i;
    $("m-title").textContent = m.n; $("m-meta").textContent = `${m.now}. ${m.y} years in. Prefers: ${m.how}.`;
    $("m-bio").textContent = m.path; $("m-tags").innerHTML = m.f.map(t => `<span>${t}</span>`).join("");
    $("m-ok").textContent = ""; $("m-msg").value = "";
    $("m-form").querySelector("button[type=submit]").disabled = !m.open;
    if (!m.open) $("m-ok").textContent = "This Chief isn't taking new mentees right now.";
    $("m-dlg").showModal();
  }
  $("m-close").onclick = () => $("m-dlg").close();
  $("m-dlg").addEventListener("click", e => { if (e.target === $("m-dlg")) $("m-dlg").close(); });
  $("m-form").addEventListener("submit", e => {
    e.preventDefault(); const ok = $("m-ok");
    if ($("m-msg").value.trim().length < 10) { ok.className = "pv-ok bad"; ok.textContent = "Add a sentence on what you'd like to talk about."; return; }
    ok.className = "pv-ok"; ok.textContent = `Request sent to ${MENTORS[mIdx].n}. (Demo only: nothing was sent.)`; $("m-msg").value = "";
  });
  $("vol-btn").onclick = () => { $("vol-ok").textContent = "In the real version this opens the profile form. (Demo only.)"; };

  // ---------------- message boards (sample)
  const MAJCOMS = ["ACC", "AETC", "AFGSC", "AFMC", "AFSOC", "AMC", "PACAF", "USAFE-AFAFRICA", "AFRC", "ANG"];
  $("mj").innerHTML = MAJCOMS.map(m => `<option>${m}</option>`).join("");
  $("aud-cmds").innerHTML = MAJCOMS.map(m => `<label><input type="checkbox" value="${m}"> ${m}</label>`).join("");
  document.querySelectorAll("input[name=aud]").forEach(r => r.onchange = () => { $("aud-cmds").hidden = r.value !== "some" || !r.checked ? $("aud-cmds").hidden && r.value !== "some" : false; $("aud-cmds").hidden = document.querySelector("input[name=aud]:checked").value !== "some"; });
  const PHOTO = (hue, label) => `<div class="pv-photo" style="--h:${hue}" role="img" aria-label="${label}"><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M0 58 L28 36 L46 48 L72 22 L120 56 L120 70 L0 70 Z" fill="currentColor" opacity=".35"/><circle cx="92" cy="18" r="8" fill="currentColor" opacity=".45"/></svg><span>Sample photo</span></div>`;
  // b: "cfm" for CFM messages (aud "all" or a list of commands); otherwise the command an MFM posted to.
  const POSTS0 = [
    { b: "cfm", aud: "all", t: "Annual training conference: dates and agenda", k: "Event", d: "Sample, 3 days ago", x: "Save the dates. The agenda covers the training pathway changes, the issue board, and an hour of open questions with the Council. Virtual seats for every command.", pin: true, img: 210 },
    { b: "cfm", aud: ["AFGSC", "USAFE-AFAFRICA", "PACAF"], t: "Console refresh: affected sites and timeline", k: "Announcement", d: "Sample, 1 week ago", x: "Sites in these three commands move to the new consoles first. MFMs will post the unit-by-unit schedule on their boards.", img: 0 },
    { b: "cfm", aud: "all", t: "Council outcomes are on The Pulse", k: "News", d: "Sample, 2 weeks ago", x: "Six issues worked this quarter. Read what was decided, who owns each item, and the dates to watch.", img: 0 },
    { b: "cfm", aud: "all", t: "Congratulations to this year's award winners", k: "Recognition", d: "Sample, last month", x: "Thank you to every unit that submitted packages. The winners' write-ups are worth reading for anyone building a package next year.", img: 38 },
    { b: "ACC", t: "Console upgrade schedule for the command", k: "Announcement", d: "Sample, 5 days ago", x: "Installs begin next quarter. Each unit gets two weeks' notice and a loaner kit.", img: 0 },
    { b: "USAFE-AFAFRICA", t: "Theater orientation for new arrivals", k: "Event", d: "Sample, 1 week ago", x: "A half-day session for everyone who has arrived in the last 90 days. Spouses welcome.", img: 160 },
    { b: "AFGSC", t: "Manning snapshot and what it means for PCS season", k: "News", d: "Sample, 2 weeks ago", x: "Where the command is short, where it's long, and how assignments will be balanced this cycle.", img: 0 },
    { b: "AMC", t: "Spotlight: a unit that cut changeover time in half", k: "Recognition", d: "Sample, 3 weeks ago", x: "A short write-up of how one team rebuilt its changeover brief, with their template attached.", img: 95 },
  ];
  const PKEY = "pulse-demo.posts.v2";
  let posts; try { posts = JSON.parse(localStorage.getItem(PKEY)); } catch { }
  if (!Array.isArray(posts)) posts = POSTS0.slice();
  const savePosts = () => { try { localStorage.setItem(PKEY, JSON.stringify(posts.map(p => ({ ...p, photo: undefined })))); } catch { } };
  let board = "cfm";
  const audText = p => p.aud === "all" ? "All commands" : p.aud.join(", ");
  function renderPosts() {
    const cmd = $("mj").value;
    let list;
    if (board === "cfm") list = posts.filter(p => p.b === "cfm");
    else list = posts.filter(p => p.b === cmd || (p.b === "cfm" && (p.aud === "all" || p.aud.includes(cmd))));
    list.sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0));
    const box = $("posts");
    if (!list.length) { box.innerHTML = `<p class="pv-hint">Nothing on the ${board === "cfm" ? "CFM" : cmd} board yet.</p>`; return; }
    box.innerHTML = "";
    list.forEach(p => {
      const fromCfm = p.b === "cfm";
      const a = document.createElement("article"); a.className = "pv-post" + (p.pin ? " pinned" : "") + (fromCfm && board !== "cfm" ? " from-cfm" : "");
      a.innerHTML = `${p.photo ? `<div class="pv-media"><img alt="Photo attached to this post"></div>` : p.img ? `<div class="pv-media">${PHOTO(p.img, "Sample photo")}</div>` : ""}<div class="pv-text"><p class="pv-meta"></p><h3></h3><p class="x"></p><p class="pv-aud"></p></div>`;
      if (p.photo) a.querySelector(".pv-media img").src = p.photo;
      const by = fromCfm ? "Career Field Manager" : `${p.b} Functional Manager`;
      a.querySelector(".pv-meta").textContent = `${p.pin ? "Pinned. " : ""}${p.k}. ${by}. ${p.d}`;
      a.querySelector("h3").textContent = p.t; a.querySelector(".x").textContent = p.x;
      a.querySelector(".pv-aud").textContent = fromCfm ? (board === "cfm" ? `Sent to: ${audText(p)}` : "From the CFM") : "";
      box.append(a);
    });
  }
  function setTab(cfm) {
    board = cfm ? "cfm" : "mj";
    $("tab-cf").setAttribute("aria-selected", cfm); $("tab-mj").setAttribute("aria-selected", !cfm);
    $("mj-pick").hidden = cfm; $("aud-box").hidden = !cfm;
    $("composer-sum").textContent = cfm ? "Post as the CFM" : `Post as the ${$("mj").value} MFM`;
    $("post-ok").textContent = ""; renderPosts();
  }
  $("tab-cf").onclick = () => setTab(true); $("tab-mj").onclick = () => setTab(false);
  $("mj").onchange = () => setTab(false);
  let pendingPhoto = null;
  $("p-photo").onchange = e => { const f = e.target.files[0]; pendingPhoto = null; if (!f) return; const r = new FileReader(); r.onload = () => { pendingPhoto = r.result; }; r.readAsDataURL(f); };
  $("post-form").addEventListener("submit", e => {
    e.preventDefault(); const ok = $("post-ok");
    const t = $("p-title").value.trim(), x = $("p-body").value.trim();
    if (t.length < 4 || x.length < 10) { ok.className = "pv-ok bad"; ok.textContent = "Add a headline and a sentence or two."; return; }
    let post;
    if (board === "cfm") {
      const some = document.querySelector("input[name=aud]:checked").value === "some";
      const picked = [...$("aud-cmds").querySelectorAll("input:checked")].map(i => i.value);
      if (some && !picked.length) { ok.className = "pv-ok bad"; ok.textContent = "Pick at least one command, or send to all commands."; return; }
      post = { b: "cfm", aud: some ? picked : "all" };
    } else post = { b: $("mj").value };
    posts.unshift({ ...post, t, x, k: $("p-kind").value, d: "Just now", pin: $("p-pin").checked, photo: pendingPhoto });
    savePosts(); renderPosts(); $("post-form").reset(); $("aud-cmds").hidden = true; pendingPhoto = null;
    ok.className = "pv-ok";
    ok.textContent = board === "cfm" ? `Sent to ${post.aud === "all" ? "all commands" : post.aud.join(", ")}. It also shows on ${post.aud === "all" ? "every command board" : "those command boards"}.` : `Posted to the ${post.b} board.`;
  });
  // Phone layout: a home screen of buttons, one section per screen (hash routes keep the iPhone back swipe working).
  const NAMES = { board: "Issue board", loop: "How it works", submit: "Raise an issue", roles: "Who does what", mentors: "Find a mentor", boards: "Message boards", news: "What changed" };
  const phone = matchMedia("(max-width: 720px)");
  function route() {
    const m = location.hash.match(/^#\\/(\\w+)/), v = m && NAMES[m[1]] ? m[1] : "home";
    if (!phone.matches) { document.body.classList.remove("pv-app"); if (v !== "home") { const el = document.querySelector(`[data-screen="${v}"]`); if (el) el.scrollIntoView(); } return; }
    document.body.classList.add("pv-app"); document.body.dataset.view = v;
    document.querySelectorAll("[data-screen]").forEach(s => s.classList.toggle("on", s.dataset.screen === v));
    $("pv-where").textContent = NAMES[v] || ""; window.scrollTo(0, 0);
  }
  $("pv-home").onclick = () => { if (history.length > 1 && location.hash.startsWith("#/")) history.back(); else location.hash = ""; };
  document.querySelectorAll('a[href="#submit"], a[href="#loop"]').forEach(a => a.addEventListener("click", e => { if (phone.matches) { e.preventDefault(); location.hash = "#/" + a.getAttribute("href").slice(1); } }));
  addEventListener("hashchange", route); phone.addEventListener("change", route); route();
  const syncBadge = () => { const n = $("m-open").textContent; $("t-open").textContent = n + " open"; };
  new MutationObserver(syncBadge).observe($("m-open"), { childList: true }); syncBadge();
  renderMentors(); renderPosts();
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
