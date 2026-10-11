# Aleena Khan – GitHub Publishing Edition

Original portfolio look is retained. Added server-verified admin publishing to GitHub via Cloudflare Worker; public articles across devices without a database. The articles remain text-only, with professional date/time display, search, categories, and links.

**Start with `SETUP-GITHUB.md`**. This is not a pure HTML-only publishing feature; secure writes require the Cloudflare Worker. Keep all credentials in Worker secrets, NOT in public files.

Files: `index.html`, `articles.html`, `article.html`, `article-admin.html` (redirect), `js/github-articles.js`, `js/config.js`, `cloudflare-worker/src/index.js`, `cloudflare-worker/wrangler.toml`, `data/articles.json`.
