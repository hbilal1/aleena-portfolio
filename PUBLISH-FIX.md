# Publish button / password dialog fix

Open `articles.html`, enter a title and some story text, then click **Publish My Article**. The password popup now opens consistently even if content is incomplete. Validation errors are displayed inside the popup rather than being lost below the long editor. Press Cancel to go back to editing. A green success tick shows only after the deployed publishing API confirms the post.

**Important:** For posting to work publicly, deploy your Cloudflare Worker and set `window.ALEENA_ARTICLES_API` in `js/config.js` to the Worker URL. Without that setup the dialog will open but Publish Now will report a setup error. A password typed into an unconfigured static site cannot publish to GitHub. See `SETUP-GITHUB.md`.
