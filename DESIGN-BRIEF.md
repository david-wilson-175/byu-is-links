# Design brief

For the linked Claude Design project. The goal is a beautiful, fast, phone-first link page. Reference point: [linktr.ee/s/templates](https://linktr.ee/s/templates).

## Context

Students scan a QR code on a poster or flyer at a crowded recruiting fair, glance at their phone for a few seconds, and tap one thing. That is the whole interaction. It happens standing up, one-handed, in a noisy room, often on a mediocre connection.

So: **fast, obvious, thumb-friendly.** A gorgeous page that takes three seconds to paint has already lost.

## The structure contract

Restyle anything. Rearrange anything. But these hooks must survive, or the page renders blank. `app.js` fills the page from `links.json` at load.

| Hook | Role |
|---|---|
| `[data-page-title]` | Text set from `links.json` `title` |
| `[data-tagline]` | Text set from `links.json` `tagline` |
| `#links` | Container the buttons are appended into |
| `#link-template` | A `<template>` cloned once per link |
| `[data-footer]` | Text set from `links.json` `footer.text` |

Inside `#link-template`, per link: the `<a>` receives `href`, `[data-title]` receives the title, `[data-subtitle]` receives the subtitle.

Two states to style, both already in the CSS:

- `.link.is-placeholder` for links whose URL is still `#`. Must read as clearly unfinished.
- `[aria-disabled="true"]` is set on those same anchors.

The button markup inside the template can change freely. Add wrappers, icons, whatever, as long as the `data-` attributes stay somewhere inside.

## Brand palette

Sampled from the official lockup and the approved recruiting poster, so the page and the printed materials match.

| Role | Hex |
|---|---|
| Brand navy | `#19315B` |
| Deep navy | `#08122D` |
| Mid blue | `#376293` |
| Cyan accent | `#9FE9ED` |
| Grey | `#7D8990` |
| Pale blue-grey | `#CCD6E0` |
| White | `#FFFFFF` |

The cyan is the only accent. It carries emphasis and nothing else dilutes it.

The lockup in `public/assets/is-lockup.png` is navy on transparent, so it needs inverting on a dark field. The current CSS does this with a filter. Do not redraw or recolor the lockup itself; it is the official mark.

## Requirements

- **Phone-first.** Design at 390px wide and work up. Desktop is a rounding error here.
- **Tap targets 44px minimum**, ideally 60px. People tap while walking.
- **No scrolling for up to 8 links** on a typical phone, including the header.
- **Respect safe areas.** `env(safe-area-inset-*)` for notches and home indicators.
- **Contrast at AA or better.** This gets read outdoors and under bad fluorescent light.
- **Visible focus states.** Keyboard and switch users included.
- **Honor `prefers-reduced-motion`.**
- **Self-contained.** No CDN fonts, no external stylesheets, no analytics scripts. System fonts or inlined assets only. It has to paint instantly on conference wifi.

## Tone

Confident, modern, technically credible, optimistic. It should feel of a piece with the recruiting poster: navy field, restraint, one bright accent.

Worth avoiding, carried over from the poster work: visual clutter, neon cyberpunk styling, generic corporate stock imagery, and anything that makes Information Systems look like a less technical business major.

## Nice to have

- A subtle entrance animation on the buttons, motion-preference aware.
- A considered empty state, in case every link is disabled.
- Something better than a plain list for hierarchy, given the first link matters most. A larger primary button is one option.

## Out of scope

Analytics, forms, and email capture. Those live behind the links, not on this page.
