# Manual customization

1. Place your logo in `images/branding/` and update the corresponding image `src` in `index.html`.
2. Put a portrait in `images/` and adjust the hero portrait path used in `index.html`.
3. Put your work thumbnails in `images/projects/`; replace demo photo URLs.
4. Put showreel clips in `videos/`, then replace the showreel placeholder with a local HTML `<video controls>` element referencing e.g. `videos/showreel.mp4`.
5. Edit `css/style.css` to update color themes, card styles or animations.
6. Edit `js/main.js` for theme/navigation/project behaviors, and `js/complaints.js` for the complaint preview experience.
7. Replace social platform home-page links with actual accounts and set your contact email.
8. Test both narrow mobile viewports and desktop before publishing.

This is static frontend code; for server-side storage of complaints or uploads you will need a separate backend.
