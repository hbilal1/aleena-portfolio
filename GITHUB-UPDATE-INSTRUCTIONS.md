# Update guide — Aleena Khan Portfolio

1. Upload updated website files to your existing GitHub repository `hbilal1/aleena-portfolio` on the `main` branch. Keep the existing `data/articles.json` (contains live published articles); **do not overwrite it** with an older local copy. Keep existing public `js/config.js` with your Worker URL.
2. Update the deployed Cloudflare Worker from `cloudflare-worker/src/index.js` via Cloudflare dashboard > Edit code > Deploy. Without the new Worker code, Edit and Delete will not work. Your Cloudflare environment variables/secrets remain unchanged.
3. GitHub Pages redeploys. Reload page, click Admin login on Articles page; authenticate once to show Edit/Delete. Delete requires typing DELETE.
4. NEW badge appears for articles published in last 7 days. Footer credit appears on homepage, articles list, and reader.
5. Note: Cloudflare dashboard code and this repository file can differ; always explicitly deploy the updated Worker.
