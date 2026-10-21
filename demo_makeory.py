"""Makeory: an unlisted, interactive concept demo of a create-make-sell platform (David, 21 Oct 2026).

Static single-page app under /demo/makeory/. noindex, not in the sitemap, linked from nowhere.
Source lives in makeory/ (index.html, mk.css, mk-core.js, mk-app.js, mk-editors.js). Every page that can
be addressed without an id gets its own index.html copy; id routes (/explore/<slug>, /studio/projects/<id>/...)
are served by the site 404 page, which hands the path back to the app (see build_404 in build.py).
All payments, quotes, manufacturer orders and payouts are simulated in the browser.
To take it down: set MAKEORY_DEMO = False.
"""
MAKEORY_DEMO = True
HERE = "demo/makeory"
STATIC_ROUTES = ["", "explore", "create", "studio", "studio/earnings", "studio/new/games", "studio/new/books",
                 "studio/new/apparel", "studio/new/objects", "checkout", "orders", "manufacturers", "how-it-works",
                 "about", "terms", "privacy"]
FALLBACK_SCRIPT = ("<script>(function(){var p=location.pathname;if(p.indexOf('/demo/makeory/')===0){"
                   "location.replace('/demo/makeory/?r='+encodeURIComponent(p+location.search+location.hash));}})();</script>")


def build(page, write, href, accent_css, root):
    if not MAKEORY_DEMO:
        return
    import hashlib, os, shutil
    src = os.path.join(root, "makeory")
    files = ["mk.css", "mk-core.js", "mk-app.js", "mk-editors.js"]
    h = hashlib.sha1()
    for f in files:
        with open(os.path.join(src, f), "rb") as fh:
            h.update(fh.read())
    v = h.hexdigest()[:10]
    with open(os.path.join(src, "index.html"), encoding="utf-8") as fh:
        doc = fh.read().replace("__BASE__", "/" + HERE).replace("__V__", v)
    for r in STATIC_ROUTES:
        write(HERE + ("/" + r if r else ""), doc)
    # write() has already created dist/demo/makeory; find it via the first route
    import build as _b  # noqa: the running build module
    dist = os.path.join(_b.DIST, HERE, "assets")
    os.makedirs(dist, exist_ok=True)
    for f in files:
        shutil.copy(os.path.join(src, f), os.path.join(dist, f))
