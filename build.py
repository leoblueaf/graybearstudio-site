#!/usr/bin/env python3
"""Build graybearstudio.com into dist/.

  python3 build.py            production build (clean URLs: /hitherto/privacy/)
  python3 build.py --preview  preview build (links end in index.html, for file/artifact previews)
"""
import html
import os
import re
import shutil
import sys

import markdown

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, "content"))
from apps import APPS, APPLE_EULA, PUBLISH_DATE  # noqa: E402

PREVIEW = "--preview" in sys.argv
DIST = os.path.join(ROOT, "dist-preview" if PREVIEW else "dist")
FONTS = ("https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;"
         "1,6..72,400&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap")
E = html.escape

BEAR = ('<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">'
        '<circle cx="8.5" cy="8.5" r="4"/><circle cx="23.5" cy="8.5" r="4"/>'
        '<path d="M5 18a11 10 0 0 1 22 0c0 6-5 10-11 10S5 24 5 18Z" fill="var(--paper)"/>'
        '<circle cx="12" cy="17" r="1.3" fill="currentColor" stroke="none"/>'
        '<circle cx="20" cy="17" r="1.3" fill="currentColor" stroke="none"/>'
        '<path d="M14 22.5c1.2 1 2.8 1 4 0"/></svg>')


def href(frm, to):
    """Relative link from directory `frm` to directory `to` (both '' = site root)."""
    up = [p for p in frm.split("/") if p]
    target = [p for p in to.split("/") if p]
    i = 0
    while i < min(len(up), len(target)) and up[i] == target[i]:
        i += 1
    rel = "../" * (len(up) - i) + "/".join(target[i:])
    if rel and not rel.endswith("/"):
        rel += "/"
    if PREVIEW:
        return rel + "index.html"
    return rel or "./"


def accent_css(app):
    if not app:
        return ""
    l1, d1 = app["accent"]
    l2, d2 = app.get("accent2", app["accent"])
    return (f"<style>:root{{--app:{l1};--app2:{l2}}}"
            f"@media (prefers-color-scheme: dark){{:root:not([data-theme=\"light\"]){{--app:{d1};--app2:{d2}}}}}"
            f":root[data-theme=\"dark\"]{{--app:{d1};--app2:{d2}}}</style>")


def page(here, title, body, app=None, description=""):
    css = href(here, "assets").replace("index.html", "") + "site.css"
    home = href(here, "")
    crumbs = ""
    if app:
        crumbs = (f'<nav class="crumbs" aria-label="Breadcrumb"><a href="{home}">All apps</a>'
                  f'<span aria-hidden="true">/</span><a href="{href(here, app["slug"])}">{E(app["name"])}</a></nav>')
    notes = "".join(f"<p class=\"notes\">{E(n)}</p>" for n in (app or {}).get("footer_notes", []))
    app_links = ""
    if app and app.get("pages"):
        s = app["slug"]
        app_links = (f'<a href="{href(here, s + "/privacy")}">Privacy</a>'
                     f'<a href="{href(here, s + "/support")}">Support</a>'
                     f'<a href="{href(here, s + "/terms")}">Terms</a>')
    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{css}">
{accent_css(app)}
</head>
<body>
<header class="top"><div class="wrap">
<a class="mark" href="{home}">{BEAR}<b>GrayBear</b><span>Studio</span></a>
{crumbs}
</div></header>
<main>
{body}
</main>
<footer class="bottom"><div class="wrap">
<span>GrayBear Studio · <a href="mailto:hello@graybearstudio.com">hello@graybearstudio.com</a></span>
<nav aria-label="Footer">{app_links}<a href="{home}">All apps</a></nav>
{notes}
</div></footer>
</body>
</html>
"""
    if PREVIEW and here == "":
        # the artifact host supplies the document skeleton for the top page
        doc = re.sub(r"<!doctype html>\s*<html[^>]*>\s*<head>\s*<meta charset[^>]*>\s*<meta name=\"viewport\"[^>]*>", "", doc)
        doc = doc.replace("</head>\n<body>", "").replace("</body>\n</html>", "")
    return doc


def write(rel_dir, content):
    d = os.path.join(DIST, rel_dir)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
        f.write(content)


def md(path):
    with open(path, encoding="utf-8") as f:
        return markdown.markdown(f.read())


def mailto(addr):
    return f'<a class="addr" href="mailto:{addr}">{addr}</a>'


def build_home():
    cards = []
    for a in APPS:
        style = f'style="--app:{a["accent"][0]}"'
        live = " live" if a["status"] == "live" else ""
        inner = (f'<div class="row"><div class="tile" aria-hidden="true">{E(a["name"][0])}</div>'
                 f'<div><h2>{E(a["name"])}</h2><div class="cat">{E(a["category"])}</div></div></div>'
                 f'<p>{E(a["tagline"])}</p>'
                 f'<div class="foot"><span class="chip{live}">{E(a["status_label"])}</span>{{go}}</div>')
        if a.get("pages"):
            link, go = href("", a["slug"]), '<span class="go">Learn more →</span>'
            ext = ""
        elif a.get("external_url"):
            link, go = a["external_url"], f'<span class="go">{E(a["external_label"])} ↗</span>'
            ext = ' target="_blank" rel="noopener"'
        else:
            link = None
        if link:
            cards.append(f'<a class="card" {style} href="{link}"{ext}>{inner.replace("{go}", go)}</a>')
        else:
            cards.append(f'<div class="card" {style}>{inner.replace("{go}", "")}</div>')
    # dark-mode accent per card (inline style carries the light accent)
    rules_light_dark = []
    for i, a in enumerate(APPS):
        sel = f".apps > :nth-child({i + 1})"
        rules_light_dark.append((sel, a["accent"][1]))
    dark_css = "<style>@media (prefers-color-scheme: dark){" + "".join(
        f':root:not([data-theme="light"]) {s}{{--app:{c} !important}}' for s, c in rules_light_dark) + "}" + "".join(
        f':root[data-theme="dark"] {s}{{--app:{c} !important}}' for s, c in rules_light_dark) + "</style>"
    body = f"""{dark_css}
<section class="wrap intro">
<p class="eyebrow">Independent apps for iPhone and iPad</p>
<h1>Small apps, each built to do one job carefully.</h1>
<p>GrayBear Studio makes focused apps for prayer, home upkeep, everyday eating, exam prep, new parents and the decisions in between. Each one says plainly what it does with your information.</p>
</section>
<section class="wrap" aria-label="Apps">
<div class="apps">
{''.join(cards)}
</div>
</section>"""
    write("", page("", "GrayBear Studio", body, description="Independent iPhone apps from GrayBear Studio."))


def build_app(a):
    s = a["slug"]
    here = s
    feats = "".join(f"<li><div><h3>{E(t)}</h3><p>{E(d)}</p></div></li>" for t, d in a["features"])
    desc = "".join(f"<p>{E(p)}</p>" for p in a["description"])
    quote = ""
    if a.get("quote"):
        q, c = a["quote"]
        quote = f'<blockquote class="verse">{E(q)}<cite>{E(c)}, BSB</cite></blockquote>'
    table = ""
    if a["price_table"]:
        rows = "".join(f'<tr><th scope="row">{E(n)}</th><td class="amt">{E(p)}</td><td class="note">{E(x)}</td></tr>'
                       for n, p, x in a["price_table"])
        table = f'<div class="tablewrap"><table class="prices"><tbody>{rows}</tbody></table></div>'
    note = f'<p class="small">{E(a["price_note"])}</p>' if a["price_note"] else ""
    disc = f'<p class="disclosure">{E(a["subscription_disclosure"])}</p>' if a.get("subscription_disclosure") else ""
    store = (f'<a class="btn" href="{E(a["store_url"])}" target="_blank" rel="noopener">View on the App Store ↗</a>'
             if a.get("store_url") else "")
    chip = f'<span class="chip">{E(a["status_label"])}</span>'
    body = f"""<section class="hero"><div class="wrap col">
<div class="row"><div class="tile" aria-hidden="true">{E(a["name"][0])}</div><p class="eyebrow" style="margin:0">{E(a["category"])} · {E(a["platform"])}</p></div>
<h1>{E(a["full_name"])}</h1>
<p class="tag">{E(a["tagline"])}</p>
<div class="meta">{store or chip}</div>
</div></section>
<section class="section"><div class="wrap col lede">{desc}{quote}</div></section>
<section class="section"><div class="wrap col"><h2>What it does</h2><ul class="features">{feats}</ul></div></section>
<section class="section"><div class="wrap col"><h2>Price</h2><p>{E(a["price_intro"])}</p><p>{E(a["price_plus"])}</p>{table}{note}{disc}</div></section>
<section class="section"><div class="wrap col"><h2>Help and policies</h2>
<div class="links">
<a href="{href(here, s + '/support')}"><b>Support</b><span>Questions and contact</span></a>
<a href="{href(here, s + '/privacy')}"><b>Privacy</b><span>What the app keeps and sends</span></a>
<a href="{href(here, s + '/terms')}"><b>Terms</b><span>License and disclaimers</span></a>
</div></div></section>"""
    write(here, page(here, a["name"], body, a, a["tagline"]))

    # Privacy
    here = f"{s}/privacy"
    pol = md(os.path.join(ROOT, "content", s, "privacy.md"))
    body = f"""<article class="doc"><div class="wrap col">
<h1>Privacy Policy</h1><p class="sub">{E(a["full_name"])}</p>
{pol}
</div></article>"""
    write(here, page(here, f'{a["name"]} Privacy Policy', body, a, f'How {a["name"]} handles your information.'))

    # Support
    here = f"{s}/support"
    raw = open(os.path.join(ROOT, "content", s, "support.md"), encoding="utf-8").read()
    faqs = []
    for block in re.split(r"^### ", raw, flags=re.M):
        block = block.strip()
        if not block:
            continue
        q, _, ans = block.partition("\n")
        faqs.append(f"<details><summary>{E(q.strip())}</summary><div class=\"ans\">{markdown.markdown(ans.strip())}</div></details>")
    notice = f'<div class="notice"><p>{E(a["support_notice"])}</p></div>' if a.get("support_notice") else ""
    body = f"""<article class="doc"><div class="wrap col">
<h1>Support</h1><p class="sub">{E(a["full_name"])}</p>
{notice}
<h2 style="margin-top:0">Common questions</h2>
{''.join(faqs)}
<div class="contact"><h2>Still need help?</h2>
<p>Email {mailto(a["email"])}. Include your iPhone model and iOS version if something is not working. We read every message.</p></div>
</div></article>"""
    write(here, page(here, f'{a["name"]} Support', body, a, f'Help with {a["name"]}.'))

    # Terms (shared template)
    here = f"{s}/terms"
    sub = ""
    if a.get("has_subscription"):
        sub = ("<h2>Purchases and subscriptions</h2><p>Purchases are made through Apple's App Store and are subject to "
               "Apple's terms. " + E(a["subscription_disclosure"]) + " Refund requests are handled by Apple.</p>")
    discl = "".join(f"<h2>{E(t)}</h2><p>{E(d)}</p>" for t, d in a["disclaimers"])
    body = f"""<article class="doc"><div class="wrap col">
<h1>Terms of Use</h1><p class="sub">{E(a["full_name"])} · Last updated {PUBLISH_DATE}</p>
<p>{E(a["name"])} is published by GrayBear Studio. The app is licensed to you, not sold.</p>
<h2>License</h2>
<p>Your use of {E(a["name"])} is governed by Apple's <a href="{APPLE_EULA}" target="_blank" rel="noopener">Licensed Application End User License Agreement</a> (the standard EULA). GrayBear Studio is the licensor named in that agreement. The points below add to it and do not replace it.</p>
{sub}
{discl}
<h2>Privacy</h2>
<p>How the app handles your information is described in the <a href="{href(here, s + '/privacy')}">{E(a["name"])} Privacy Policy</a>.</p>
<h2>Changes</h2>
<p>If these terms change, we will update the date above and post the new version on this page.</p>
<h2>Contact</h2>
<p>{mailto(a["email"])}</p>
</div></article>"""
    write(here, page(here, f'{a["name"]} Terms', body, a, f'Terms of use for {a["name"]}.'))


def build_404():
    body = """<section class="wrap intro"><p class="eyebrow">404</p><h1>That page isn't here.</h1>
<p>It may have moved. Every GrayBear Studio app is listed on the home page.</p>
<p><a href="/">Go to all apps</a></p></section>"""
    os.makedirs(DIST, exist_ok=True)
    with open(os.path.join(DIST, "404.html"), "w", encoding="utf-8") as f:
        f.write(page("", "Page not found", body))


def main():
    shutil.rmtree(DIST, ignore_errors=True)
    os.makedirs(DIST)
    shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(DIST, "assets"))
    build_home()
    for a in APPS:
        if a.get("pages"):
            build_app(a)
    if not PREVIEW:
        build_404()
        with open(os.path.join(DIST, "CNAME"), "w") as f:
            f.write("graybearstudio.com\n")
        open(os.path.join(DIST, ".nojekyll"), "w").close()
    n = sum(len(fs) for _, _, fs in os.walk(DIST))
    print(f"built {n} files into {os.path.relpath(DIST, ROOT)}")


if __name__ == "__main__":
    main()
