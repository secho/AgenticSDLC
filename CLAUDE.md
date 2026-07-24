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
| `platform-landscape.html` | Comparison of third-party AI SDLC platforms (JetBrains Central, Port.io, Factory.ai, Devin, Copilot, etc.), linked from nav |
| `nav.js` | Shared top navigation — injected into every page. Single source of truth for the menu. |

### `index.html` sections (in order, keyed by `id=`)

`#problem` → `#shift` → `#principles` → `#advantage` → `#architecture` → swarm (no id) → `#governance` → `#roadmap` → `#cta`

## Navigation (`nav.js`)

The top nav is a shared component, not inline per page. Each page includes `<script src="nav.js" defer></script>` right after `<body>`; the script injects its own `<style>`, the `<nav>` markup, and a `.nav-spacer` at the top of `<body>`, then wires up dropdowns + the mobile hamburger drawer.

- **To add/rename/reorder a menu item, edit the `NAV` array (and `CTA`) at the top of `nav.js` only** — every page updates automatically. A top-level entry is either `{label, href}` or `{label, dropdown:[{label,href}, …]}`.
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
