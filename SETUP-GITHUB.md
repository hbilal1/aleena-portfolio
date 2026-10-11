# Aleena Khan – GitHub publishing without a database

This is a **static GitHub Pages website** with a **Cloudflare Worker** handling admin password verification and GitHub API writes. Articles are stored as JSON in your GitHub repo (`data/articles.json`) – no MySQL or database needed. No GitHub token or admin password is placed in publicly accessible website files.

## 1. Create GitHub repository

1. Create a GitHub repository, e.g. `aleena-portfolio`.
2. Upload the **contents** of the website folder (index.html, articles.html, css, js, data, etc.), **NOT** a nested folder.
3. Turn on **Settings → Pages → Deploy from a branch → main / (root)**. Your site should have a URL such as `https://YOURNAME.github.io/aleena-portfolio/`. Wait for GitHub Pages publishing.
4. Verify that `data/articles.json` exists in the `main` branch and contains `[]` initially.

## 2. GitHub fine-grained access token

Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens. Select **only your portfolio repository**, and grant **Contents: Read and write** permission. Keep it secret. It is used only by Cloudflare Worker secrets, never in the site's frontend code.

## 3. Cloudflare Worker

1. Create a free Cloudflare account, install Node.js on your computer and run `npm install -g wrangler` (or use `npx wrangler`).
2. In a terminal, enter the `cloudflare-worker` directory.
3. Open `wrangler.toml` and replace the placeholder values:
   - `SITE_ORIGIN`: **origin ONLY**, e.g. `https://YOURNAME.github.io` (NO trailing slash or `/aleena-portfolio`). Custom domains are also supported.
   - `GITHUB_OWNER`: your GitHub username or organization.
   - `GITHUB_REPO`: repository name.
   - `GITHUB_BRANCH`: generally `main`.
4. Run `npx wrangler login` and then:

```
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put SESSION_SECRET
npx wrangler deploy
```

Use a **strong unique password** for ADMIN_PASSWORD, your fine-grained GitHub token for GITHUB_TOKEN, and a random long value for SESSION_SECRET. Choose a different secret for the session, such as 64 random characters. Cloudflare prompts for each value; no secret is committed to GitHub. The `npx wrangler secret put` commands may create the Worker before the final deploy.

5. Copy the deployed URL such as `https://aleena-articles-api.YOUR-SUBDOMAIN.workers.dev`.
6. In the WEBSITE `js/config.js`, set `window.ALEENA_ARTICLES_API` to this exact Worker URL, without trailing slash. Commit changes, then wait for GitHub Pages to update.

## 4. Publish articles

Visit `https://YOURNAME.github.io/aleena-portfolio/articles.html`, type your admin password in Admin Login. Compose a headline and text (paragraphs supported), click Publish Article, enter admin password **again for every publication**. Worker verifies BOTH the signed 4-hour session token and admin password on every publish, and GitHub stores the new article permanently in `data/articles.json`.

The public listing and reading page request the latest posts from the Worker. Other devices can view them as soon as GitHub commits succeed; your website stays hosted as static files.

## Security notes / limitations

- Demo password `ALEENA2026` is **NOT used** here. Set your own strong password in Worker secrets.
- Never put ADMIN_PASSWORD, GITHUB_TOKEN or SESSION_SECRET in `js/config.js`, HTML, GitHub source or browser localStorage.
- Worker checks your exact public site Origin, HTTPS is essential, and sessions stay in browser memory only. Admin must log in again after reload.
- Origin restrictions are NOT an authentication substitute. Authentication and publish passwords are validated server-side.
- This starter does not include IP-based rate limiting or multiple admins; before large public use, enable Cloudflare rate limiting / bot mitigation for `/login` and `/publish` and protect your Worker account with MFA.
- Keep a backup of `data/articles.json` and secure GitHub with MFA. GitHub API has limits; public reads of /articles use a GitHub API request.
- If GitHub reports a concurrent-write conflict, retry publishing after refreshing. The Worker never stores content in a database.
- Editing and deleting posts are not included in this version; manage older JSON records carefully through GitHub with backups.
- **No live Worker has been deployed by this package.** Set up GitHub and Cloudflare before online publishing works.
