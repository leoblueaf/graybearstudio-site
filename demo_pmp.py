"""PMP Reasoning Web: an unlisted concept demo of the iOS app as a website (David, 18 Oct 2026).

Built at /demo/pmp/ as a standalone full-screen app page (not the studio frame), styled with the
app's own AppColors tokens and DM Sans. noindex, not in the sitemap, linked from nowhere.
Content: 8 mindset rules, 89 glossary terms, 11 approach sections and 12 sample questions taken
from the app's seed data (demo_pmp_data.json, HTML-escaped). Page template: demo_pmp.html.
To take it down: set PMP_DEMO = False.
"""
PMP_DEMO = True
HERE = "demo/pmp"


def build(page, write, href, accent_css, root):
    if not PMP_DEMO:
        return
    import os
    with open(os.path.join(root, "demo_pmp.html"), encoding="utf-8") as f:
        doc = f.read()
    with open(os.path.join(root, "demo_pmp_data.json"), encoding="utf-8") as f:
        data = f.read().replace("</", "<\\/")
    write(HERE, doc.replace("__DATA__", data, 1))
