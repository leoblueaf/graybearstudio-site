"""DraftHawk signal test page (unlisted, noindex, out of the sitemap).

Published at /demo/drafthawk-test/ for David's Phase 0 test (17 Nov 2026).
The page is copied unchanged from demo_drafthawk.html (source:
claude/drafthawk/web_test.html in the Project). It analyses microphone audio
in the browser only; nothing is recorded or sent.
To take it down: set DRAFTHAWK_DEMO = False.
"""
import os
import shutil

DRAFTHAWK_DEMO = True


def build(page, write, href, accent_css, root):
    if not DRAFTHAWK_DEMO:
        return
    out = os.path.join(root, "dist", "demo", "drafthawk-test")
    os.makedirs(out, exist_ok=True)
    shutil.copyfile(os.path.join(root, "demo_drafthawk.html"), os.path.join(out, "index.html"))
