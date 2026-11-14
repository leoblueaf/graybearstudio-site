"""Post 778 hub: an unlisted prototype of a veterans post web app (David, 14 Nov 2026), for his father's post in Trenton, IL.

Standalone page (no studio header or footer) at /demo/post778/. noindex, not in the sitemap, linked from nowhere,
sample data only. Source page: demo_post778.html. To take it down: set POST778_DEMO = False.
"""
POST778_DEMO = True
HERE = "demo/post778"


def build(page, write, href, accent_css, root):
    if not POST778_DEMO:
        return
    import os
    with open(os.path.join(root, "demo_post778.html"), encoding="utf-8") as f:
        doc = f.read()
    assert 'name="robots" content="noindex' in doc
    write(HERE, doc)
