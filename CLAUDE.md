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
| `platform-landscape.html` | Comparison of third-party AI SDLC platforms, linked from nav. Two halves: agents/control planes (JetBrains Central, Port.io, Factory.ai, Devin, Copilot, …) and the layers underneath them (`#stack` — LiteLLM, Bifrost, OpenRouter, Portkey, E2B, Daytona, Langfuse, LangSmith, Braintrust, CodeRabbit, Greptile, Moderne). Then a head-to-head (`#gateway-head-to-head`) comparing **Bifrost vs LiteLLM**, which takes apart Bifrost's "50× faster" claim: the benchmark is credible (open-sourced suite, third-party reproduction) but measured against mocked endpoints, and the arithmetic shows gateway overhead is ~0.005% of a real agentic request. Ends with two analysis figures: the **Secho Quadrant** (`#quadrant`, independence × surface area, 23 platforms) and **Secho's Eye Cycle** (`#eye-cycle`, a hype curve over techniques, not vendors).<br><br>The page body is split into `.page--top` (hero) and `.page--rest` so the second-level nav can sit full-bleed between them.<br><br>Every vendor name — in both tables and in the profile `<h3>`s — links out to the product page or GitHub repo via `.vlink`, which inherits the surrounding colour with a hairline underline and only turns purple on hover, so the first table column does not become a wall of links. Links open in a new tab (`target="_blank" rel="noopener"`) so a reader mid-comparison does not lose their place. Verify any new URL actually resolves before adding it. |
| `method.html` | Scrollytelling explainer for paying down a legacy stored-procedure estate, linked from nav |
| `method-brief.html` | **Technical** companion to `method.html`, in the `one-pager.html` style — states the equivalence criterion formally, tabulates the non-determinism/normalisation taxonomy, analyses the classifier and correlated-failure failure modes, and carries a references list. Written for a rigorous reader, not a skimmer. |
| `method-brief.pdf` | Generated from `method-brief.html` — the downloadable offered in `#resources` and the Resources menu |
| `blog.html` | Blog index — post cards, newest first. Add a card here when adding a post. |
| `blog-*.html` | One file per post. Slug is the filename: `blog-ai-spend-attribution.html`. |
| `blog.css` | **The only shared stylesheet on the site** — see below. |
| `nav.js` | Shared top navigation — injected into every page. Single source of truth for the menu. |

### The blog

`blog.css` is a deliberate exception to the "tokens inline per page" convention below: posts multiply, and duplicating ~350 lines of article CSS into each one is not maintainable. Its `:root` values are identical to every other page so `nav.js` behaves the same.

To add a post: copy an existing `blog-*.html`, change the head/meta/hero, write the body, then add a `.post-card` to `blog.html` and fix up the `.related` blocks in the neighbouring posts. There is no index generation — the list is hand-maintained, which is fine at this volume and should be revisited past ~15 posts.

Article components available in `blog.css`: `.lede`, `.pull` (pull quote), `.callout` (+ `.warn` / `.good`), `.term` (dark config block reusing `index.html`'s terminal treatment, with `.c` `.k` `.s` `.n` spans), `.takeaways`, `.operated` (the commercial block), `.related`.

**Editorial line for the `.operated` block**: sell the operation, not the software. LiteLLM is open source and the posts say so plainly; the offer is SLA-backed running of it, and every post states the honest limits (spend floor below which a gateway is not worth it, single-point-of-failure risk, metadata-not-payloads boundary). Do not write a post whose `.operated` block claims the software itself is the differentiator.

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

The seven stage ids after `#pivot` are also the second-level nav's targets — renaming one means editing the `<li data-target="…">` entries and the `NAV` dropdown in `nav.js` too.

This page carries two tokens the other pages do not: `--match` / `--match-ink` (agreement, the `═` glyph) and `--differ` / `--differ-ink` (difference, the `≠` glyph). They are the page's only new colours; everything else comes from the shared tokens.

Its figures are one continuous artefact — a dark terminal-style panel reusing `index.html`'s `.terminal` treatment — that changes state across the stages. Two rules keep it robust: **every figure's resting CSS is its end state** (motion is added by a `.play` class an `IntersectionObserver` adds once and never removes, inside a `@media (prefers-reduced-motion: no-preference)` block), so JS-off and reduced-motion both render the final frame; and `.stage-inner` shares an element with `.container`, so it must only ever set `padding-top`/`padding-bottom` longhand — a `padding` shorthand there wipes out the container's side gutters.

## Navigation (`nav.js`)

The top nav is a shared component, not inline per page. Each page includes `<script src="nav.js" defer></script>` right after `<body>`; the script injects its own `<style>`, the `<nav>` markup, and a `.nav-spacer` at the top of `<body>`, then wires up dropdowns + the mobile hamburger drawer.

- **To add/rename/reorder a menu item, edit the `NAV` array (and `CTA`) at the top of `nav.js` only** — every page updates automatically. A top-level entry is `{label, href}`, `{label, dropdown:[{label,href}, …]}`, or `{label, href, dropdown:[…]}`. The third form renders the trigger as a real `<a>` — it navigates on click and still opens the menu on hover — and is the right shape when the parent is an actual page with sections (Platform Landscape uses it). The plain `dropdown` form renders a `<button>` that cannot be clicked through to, which is correct only when there is no parent page (Resources). Items with both get `.has-link`, which skips the click-toggle so the link keeps working, and hides their children in the mobile drawer — the parent link plus that page's own sticky sub-nav covers it, and expanding all of them would make a ~30-row drawer. A dropdown child may add `download: true` to emit `<a download>` so the file saves instead of opening (used for `method-brief.pdf`). A top-level entry may add `match: '<prefix>'` to own a whole family of pages for active-state highlighting — Blog uses `match: 'blog'` so every `blog-*.html` post keeps the nav item lit.
- Active-state highlighting is derived from the current filename; index sections live under the "The Approach" dropdown as `index.html#…` anchors.
- `nav.js` hard-codes its easing (no dependence on a page-level `--ease` token) but otherwise relies on the shared `--primary` / `--slate-*` / `--font-*` tokens each page defines in `:root`. It hides itself in `@media print` so the one-pager stays printable.

### Second-level navigation

Two coordinated things, both driven from `nav.js`:

1. **A hover dropdown** on the top-level nav item, listing that page's sections.
2. **A sticky bar on the page itself** (`<nav class="subnav">`) that scroll-spies and highlights the section in view.

`index.html`, `method.html`, `platform-landscape.html` and every `blog-*.html` post have both. `nav.js` owns the `.subnav` CSS and the scroll-spy, so a page only supplies markup:

```html
<nav class="subnav" aria-label="Sections of this page">
  <div class="subnav-inner"><ol>
    <li data-target="section-id"><a href="#section-id">label</a></li>
  </ol></div>
</nav>
```

Set `data-auto="<selector>"` on the `<nav>` instead of listing items and it builds itself from the matching headings, slugifying ids where they are missing — blog posts use `data-auto=".post-body h2"` so a post never needs a hand-maintained table of contents.

Behaviour worth knowing before changing it:

- The active section is the one owning the line just below the bar, **falling back to the last section that started above it**. Without that fallback the highlight drops out in the gaps between sections and never lights the last item at page end.
- Anchor offset comes from the `--subnav-anchor` custom property (set in `nav.js` with the same breakpoint as the nav height), not from a value measured at init — a measured value freezes at whatever the viewport was when the script ran.
- Highlighting is progressive enhancement. With JS off the bar is still a working set of jump links.
- `method.html` uses this shared component; its old bespoke `.rail` is gone.

## SEO and site assets

Canonical base URL is `https://secho.github.io/AgenticSDLC` — it is hard-coded in the canonical/OG tags of every page, in `sitemap.xml`, `robots.txt` and `llms.txt`. **Moving to a custom domain means updating all of them.**

| File | Purpose |
|------|---------|
| `favicon.svg` | Master mark — a terminal prompt `>_` in white on `#7640FF`, sharp-edged to match the site. The same geometry is inlined in `nav.js` as `MARK` and shown beside the wordmark in the header; **if you change one, change both** or the header and the browser tab drift apart. |
| `favicon-32/96.png`, `apple-touch-icon.png`, `icon-512.png` | Rendered from the SVG via headless Chrome at 512, then downscaled with `sips`. Chrome will not render reliably at tiny window sizes, so never screenshot directly at 32. |
| `og-image.png` | 1200×630 social card, generated from an HTML template with headless Chrome so it uses the real site fonts. |
| `robots.txt` | Allows everything, and names AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …) explicitly rather than relying on the wildcard. |
| `sitemap.xml` | Hand-maintained. Add a `<url>` when adding a page. |
| `llms.txt` | Summary for AI agents: what each page argues, plus the positions worth citing. Keep it in sync when the argument changes, not just when pages are added. |

Every page carries canonical, Open Graph, Twitter card, keywords, theme-color, favicon links and JSON-LD (`WebSite` + `Organization` on the index, `TechArticle` / `Article` / `BlogPosting` elsewhere). When adding a page, copy the head block from a sibling and change the URL, type and dates.

## Booking CTA

`nav.js` holds a single `BOOKING` constant and rewrites every `a[href="index.html#cta"]` to it at load. Pages keep that href as the marker so they still land somewhere sensible with JS off. **To change where every "book a session" button on the site points, edit that one line.**

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
