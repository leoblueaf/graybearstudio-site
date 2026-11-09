"""Hitherto Advent landing page: /hitherto/advent/ (requested by the Hitherto chat, 9 Nov 2026).

ADVENT_PUBLIC = False  -> page is built but noindex and left out of the sitemap and the /hitherto/ link (preview).
ADVENT_PUBLIC = True   -> indexed, in the sitemap, linked from the /hitherto/ Advent feature.
After 25 Dec set AFTER_SEASON = True to switch the lead to "Advent returns ...".
"""
import html

ADVENT_PUBLIC = False
AFTER_SEASON = False

E = html.escape
STORE = "https://apps.apple.com/app/id6819012177"
URL = "https://graybearstudio.com/hitherto/advent/"
IMG = "https://graybearstudio.com/assets/hitherto/hitherto_advent_web_1920x1080.jpg"
TITLE = "Advent with Hitherto: a reading and prayer for each day"
DESC = ("A short Scripture reading and prayer for each day of Advent, from November 29 to Christmas, "
        "in Hitherto: Prayer Journal for iPhone. The first three days are free.")
ALT = "An open Bible beside a lit candle, with pine and red berries, on burgundy velvet."

LEAD = ("A short Scripture reading and prayer for each day from November 29 to Christmas, "
        "in Hitherto: Prayer Journal for iPhone.")
LEAD_AFTER = "Advent returns on the first Sunday of Advent."
PARA = ("Advent is a season of waiting and making room. Hitherto gives each day of it a few quiet minutes with "
        "Scripture and prayer, from the first Sunday of Advent to Christmas Day.")
HOW = [
    "Advent begins on Sunday, November 29 and ends on Christmas Day.",
    "Each day brings a short Scripture reading and a prayer. It follows the calendar, so you can join on any day.",
    "The first three days of Advent are free. The rest of Advent comes with Hitherto Premium.",
    "Keep a prayer list alongside it, and mark prayers answered in Remembrance, a lasting timeline of how God has met you.",
    "No account and no tracking. Everything stays on your iPhone.",
]

STYLE = """<style>
.adv-hero{position:relative;border-bottom:1px solid var(--line);background:#2a0a0f;overflow:hidden}
.adv-hero picture,.adv-hero img{display:block;width:100%;height:100%}
.adv-hero img{object-fit:cover;aspect-ratio:16/9;max-height:78vh}
.adv-hero .over{position:absolute;inset:auto 0 0 0;padding:3rem 0 2.25rem;
  background:linear-gradient(to top,rgba(20,4,8,.88),rgba(20,4,8,.55) 55%,rgba(20,4,8,0))}
.adv-hero h1{color:#F6EEDF;font-size:clamp(2.2rem,6vw,3.8rem);letter-spacing:-.01em;margin:0}
.adv-hero .tag{color:#E9D3A6;font:italic 400 clamp(1.05rem,2.3vw,1.4rem)/1.45 var(--display);margin:.8rem 0 0;max-width:38ch}
.adv-how{margin:1rem 0 0;padding:0;list-style:none;display:grid;gap:.75rem}
.adv-how li{padding:.9rem 1rem;border:1px solid var(--line);border-radius:8px;background:var(--surface)}
.adv-cta{display:flex;flex-direction:column;align-items:flex-start;gap:.6rem;margin-top:.5rem}
.adv-store{display:inline-flex;align-items:center;gap:.6rem;background:#000;color:#fff;text-decoration:none;
  border:1px solid #a6a6a6;border-radius:10px;padding:.55rem 1.1rem .6rem;line-height:1.1}
.adv-store small{display:block;font:500 .7rem/1 var(--body);letter-spacing:.02em}
.adv-store b{display:block;font:600 1.25rem/1.1 var(--body);letter-spacing:-.01em}
.adv-store:hover{opacity:.9}
@media (max-width:640px){.adv-hero img{aspect-ratio:9/16;max-height:none}.adv-hero .over{padding-top:4rem}}
</style>"""


def build_advent(page, write, href, accent_css, apps):
    a = next(x for x in apps if x["slug"] == "hitherto")
    here = "hitherto/advent"
    img_l = href(here, "assets/hitherto").rstrip("/").replace("/index.html", "")
    if img_l.endswith("index.html"):
        img_l = img_l[: -len("index.html")]
    img_l = img_l.rstrip("/") + "/"
    how = "".join(f"<li>{E(x)}</li>" for x in HOW)
    lead = LEAD_AFTER if AFTER_SEASON else LEAD
    body = f"""{STYLE}
<section class="adv-hero">
<picture>
<source media="(max-width: 640px)" srcset="{img_l}hitherto_advent_web_1080x1920.jpg">
<img src="{img_l}hitherto_advent_web_1920x1080.jpg" alt="{E(ALT)}" width="1920" height="1080">
</picture>
<div class="over"><div class="wrap col">
<h1>Your Advent, Day by Day</h1>
<p class="tag">{E(lead)}</p>
</div></div>
</section>
<section class="section"><div class="wrap col lede"><p>{E(PARA)}</p></div></section>
<section class="section"><div class="wrap col"><h2>How it works</h2><ul class="adv-how">{how}</ul></div></section>
<section class="section"><div class="wrap col">
<p>This Advent, add a prayer to the <a href="{href(here, 'hitherto/quilt')}">Hitherto Prayer Quilt</a> and pray for someone else's.</p>
</div></section>
<section class="section"><div class="wrap col"><div class="adv-cta">
<a class="adv-store" href="{STORE}" target="_blank" rel="noopener" aria-label="Download Hitherto on the App Store">
<span><small>Download on the</small><b>App Store</b></span></a>
<p class="small">Free to download. iPhone, iOS 15 or later.</p>
<p><a href="{href(here, 'hitherto')}">More about Hitherto</a></p>
</div>
<blockquote class="verse">Thus far the LORD has helped us.<cite>1 Samuel 7:12, BSB</cite></blockquote>
</div></section>"""
    doc = page(here, TITLE, body, a, DESC)
    meta = (f'<link rel="canonical" href="{URL}">\n'
            f'<meta property="og:type" content="website">\n'
            f'<meta property="og:title" content="{E(TITLE)}">\n'
            f'<meta property="og:description" content="{E(DESC)}">\n'
            f'<meta property="og:url" content="{URL}">\n'
            f'<meta property="og:image" content="{IMG}">\n'
            f'<meta property="og:image:alt" content="{E(ALT)}">\n'
            f'<meta name="twitter:card" content="summary_large_image">\n'
            f'<meta name="twitter:image" content="{IMG}">\n')
    if not ADVENT_PUBLIC:
        meta += '<meta name="robots" content="noindex">\n'
    doc = doc.replace("</head>", meta + "</head>", 1)
    write(here, doc)
    return [URL] if ADVENT_PUBLIC else []
