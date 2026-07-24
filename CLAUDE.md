# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A two-page static marketing website for the "Agentic SDLC / Self-Driving Codebase" concept. No build system, no package manager, no framework — plain HTML files with all CSS and JavaScript inline.

## Development

Open either file directly in a browser; no server required.

```bash
open index.html        # main landing page
open one-pager.html    # executive brief
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

### `index.html` sections (in order, keyed by `id=`)

`#problem` → `#shift` → `#principles` → `#advantage` → `#architecture` → swarm (no id) → `#governance` → `#roadmap` → `#cta`

## Design system

All design tokens are CSS custom properties defined in `:root` of each file. The two files share the same token names but define them independently (no shared stylesheet).

- **Primary color**: `#7640FF` (purple), variants via `--primary`, `--primary-dark`, `--primary-soft`, `--primary-glow`
- **Neutral scale**: `--slate-50` through `--slate-900`
- **Fonts**: Space Grotesk (headings, `--font-display`), Inter (body, `--font-body`), JetBrains Mono (code, `--font-mono`) — all loaded from Google Fonts
- **Button style**: sharp edges (no `border-radius`); variants `.btn--primary`, `.btn--outline`, `.btn--ghost`
- **Reveal animation**: elements with `.reveal` class animate in via IntersectionObserver (defined at bottom of `index.html`)

## Positioning / messaging constraints

- Cloud-agnostic: do not hard-code any single cloud provider's product names
- No partner branding in the pages themselves (AWS partner credential was removed per git history)
- Tone: direct, IT-practitioner language — not sales-speak
