# Write First → Password → Publish

Open `articles.html`: everyone can type a title, choose a category, and compose an article. Clicking **Publish Article** opens a password modal. The Cloudflare Worker verifies ADMIN_PASSWORD on every POST /publish and commits articles to GitHub `data/articles.json`. There is no upfront login. Incorrect password cannot publish. Published writing is visible via /articles on any device after the site and Worker are deployed.

## Setup
Follow SETUP-GITHUB.md, set `js/config.js` to the deployed Worker URL, configure SITE_ORIGIN for your exact website origin, and add ADMIN_PASSWORD and GITHUB_TOKEN as Worker secrets. A sample password in HTML/JS would NOT be secure. Do not upload credentials in website files.

On a local `file://` webpage, the Worker cannot accept the origin. Test on an allowed hosted domain; update Worker SITE_ORIGIN when switching hosting. No database is used. The GitHub repository is the article store. This is not a pure browser-only system: an online Worker and GitHub configuration are required. The public editor allows writing to anybody; only a correct password can publish. The Worker should have rate limiting configured on public production deployments to mitigate password guessing.
