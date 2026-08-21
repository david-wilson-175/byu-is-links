# byu-is-links: agent guide

A QR code landing page for BYU Information Systems recruiting. Static, no build step, deployed to Vercel from `main`. Done means: a student scans a printed code, sees a handful of tappable buttons, and taps one.

## Map

| Path | Purpose |
|---|---|
| `public/links.json` | The content. Everything on the page comes from here. |
| `public/index.html` | Page shell plus the `<template>` for one button. Carries the structure contract comment. |
| `public/app.js` | Reads `links.json`, clones the template per link. Rarely needs edits. |
| `public/styles.css` | Appearance. Owned by the Claude Design project. |
| `scripts/validate-links.mjs` | Pre-deploy guard. Runs in CI on every push. |
| `EDITING-LINKS.md` | Student-employee guide. Keep it non-technical. |
| `DESIGN-BRIEF.md` | Constraints for the design project, including the structure contract. |
| `_internal/status/worklog.md` | Jarvis tracking. Gitignored, never ships. |

## Rules

- Start every session by reading the top of `_internal/status/worklog.md`.
- Close every session by appending a worklog entry (format: jarvis/standards/worklog-standard.md).
- No emdashes in any writing. Concise, direct.
- **The printed QR code freezes the URL forever.** Never change the production domain once codes are printed. Change content behind it instead.
- **Content changes go in `links.json`, not in HTML.** The whole point is that a non-technical student can edit it from the GitHub web UI.
- **Never break the structure contract** documented at the top of `index.html` and in `DESIGN-BRIEF.md`. Removing `#links` or `#link-template` renders the page blank.
- **No external runtime dependencies.** No CDN fonts, no analytics, no third-party scripts. Must paint instantly on bad conference wifi.
- Run `node scripts/validate-links.mjs` after touching `links.json`.
- Keep `EDITING-LINKS.md` readable by someone who has never used git. If a change makes editing harder, it is the wrong change.
- Eight visible links maximum. More means scrolling, and nobody scrolls a page they scanned at a booth.

## Current focus

Scaffold is in place with placeholder links. Two things block launch: the real destination URLs, and the custom domain. The domain must be live and the QR generated against it before the recruiting poster goes to print for Marriott Night on 2026-09-09.

Design work happens in a linked Claude Design project against `DESIGN-BRIEF.md`.
