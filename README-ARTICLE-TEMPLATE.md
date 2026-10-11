# Premium Article Studio template

This edition refines only the article composer in `articles.html`. All six portfolio themes, the existing navbar, category/search, password dialog, success dialog, GitHub/Cloudflare publishing integration and public article reading page remain in place.

The visual overrides are stored in `css/article-studio.css`. Editor markup still uses the same JavaScript IDs (`postTitle`, `postCategory`, `quickPostText`, `quickPostButton`, `postFeedback`, etc.), so the existing publishing flow is preserved.

**Deployment**: Upload the complete website folder to your static host. Secure online publishing still requires configuring the GitHub repository and Cloudflare Worker secrets in `SETUP-GITHUB.md`. Do not put a secret token or password directly in client JavaScript.
