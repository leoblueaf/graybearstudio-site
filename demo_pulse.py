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
<a href="#board-h">Issue board</a><a href="#loop">How it works</a><a href="#submit">Raise an issue</a><a href="#mentors">Mentors and SMEs</a><a href="#hub">Development hub</a><a href="#events">Events</a><a href="#forums">Forums</a><a href="#boards">Message boards</a><a href="#news">What changed</a><a href="#health">Network health</a>
</div></nav>
<div class="pv-back" id="pv-back"><div class="wrap"><button type="button" id="pv-home">Home</button><span id="pv-where"></span></div></div>
<section class="pv-hero"><div class="wrap pv-hero-grid">
<div class="pv-home">
<h1>The Pulse</h1>
<p class="tag">Every issue raised gets an answer back.</p>
<p class="lede">One place for the whole career field to raise what is getting in the way, find the people who have done it before, and hear what was decided. Operational excellence through connected expertise.</p>
<nav class="pv-tiles" aria-label="Sections">
<a class="pv-tile pv-tile-main" href="#/submit"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span><span class="pv-tt">Raise an issue<small>Two minutes. It gets an answer back.</small></span></a>
<a class="pv-tile" href="#/board"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h4v14H4zM10 5h4v9h-4zM16 5h4v6h-4z"/></svg></span><span class="pv-tbadge" id="t-open"></span><span class="pv-tt">Issue board<small>See what is open</small></span></a>
<a class="pv-tile" href="#/loop"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/></svg></span><span class="pv-tt">How it works<small>From raised to answered</small></span></a>
<a class="pv-tile" href="#/mentors"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/></svg></span><span class="pv-tt">Mentors and SMEs<small>Chiefs and experts who will talk</small></span></a>
<a class="pv-tile" href="#/hub"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V6l8-3 8 3v13l-8 3zM12 3v19M4 6l8 3 8-3"/></svg></span><span class="pv-tt">Development hub<small>Podcasts, Q&amp;As, library</small></span></a>
<a class="pv-tile" href="#/events"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"/></svg></span><span class="pv-tt">Events<small>Webinars and Ask Me Anything</small></span></a>
<a class="pv-tile" href="#/forums"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h12v8H8l-5 3zM9 17h7l5 3v-9h-3"/></svg></span><span class="pv-tt">Forums<small>Ask peers and experts</small></span></a>
<a class="pv-tile" href="#/boards"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H9l-5 4zM8 9h8M8 12h5"/></svg></span><span class="pv-tt">Message boards<small>CFM and command news</small></span></a>
<a class="pv-tile" href="#/roles"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v6M5 21v-5h14v5M12 9H5v7M12 9h7v7M3 21h18"/></svg></span><span class="pv-tt">Who does what<small>CFM, FAC, Council</small></span></a>
<a class="pv-tile" href="#/news"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5zM8 10h8M8 14h8M8 18h5"/></svg></span><span class="pv-tt">What changed<small>Decisions shared back</small></span></a>
<a class="pv-tile" href="#/health"><span class="pv-ticon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg></span><span class="pv-tt">Network health<small>Measures, rules, roadmap</small></span></a>
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
<h2>Mentors and SMEs</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">Volunteers who have offered their time: Chief mentors for the long view, subject matter experts for a specific problem, and coaches for a skill you are building. Read a profile and ask for a conversation. Each volunteer decides whether to accept.</p>
<div class="pv-filter" role="group" aria-label="Filter by type of help" id="type-chips"><button type="button" class="pv-tchip pv-chip" aria-pressed="true" data-type="all">Everyone</button><button type="button" class="pv-tchip pv-chip" aria-pressed="false" data-type="Mentor">Chief mentors</button><button type="button" class="pv-tchip pv-chip" aria-pressed="false" data-type="SME">Subject matter experts</button><button type="button" class="pv-tchip pv-chip" aria-pressed="false" data-type="Coach">Coaches</button></div>
<div class="pv-filter pv-filter2" role="group" aria-label="Filter mentors by focus">
<button type="button" class="pv-chip" aria-pressed="true" data-focus="all">All</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Leadership">Leadership</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Career moves">Career moves</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Joint and broadening">Joint and broadening</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Training and evaluation">Training and evaluation</button>
<button type="button" class="pv-chip" aria-pressed="false" data-focus="Life and family">Life and family</button>
</div>
<div class="pv-mentors" id="mentor-list"></div>
<p class="pv-hint" style="margin-top:0.8rem">Sample profiles. In a real version each volunteer writes their own profile and chooses how many people to take.</p>
<div class="pv-box pv-volunteer"><h3>Want to volunteer?</h3><p class="pv-hint" style="margin-top:0.3rem">Chiefs mentor, and anyone with deep experience in a system, mission or skill can sign up as an SME or coach. Add your profile, what you can help with, and how many people you can take on. You can pause it any time.</p><button type="button" class="btn pv-ghost" id="vol-btn" style="margin-top:0.7rem">Add my profile</button><p class="pv-ok" id="vol-ok" role="status"></p></div>
</div></section>


<section class="section" id="hub" data-screen="hub"><div class="wrap">
<h2>Development hub</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">Everything for growing in the career field, sorted by topic. Each topic has podcasts, answered questions, a reference library and a mentor who has been there.</p>
<div class="pv-hubgrid" id="hub-grid"></div>
</div></section>

<section class="section" id="events" data-screen="events"><div class="wrap">
<h2>Events</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">Live online sessions led by people who know the work: workshops on a topic, Ask Me Anything sessions with senior leaders, and the regular syncs that keep the field connected.</p>
<div class="pv-plan">
<div><b>Initial</b><span>3-level course welcome and network introduction</span></div>
<div><b>Recurring</b><span>5-level and 7-level sessions as Airmen upgrade</span></div>
<div><b>Spotlight</b><span>Leadership syncs and MFM syncs, open to the field</span></div>
</div>
<div class="pv-filter" role="group" aria-label="Filter events" id="ev-chips">
<button type="button" class="pv-chip" aria-pressed="true" data-ev="all">All</button>
<button type="button" class="pv-chip" aria-pressed="false" data-ev="Workshop">Workshops</button>
<button type="button" class="pv-chip" aria-pressed="false" data-ev="Ask Me Anything">Ask Me Anything</button>
<button type="button" class="pv-chip" aria-pressed="false" data-ev="Course">Courses</button>
<button type="button" class="pv-chip" aria-pressed="false" data-ev="Sync">Syncs</button>
</div>
<div class="pv-events" id="ev-list"></div>
<p class="pv-hint" style="margin-top:0.8rem">Sample events. Times in Zulu so every command reads the same clock.</p>
</div></section>

<section class="section" id="forums" data-screen="forums"><div class="wrap">
<h2>Forums</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">Ask a question, share what worked, and learn from peers and experts across every command. Chief moderators keep it professional.</p>
<div class="pv-filter" role="group" aria-label="Forums" id="fo-chips"></div>
<details class="pv-composer" id="fo-composer"><summary>Start a thread</summary>
<form class="pv-form" id="fo-form" novalidate style="margin-top:0.8rem">
<label class="f" for="fo-title">Your question or topic</label><input type="text" id="fo-title" maxlength="100" placeholder="How did you prepare for your first NCOIC job?">
<label class="f" for="fo-body">Details</label><textarea id="fo-body" maxlength="600" placeholder="Give enough context for someone at another base to help. Keep it unclassified."></textarea>
<label class="pv-check" id="fo-coc-row"><input type="checkbox" id="fo-coc"> I have read and agree to the <button type="button" class="pv-link" id="fo-coc-open">code of conduct</button></label>
<div class="pv-row"><button class="btn" type="submit">Post thread</button><p class="pv-ok" id="fo-ok" role="status"></p></div>
<p class="pv-hint">New threads are checked by a moderator before they show to everyone. In the demo that takes a few seconds.</p>
</form></details>
<div class="pv-threads" id="fo-list"></div>
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


<section class="section" id="health" data-screen="health"><div class="wrap">
<h2>Network health</h2>
<p class="pv-hint" style="margin:-0.4rem 0 1.2rem;font-size:1rem">How the network is doing, the rules it runs on, and where it goes next. The program manager reports these to the FAC and the CFM.</p>
<div class="pv-metrics pv-kpis" aria-label="Sample measures">
<div class="pv-metric"><b>1,284</b><span>active members this quarter</span></div>
<div class="pv-metric"><b>96</b><span>volunteers (31 Chiefs, 65 SMEs and coaches)</span></div>
<div class="pv-metric"><b>412</b><span>connections made this quarter</span></div>
<div class="pv-metric"><b>4.6/5</b><span>member satisfaction</span></div>
<div class="pv-metric"><b>3 days</b><span>median wait for a first reply</span></div>
</div>
<div class="pv-two pv-health">
<div class="pv-box"><h3>What people come for</h3><div class="pv-bars" id="hl-bars"></div><p class="pv-hint">Share of hub and mentor activity by topic. Sample figures. Long-term, the network would also track retention and promotion trends.</p></div>
<div class="pv-box"><h3>Rules of the network</h3>
<ul class="pv-rules">
<li><button type="button" class="pv-link" data-rule="coc">Code of conduct</button><span>Professional, respectful, confidential. Applies to mentors, mentees and SMEs alike.</span></li>
<li><button type="button" class="pv-link" data-rule="privacy">Privacy and security</button><span>Follows Air Force and DoD rules for privacy and official communication. Professional conversations stay on approved channels.</span></li>
<li><button type="button" class="pv-link" data-rule="dispute">Resolving problems</button><span>A clear path for conflicts or misconduct, owned by the program manager.</span></li>
<li><button type="button" class="pv-link" data-rule="mod">Moderation</button><span>Chief moderators review forum posts against the code of conduct.</span></li>
</ul></div>
</div>
<h3 style="margin-top:2rem">Guidance this is built on</h3>
<div class="pv-pubs">
<div><b>DAFMAN 36-2643</b><i>Coaching and Mentoring Program</i><span>Defines mentoring and coaching, the roles, and how they differ.</span></div>
<div><b>DAFI 36-2670</b><i>Total Force Development</i><span>The Continuum of Learning and how Airmen own their development.</span></div>
<div><b>AFH 36-2618</b><i>The Enlisted Force Structure</i><span>Mentorship and developing subordinates as a core duty of every NCO and Senior NCO.</span></div>
</div>
<p class="pv-hint">Publications are on the Air Force e-Publishing site. Titles shown for context; check the current version before citing.</p>
<h3 style="margin-top:2rem">How the network is run</h3>
<div class="pv-roles pv-net">
<div class="pv-role"><b>Career Field Manager</b><p>Oversight and direction, keeping the network aligned with career field goals.</p></div>
<div class="pv-role"><b>Network program manager</b><p>Runs it day to day: onboarding volunteers, curating content, tracking measures, enforcing the rules.</p></div>
<div class="pv-role"><b>Functional Advisory Council</b><p>Senior leaders and command representatives who set direction, approve policy changes and champion the network.</p></div>
<div class="pv-role"><b>Command and wing liaisons</b><p>Local points of contact who promote the network, help Airmen sign up and spot new volunteers.</p></div>
<div class="pv-role"><b>Technical support team</b><p>Keeps the platform secure and working, answers user questions and builds new features.</p></div>
</div>
<h3 style="margin-top:2rem">Roadmap</h3>
<ol class="pv-road">
<li><b>Charter</b><span>Code of conduct, roles and measures written; FAC endorsement.</span></li>
<li><b>Pilot</b><span>Two commands, a first wave of volunteers, the hub seeded with content.</span></li>
<li><b>Field-wide</b><span>Every command, liaisons named, events on a regular rhythm.</span></li>
<li><b>Sustain</b><span>Quarterly health report, yearly review of the rules and measures.</span></li>
</ol>
<div class="pv-box" style="margin-top:1.2rem"><h3>Decisions for the FAC</h3><ul><li>Endorse the charter and code of conduct</li><li>Name the network program manager</li><li>Approve the platform and where conversations happen</li><li>Agree the measures and the reporting rhythm</li></ul><p class="pv-hint">Sample list for the demo.</p></div>
</div></section>

<section class="pv-close pv-home"><div class="wrap">
<p class="motto">Integrate. Connect. Inform. Enable.</p>
<p>One team, one voice, one mission.</p>
<div class="pv-domains"><span>Air</span><span>Space</span><span>Cyber</span><span>Global operations</span></div>
<p class="pv-hint" style="max-width:60ch;margin:1.6rem auto 0">A concept demo of a career field communication hub. Not an official U.S. Air Force or Department of the Air Force website, not endorsed by either, and holding no real data. What you type stays in this browser and is cleared by "Reset the demo".</p>
</div></section>


<dialog class="pv-dialog" id="g-dlg" aria-labelledby="g-title"><div>
<h3 id="g-title"></h3>
<div id="g-body"></div>
<div class="pv-row" style="justify-content:flex-end"><button class="btn" type="button" id="g-close">Close</button></div>
</div></dialog>
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
  $("reset").onclick = () => { issues = SAMPLE.map((x, i) => ({ ...x, id: i + 1 })); fresh = null; try { localStorage.removeItem(KEY); localStorage.removeItem("pulse-demo.posts.v2"); } catch { } posts = POSTS0.slice(); try { ["pulse-demo.rsvp", "pulse-demo.threads", "pulse-demo.coc"].forEach(k => localStorage.removeItem(k)); } catch { } rsvp = []; threads = THREADS0.slice(); cocOk = false; reported = []; $("fo-coc").checked = false; render(); renderPosts(); renderEvents(); renderThreads(); };
  const zulu = () => { const d = new Date(); $("zulu").textContent = String(d.getUTCHours()).padStart(2, "0") + String(d.getUTCMinutes()).padStart(2, "0") + "Z"; };

  // ---------------- mentors (sample)
  const MENTORS = [
    { n: "Chief M. Alvarez", y: 24, now: "Command Chief, sample wing", path: "Operations centers at four bases, two tours as a superintendent, one joint staff tour.", f: ["Leadership", "Joint and broadening"], open: 2, how: "Video call" },
    { n: "Chief R. Okafor", y: 22, now: "Superintendent, sample operations center", path: "Instructor, standardization and evaluation, then a career-broadening tour in personnel.", f: ["Training and evaluation", "Career moves"], open: 3, how: "Phone or video" },
    { n: "Chief D. Lindqvist", y: 26, now: "MAJCOM Functional Manager (sample)", path: "Overseas most of a career, two remote tours, and a dual-military family that made it work.", f: ["Life and family", "Career moves"], open: 1, how: "Video call" },
    { n: "Chief T. Nakamura", y: 23, now: "Senior enlisted leader, sample joint staff", path: "Moved from the ops floor to joint planning; happy to talk about writing, briefing and boards.", f: ["Joint and broadening", "Leadership"], open: 0, how: "Video call" },
    { n: "Chief S. Bennett", y: 21, now: "Chief, sample training squadron", path: "Built two upgrade-training programs from scratch and ran a schoolhouse.", f: ["Training and evaluation", "Leadership"], open: 2, how: "In person or video" },
    { n: "Chief A. Haddad", y: 25, now: "First sergeant turned superintendent (sample)", path: "Took a special duty mid-career and came back to the field. Ask about stepping away and back.", f: ["Career moves", "Life and family"], open: 4, how: "Phone" },
    { n: "MSgt J. Rivera", r: "SME", y: 14, now: "SME: data links and network planning (sample)", path: "Ten years on the systems side, now the person units call when the picture drops. Happy to walk through troubleshooting.", f: ["Training and evaluation"], open: 5, how: "Video call or chat" },
    { n: "SMSgt K. Osei", r: "SME", y: 18, now: "SME: joint and NATO operations (sample)", path: "Two NATO tours and a combatant command. Ask about working in a coalition cell and preparing for a joint job.", f: ["Joint and broadening"], open: 3, how: "Video call" },
    { n: "TSgt L. Moreau", r: "SME", y: 11, now: "SME: instructor and evaluator (sample)", path: "Writes and grades evaluations. Can help you prepare for one, or build training for your section.", f: ["Training and evaluation"], open: 4, how: "Phone or video" },
    { n: "SMSgt P. Ward", r: "Coach", y: 19, now: "Coach: writing, briefing and boards (sample)", path: "A structured four-session plan for the skill you pick: performance statements, briefing up, or board preparation.", f: ["Leadership", "Career moves"], open: 2, how: "Video call" },
  ];
  MENTORS.forEach(m => { m.r = m.r || "Mentor"; });
  let focus = "all", mtype = "all";
  const initials = n => n.split(" ").slice(1).join(" ").split(/[ .]+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2);
  function renderMentors() {
    const box = $("mentor-list"); box.innerHTML = "";
    MENTORS.filter(m => (focus === "all" || m.f.includes(focus)) && (mtype === "all" || m.r === mtype)).forEach((m, i) => {
      const c = document.createElement("article"); c.className = "pv-mentor";
      c.innerHTML = `<div class="pv-avatar" aria-hidden="true">${initials(m.n)}</div><div><h3></h3><p class="pv-hint"></p></div><p class="path"></p><div class="pv-tags"></div><div class="pv-row" style="justify-content:space-between"><span class="pv-open"></span><button type="button" class="btn pv-ghost">View profile</button></div>`;
      c.querySelector("h3").textContent = m.n;
      c.querySelector(".pv-hint").textContent = `${m.now}. ${m.y} years.`;
      c.querySelector(".path").textContent = m.path;
      c.querySelector(".pv-tags").innerHTML = `<span class="kind">${m.r === "Mentor" ? "Chief mentor" : m.r}</span>` + m.f.map(t => `<span>${t}</span>`).join("");
      const o = c.querySelector(".pv-open"); o.textContent = m.open ? `Taking ${m.open} more ${m.r === "Mentor" ? "mentee" : "request"}${m.open === 1 ? "" : "s"}` : "Not taking requests right now"; o.classList.toggle("full", !m.open);
      c.querySelector("button").onclick = () => showMentor(MENTORS.indexOf(m));
      box.append(c);
    });
  }
  document.querySelectorAll(".pv-chip[data-focus]").forEach(b => b.onclick = () => {
    focus = b.dataset.focus; document.querySelectorAll(".pv-chip[data-focus]").forEach(x => x.setAttribute("aria-pressed", x === b)); renderMentors();
  });
  document.querySelectorAll(".pv-chip[data-type]").forEach(b => b.onclick = () => {
    mtype = b.dataset.type; focus = "all"; document.querySelectorAll(".pv-chip[data-type]").forEach(x => x.setAttribute("aria-pressed", x === b)); document.querySelectorAll(".pv-chip[data-focus]").forEach(x => x.setAttribute("aria-pressed", x.dataset.focus === "all")); renderMentors();
  });
  let mIdx = -1;
  function showMentor(i) {
    const m = MENTORS[i]; mIdx = i;
    $("m-title").textContent = m.n; $("m-meta").textContent = `${m.now}. ${m.y} years in. Prefers: ${m.how}.`;
    $("m-bio").textContent = m.path; $("m-tags").innerHTML = m.f.map(t => `<span>${t}</span>`).join("");
    $("m-ok").textContent = ""; $("m-msg").value = "";
    $("m-form").querySelector("button[type=submit]").disabled = !m.open;
    if (!m.open) $("m-ok").textContent = "This volunteer isn't taking new requests right now.";
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

  // ---------------- shared helpers for the network features
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } };
  const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
  function go(screen) {
    if (matchMedia("(max-width: 720px)").matches) location.hash = "#/" + screen;
    else { const el = document.querySelector(`[data-screen="${screen}"]`); if (el) el.scrollIntoView({ behavior: "smooth" }); }
  }
  function dialog(title, html) { $("g-title").textContent = title; $("g-body").innerHTML = html; $("g-dlg").showModal(); }
  $("g-close").onclick = () => $("g-dlg").close();
  $("g-dlg").addEventListener("click", e => { if (e.target === $("g-dlg")) $("g-dlg").close(); });

  // ---------------- development hub (sample content)
  const HUB = [
    { t: "MFM, P&P, KLP and KDP jobs", d: "What these positions do, who fills them and how to compete for one.", focus: "Career moves",
      pod: ["Inside a MAJCOM functional manager's week", "Key positions: what the board looks for"], qa: [["When should I start preparing for a key position?", "About two years out. Talk to someone who held it and ask what they wish they had done first."], ["Do I need a staff tour first?", "Not always. A strong ops record and clear writing matter more than one specific job."]], docs: ["Position descriptions (sample)", "How nominations work (sample)"] },
    { t: "Superintendent", d: "Running an operations center: people, readiness and the mission at once.", focus: "Leadership",
      pod: ["First 90 days as a superintendent", "Balancing the floor and the front office"], qa: [["How do I take over from a strong predecessor?", "Keep what works for 60 days, listen, then change one thing at a time."], ["What should I read first?", "The unit's last inspection report and every open issue on the board."]], docs: ["Superintendent continuity template (sample)", "Readiness review checklist (sample)"] },
    { t: "NCOIC positions", d: "Your first time leading a section: expectations, pitfalls and tools.", focus: "Leadership",
      pod: ["From best operator to first-time leader", "Feedback that actually lands"], qa: [["My section is short on people. Where do I start?", "Map the critical tasks, cross-train two people deep, and tell your superintendent early."], ["How often should I give feedback?", "Formally on schedule, informally every week."]], docs: ["NCOIC turnover checklist (sample)", "Section training plan template (sample)"] },
    { t: "Core competencies", d: "The skills every member of the career field is expected to master, by skill level.", focus: "Training and evaluation",
      pod: ["What 5-level looks like done well", "Keeping skills sharp between evaluations"], qa: [["How do I know I'm ready for my 7-level?", "When you can teach the task and explain why each step matters."], ["Where are the current standards?", "In the official training references. The hub would link the current version."]], docs: ["Competency map by skill level (sample)", "Self-assessment worksheet (sample)"] },
    { t: "Missions: joint, MAJCOM and SC2E", d: "What the work looks like in each mission set, and how to move between them.", focus: "Joint and broadening",
      pod: ["Life in a joint operations center", "Coalition work: what changes"], qa: [["How do I land a joint job?", "Build a record of clear writing and briefing, then tell your functional manager early."], ["Is a joint tour good for my career?", "Usually, if you come back able to explain what you learned."]], docs: ["Mission set overviews (sample)", "Joint job primer (sample)"] },
    { t: "Subject matter experts", d: "Who knows what across the field, and how to reach them for a specific problem.", focus: "Training and evaluation",
      pod: ["Ask an SME: troubleshooting the hard way", "How SMEs keep current"], qa: [["How do I reach an SME?", "Use the Mentors and SMEs page and pick Subject matter experts."], ["Can I become an SME?", "Yes. Volunteer with a short profile and what you can help with."]], docs: ["SME directory guide (sample)", "Volunteer expectations (sample)"] },
    { t: "Leadership development", d: "Growing as a leader at every rank, with the people who have done it.", focus: "Leadership",
      pod: ["Leading through a hard day on the floor", "Mentoring up and down"], qa: [["What is the difference between mentoring and coaching?", "Mentoring is a long-term relationship; coaching is structured and focused on one skill. Both are defined in DAFMAN 36-2643."], ["How do I find a mentor?", "Start with Chief mentors on the Mentors and SMEs page."]], docs: ["Leadership reading list (sample)", "Mentoring conversation guide (sample)"] },
    { t: "Developmental opportunities", d: "Courses, broadening jobs, special duties and certifications, and when each fits.", focus: "Career moves",
      pod: ["Special duty and coming back to the field", "Choosing your next course"], qa: [["When is the right time for a special duty?", "After you have led a section, so you bring something back."], ["Where are open broadening jobs posted?", "On the board each quarter, in the real version."]], docs: ["Opportunities by career stage (sample)", "Broadening job list (sample)"] },
  ];
  function renderHub() {
    $("hub-grid").innerHTML = HUB.map((h, i) => `<button type="button" class="pv-hubcard" data-i="${i}"><b>${esc(h.t)}</b><span>${esc(h.d)}</span><small>${h.pod.length} podcasts, ${h.qa.length} Q&amp;As, ${h.docs.length} documents</small></button>`).join("");
    $("hub-grid").querySelectorAll("button").forEach(b => b.onclick = () => openHub(+b.dataset.i));
  }
  function openHub(i) {
    const h = HUB[i];
    dialog(h.t, `<p class="pv-hint" style="margin-top:0">${esc(h.d)}</p>
      <h4>Podcasts</h4><ul class="pv-res">${h.pod.map(x => `<li><span class="pv-play" aria-hidden="true"></span>${esc(x)} <small>sample episode</small></li>`).join("")}</ul>
      <h4>Questions answered</h4>${h.qa.map(([q, a]) => `<details class="pv-qa"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
      <h4>Library</h4><ul class="pv-res">${h.docs.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="pv-row" style="margin-top:0.8rem"><button type="button" class="btn pv-ghost" id="hub-mentor">Connect with a mentor in this area</button></div>`);
    $("hub-mentor").onclick = () => {
      $("g-dlg").close(); focus = h.focus; mtype = "all";
      document.querySelectorAll(".pv-chip[data-focus]").forEach(x => x.setAttribute("aria-pressed", x.dataset.focus === focus));
      document.querySelectorAll(".pv-chip[data-type]").forEach(x => x.setAttribute("aria-pressed", x.dataset.type === "all"));
      renderMentors(); go("mentors");
    };
  }

  // ---------------- events (sample)
  const EVENTS = [
    { id: 1, k: "Ask Me Anything", t: "Ask the CFM anything", w: "Thu, 1700Z", h: "Career Field Manager", d: "Open questions on manning, training and what the Council is working. Send questions ahead or ask live." },
    { id: 2, k: "Workshop", t: "Writing strong performance statements", w: "Tue, 1500Z", h: "SMSgt P. Ward (sample)", d: "A hands-on session with before-and-after examples. Bring a draft." },
    { id: 3, k: "Course", t: "3-level welcome to the network", w: "Monthly, first Wed, 1400Z", h: "Network program manager", d: "For new Airmen: how to find a mentor, use the hub and raise an issue." },
    { id: 4, k: "Sync", t: "MFM sync, open to the field", w: "Quarterly, 1600Z", h: "MAJCOM Functional Managers", d: "Each command's update in ten minutes, then questions." },
    { id: 5, k: "Workshop", t: "Getting ready for a joint job", w: "Mon, 1800Z", h: "SMSgt K. Osei (sample)", d: "What changes in a joint or NATO cell, and how to prepare in the months before." },
    { id: 6, k: "Course", t: "5-level and 7-level upgrade check-in", w: "Every other month, 1500Z", h: "Training SMEs", d: "Common sticking points in upgrade training and how units are solving them." },
    { id: 7, k: "Sync", t: "Leadership sync: superintendents", w: "Monthly, 1300Z", h: "Senior enlisted leaders", d: "Superintendents compare notes on readiness, people and process." },
    { id: 8, k: "Ask Me Anything", t: "Ask a Chief: career moves", w: "Fri, 1900Z", h: "Chief A. Haddad (sample)", d: "Special duties, broadening and coming back to the field." },
  ];
  let evType = "all", rsvp = load("pulse-demo.rsvp", []);
  function renderEvents() {
    $("ev-list").innerHTML = EVENTS.filter(e => evType === "all" || e.k === evType).map(e => {
      const going = rsvp.includes(e.id);
      return `<article class="pv-event"><div class="pv-evk">${esc(e.k)}</div><h3>${esc(e.t)}</h3><p class="pv-hint">${esc(e.w)}. Led by ${esc(e.h)}.</p><p>${esc(e.d)}</p>
      <div class="pv-row"><button type="button" class="btn ${going ? "" : "pv-ghost"}" data-rsvp="${e.id}" aria-pressed="${going}">${going ? "Going" : "Save my seat"}</button>${e.k === "Ask Me Anything" ? `<button type="button" class="pv-link" data-ask="${e.id}">Send a question ahead</button>` : ""}</div></article>`;
    }).join("");
    $("ev-list").querySelectorAll("[data-rsvp]").forEach(b => b.onclick = () => { const id = +b.dataset.rsvp; rsvp = rsvp.includes(id) ? rsvp.filter(x => x !== id) : [...rsvp, id]; store("pulse-demo.rsvp", rsvp); renderEvents(); });
    $("ev-list").querySelectorAll("[data-ask]").forEach(b => b.onclick = () => {
      const e = EVENTS.find(x => x.id === +b.dataset.ask);
      dialog("Question for: " + e.t, `<form class="pv-form" id="ask-f" novalidate><label class="f" for="ask-q">Your question</label><textarea id="ask-q" maxlength="300" placeholder="Keep it unclassified. You can ask anonymously."></textarea><label class="pv-check"><input type="checkbox" checked> Ask anonymously</label><div class="pv-row"><button class="btn" type="submit">Send</button><p class="pv-ok" id="ask-ok" role="status"></p></div></form>`);
      $("ask-f").onsubmit = ev => { ev.preventDefault(); const ok = $("ask-ok"); if ($("ask-q").value.trim().length < 8) { ok.className = "pv-ok bad"; ok.textContent = "Write the question first."; return; } ok.className = "pv-ok"; ok.textContent = "Sent to the host's queue. (Demo only.)"; $("ask-q").value = ""; };
    });
  }
  document.querySelectorAll("#ev-chips .pv-chip").forEach(b => b.onclick = () => { evType = b.dataset.ev; document.querySelectorAll("#ev-chips .pv-chip").forEach(x => x.setAttribute("aria-pressed", x === b)); renderEvents(); });

  // ---------------- forums (sample)
  const FORUMS = [["all", "All forums"], ["career", "Career moves"], ["training", "Upgrade training"], ["leading", "Leading people"], ["joint", "Joint and NATO"], ["life", "Life and family"]];
  const THREADS0 = [
    { id: 1, f: "training", t: "Best way to study for the 7-level?", by: "SSgt (sample)", r: 6, last: "2 hours ago", sme: true },
    { id: 2, f: "career", t: "Is a special duty worth it mid-career?", by: "TSgt (sample)", r: 11, last: "yesterday", sme: false },
    { id: 3, f: "leading", t: "First week as an NCOIC: what would you do?", by: "TSgt (sample)", r: 9, last: "yesterday", sme: true },
    { id: 4, f: "joint", t: "What to pack for a NATO assignment (work, not suitcase)", by: "MSgt (sample)", r: 4, last: "3 days ago", sme: true },
    { id: 5, f: "life", t: "Dual-military and both in the career field: tips?", by: "SrA (sample)", r: 14, last: "4 days ago", sme: false },
    { id: 6, f: "training", t: "Shift schedules that leave time for upgrade training", by: "SSgt (sample)", r: 7, last: "last week", sme: false },
  ];
  let forum = "all", threads = load("pulse-demo.threads", null) || THREADS0.slice(), cocOk = load("pulse-demo.coc", false), reported = [];
  const fname = k => (FORUMS.find(f => f[0] === k) || ["", ""])[1];
  $("fo-chips").innerHTML = FORUMS.map(([k, n], i) => `<button type="button" class="pv-chip" aria-pressed="${i === 0}" data-fo="${k}">${n}</button>`).join("");
  $("fo-chips").querySelectorAll(".pv-chip").forEach(b => b.onclick = () => { forum = b.dataset.fo; $("fo-chips").querySelectorAll(".pv-chip").forEach(x => x.setAttribute("aria-pressed", x === b)); renderThreads(); });
  function renderThreads() {
    const list = threads.filter(x => forum === "all" || x.f === forum).sort((a, b) => b.id - a.id);
    $("fo-list").innerHTML = list.map(x => `<article class="pv-thread${x.pending ? " pending" : ""}"><div><span class="pv-evk">${esc(fname(x.f))}</span>${x.pending ? '<span class="pv-pend">Waiting for moderator review</span>' : ""}${x.sme ? '<span class="pv-smebadge">SME answered</span>' : ""}</div><h3>${esc(x.t)}</h3><p class="pv-hint">Started by ${esc(x.by)}. ${x.r} ${x.r === 1 ? "reply" : "replies"}, last ${esc(x.last)}.</p><div class="pv-row"><button type="button" class="pv-link" data-rep="${x.id}">${reported.includes(x.id) ? "Reported" : "Report"}</button></div></article>`).join("") || '<p class="pv-hint">No threads here yet. Start one.</p>';
    $("fo-list").querySelectorAll("[data-rep]").forEach(b => b.onclick = () => { const id = +b.dataset.rep; if (!reported.includes(id)) reported.push(id); renderThreads(); });
  }
  if (cocOk) $("fo-coc").checked = true;
  $("fo-form").addEventListener("submit", e => {
    e.preventDefault(); const ok = $("fo-ok"), title = $("fo-title").value.trim();
    if (title.length < 8) { ok.className = "pv-ok bad"; ok.textContent = "Add a question or topic first."; return; }
    if (!$("fo-coc").checked) { ok.className = "pv-ok bad"; ok.textContent = "Agree to the code of conduct to post."; return; }
    cocOk = true; store("pulse-demo.coc", true);
    const x = { id: Math.max(0, ...threads.map(t => t.id)) + 1, f: forum === "all" ? "career" : forum, t: title, by: "you", r: 0, last: "just now", sme: false, pending: true };
    threads.push(x); store("pulse-demo.threads", threads); renderThreads();
    ok.className = "pv-ok"; ok.textContent = "Posted. A moderator will review it."; $("fo-title").value = ""; $("fo-body").value = "";
    setTimeout(() => { x.pending = false; store("pulse-demo.threads", threads); renderThreads(); ok.textContent = "Approved by a moderator. It's live."; }, 3500);
  });

  // ---------------- network health and rules
  const BARS = [["Mentors and SMEs", 31], ["Developmental opportunities", 18], ["Leadership development", 16], ["Core competencies", 12], ["Missions: joint, MAJCOM, SC2E", 10], ["Superintendent and NCOIC", 8], ["Key positions", 5]];
  $("hl-bars").innerHTML = BARS.map(([n, v]) => `<div class="pv-bar"><span>${esc(n)}</span><i style="--v:${v * 3}%"></i><b>${v}%</b></div>`).join("");
  const RULES = {
    coc: ["Code of conduct", "<ul><li>Treat every member with respect, whatever their rank.</li><li>Keep it professional and unclassified. Nothing sensitive, nothing For Official Use Only.</li><li>What a mentee shares in confidence stays in confidence, unless safety or the law requires otherwise.</li><li>No selling, recruiting or promoting outside businesses.</li><li>Volunteers give honest advice and say when something is outside what they know.</li></ul><p class='pv-hint'>Sample text for the demo. The real charter would be approved by the FAC.</p>"],
    privacy: ["Privacy and security", "<ul><li>Follows Air Force and DoD rules for privacy, information security and official communication.</li><li>Profiles show only what the volunteer chooses to share.</li><li>Professional conversations stay on approved platforms and channels.</li><li>No classified or controlled information, ever.</li></ul>"],
    dispute: ["Resolving problems", "<ol><li>Report the problem from the post or profile, or to the program manager directly.</li><li>The program manager reviews it and talks to the people involved.</li><li>Outcomes range from a reminder to removal from the network.</li><li>Anything that is a matter for the chain of command goes there.</li></ol>"],
    mod: ["Moderation", "<p>New forum threads are reviewed by Chief moderators against the code of conduct, much like the career field's existing community pages. Members can report any post. Reported posts are reviewed within one duty day.</p>"],
  };
  document.querySelectorAll("[data-rule]").forEach(b => b.onclick = () => dialog(...RULES[b.dataset.rule]));
  $("fo-coc-open").onclick = () => dialog(...RULES.coc);
  renderHub(); renderEvents(); renderThreads();

  // Phone layout: a home screen of buttons, one section per screen (hash routes keep the iPhone back swipe working).
  const NAMES = { board: "Issue board", loop: "How it works", submit: "Raise an issue", roles: "Who does what", mentors: "Mentors and SMEs", boards: "Message boards", news: "What changed", hub: "Development hub", events: "Events", forums: "Forums", health: "Network health" };
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
    # No studio branding or links to the apps: drop the site header and footer (David, 22 Oct).
    import re
    doc = re.sub(r'<header class="top">.*?</header>\s*', "", doc, count=1, flags=re.S)
    doc = re.sub(r'<footer class="bottom">.*?</footer>\s*', "", doc, count=1, flags=re.S)
    doc = doc.replace("</head>", f'<meta name="robots" content="noindex, nofollow">\n<link rel="stylesheet" href="{css}">\n'
                      + accent_css(ACCENT) + "\n</head>", 1)
    write(HERE, doc)
