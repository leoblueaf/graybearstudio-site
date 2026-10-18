"""Report Desk: a temporary, unlisted concept demo of an operational reporting (OPREP-3) workflow (David, 18 Oct 2026).

Built from the public DAFI 10-206 (1 July 2026). Lives at /demo/oprep/ in the studio frame: noindex, not in the
sitemap, linked from nowhere, sample data only. Nuclear and Special Access Program categories are deliberately left
out of this public demo. To take it down: set OPREP_DEMO = False (the source stays here for later).
"""
OPREP_DEMO = True
HERE = "demo/oprep"
ACCENT = {"accent": ("#8C2F2F", "#E39A92")}

BODY = r"""
<div class="op-banner"><div class="wrap">
<span><b>Concept demo. Sample data only.</b> Not an official Air Force system. Never enter real event details: real reports are CUI or classified and go only through approved systems.</span>
<button type="button" class="op-link" id="op-reset">Reset the demo</button>
</div></div>

<section class="op-top"><div class="wrap op-top-grid">
<div>
<h1>Report Desk</h1>
<p class="op-tag">Report fast, report right, never miss a clock.</p>
<p class="op-lede">A guided workspace for building operational reports the way DAFI 10-206 lays them out: pick the category, watch the deadlines, write the message, and send it down the right path, with every step checked.</p>
<div class="op-actions"><button type="button" class="btn" id="op-new">Start a new report</button><button type="button" class="btn op-ghost" id="op-try">Try it with a sample event</button><a class="op-link" href="#op-ref">Quick reference</a></div>
<ol class="op-how"><li><b>Tell it what happened</b>and when</li><li><b>Answer a few questions</b>to find the right report</li><li><b>Fill in the blanks</b>the subject line writes itself</li><li><b>Release and send</b>with the clocks counting down</li></ol>
</div>
<div class="op-clock" aria-live="off"><span>Current time</span><b id="op-zulu">00:00:00Z</b><small id="op-date"></small></div>
</div></section>

<div class="op-modebar"><div class="wrap">
<nav class="op-modes" role="tablist" aria-label="Views">
<button type="button" role="tab" data-view="unit" aria-selected="true">Unit command post</button>
<button type="button" role="tab" data-view="search" aria-selected="false">Search reports</button>
<button type="button" role="tab" data-view="watch" aria-selected="false">AFSWC watch</button>
</nav>
<button type="button" class="op-unitchip" id="op-unitchip"><span>Signed in as</span><b id="op-unitname"></b><i>Unit profile</i></button>
</div></div>

<section class="section op-view" id="op-view-unit"><div class="wrap op-layout">

<aside class="op-board" aria-labelledby="op-board-h">
<div class="op-board-head"><h2 id="op-board-h">Open events</h2><span id="op-count"></span></div>
<div id="op-events"></div>
<p class="op-hint">Your unit's open events. Tap one to see the full report, messages from the watch cell, and to send a follow-up or final.</p>
</aside>

<div class="op-main">
<div class="op-empty" id="op-empty">
<h2>No report in progress</h2>
<p class="op-hint">Start a new report, or pick an open event to send a follow-up, final, correction or upgrade.</p>
<div class="op-actions" style="justify-content:center;margin:0"><button type="button" class="btn" id="op-new2">Start a new report</button><button type="button" class="btn op-ghost" id="op-try2">Try it with a sample event</button></div>
</div>

<form class="op-wiz" id="op-wiz" novalidate hidden>
<ol class="op-steps" id="op-steps">
<li data-s="0">Event</li><li data-s="1">Category</li><li data-s="2">Message</li><li data-s="3">Release</li><li data-s="4">Send</li>
</ol>

<div class="op-step" data-step="0">
<h2>What happened, and when?</h2>
<p class="op-hint">Report what you have now. DAFI 10-206 says reports are not delayed to get more information, or to find out whether another unit is reporting too.</p>
<div class="op-pair">
<div><label class="f" for="op-inc">Time of incident (Zulu)</label><input type="datetime-local" id="op-inc"></div>
<div><label class="f" for="op-known">Time the command post learned of it (Zulu)</label><input type="datetime-local" id="op-known"></div>
</div>
<label class="f" for="op-what">One-line summary</label>
<input type="text" id="op-what" maxlength="120" placeholder="Sample: vehicle accident on the flightline, two injured">
<label class="f" for="op-where">Location</label>
<input type="text" id="op-where" maxlength="80" placeholder="Sample Air Force Base, building or area">
<div class="op-checks">
<label class="op-check"><input type="checkbox" id="op-exercise"> This is an exercise</label>
<label class="op-check"><input type="checkbox" id="op-rd"> Report would include Restricted Data or Formerly Restricted Data</label>
<label class="op-check"><input type="checkbox" id="op-sa"> Event is a sexual assault or another sexually based crime</label>
<label class="op-check"><input type="checkbox" id="op-outage"> Our normal reporting systems are down</label>
</div>
<div class="op-alert" id="op-alert0" hidden></div>
</div>

<div class="op-step" data-step="1" hidden>
<h2>Which report is it?</h2>
<p class="op-hint">Not sure? Tap the first question that's a "yes" and we'll pick the category for you. If more than one fits, the higher one wins. You can also pick a card directly.</p>
<div class="op-q" id="op-qs"></div>
<div class="op-cats" id="op-cats" role="radiogroup" aria-label="Report category"></div>
<label class="f" for="op-rule">Reporting rule (number and title)</label>
<input type="text" id="op-rule" maxlength="80" placeholder="Sample rule 00: title from the DAF Reporting Program Matrix">
<label class="f" for="op-more">Other rules that also apply (optional)</label>
<input type="text" id="op-more" maxlength="120" placeholder="Sample rules 00, 00">
<p class="op-hint">Real rule numbers and titles come from the DAF Reporting Program Matrix and Templates, which are not public. The demo uses placeholders.</p>
</div>

<div class="op-step" data-step="2" hidden>
<h2>Write the message</h2>
<div class="op-pair">
<div><label class="f" for="op-kind">Report type</label>
<select id="op-kind"><option>Initial</option><option>Initial/Final</option><option>Follow-Up</option><option>Final</option><option>Corrected Copy</option><option>Upgrade</option></select></div>
<div><label class="f" for="op-class">Classification marking</label>
<select id="op-class"><option>CUI</option><option>SECRET</option></select></div>
</div>
<p class="op-hint" id="op-kindhelp"></p>
<div class="op-subject"><span>Subject line</span><code id="op-subj"></code></div>
<label class="f" for="op-who">WHO: units and people involved (no names in the demo)</label>
<textarea id="op-who" maxlength="400" placeholder="Sample: two Airmen from a sample squadron"></textarea>
<label class="f" for="op-whatd">WHAT, WHEN and WHERE</label>
<textarea id="op-whatd" maxlength="600" placeholder="Sample: at 1342Z a government vehicle struck a light cart near the sample ramp."></textarea>
<label class="f" for="op-why">WHY: narrative, impact and actions taken</label>
<textarea id="op-why" maxlength="1500" placeholder="Sample: both Airmen transported to the clinic, injuries not life-threatening. Area cordoned; investigation started. Next update when the clinic reports."></textarea>
<label class="f" for="op-change" id="op-change-l" hidden>What changed in this corrected copy</label>
<textarea id="op-change" maxlength="300" hidden placeholder="Sample: corrected the time of incident from 1324Z to 1342Z."></textarea>
<div class="op-checks">
<label class="op-check"><input type="checkbox" id="op-newonly"> This follow-up or final contains only new or updated information</label>
</div>
<p class="op-hint">Field layout is illustrative. Units use the official templates; DAFI 10-206 names the subject line and the WHY section.</p>
<div class="op-alert" id="op-alert2" hidden></div>
</div>

<div class="op-step" data-step="3" hidden>
<h2>Release authority</h2>
<p class="op-hint">The installation, wing or delta commander owns the report and may delegate release. Speed matters more than polish: the instruction says not to hold a report for grammar or punctuation.</p>
<div class="op-preview" id="op-preview"></div>
<label class="f" for="op-releaser">Released by (role, sample)</label>
<select id="op-releaser"></select>
<p class="op-hint">Names come from your unit profile.</p>
<label class="op-check"><input type="checkbox" id="op-approve"> Reviewed and approved for release</label>
<div class="op-alert" id="op-alert3" hidden></div>
</div>

<div class="op-step" data-step="4" hidden>
<h2>Send it down the right path</h2>
<div class="op-path" id="op-path"></div>
<div class="op-ack" id="op-ackbox"></div>
<div class="op-alert" id="op-alert4" hidden></div>
</div>

<div class="op-timers" id="op-timers"></div>

<div class="op-nav">
<button type="button" class="btn op-ghost" id="op-back">Back</button>
<button type="button" class="op-link" id="op-cancel">Discard</button>
<button type="button" class="btn" id="op-next">Next</button>
</div>
</form>
</div>
</div></section>


<section class="section op-view" id="op-view-search" hidden><div class="wrap">
<h2>Search reports</h2>
<p class="op-hint" style="font-size:1rem;margin:-0.4rem 0 1rem">Find any report by word, category, type, unit, command, status or date.</p>
<form class="op-filters" id="op-sf" onsubmit="return false">
<div class="op-f op-f-wide"><label for="sf-q">Search words</label><input type="search" id="sf-q" placeholder="Try: vehicle, power, storm"></div>
<div class="op-f"><label for="sf-cat">Category</label><select id="sf-cat"></select></div>
<div class="op-f"><label for="sf-kind">Report type</label><select id="sf-kind"><option value="">Any type</option><option>Initial</option><option>Initial/Final</option><option>Follow-Up</option><option>Final</option><option>Corrected Copy</option><option>Upgrade</option></select></div>
<div class="op-f"><label for="sf-unit">Unit</label><select id="sf-unit"></select></div>
<div class="op-f"><label for="sf-cmd">Command</label><select id="sf-cmd"></select></div>
<div class="op-f"><label for="sf-status">Status</label><select id="sf-status"><option value="">Open or closed</option><option value="open">Open</option><option value="closed">Closed</option></select></div>
<div class="op-f"><label for="sf-from">From date</label><input type="date" id="sf-from"></div>
<div class="op-f"><label for="sf-to">To date</label><input type="date" id="sf-to"></div>
<div class="op-f op-f-btn"><button type="button" class="op-link" id="sf-clear">Clear filters</button></div>
</form>
<p class="op-count" id="sf-count" role="status"></p>
<div class="op-results" id="sf-results"></div>
</div></section>

<section class="section op-view" id="op-view-watch" hidden><div class="wrap">
<div class="op-watchhead"><div><h2>AFSWC watch</h2><p class="op-hint" style="font-size:1rem">Every report from every unit, in one queue. Acknowledge, ask for more, re-categorize, and close or extend.</p></div>
<div class="op-watchclock"><span>Watch time</span><b id="op-zulu2">00:00Z</b></div></div>
<div class="op-kpis" id="w-kpis"></div>
<div class="op-filterchips" role="group" aria-label="Queue filter" id="w-chips">
<button type="button" class="op-chip" aria-pressed="true" data-w="all">All</button>
<button type="button" class="op-chip" aria-pressed="false" data-w="ack">Needs acknowledgment</button>
<button type="button" class="op-chip" aria-pressed="false" data-w="open">Open</button>
<button type="button" class="op-chip" aria-pressed="false" data-w="reply">Unit replied</button>
<button type="button" class="op-chip" aria-pressed="false" data-w="auto">Automatic final due</button>
<button type="button" class="op-chip" aria-pressed="false" data-w="closed">Closed</button>
</div>
<div class="op-queue" id="w-queue"></div>
</div></section>


<dialog class="op-dlg" id="d-unit" aria-labelledby="du-h"><form method="dialog" class="op-dform" id="du-form" novalidate>
<h2 id="du-h">Unit profile</h2>
<p class="op-hint">Your profile fills in reports automatically and tells the watch cell who to call back. Sample details only.</p>
<div class="op-f"><label for="du-pick">Switch to another unit</label><select id="du-pick"></select></div>
<div class="op-pair">
<div class="op-f"><label for="du-name">Unit name</label><input type="text" id="du-name" maxlength="60" placeholder="Sample Wing Command Post"></div>
<div class="op-f"><label for="du-inst">Installation</label><input type="text" id="du-inst" maxlength="60" placeholder="Sample Air Force Base"></div>
<div class="op-f"><label for="du-cmd">Command</label><select id="du-cmd"></select></div>
<div class="op-f"><label for="du-office">Office symbol</label><input type="text" id="du-office" maxlength="20" placeholder="SAMPLE/CP"></div>
<div class="op-f"><label for="du-phone">Command post phone (sample)</label><input type="text" id="du-phone" maxlength="20" placeholder="DSN 000-0000"></div>
<div class="op-f"><label for="du-email">Org mailbox (sample)</label><input type="text" id="du-email" maxlength="60" placeholder="sample.cp@example.mil"></div>
</div>
<div class="op-f"><label for="du-rel">Release authorities, one per line</label><textarea id="du-rel" rows="3" placeholder="Wing commander&#10;Vice wing commander"></textarea></div>
<p class="op-ok" id="du-ok" role="status"></p>
<div class="op-dactions"><button type="button" class="op-link" id="du-new">Create a new unit</button><span></span><button type="button" class="btn op-ghost" id="du-close">Close</button><button type="button" class="btn" id="du-save">Save profile</button></div>
</form></dialog>

<dialog class="op-dlg op-dlg-wide" id="d-ev" aria-labelledby="de-h"><div class="op-dform">
<div class="op-dhead"><div><span class="op-pill" id="de-pill"></span> <span class="op-status" id="de-status"></span><h2 id="de-h"></h2><p class="op-hint" id="de-meta"></p></div><button type="button" class="op-x" id="de-close" aria-label="Close">&times;</button></div>
<div class="op-dgrid">
<div><h3>Reports sent</h3><div id="de-reports"></div></div>
<div><h3>Messages</h3><div class="op-thread" id="de-thread"></div>
<form class="op-reply" id="de-reply" novalidate><label class="f" for="de-msg" id="de-msg-l">Reply</label>
<div class="op-f" id="de-type-row" hidden><label for="de-type">Message type</label><select id="de-type"><option>Request for information</option><option>Guidance</option><option>Note</option></select></div>
<textarea id="de-msg" rows="3" maxlength="600" placeholder="Keep it unclassified in the demo."></textarea>
<div class="op-dactions"><span class="op-ok" id="de-ok" role="status"></span><button type="submit" class="btn">Send message</button></div></form>
<div class="op-wactions" id="de-wactions" hidden>
<h3>Watch cell actions</h3>
<div class="op-dactions" style="justify-content:flex-start"><button type="button" class="btn" id="de-ack">Acknowledge</button><button type="button" class="btn op-ghost" id="de-extend">Extend 7 days</button><button type="button" class="btn op-ghost" id="de-closeev">Close report</button></div>
<div class="op-recat"><label for="de-cat">Change category</label><select id="de-cat"></select><input type="text" id="de-why" maxlength="160" placeholder="Reason, e.g. not enough information for a BEELINE"><button type="button" class="op-link" id="de-recat">Change</button></div>
</div>
<div class="op-dactions" id="de-uactions" hidden style="justify-content:flex-start"><button type="button" class="btn" id="de-follow">Send a follow-up, final or correction</button></div>
</div></div></div></dialog>

<section class="section op-refsec" id="op-ref"><div class="wrap">
<h2>Quick reference</h2>
<p class="op-hint" style="font-size:1rem;margin-top:-0.4rem">From DAFI 10-206, Operational Reporting, 1 July 2026 (public). Check the current version before relying on it.</p>
<div class="op-refgrid">
<div class="op-box"><h3>Report deadlines</h3>
<table class="op-table"><thead><tr><th>Category</th><th>Synchronous</th><th>Asynchronous</th></tr></thead><tbody>
<tr><td>PINNACLE</td><td>15 min from incident</td><td>1 hour from incident</td></tr>
<tr><td>BEELINE</td><td>30 min from incident</td><td>1 hour from acknowledgment</td></tr>
<tr><td>DAF CCIR</td><td>30 min from incident</td><td>4 hours from acknowledgment</td></tr>
<tr><td>WHITE PINNACLE (exercise)</td><td>20 min from incident</td><td>Not required</td></tr>
</tbody></table>
<p class="op-hint">Synchronous means real time (chat or voice); asynchronous means the written report. Watch cells acknowledge within 5 minutes; if not, contact the MAJCOM command center.</p></div>
<div class="op-box"><h3>Who reports, and to whom</h3>
<ol class="op-chain"><li><b>Unit</b><span>Installation, wing or delta commander, or a delegate. The first commander who knows reports.</span></li><li><b>Command post</b><span>Qualified 1C3X1s or a specialized C2 element transmit.</span></li><li><b>MAJCOM or FLDCOM command center</b></li><li><b>Service watch cell</b><span>AFSWC or SFSWC.</span></li><li><b>NMCC and Joint Staff</b><span>For PINNACLE reports.</span></li></ol></div>
<div class="op-box"><h3>Report types</h3><dl class="op-dl">
<dt>Initial</dt><dd>Everything known now. Never held for more detail.</dd>
<dt>Initial/Final</dt><dd>When the initial already meets the final's conditions.</dd>
<dt>Follow-Up</dt><dd>Only new or updated information, in the WHY section.</dd>
<dt>Final</dt><dd>Once the situation is stable and nothing significant is expected. Only new information.</dd>
<dt>Automatic final</dt><dd>After 7 days with no new information; the watch cell closes or extends it.</dd>
<dt>Corrected Copy</dt><dd>Fixes an error; ends with a statement of what changed.</dd>
<dt>Upgrade</dt><dd>A new initial at the higher level carrying everything already reported; the old report closes.</dd></dl></div>
<div class="op-box"><h3>Rules that trip people up</h3><ul>
<li>Several rules apply: use the most severe in the subject line and list the others at the end of WHY.</li>
<li>Minimum classification is CUI. The originator classifies, safeguards and downgrades.</li>
<li>Restricted Data and Formerly Restricted Data never go on the chat or reporting tool: secure voice or SIPRNET email only.</li>
<li>Reported something that turns out not to be reportable: tell the MAJCOM command center and the watch cell.</li>
<li>Systems down: send by other appropriate classified means, then enter it in the reporting tool once restored.</li>
<li>Sexual assaults and other sexually based crimes are not OPREP-3 reports; follow DAFI 90-6001.</li>
<li>SITREPs are due by 0800Z with information current as of 0600Z unless directed otherwise.</li>
<li>Storyboards, when directed, are due within 4 hours.</li>
</ul></div>
<div class="op-box"><h3>Training tracker (sample)</h3>
<table class="op-table"><thead><tr><th>Who</th><th>Requirement</th><th>Status</th></tr></thead><tbody id="op-train"></tbody></table>
<p class="op-hint">The reporting element trains commanders and first sergeants within 60 days of assignment and every year after, and documents it.</p></div>
<div class="op-box"><h3>Left out of this demo on purpose</h3><p class="op-hint" style="margin:0">Nuclear-related and Special Access Program report categories, the non-public reporting matrix and templates, and anything resembling real events. A real version would live on approved government systems.</p></div>
</div>
</div></section>
"""

SCRIPT = r"""<script>
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } };
  const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
  const MIN = 60000, HOUR = 3600000, DAY = 86400000;

  // Categories in this demo (nuclear and SAP categories intentionally omitted).
  const CATS = {
    P:  { n: "OPREP-3 PINNACLE", s: "OPREP-3P", lvl: 4, sync: 15, async: 60, asyncFrom: "incident", desc: "National-level interest: goes to the Chairman and the Secretary through the NMCC.",
          paths: ["Synchronous: NMCC-NJOIC chatroom on SIPRNET, and an immediate phone call to JS/J3", "Asynchronous: AMHS if available, and SIPRNET email to JS/J3 and the AFSWC"] },
    WP: { n: "WHITE PINNACLE (exercise)", s: "OPREP-3WP", lvl: 3, sync: 20, async: null, asyncFrom: null, desc: "An exercise report using PINNACLE procedures.",
          paths: ["Synchronous: exercise chatroom per the exercise directive", "Asynchronous: not required"] },
    B:  { n: "OPREP-3 BEELINE", s: "OPREP-3B", lvl: 2, sync: 30, async: 60, asyncFrom: "ack", desc: "Service-level event for the Secretary and service chiefs, not of national or international interest.",
          paths: ["Synchronous: AFSWC chatroom on NIPRNET or SIPRNET", "Asynchronous: the reporting tool, with notice to the AFSWC in the chatroom"] },
    C:  { n: "DAF CCIR", s: "DAF CCIR", lvl: 1, sync: 30, async: 240, asyncFrom: "ack", desc: "Commander's critical information requirement below the BEELINE threshold.",
          paths: ["Synchronous: AFSWC chatroom on NIPRNET or SIPRNET", "Asynchronous: the reporting tool, with notice to the AFSWC in the chatroom"] },
  };
  const QS = [
    ["Is this an exercise event that would otherwise be a PINNACLE?", "WP"],
    ["Is it of national or international interest (needs the Chairman or the Secretary)?", "P"],
    ["Does service leadership need to know right away, but it is not national-level?", "B"],
    ["Is it a commander's critical information requirement that does not need immediate service-level notice?", "C"],
  ];
  const KIND_HELP = {
    "Initial": "Everything known right now. Do not hold it for more detail.",
    "Initial/Final": "Use when the initial report already meets the conditions for a final.",
    "Follow-Up": "Only new or updated information, in the WHY section.",
    "Final": "The situation is stable and nothing significant is expected. Only new information.",
    "Corrected Copy": "Fixes an error in a report already sent. It must end with a statement of what changed.",
    "Upgrade": "A new initial at the higher category with everything already reported. The DTG is when the new information came in; the old report closes.",
  };

  const now = () => Date.now();
  const z = t => { const d = new Date(t); return d.toISOString().slice(11, 19) + "Z"; };
  const dtg = t => { const d = new Date(t), M = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return String(d.getUTCDate()).padStart(2, "0") + String(d.getUTCHours()).padStart(2, "0") + String(d.getUTCMinutes()).padStart(2, "0") + "Z " + M[d.getUTCMonth()] + " " + String(d.getUTCFullYear()).slice(2); };
  const toLocalInput = t => new Date(t).toISOString().slice(0, 16);
  const fromInput = v => v ? Date.parse(v + ":00Z") : null;
  const fmtLeft = ms => { const neg = ms < 0, a = Math.abs(ms), h = Math.floor(a / HOUR), m = Math.floor(a % HOUR / MIN), s = Math.floor(a % MIN / 1000);
    return (neg ? "-" : "") + (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); };

  // ---------------- units (sample)
  const CMDS = ["ACC", "AETC", "AFGSC", "AFMC", "AFSOC", "AMC", "PACAF", "USAFE-AFAFRICA", "AFRC", "ANG"];
  const UNITS0 = [
    { id: "u1", name: "Sample Wing Command Post", inst: "Sample Air Force Base", cmd: "ACC", office: "SMPL/CP", phone: "DSN 000-0001", email: "sample.wing.cp@example.mil", rel: ["Wing commander", "Vice wing commander", "Delegated release authority"] },
    { id: "u2", name: "Sample Airlift Wing Command Post", inst: "Sample Field", cmd: "AMC", office: "SMPL2/CP", phone: "DSN 000-0002", email: "sample.airlift.cp@example.mil", rel: ["Wing commander", "Vice wing commander"] },
    { id: "u3", name: "Sample Fighter Wing Command Post", inst: "Sample Air Base (overseas)", cmd: "USAFE-AFAFRICA", office: "SMPL3/CP", phone: "DSN 000-0003", email: "sample.fighter.cp@example.mil", rel: ["Wing commander", "Vice wing commander"] },
    { id: "u4", name: "Sample Training Wing Command Post", inst: "Sample Air Force Base South", cmd: "AETC", office: "SMPL4/CP", phone: "DSN 000-0004", email: "sample.training.cp@example.mil", rel: ["Wing commander", "Mission support group commander (delegated)"] },
  ];
  let units = load("oprep-demo.units", null) || UNITS0.map(u => ({ ...u, rel: u.rel.slice() }));
  let me = load("oprep-demo.me", "u1");
  const unitOf = id => units.find(u => u.id === id) || units[0];
  const saveUnits = () => { store("oprep-demo.units", units); store("oprep-demo.me", me); };

  // ---------------- sample events
  const T = now();
  const R = (kind, t, why, extra) => ({ kind, t, why, who: (extra || {}).who || "Sample personnel", whatd: (extra || {}).whatd || "", cls: "CUI" });
  const EV = () => [
    { id: 1, unit: "u1", cat: "B", what: "Sample: aircraft returned with a bird strike, no injuries", where: "Sample Air Force Base, runway 1", inc: T - 3 * HOUR, kinds: ["Initial"], last: T - 2.5 * HOUR, ack: T - 2.9 * HOUR, rule: "Sample rule 00",
      reps: [R("Initial", T - 2.5 * HOUR, "Aircraft landed safely after a bird strike on approach. No injuries. Aircraft impounded for inspection.")],
      thread: [{ from: "watch", t: T - 2 * HOUR, type: "Request for information", text: "Thanks. Please send an estimated return to service when maintenance has one.", seenU: false }] },
    { id: 2, unit: "u1", cat: "C", what: "Sample: base-wide power outage, mission continuing on backup power", where: "Sample Air Force Base", inc: T - 2 * DAY, kinds: ["Initial", "Follow-Up"], last: T - 1 * DAY, ack: T - 2 * DAY + 20 * MIN, rule: "Sample rule 00",
      reps: [R("Initial", T - 2 * DAY + 30 * MIN, "Utility power lost base-wide. Critical facilities on generators. Mission continuing."), R("Follow-Up", T - 1 * DAY, "Power restored to 80 percent of facilities. Remaining areas expected tomorrow.")], thread: [] },
    { id: 3, unit: "u2", cat: "C", what: "Sample: tropical storm readiness change, first change for this storm", where: "Sample Field", inc: T - 7.2 * DAY, kinds: ["Initial"], last: T - 7.2 * DAY, ack: T - 7.2 * DAY + 10 * MIN, rule: "Sample rule 00",
      reps: [R("Initial", T - 7.2 * DAY, "Readiness condition raised for an approaching storm. Aircraft evacuation planning under way.")], thread: [] },
    { id: 4, unit: "u3", cat: "B", what: "Sample: off-base vehicle accident involving two Airmen", where: "Near Sample Air Base", inc: T - 40 * MIN, kinds: ["Initial"], last: T - 25 * MIN, ack: null, rule: "Sample rule 00",
      reps: [R("Initial", T - 25 * MIN, "Two Airmen involved in an off-base vehicle accident. Both taken to a local hospital. Condition being confirmed.")], thread: [] },
    { id: 5, unit: "u4", cat: "C", what: "Sample: training sortie cancelled base-wide for a fuel contamination check", where: "Sample Air Force Base South", inc: T - 9 * HOUR, kinds: ["Initial"], last: T - 8.5 * HOUR, ack: T - 8.9 * HOUR, rule: "Sample rule 00",
      reps: [R("Initial", T - 8.5 * HOUR, "Fuel samples failed a routine check. Flying stopped until retest results are in.")],
      thread: [{ from: "watch", t: T - 7 * HOUR, type: "Request for information", text: "How many sorties are affected, and when is the retest due?", seenU: true }, { from: "unit", t: T - 6 * HOUR, text: "14 sorties today. Retest results expected by 1800Z.", seenW: false }] },
    { id: 6, unit: "u2", cat: "B", what: "Sample: hazardous cargo leak contained on the flightline", where: "Sample Field, cargo ramp", inc: T - 12 * DAY, kinds: ["Initial", "Final"], last: T - 11 * DAY, ack: T - 12 * DAY + 15 * MIN, rule: "Sample rule 00", closed: true,
      reps: [R("Initial", T - 12 * DAY + 20 * MIN, "Small leak from a cargo container. Area cordoned; fire department responded."), R("Final", T - 11 * DAY, "Leak contained and cleaned up. No injuries, no environmental impact. Closing.")], thread: [] },
    { id: 7, unit: "u3", cat: "C", what: "Sample: network outage affecting the command post for 3 hours", where: "Sample Air Base (overseas)", inc: T - 20 * DAY, kinds: ["Initial/Final"], last: T - 20 * DAY, ack: T - 20 * DAY + 8 * MIN, rule: "Sample rule 00", closed: true,
      reps: [R("Initial/Final", T - 20 * DAY, "Network outage from 0900Z to 1200Z. Reporting done by alternate means. Service restored; no mission impact.")], thread: [] },
    { id: 8, unit: "u4", cat: "WP", what: "Sample exercise: simulated aircraft mishap", where: "Sample Air Force Base South", inc: T - 4 * DAY, kinds: ["Initial"], last: T - 4 * DAY, ack: T - 4 * DAY + 5 * MIN, rule: "Exercise", closed: true,
      reps: [R("Initial", T - 4 * DAY, "EXERCISE EXERCISE EXERCISE. Simulated mishap for the quarterly exercise.")], thread: [] },
  ];
  let events = load("oprep-demo.v2", null) || EV();
  const saveEv = () => store("oprep-demo.v2", events);
  const unreadU = e => (e.thread || []).filter(m => m.from === "watch" && !m.seenU).length;
  const unreadW = e => (e.thread || []).filter(m => m.from === "unit" && !m.seenW).length;
  const autoLeft = e => (e.ext || e.last + 7 * DAY) - now();

  function renderBoard() {
    const mine = events.filter(e => e.unit === me), open = mine.filter(e => !e.closed);
    $("op-count").textContent = open.length + " open";
    $("op-events").innerHTML = open.length ? open.sort((a, b) => b.last - a.last).map(e => {
      const c = CATS[e.cat], age = now() - e.last, auto = autoLeft(e), u = unreadU(e);
      return `<button type="button" class="op-ev" data-id="${e.id}"><span class="op-row2"><span class="op-pill op-l${c.lvl}">${esc(c.s)}</span>${u ? `<span class="op-new">${u} new from AFSWC</span>` : ""}${e.ack ? "" : '<span class="op-wait">Awaiting acknowledgment</span>'}</span><b>${esc(e.what)}</b>
        <small>${esc(e.kinds.join(", "))} sent. Last report ${age < HOUR ? Math.max(1, Math.floor(age / MIN)) + " min" : Math.floor(age / HOUR) + " h"} ago.</small>
        <small class="${auto < DAY ? "warn" : ""}">${auto > 0 ? "Automatic final in " + Math.ceil(auto / DAY) + " day" + (Math.ceil(auto / DAY) === 1 ? "" : "s") : "Automatic final due: the watch cell closes or extends"}</small></button>`;
    }).join("") : '<p class="op-hint">No open events for this unit.</p>';
    $("op-events").querySelectorAll(".op-ev").forEach(b => b.onclick = () => showEvent(+b.dataset.id, "unit"));
    const totalNew = mine.reduce((n, e) => n + unreadU(e), 0);
    document.querySelector('[data-view="unit"]').dataset.badge = totalNew || "";
    const wNew = events.reduce((n, e) => n + unreadW(e) + (!e.ack && !e.closed ? 1 : 0), 0);
    document.querySelector('[data-view="watch"]').dataset.badge = wNew || "";
  }

  // ---------------- wizard state
  let st = null, step = 0;
  function blank() { return { id: null, cat: null, kind: "Initial", inc: now() - 4 * MIN, known: now() - 2 * MIN, ack: null, sentSync: null, sentAsync: null, released: false }; }
  function openWizard(s, startStep) {
    st = s; step = startStep || 0;
    $("op-empty").hidden = true; $("op-wiz").hidden = false;
    $("op-inc").value = toLocalInput(st.inc); $("op-known").value = toLocalInput(st.known);
    ["what", "where", "rule", "more", "who", "whatd", "why", "change"].forEach(k => { const el = $("op-" + k); if (el) el.value = st[k] || ""; });
    ["exercise", "rd", "sa", "outage", "newonly", "approve"].forEach(k => $("op-" + k).checked = !!st[k]);
    $("op-kind").value = st.kind; $("op-class").value = st.cls || "CUI";
    $("op-releaser").innerHTML = unitOf(me).rel.map(r => `<option>${esc(r)}</option>`).join("");
    renderCats(); show();
  }
  function collect() {
    st.inc = fromInput($("op-inc").value) || st.inc; st.known = fromInput($("op-known").value) || st.known;
    ["what", "where", "rule", "more", "who", "whatd", "why", "change"].forEach(k => st[k] = $("op-" + k).value.trim());
    ["exercise", "rd", "sa", "outage", "newonly", "approve"].forEach(k => st[k] = $("op-" + k).checked);
    st.kind = $("op-kind").value; st.cls = $("op-class").value; st.releaser = $("op-releaser").value;
  }
  function alertBox(id, html, bad) { const a = $(id); a.hidden = !html; a.className = "op-alert" + (bad ? " bad" : ""); a.innerHTML = html || ""; }

  function renderCats() {
    $("op-qs").innerHTML = QS.map(([q, c], i) => `<button type="button" class="op-qb" data-c="${c}"><span>${i + 1}</span>${esc(q)}</button>`).join("");
    $("op-qs").querySelectorAll(".op-qb").forEach(b => b.onclick = () => { st.cat = b.dataset.c; renderCats(); updateTimers(); });
    $("op-cats").innerHTML = Object.entries(CATS).map(([k, c]) => `<label class="op-cat ${st.cat === k ? "on" : ""}"><input type="radio" name="op-cat" value="${k}" ${st.cat === k ? "checked" : ""}><b>${esc(c.n)}</b><span>${esc(c.desc)}</span><small>Synchronous ${c.sync} min. ${c.async ? "Asynchronous " + (c.async >= 60 ? c.async / 60 + " h" : c.async + " min") + " from " + (c.asyncFrom === "ack" ? "acknowledgment" : "incident") : "No asynchronous report"}.</small></label>`).join("");
    $("op-cats").querySelectorAll("input").forEach(r => r.onchange = () => { st.cat = r.value; renderCats(); updateTimers(); });
  }

  function subject() {
    const c = CATS[st.cat]; if (!c) return "Pick a category first";
    const t = st.kind === "Upgrade" ? now() : st.inc;
    return `${st.cls || "CUI"} // ${c.s} ${st.kind === "Upgrade" ? "INITIAL (UPGRADE)" : st.kind.toUpperCase()} // ${(st.rule || "SAMPLE RULE 00").toUpperCase()} // ${dtg(t)}`;
  }
  function body() {
    let why = st.why || "";
    if (st.more) why += (why ? " " : "") + "Other rules that apply: " + st.more + ".";
    if (st.kind === "Corrected Copy" && st.change) why += (why ? " " : "") + "CORRECTION: " + st.change;
    return [["SUBJECT", subject()], ["WHO", st.who], ["WHAT, WHEN, WHERE", st.whatd || st.what], ["WHY", why]];
  }

  // ---------------- validation per step
  function check(s) {
    collect();
    if (s === 0) {
      if (st.sa) return alertBox("op-alert0", "<b>Not an OPREP-3.</b> Sexual assaults and other sexually based crimes are reported under DAFI 90-6001, not through OPREP-3 channels.", true), false;
      if (!st.what || st.what.length < 8) return alertBox("op-alert0", "Add a one-line summary. Send what you know now; it can be filled in later.", true), false;
      const notes = [];
      if (st.rd) notes.push("<b>Restricted Data:</b> do not put it on the chat or reporting tool. Report by secure voice or SIPRNET email.");
      if (st.outage) notes.push("<b>Systems down:</b> send by other appropriate classified means, then enter the report in the reporting tool once it is back.");
      alertBox("op-alert0", notes.join("<br>"), false); return true;
    }
    if (s === 1) {
      if (st.exercise && st.cat === "P") { st.cat = "WP"; renderCats(); }
      if (!st.cat) return alertBox("op-alert0", "", false), (alert1("Pick a category, or answer the questions from the top."), false);
      return true;
    }
    if (s === 2) {
      if (!st.why) return alertBox("op-alert2", "The WHY section can't be empty. Even one sentence on impact and actions taken is enough for an initial.", true), false;
      if (["Follow-Up", "Final"].includes(st.kind) && !st.newonly) return alertBox("op-alert2", "Follow-ups and finals carry only new or updated information. Tick the box once you have trimmed it.", true), false;
      if (st.kind === "Corrected Copy" && !st.change) return alertBox("op-alert2", "A corrected copy must say what changed.", true), false;
      alertBox("op-alert2", "", false); return true;
    }
    if (s === 3) {
      if (!st.approve) return alertBox("op-alert3", "Release authority has to approve before it goes. In a real unit this is the commander or a delegate.", true), false;
      alertBox("op-alert3", "", false); return true;
    }
    return true;
  }
  function alert1(msg) { let a = document.querySelector("[data-step='1'] .op-alert"); if (!a) { a = document.createElement("div"); a.className = "op-alert bad"; document.querySelector("[data-step='1']").append(a); } a.hidden = false; a.textContent = msg; }

  function show() {
    document.querySelectorAll(".op-step").forEach(el => el.hidden = +el.dataset.step !== step);
    document.querySelectorAll("#op-steps li").forEach(li => { const s = +li.dataset.s; li.className = s < step ? "done" : s === step ? "now" : ""; });
    $("op-back").hidden = step === 0; $("op-next").hidden = step === 4;
    $("op-next").textContent = ["Next: pick the category", "Next: write the message", "Next: review and release", "Release the report", ""][step];
    $("op-kindhelp").textContent = KIND_HELP[$("op-kind").value] || "";
    const corr = $("op-kind").value === "Corrected Copy"; $("op-change").hidden = !corr; $("op-change-l").hidden = !corr;
    $("op-subj").textContent = subject();
    if (step === 3) $("op-preview").innerHTML = `<div class="op-mark">${esc(st.cls || "CUI")}</div>` + body().map(([k, v]) => `<p><b>${k}:</b> ${esc(v || "(none)")}</p>`).join("") + `<div class="op-mark">${esc(st.cls || "CUI")}</div>`;
    if (step === 4) renderSend();
    updateTimers();
  }
  $("op-next").onclick = () => { if (!check(step)) return; step = Math.min(4, step + 1); if (step === 4) st.released = true; show(); };
  $("op-back").onclick = () => { collect(); step = Math.max(0, step - 1); show(); };
  $("op-cancel").onclick = () => { st = null; $("op-wiz").hidden = true; $("op-empty").hidden = false; };
  $("op-kind").onchange = () => { collect(); show(); };
  ["op-rule", "op-class"].forEach(id => $(id).addEventListener("input", () => { collect(); $("op-subj").textContent = subject(); }));
  ["op-inc"].forEach(id => $(id).addEventListener("change", () => { collect(); updateTimers(); }));

  // ---------------- send step
  function renderSend() {
    const c = CATS[st.cat];
    if (st.rd) { $("op-path").innerHTML = '<div class="op-alert bad"><b>Restricted Data:</b> this report goes by secure voice or SIPRNET email only. The chat and reporting tool steps are skipped.</div>'; }
    else $("op-path").innerHTML = c.paths.map((p, i) => {
      const sent = i === 0 ? st.sentSync : st.sentAsync, can = i === 0 || (c.async && (c.asyncFrom === "incident" || st.ack));
      return `<div class="op-pathrow ${sent ? "sent" : ""}"><div><b>${i === 0 ? "1. Synchronous report" : "2. Asynchronous report"}</b><span>${esc(p)}</span></div>
        ${c.async === null && i === 1 ? '<em>Not required</em>' : sent ? `<em>Sent ${z(sent)}</em>` : `<button type="button" class="btn ${can ? "" : "op-ghost"}" data-send="${i}" ${can ? "" : "disabled"}>${i === 0 ? "Mark as sent" : can ? "Mark as sent" : "Waiting for acknowledgment"}</button>`}</div>`;
    }).join("");
    $("op-path").querySelectorAll("[data-send]").forEach(b => b.onclick = () => {
      if (b.dataset.send === "0") { st.sentSync = now(); setTimeout(() => { if (st && st.sentSync && !st.ack) { st.ack = now(); renderSend(); updateTimers(); } }, 6000); }
      else { st.sentAsync = now(); finishEvent(); }
      renderSend(); updateTimers();
    });
    let ack = "";
    if (st.sentSync && !st.ack) ack = `<p><b>Waiting for acknowledgment.</b> The watch cell or MAJCOM command center should acknowledge within 5 minutes. If they don't, call the MAJCOM command center. <span class="op-hint">(Demo: they acknowledge in a few seconds.)</span></p><button type="button" class="op-link" id="op-ackbtn">Mark acknowledged now</button>`;
    else if (st.ack) ack = `<p><b>Acknowledged at ${z(st.ack)}.</b>${c.asyncFrom === "ack" ? " The asynchronous clock starts now." : ""}</p>`;
    $("op-ackbox").innerHTML = ack;
    const ab = $("op-ackbtn"); if (ab) ab.onclick = () => { st.ack = now(); renderSend(); updateTimers(); };
    const done = st.sentSync && (st.sentAsync || c.async === null || st.rd);
    alertBox("op-alert4", done ? "<b>Report complete.</b> It's on the open events list. Send follow-ups as you learn more, and a final once things are stable." : "", false);
    if (done && !st.saved) finishEvent();
  }
  function finishEvent() {
    if (st.saved) { const e = events.find(x => x.id === st.id); if (e) { e.last = now(); saveEv(); renderBoard(); refreshViews(); } return; }
    st.saved = true;
    const kind = st.kind, rep = { kind: kind === "Upgrade" ? "Initial (upgrade)" : kind, t: now(), why: body()[3][1], who: st.who, whatd: st.whatd || st.what, cls: st.cls || "CUI", by: st.releaser, subj: subject() };
    const nid = () => Math.max(0, ...events.map(x => x.id)) + 1;
    if (st.id) {
      const e = events.find(x => x.id === st.id);
      if (kind === "Upgrade") { e.closed = true; const n = { id: nid(), unit: e.unit, cat: st.cat, what: st.what, where: st.where, inc: st.inc, kinds: ["Initial (upgrade)"], last: now(), ack: st.ack, rule: st.rule, reps: [...(e.reps || []), rep], thread: [{ from: "unit", t: now(), text: "Upgraded from report " + e.id + ".", seenW: false }] }; events.push(n); st.id = n.id; }
      else { e.kinds.push(kind); e.reps = e.reps || []; e.reps.push(rep); e.last = now(); e.ext = null; if (["Final", "Initial/Final"].includes(kind)) e.closed = true; }
    } else { const n = { id: nid(), unit: me, cat: st.cat, what: st.what, where: st.where, inc: st.inc, kinds: [kind], last: now(), ack: st.ack, rule: st.rule, reps: [rep], thread: [], closed: kind === "Initial/Final" }; events.push(n); st.id = n.id; }
    saveEv(); renderBoard(); refreshViews();
  }

  // ---------------- open an existing event
  function openEvent(id) {
    const e = events.find(x => x.id === id); if (!e) return;
    const last = (e.reps || []).slice(-1)[0] || {}; const s = blank(); Object.assign(s, { id: e.id, cat: e.cat, what: e.what, where: e.where, inc: e.inc, known: e.inc, rule: e.rule, kind: "Follow-Up", ack: e.ack, who: last.who || "", whatd: last.whatd || "" });
    openWizard(s, 2);
    alertBox("op-alert2", `Reporting on <b>${esc(e.what)}</b>. Choose Follow-Up, Final, Corrected Copy or Upgrade. For an upgrade, go back to Category and pick the higher one.`, false);
  }

  // ---------------- timers
  function updateTimers() {
    const box = $("op-timers");
    if (!st || !st.cat) { box.innerHTML = '<p class="op-hint">Clocks start once you pick a category.</p>'; return; }
    const c = CATS[st.cat], t = now(), rows = [];
    const syncDue = st.inc + c.sync * MIN;
    rows.push(["Synchronous report", st.sentSync ? null : syncDue - t, st.sentSync, `due ${z(syncDue)}`]);
    if (c.async !== null && !st.rd) {
      if (c.asyncFrom === "incident" || st.ack) { const due = (c.asyncFrom === "incident" ? st.inc : st.ack) + c.async * MIN; rows.push(["Asynchronous report", st.sentAsync ? null : due - t, st.sentAsync, `due ${z(due)}`]); }
      else rows.push(["Asynchronous report", null, null, `starts at acknowledgment, then ${c.async >= 60 ? c.async / 60 + " h" : c.async + " min"}`]);
    }
    if (st.sentSync && !st.ack) { const due = st.sentSync + 5 * MIN; rows.push(["Acknowledgment", due - t, null, "within 5 min, or call the MAJCOM command center"]); }
    box.innerHTML = rows.map(([n, left, sent, note]) => {
      const cls = sent ? "ok" : left == null ? "idle" : left < 0 ? "late" : left < 5 * MIN ? "near" : "";
      return `<div class="op-timer ${cls}"><span>${n}</span><b>${sent ? "Sent " + z(sent) : left == null ? "Not started" : left < 0 ? "Overdue " + fmtLeft(left).slice(1) : fmtLeft(left)}</b><small>${esc(note)}</small></div>`;
    }).join("");
  }

  // ---------------- training tracker sample
  const TRAIN = [["Wing commander (sample)", "Annual", "Current"], ["Vice wing commander (sample)", "Initial within 60 days", "Due in 12 days"], ["First sergeant, sample squadron", "Annual", "Overdue"], ["First sergeant, sample group", "Initial within 60 days", "Current"]];
  $("op-train").innerHTML = TRAIN.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td><td class="${c === "Overdue" ? "late" : c.startsWith("Due") ? "near" : "ok"}">${esc(c)}</td></tr>`).join("");

  // ---------------- views
  let view = "unit";
  function setView(v) {
    view = v;
    document.querySelectorAll(".op-modes [data-view]").forEach(b => b.setAttribute("aria-selected", b.dataset.view === v));
    ["unit", "search", "watch"].forEach(x => $("op-view-" + x).hidden = x !== v);
    $("op-unitchip").hidden = v === "watch";
    refreshViews();
  }
  document.querySelectorAll(".op-modes [data-view]").forEach(b => b.onclick = () => setView(b.dataset.view));
  function refreshViews() { if (view === "search") runSearch(); if (view === "watch") renderWatch(); if (openId) renderDetail(); }

  // ---------------- unit profile
  function renderUnit() { $("op-unitname").textContent = unitOf(me).name; }
  let editing = null;
  function fillUnitForm(u) {
    editing = u ? u.id : null;
    $("du-pick").innerHTML = units.map(x => `<option value="${x.id}" ${x.id === me ? "selected" : ""}>${esc(x.name)}</option>`).join("");
    $("du-cmd").innerHTML = CMDS.map(c => `<option>${c}</option>`).join("");
    const x = u || { name: "", inst: "", cmd: "ACC", office: "", phone: "", email: "", rel: [] };
    $("du-name").value = x.name; $("du-inst").value = x.inst; $("du-cmd").value = x.cmd; $("du-office").value = x.office; $("du-phone").value = x.phone; $("du-email").value = x.email; $("du-rel").value = x.rel.join("\n");
    $("du-h").textContent = u ? "Unit profile" : "Create a unit profile"; $("du-ok").textContent = "";
  }
  $("op-unitchip").onclick = () => { fillUnitForm(unitOf(me)); $("d-unit").showModal(); };
  $("du-pick").onchange = () => { me = $("du-pick").value; saveUnits(); fillUnitForm(unitOf(me)); renderUnit(); renderBoard(); refreshViews(); $("du-ok").textContent = "Switched to " + unitOf(me).name + "."; };
  $("du-new").onclick = () => fillUnitForm(null);
  $("du-close").onclick = () => $("d-unit").close();
  $("du-save").onclick = () => {
    const ok = $("du-ok"), name = $("du-name").value.trim(), rel = $("du-rel").value.split("\n").map(s => s.trim()).filter(Boolean);
    if (name.length < 4) { ok.className = "op-ok bad"; ok.textContent = "Give the unit a name."; return; }
    if (!rel.length) { ok.className = "op-ok bad"; ok.textContent = "Add at least one release authority (for example: Wing commander)."; return; }
    const data = { name, inst: $("du-inst").value.trim() || "Sample installation", cmd: $("du-cmd").value, office: $("du-office").value.trim(), phone: $("du-phone").value.trim(), email: $("du-email").value.trim(), rel };
    if (editing) Object.assign(unitOf(editing), data);
    else { const id = "u" + (Math.max(0, ...units.map(u => +u.id.slice(1))) + 1); units.push({ id, ...data }); me = id; editing = id; }
    saveUnits(); renderUnit(); renderBoard(); refreshViews(); fillUnitForm(unitOf(me));
    ok.className = "op-ok"; ok.textContent = "Saved. You're signed in as " + unitOf(me).name + ".";
  };

  // ---------------- search
  function fillSearch() {
    const keep = id => $(id).value;
    const u = keep("sf-unit"), c = keep("sf-cmd"), k = keep("sf-cat");
    $("sf-cat").innerHTML = '<option value="">Any category</option>' + Object.entries(CATS).map(([k2, c2]) => `<option value="${k2}">${esc(c2.n)}</option>`).join("");
    $("sf-unit").innerHTML = '<option value="">Any unit</option>' + units.map(x => `<option value="${x.id}">${esc(x.name)}</option>`).join("");
    $("sf-cmd").innerHTML = '<option value="">Any command</option>' + CMDS.map(x => `<option>${x}</option>`).join("");
    $("sf-unit").value = u; $("sf-cmd").value = c; $("sf-cat").value = k;
  }
  function matches(e, f) {
    const u = unitOf(e.unit);
    if (f.cat && e.cat !== f.cat) return false;
    if (f.kind && !e.kinds.some(k => k.startsWith(f.kind))) return false;
    if (f.unit && e.unit !== f.unit) return false;
    if (f.cmd && u.cmd !== f.cmd) return false;
    if (f.status === "open" && e.closed) return false;
    if (f.status === "closed" && !e.closed) return false;
    if (f.from && e.inc < Date.parse(f.from + "T00:00:00Z")) return false;
    if (f.to && e.inc > Date.parse(f.to + "T23:59:59Z")) return false;
    if (f.q) { const hay = [e.what, e.where, e.rule, u.name, u.inst, u.cmd, CATS[e.cat].n, ...(e.reps || []).map(r => r.why + " " + r.who + " " + r.whatd)].join(" ").toLowerCase(); if (!f.q.toLowerCase().split(/\s+/).every(w => hay.includes(w))) return false; }
    return true;
  }
  function card(e, mode) {
    const c = CATS[e.cat], u = unitOf(e.unit), d = new Date(e.inc).toISOString().slice(0, 10), nw = mode === "watch" ? unreadW(e) : unreadU(e);
    return `<button type="button" class="op-res" data-id="${e.id}"><span class="op-row2"><span class="op-pill op-l${c.lvl}">${esc(c.s)}</span><span class="op-status ${e.closed ? "closed" : "open"}">${e.closed ? "Closed" : "Open"}</span>${!e.ack && !e.closed ? '<span class="op-wait">Awaiting acknowledgment</span>' : ""}${nw ? `<span class="op-new">${nw} new message${nw === 1 ? "" : "s"}</span>` : ""}</span>
      <b>${esc(e.what)}</b><small>${esc(u.name)}, ${esc(u.cmd)}. Incident ${d} ${z(e.inc).slice(0, 5)}Z. ${esc(e.kinds.join(", "))}.</small></button>`;
  }
  function runSearch() {
    fillSearch();
    const f = { q: $("sf-q").value.trim(), cat: $("sf-cat").value, kind: $("sf-kind").value, unit: $("sf-unit").value, cmd: $("sf-cmd").value, status: $("sf-status").value, from: $("sf-from").value, to: $("sf-to").value };
    const list = events.filter(e => matches(e, f)).sort((a, b) => b.inc - a.inc);
    $("sf-count").textContent = list.length + " report" + (list.length === 1 ? "" : "s") + " found";
    $("sf-results").innerHTML = list.map(e => card(e, "search")).join("") || '<p class="op-hint">Nothing matches. Try clearing a filter.</p>';
    $("sf-results").querySelectorAll(".op-res").forEach(b => b.onclick = () => showEvent(+b.dataset.id, "search"));
  }
  ["sf-q", "sf-cat", "sf-kind", "sf-unit", "sf-cmd", "sf-status", "sf-from", "sf-to"].forEach(id => $(id).addEventListener("input", runSearch));
  $("sf-clear").onclick = () => { ["sf-q", "sf-cat", "sf-kind", "sf-unit", "sf-cmd", "sf-status", "sf-from", "sf-to"].forEach(id => $(id).value = ""); runSearch(); };

  // ---------------- AFSWC watch
  let wf = "all";
  function renderWatch() {
    const open = events.filter(e => !e.closed), t = now();
    const needAck = open.filter(e => !e.ack), replies = events.filter(e => unreadW(e)), auto = open.filter(e => autoLeft(e) <= 0);
    const closed7 = events.filter(e => e.closed && t - e.last < 7 * DAY);
    $("w-kpis").innerHTML = [["Needs acknowledgment", needAck.length, needAck.length ? "late" : ""], ["Open reports", open.length, ""], ["Unit replies to read", replies.length, replies.length ? "near" : ""], ["Automatic final due", auto.length, auto.length ? "near" : ""], ["Closed in 7 days", closed7.length, "ok"]]
      .map(([n, v, c]) => `<div class="op-kpi ${c}"><b>${v}</b><span>${n}</span></div>`).join("");
    const sel = { all: events, ack: needAck, open, reply: replies, auto, closed: events.filter(e => e.closed) }[wf];
    const order = e => (!e.ack && !e.closed ? 0 : unreadW(e) ? 1 : autoLeft(e) <= 0 && !e.closed ? 2 : e.closed ? 4 : 3);
    $("w-queue").innerHTML = sel.slice().sort((a, b) => order(a) - order(b) || b.last - a.last).map(e => card(e, "watch")).join("") || '<p class="op-hint">Queue is clear.</p>';
    $("w-queue").querySelectorAll(".op-res").forEach(b => b.onclick = () => showEvent(+b.dataset.id, "watch"));
  }
  document.querySelectorAll("#w-chips .op-chip").forEach(b => b.onclick = () => { wf = b.dataset.w; document.querySelectorAll("#w-chips .op-chip").forEach(x => x.setAttribute("aria-pressed", x === b)); renderWatch(); });

  // ---------------- report detail (shared by unit, search and watch)
  let openId = null, openMode = "unit";
  function showEvent(id, mode) { openId = id; openMode = mode; renderDetail(); if (!$("d-ev").open) $("d-ev").showModal(); }
  function renderDetail() {
    const e = events.find(x => x.id === openId); if (!e) return;
    const c = CATS[e.cat], u = unitOf(e.unit), watch = openMode === "watch", mine = e.unit === me;
    (e.thread || []).forEach(m => { if (watch && m.from === "unit") m.seenW = true; if (!watch && mine && m.from === "watch") m.seenU = true; });
    saveEv();
    $("de-pill").className = "op-pill op-l" + c.lvl; $("de-pill").textContent = c.s;
    $("de-status").className = "op-status " + (e.closed ? "closed" : "open"); $("de-status").textContent = e.closed ? "Closed" : e.ack ? "Open, acknowledged " + z(e.ack).slice(0, 5) + "Z" : "Open, awaiting acknowledgment";
    $("de-h").textContent = e.what;
    $("de-meta").textContent = `${u.name} (${u.office || "office not set"}), ${u.cmd}. ${u.phone ? "Call back: " + u.phone + ". " : ""}Incident ${new Date(e.inc).toISOString().slice(0, 10)} ${z(e.inc).slice(0, 5)}Z at ${e.where || "location not given"}. ${e.rule || ""}`;
    $("de-reports").innerHTML = (e.reps || []).map(r => `<article class="op-rep"><div class="op-rephead"><b>${esc(r.kind)}</b><span>${new Date(r.t).toISOString().slice(0, 10)} ${z(r.t).slice(0, 5)}Z${r.by ? ", released by " + esc(r.by) : ""}</span></div>${r.subj ? `<code>${esc(r.subj)}</code>` : ""}<p><b>WHO:</b> ${esc(r.who || "")}</p>${r.whatd ? `<p><b>WHAT, WHEN, WHERE:</b> ${esc(r.whatd)}</p>` : ""}<p><b>WHY:</b> ${esc(r.why || "")}</p></article>`).join("");
    $("de-thread").innerHTML = (e.thread || []).length ? e.thread.map(m => `<div class="op-msg ${m.from}"><span>${m.from === "watch" ? "AFSWC" + (m.type ? ", " + esc(m.type) : "") : esc(u.name)}, ${z(m.t).slice(0, 5)}Z</span><p>${esc(m.text)}</p></div>`).join("") : '<p class="op-hint">No messages yet.</p>';
    $("de-thread").scrollTop = 1e6;
    $("de-type-row").hidden = !watch; $("de-msg-l").textContent = watch ? "Message to " + u.name : "Reply to AFSWC";
    $("de-reply").hidden = !watch && !mine; $("de-ok").textContent = "";
    $("de-wactions").hidden = !watch; $("de-uactions").hidden = watch || !mine || e.closed;
    if (watch) {
      $("de-ack").hidden = !!e.ack || e.closed; $("de-extend").hidden = e.closed; $("de-closeev").hidden = e.closed;
      $("de-extend").textContent = autoLeft(e) <= 0 ? "Extend 7 days (automatic final due)" : "Extend 7 days";
      $("de-cat").innerHTML = Object.entries(CATS).map(([k, x]) => `<option value="${k}" ${k === e.cat ? "selected" : ""}>${esc(x.n)}</option>`).join("");
    }
  }
  const post = (e, m) => { e.thread = e.thread || []; e.thread.push({ t: now(), ...m }); saveEv(); renderDetail(); renderBoard(); refreshViews(); };
  $("de-close").onclick = () => { $("d-ev").close(); openId = null; };
  $("d-ev").addEventListener("click", ev => { if (ev.target === $("d-ev")) { $("d-ev").close(); openId = null; } });
  $("de-reply").addEventListener("submit", ev => {
    ev.preventDefault(); const e = events.find(x => x.id === openId), txt = $("de-msg").value.trim();
    if (txt.length < 3) { $("de-ok").className = "op-ok bad"; $("de-ok").textContent = "Write a message first."; return; }
    if (openMode === "watch") post(e, { from: "watch", type: $("de-type").value, text: txt, seenU: false });
    else post(e, { from: "unit", text: txt, seenW: false });
    $("de-msg").value = ""; $("de-ok").className = "op-ok"; $("de-ok").textContent = "Sent.";
  });
  $("de-ack").onclick = () => { const e = events.find(x => x.id === openId); e.ack = now(); post(e, { from: "watch", type: "Note", text: "Acknowledged.", seenU: false }); };
  $("de-extend").onclick = () => { const e = events.find(x => x.id === openId); e.ext = now() + 7 * DAY; post(e, { from: "watch", type: "Note", text: "Report extended 7 days. Send a follow-up or final when you have more.", seenU: false }); };
  $("de-closeev").onclick = () => { const e = events.find(x => x.id === openId); e.closed = true; e.kinds.push("Closed by AFSWC"); post(e, { from: "watch", type: "Note", text: "Report closed by the watch cell.", seenU: false }); };
  $("de-recat").onclick = () => {
    const e = events.find(x => x.id === openId), to = $("de-cat").value, why = $("de-why").value.trim();
    if (to === e.cat) return;
    if (why.length < 4) { $("de-why").focus(); $("de-why").placeholder = "Add a short reason first"; return; }
    const from = CATS[e.cat].s; e.cat = to; $("de-why").value = "";
    post(e, { from: "watch", type: "Guidance", text: `Category changed from ${from} to ${CATS[to].s}: ${why}`, seenU: false });
  };
  $("de-follow").onclick = () => { $("d-ev").close(); const id = openId; openId = null; setView("unit"); openEvent(id); $("op-wiz").scrollIntoView({ behavior: "smooth", block: "start" }); };

  // ---------------- clock, buttons, reset
  const tick = () => { const d = new Date(); $("op-zulu").textContent = d.toISOString().slice(11, 19) + "Z"; $("op-zulu2").textContent = d.toISOString().slice(11, 16) + "Z"; $("op-date").textContent = d.toISOString().slice(0, 10) + " UTC"; if (st) updateTimers(); };
  setInterval(tick, 1000); tick();
  const trySample = () => { const s = blank(); Object.assign(s, { what: "Sample: government vehicle struck a light cart on the ramp, two Airmen hurt", where: "Sample Air Force Base, main ramp", who: "Two Airmen from a sample maintenance squadron", whatd: "At " + z(s.inc).slice(0, 5).replace(":", "") + "Z a government vehicle struck a light cart near the sample ramp.", why: "Both Airmen taken to the base clinic; injuries not life-threatening. Area cordoned off and a safety investigation started. Next update when the clinic reports.", rule: "Sample rule 00" }); openWizard(s, 0); $("op-wiz").scrollIntoView({ behavior: "smooth", block: "start" }); };
  $("op-try").onclick = $("op-try2").onclick = trySample;
  $("op-new").onclick = $("op-new2").onclick = () => { openWizard(blank(), 0); $("op-wiz").scrollIntoView({ behavior: "smooth", block: "start" }); };
  $("op-reset").onclick = () => { try { ["oprep-demo.v2", "oprep-demo.units", "oprep-demo.me"].forEach(k => localStorage.removeItem(k)); } catch { } events = EV(); units = UNITS0.map(u => ({ ...u, rel: u.rel.slice() })); me = "u1"; st = null; $("op-wiz").hidden = true; $("op-empty").hidden = false; saveEv(); saveUnits(); renderUnit(); renderBoard(); refreshViews(); };
  renderUnit(); renderBoard(); updateTimers();
})();
</script>"""


def build(page, write, href, accent_css, root):
    """Called from build.py. Writes /demo/oprep/ when OPREP_DEMO is on."""
    if not OPREP_DEMO:
        return
    import hashlib, os
    with open(os.path.join(root, "assets", "oprep.css"), "rb") as f:
        v = hashlib.sha1(f.read()).hexdigest()[:10]
    css = href(HERE, "assets").replace("index.html", "") + "oprep.css?v=" + v
    doc = page(HERE, "Report Desk · concept demo", BODY + SCRIPT, None,
               "Concept demo of an operational reporting workflow.")
    doc = doc.replace("</head>", f'<meta name="robots" content="noindex, nofollow">\n<link rel="stylesheet" href="{css}">\n'
                      + accent_css(ACCENT) + "\n</head>", 1)
    write(HERE, doc)
