"""Build the Hitherto Prayer Quilt pages under /hitherto/quilt/ (called from build.py).

Sources live in quilt/: app.js, core.js, review.js, config.js, quilt.css, pages/*.md, og.png.
Scripts and styles are copied into a content-hashed folder so a deploy never mixes old and new modules.
"""
import hashlib
import html
import os
import shutil

import markdown

E = html.escape
# Flip to True at the Hitherto app launch: removes noindex and adds the quilt to the sitemap.
QUILT_PUBLIC = False
PUBLISH_DATE = "October 17, 2026"
FONTS = ("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500"
         "&family=Manrope:wght@400;500;600&display=swap")
ASSET_FILES = ["app.js", "core.js", "review.js", "config.js", "quilt.css"]
BASE = "hitherto/quilt"
SITE = "https://graybearstudio.com/hitherto/quilt/"


def _hash(src):
    h = hashlib.sha1()
    for n in ASSET_FILES:
        with open(os.path.join(src, n), "rb") as f:
            h.update(f.read())
    return h.hexdigest()[:10]


def _shell(rel, title, body, desc, assets, script=None, robots=None):
    up = "../" * rel.count("/") + ("../" if rel else "")
    root = up or "./"
    noindex = '<meta name="robots" content="noindex">' if (robots or not QUILT_PUBLIC) else ""
    js = f'<script type="module" src="{up}{assets}/{script}"></script>' if script else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
{noindex}
<meta property="og:title" content="Hitherto Prayer Quilt">
<meta property="og:description" content="A public place to pray together.">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}{rel + '/' if rel else ''}">
<meta property="og:image" content="{SITE}og.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F7F2E8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#151310" media="(prefers-color-scheme: dark)">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{up}{assets}/quilt.css">
</head>
<body>
<header class="qtop"><div class="wrap">
<a class="qmark" href="{root}"><b>Hitherto Prayer Quilt</b><span>A public place to pray together</span></a>
<nav class="qnav" aria-label="Quilt"><a href="{root}">Today</a><a href="{up}guidelines/">Guidelines</a><a href="{up}remove/">Remove a square</a></nav>
</div></header>
<main class="wrap">
{body}
</main>
<footer class="qfoot"><div class="wrap">
<div class="funnel">
<p>Keep your own prayers privately in <a href="{up}../"><b>Hitherto</b></a>, the prayer journal that remembers how God carried you.</p>
<p>The quilt is separate from the Hitherto app. The app never sends it anything.</p>
</div>
<nav aria-label="Quilt links"><a href="{up}guidelines/">Guidelines</a><a href="{up}privacy/">Privacy</a><a href="{up}terms/">Terms</a><a href="{up}remove/">Remove a square</a><a href="mailto:hitherto@graybearstudio.com">hitherto@graybearstudio.com</a></nav>
<p class="verse">"Carry one another's burdens." Galatians 6:2, BSB</p>
<p>A GrayBear Studio project.</p>
</div></footer>
{js}
</body>
</html>
"""


def _md(src, name):
    with open(os.path.join(src, "pages", name + ".md"), encoding="utf-8") as f:
        return markdown.markdown(f.read().replace("{DATE}", PUBLISH_DATE))


MAIN = """
<header>
<h1 id="title">Today's quilt</h1>
<p class="date" id="date"></p>
<p class="sub">Every square is a prayer someone added today. Zoom out to see the whole quilt and the pattern stitched across it. Zoom in to read a square and tie a knot when you pray for it.</p>
<div class="stats" id="stats" aria-live="polite"></div>
</header>

<div class="toolbar">
<input class="search" id="q" type="search" placeholder="Search prayers or initials" aria-label="Search prayers or initials">
<button class="link" type="button" id="search-all">Search all days</button>
<button class="chip" type="button" id="listview" aria-pressed="false">Read as a list</button>
<button class="chip" type="button" id="share-quilt" data-label="Share">Share</button>
<button class="chip" type="button" id="save-img">Save as image</button>
</div>
<div id="all-results" hidden aria-live="polite"></div>

<div class="stage" id="stage">
<canvas id="quilt" tabindex="0" role="img" aria-label="Today's prayer quilt. Drag to move, pinch or scroll to zoom, tap a square to read it. For a text version, choose Read as a list."></canvas>
<div class="tools">
<button type="button" id="zin" aria-label="Zoom in">+</button>
<button type="button" id="zout" aria-label="Zoom out">&minus;</button>
<button type="button" id="zall" aria-label="Show the whole quilt">Whole</button>
<button type="button" id="mine" aria-label="Find my square" hidden>Mine</button>
</div>
<div class="hint" id="hint">Drag to move · pinch or scroll to zoom · double-click to zoom in · tap a square to read it</div>
<div class="state" id="state" hidden></div>
</div>
<div id="list" hidden aria-live="polite"></div>

<section class="card" id="card" hidden aria-live="polite" aria-label="The selected square">
<svg class="knot-anim" id="knot-anim" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 30 C14 30 12 10 22 12 C30 14 28 26 20 24 C14 22 18 14 26 14 C32 14 34 20 36 22"/><circle cx="21" cy="19" r="3.2" fill="currentColor" stroke="none"/></svg>
<span class="eyebrow" id="c-label">A square</span>
<p class="prayer" id="c-text"></p>
<span class="meta" id="c-meta"></span>
<span class="code" id="c-code"></span>
<div class="row">
<button class="btn" type="button" id="knot">Tie a knot</button>
<button class="btn quiet" type="button" id="share-sq" data-label="Share">Share</button>
<button class="link" type="button" id="report">Report</button>
<button class="link" type="button" id="remove" hidden>Remove my square</button>
</div>
<p class="note">A knot means "I prayed for this." Nobody sees who tied it.</p>
<div class="reportbox" id="reportbox" hidden>
<fieldset><legend>What's wrong with this square?</legend>
<label><input type="radio" name="why" value="private" checked> Private information</label>
<label><input type="radio" name="why" value="unkind"> Unkind or inappropriate</label>
<label><input type="radio" name="why" value="spam"> Spam or advertising</label>
<label><input type="radio" name="why" value="other"> Something else</label>
</fieldset>
<div class="row"><button class="btn small" type="button" id="report-send">Send report</button><button class="link" type="button" id="report-cancel">Cancel</button></div>
</div>
<p class="flash" id="c-flash" hidden></p>
</section>

<div class="grid2">
<section aria-labelledby="add-h">
<h2 id="add-h">Add your square</h2>
<p class="flash" id="closed" hidden>This quilt is finished. You can still read it and tie knots. <a href="./">Go to today's quilt</a>.</p>
<form id="add-form" novalidate>
<label class="f" for="ptext">Your prayer</label>
<textarea id="ptext" maxlength="280" placeholder="For M., starting treatment on Monday. For peace and good doctors."></textarea>
<div class="counter" id="count" aria-live="polite">0 / 280</div>
<label class="f" for="pinit">Initials (optional)</label>
<input id="pinit" type="text" maxlength="6" placeholder="D.B." autocomplete="off" autocapitalize="characters">
<fieldset class="fabrics" id="fabrics"><legend>Choose a fabric</legend></fieldset>
<label class="check"><input type="checkbox" id="consent"> <span>I understand this square will be public. I've used first names or initials only, and I have permission to share someone else's situation.</span></label>
<p><button class="link" type="button" id="guidelines-btn" aria-expanded="false" aria-controls="guidelines">Read the quilt guidelines</button></p>
<div class="guidelines" id="guidelines" hidden>{GUIDELINES}</div>
<div class="namecheck" id="namecheck" hidden>
<p class="note">This looks like it might include someone's full name. Please use first names or initials only.</p>
<div class="row"><button class="btn small" type="button" id="name-edit">Edit my square</button><button class="btn small quiet" type="button" id="name-review">Sew it for review</button></div>
</div>
<p class="crisis" id="crisis" tabindex="-1" hidden>We're really glad you wrote this down. Because the quilt is public, we can't post this square. If you are thinking about ending your life or might be in danger, please reach out now to someone you trust and to a crisis line where you live. In the U.S. and Canada, you can call or text 988. If you might act on these thoughts, call your local emergency number. You can still add a square that asks others to pray for you, using first names or initials only.</p>
<button class="btn" type="submit" id="sew">Sew my square</button>
<p class="flash" id="flash" hidden role="status"></p>
<p class="note">Squares can only be added to today's quilt. Past quilts stay open to read and pray over.</p>
</form>
</section>
<section aria-labelledby="past-h">
<h2 id="past-h">Past quilts</h2>
<p class="note" style="margin-bottom:12px">Every day is kept. Tap a day to see its quilt.</p>
<div class="days" id="days"></div>
</section>
</div>
"""

REVIEW = """
<h1>Quilt review</h1>
<p class="note">For GrayBear Studio only. <span id="who"></span></p>
<div class="row"><button class="btn" id="signin" type="button">Sign in with Google</button><button class="link" id="signout" type="button" hidden>Sign out</button></div>
<p class="flash" id="msg" hidden></p>
<div id="panel" hidden>
<section class="rv-section"><h2>Held for review (<span id="held-count">0</span>)</h2><ul class="rlist" id="held"></ul></section>
<section class="rv-section"><h2>A day</h2>
<div class="row"><label class="f" for="day">Date</label><input type="date" id="day"> <span class="note" id="day-label"></span></div>
<ul class="rv-totals" id="totals"></ul>
<h3>Hidden by reports</h3><ul class="rlist" id="hidden"></ul>
<h3>Other reported squares</h3><ul class="rlist" id="reported"></ul>
<details><summary>Every square on this day</summary><ul class="rlist" id="all"></ul></details>
<p><button class="btn small quiet" id="clear-day" type="button">Clear this whole day (test squares only)</button></p>
</section>
<section class="rv-section"><h2>Remove by code</h2>
<form id="code-form" class="row"><input type="text" id="code" maxlength="6" placeholder="K7Q2RM" style="max-width:10rem" aria-label="Square code"><button class="btn small" type="submit">Find and remove</button></form>
</section>
</div>
"""


def build_quilt(dist, root):
    src = os.path.join(root, "quilt")
    out = os.path.join(dist, BASE)
    v = "assets-" + _hash(src)
    os.makedirs(os.path.join(out, v), exist_ok=True)
    for n in ASSET_FILES:
        shutil.copy(os.path.join(src, n), os.path.join(out, v, n))
    if os.path.exists(os.path.join(src, "og.png")):
        shutil.copy(os.path.join(src, "og.png"), os.path.join(out, "og.png"))

    def write(rel, doc):
        d = os.path.join(out, rel)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(doc)

    desc = ("A public place to pray together. Add a prayer as one square on today's quilt, "
            "and tie a knot when you pray for someone else's.")
    write("", _shell("", "Hitherto Prayer Quilt", MAIN.replace("{GUIDELINES}", _md(src, "guidelines")), desc, v, "app.js"))
    docs = [("guidelines", "Quilt guidelines", "The guidelines for squares on the Hitherto Prayer Quilt."),
            ("privacy", "Hitherto Prayer Quilt Privacy Notice", "How the Hitherto Prayer Quilt handles information."),
            ("terms", "Hitherto Prayer Quilt Terms", "The terms for adding squares and tying knots on the Hitherto Prayer Quilt."),
            ("remove", "Remove a square", "How to remove a square from the Hitherto Prayer Quilt.")]
    for slug, title, d in docs:
        body = f'<article class="doc"><h1>{E(title)}</h1>{_md(src, slug)}</article>'
        write(slug, _shell(slug, title + " · Hitherto Prayer Quilt", body, d, v))
    write("review", _shell("review", "Quilt review", REVIEW, "", v, "review.js", robots="noindex"))
    return [SITE] + [SITE + s + "/" for s, _, _ in docs] if QUILT_PUBLIC else []
