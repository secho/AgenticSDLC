# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A static marketing website for the "Agentic SDLC / Self-Driving Codebase" concept. No build system, no package manager, no framework — plain HTML files with page-specific CSS and JavaScript inline. The one shared component is the top navigation (`nav.js`).

## Development

Open any file directly in a browser; no server required.

```bash
open index.html                # main landing page
open one-pager.html            # executive brief
open platform-landscape.html   # AI SDLC platform comparison
open method.html               # the legacy stored-procedure method
```

For a local HTTP server if needed:
```bash
python3 -m http.server 8080
```

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Full landing page with nav, animations, and all sections |
| `one-pager.html` | Printable executive brief linked from the landing page |
| `platform-landscape.html` | Comparison of third-party AI SDLC platforms, linked from nav. Two halves: agents/control planes (JetBrains Central, Port.io, Factory.ai, Devin, Copilot, …) and the layers underneath them (`#stack` — LiteLLM, OpenRouter, Portkey, E2B, Daytona, Langfuse, LangSmith, Braintrust, CodeRabbit, Greptile, Moderne). Ends with two analysis figures: the **Secho Quadrant** (`#quadrant`, independence × surface area) and **Secho's Eye Cycle** (`#eye-cycle`, a hype curve over techniques, not vendors). |
| `method.html` | Scrollytelling explainer for paying down a legacy stored-procedure estate, linked from nav |
| `method-brief.html` | **Technical** companion to `method.html`, in the `one-pager.html` style — states the equivalence criterion formally, tabulates the non-determinism/normalisation taxonomy, analyses the classifier and correlated-failure failure modes, and carries a references list. Written for a rigorous reader, not a skimmer. |
| `method-brief.pdf` | Generated from `method-brief.html` — the downloadable offered in `#resources` and the Resources menu |
| `nav.js` | Shared top navigation — injected into every page. Single source of truth for the menu. |

### Regenerating `method-brief.pdf`

It is a build artifact of `method-brief.html`, not a hand-edited file. After changing the brief, serve the site and re-render it — it must be served over HTTP, not `file://`, or the Google Fonts and `nav.js` will not load:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --virtual-time-budget=12000 --no-pdf-header-footer --print-to-pdf="$PWD/method-brief.pdf" "http://localhost:8080/method-brief.html"
```

Print layout is controlled by `@page` plus the `@media print` block at the end of the brief's `<style>`. Keep `break-inside: avoid` on the individual blocks (`.stage`, `.pivot`, `.metric-box`, `.funnel`, `.artifact`) rather than on `.section` — avoiding breaks on whole sections leaves half-empty pages.

### `index.html` sections (in order, keyed by `id=`)

`#problem` → `#shift` → `#principles` → `#advantage` → `#architecture` → swarm (no id) → `#governance` → `#roadmap` → `#resources` → `#cta`

`#resources` is the download hub — the nav's "Resources → All resources" entry points at it.

### `method.html` sections (in order, keyed by `id=`)

`#pivot` → `#triage` → `#spec` → `#oracle` → `#baseline` → `#diff` → `#implement` → `#verdict` → `#limits` → `#metric`

The seven stage ids after `#pivot` are also the sticky progress rail's link targets — renaming one means editing the rail's `<li data-stage="…">` entries too.

This page carries two tokens the other pages do not: `--match` / `--match-ink` (agreement, the `═` glyph) and `--differ` / `--differ-ink` (difference, the `≠` glyph). They are the page's only new colours; everything else comes from the shared tokens.

Its figures are one continuous artefact — a dark terminal-style panel reusing `index.html`'s `.terminal` treatment — that changes state across the stages. Two rules keep it robust: **every figure's resting CSS is its end state** (motion is added by a `.play` class an `IntersectionObserver` adds once and never removes, inside a `@media (prefers-reduced-motion: no-preference)` block), so JS-off and reduced-motion both render the final frame; and `.stage-inner` shares an element with `.container`, so it must only ever set `padding-top`/`padding-bottom` longhand — a `padding` shorthand there wipes out the container's side gutters.

## Navigation (`nav.js`)

The top nav is a shared component, not inline per page. Each page includes `<script src="nav.js" defer></script>` right after `<body>`; the script injects its own `<style>`, the `<nav>` markup, and a `.nav-spacer` at the top of `<body>`, then wires up dropdowns + the mobile hamburger drawer.

- **To add/rename/reorder a menu item, edit the `NAV` array (and `CTA`) at the top of `nav.js` only** — every page updates automatically. A top-level entry is either `{label, href}` or `{label, dropdown:[{label,href}, …]}`. A dropdown child may add `download: true` to emit `<a download>` so the file saves instead of opening (used for `method-brief.pdf`).
- Active-state highlighting is derived from the current filename; index sections live under the "The Approach" dropdown as `index.html#…` anchors.
- `nav.js` hard-codes its easing (no dependence on a page-level `--ease` token) but otherwise relies on the shared `--primary` / `--slate-*` / `--font-*` tokens each page defines in `:root`. It hides itself in `@media print` so the one-pager stays printable.

## Design system

All design tokens are CSS custom properties defined in `:root` of each HTML file. The pages share the same token names but define them independently (no shared stylesheet); `nav.js` consumes these tokens, so keep them consistent across pages.

- **Primary color**: `#7640FF` (purple), variants via `--primary`, `--primary-dark`, `--primary-soft`, `--primary-glow`
- **Neutral scale**: `--slate-50` through `--slate-900`
- **Fonts**: Space Grotesk (headings, `--font-display`), Inter (body, `--font-body`), JetBrains Mono (code, `--font-mono`) — all loaded from Google Fonts
- **Button style**: sharp edges (no `border-radius`); variants `.btn--primary`, `.btn--outline`, `.btn--ghost`
- **Reveal animation**: elements with `.reveal` class animate in via IntersectionObserver (defined at bottom of `index.html`)

## Positioning / messaging constraints

- Cloud-agnostic: do not hard-code any single cloud provider's product names when describing *this site's own* architecture. This doesn't apply to `platform-landscape.html`, which factually names real third-party products for comparison.
- No partner branding of any cloud provider in the pages
- Tone: direct, IT-practitioner language — not sales-speak
