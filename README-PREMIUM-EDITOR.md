# Premium Article Editor

The Articles page now includes a simplified two-step editor, responsive theme-compatible UI, word and reading-time counts, password visibility toggle and animated success confirmation.

## Important
Success is displayed **only after** `/publish` returns HTTP success containing `ok: true` and an article `id`. An incorrect password or misconfigured Worker shows an error in the password dialog, not a success tick. The admin password is verified by Cloudflare Worker and must never be hardcoded in browser code. Follow `SETUP-GITHUB.md` to enable public publishing.

Existing portfolio, six themes, article listing and GitHub/Worker backend are unchanged.
