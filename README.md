# graybearstudio.com

Static site for GrayBear Studio.

- `content/apps.py` — one entry per app (add an app here).
- `content/<slug>/privacy.md`, `support.md` — per-app policy and FAQ.
- `assets/site.css` — shared styles.
- `python3 build.py` builds the site into `dist/` (requires `pip install markdown`).
- Deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.
