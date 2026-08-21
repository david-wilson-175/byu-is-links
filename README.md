# byu-is-links

A QR code landing page for BYU Information Systems recruiting. Students scan a code on a poster, flyer, or table card and land on a short list of tappable buttons: join AIS, upcoming events, explore the major, get on the email list.

**Just need to change a link?** Read [EDITING-LINKS.md](EDITING-LINKS.md) and ignore the rest of this file.

## Why this exists

Recruiting materials get printed, and **a printed QR code freezes its destination URL forever.** So the destination has to be a URL we control, with content we can change behind it, indefinitely. That single requirement drives every decision here.

It also has to be editable by student officers and employees with no build tools and no local setup, which is why the content lives in one JSON file editable from the GitHub web UI.

Prior approaches that failed: Box links (expire), the BYU web request queue (too slow, too many hands), and shared Google Docs.

## How it works

There is no framework and no build step. Three files do everything.

```
public/
  index.html    page shell, plus a <template> for one button
  links.json    THE CONTENT. Everything on the page comes from here
  app.js        reads links.json, clones the template once per link
  styles.css    appearance
  assets/       the official BYU IS lockup
```

Open `public/index.html` in a browser and it works. Push to `main` and Vercel publishes it in about 20 seconds.

### The data flow

`links.json` -> `app.js` -> clones `#link-template` -> appends into `#links`

Anyone restyling the page must keep the hooks listed in the structure contract comment at the top of `index.html`. They are also documented in [DESIGN-BRIEF.md](DESIGN-BRIEF.md).

### Why JSON instead of editing HTML

Student employees update this a few times a semester. A malformed JSON file fails a check and gets rejected; malformed HTML silently renders a broken page. The tradeoff is that the page needs JavaScript, which is fine for a phone-scanned link page.

## Safety net

`.github/workflows/validate-links.yml` runs `scripts/validate-links.mjs` on every push and pull request. It checks that the JSON parses, that each link has a title and a usable URL, that `enabled` is a real boolean, and that the list is not empty.

**A failed check means the live site keeps serving the last good version.** A bad edit cannot take the page down.

Run it locally with:

```bash
node scripts/validate-links.mjs
```

## Local preview

```bash
cd public && python3 -m http.server 8000
```

Then open <http://localhost:8000>. A plain server is required because `app.js` fetches `links.json`, which browsers block over `file://`.

## Deployment

| | |
|---|---|
| Host | Vercel, free Hobby tier |
| Trigger | Every push to `main` |
| Build | None. `vercel.json` serves `public/` as static files |
| Domain | **isbyu.link** (registered at Hover, DNS stays at Hover) |
| Project | `byu-is-links` under `david-wilson-175s-projects` |

### DNS

DNS is kept at Hover rather than delegated to Vercel, so the registrar stays the single source of truth and a future host change is a two-record edit.

| Type | Host | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| A | `www` | `76.76.21.21` |

Vercel issues the TLS certificate automatically once those resolve. Check status with:

```bash
vercel domains inspect isbyu.link
dig +short isbyu.link
```

`vercel.json` sets `Cache-Control: max-age=0` on `links.json` specifically, so edits show up immediately instead of being cached on phones for hours. Assets under `/assets/` are cached hard by contrast, for a year.

Note that `vercel.json` rejects unknown keys, so it cannot carry `//` comments. Document changes to it here instead.

### First-time setup

Already done. For reference, or to rebuild from scratch:

1. Import this repo at [vercel.com/new](https://vercel.com/new). Framework preset: **Other**. No build command.
2. Add `isbyu.link` and `www.isbyu.link` under Project Settings, Domains.
3. At Hover, set the DNS records Vercel specifies.
4. Generate the QR code against **https://isbyu.link**, never the `.vercel.app` address, so the printed code survives a future host change.

**The `.vercel.app` URL is a staging address. It must never appear on anything printed.**

## Design

Layout and visual design are developed in a linked Claude Design project. See [DESIGN-BRIEF.md](DESIGN-BRIEF.md) for the brand palette, the constraints, and the structure contract a redesign must not break.

## Reuse

This is deliberately generic. Any committee or club needing a QR destination can fork it, replace `links.json` and the lockup in `public/assets/`, and deploy. It was built for the student recruiting committee but is not specific to it.

## Related

- Recruiting committee project: `~/Library/CloudStorage/Dropbox/agent-sync/committee-work/student-recruiting-committee`
- The poster whose QR code points here: that project's `poster-design-plan.md`
