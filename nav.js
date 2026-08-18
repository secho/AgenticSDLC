/* ══════════════════════════════════════════════════════════════════════
   Shared site navigation.
   Single source of truth for the top nav across every page.

   To add a page: add an entry to NAV below (or a child under a dropdown).
   No other file needs to change.

   Relies on CSS custom properties that every page defines in :root
   (--primary, --slate-*, --font-display, --font-body). Easing is hard-coded
   here so the component does not depend on a page-level --ease token.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Menu structure ──────────────────────────────────────────────────
  // Top-level item: { label, href }  OR  { label, dropdown: [ {label, href}, ... ] }
  //   OR  { label, href, dropdown: [...] } — a link that ALSO opens a menu on
  //   hover. Use this when the parent is a real page with sections; the plain
  //   `dropdown` form renders a button that cannot be clicked through to.
  //   These get `.has-link`: the click-toggle is skipped so the link works, and
  //   in the mobile drawer their children are hidden entirely — the parent link
  //   plus that page's own sticky sub-nav covers it, and expanding every child
  //   would make a ~30-row drawer.
  // A dropdown child may add `download: true` to save the file instead of opening it.
  var NAV = [
    {
      label: 'The Approach',
      href: 'index.html',
      dropdown: [
        { label: 'The Problem', href: 'index.html#problem' },
        { label: 'From Copilots to Agents', href: 'index.html#shift' },
        { label: 'Principles', href: 'index.html#principles' },
        { label: 'Frontier Stack Advantage', href: 'index.html#advantage' },
        { label: 'Architecture', href: 'index.html#architecture' },
        { label: 'Governance', href: 'index.html#governance' },
        { label: 'Roadmap', href: 'index.html#roadmap' },
        { label: 'Resources', href: 'index.html#resources' }
      ]
    },
    {
      label: 'The Method',
      href: 'method.html',
      dropdown: [
        { label: 'The pivot', href: 'method.html#pivot' },
        { label: '01 &middot; Triage', href: 'method.html#triage' },
        { label: '02 &middot; Spec', href: 'method.html#spec' },
        { label: '03 &middot; Oracle', href: 'method.html#oracle' },
        { label: '04 &middot; Baseline shadow run', href: 'method.html#baseline' },
        { label: '05 &middot; Diff classification', href: 'method.html#diff' },
        { label: '06 &middot; Implement', href: 'method.html#implement' },
        { label: '07 &middot; Verdict shadow run', href: 'method.html#verdict' },
        { label: 'Where it stops', href: 'method.html#limits' },
        { label: 'The metric', href: 'method.html#metric' }
      ]
    },
    {
      label: 'Platform Landscape',
      href: 'platform-landscape.html',
      dropdown: [
        { label: 'The Comparison', href: 'platform-landscape.html#comparison' },
        { label: 'Platform Profiles', href: 'platform-landscape.html#profiles' },
        { label: 'The Layers Underneath', href: 'platform-landscape.html#stack' },
        { label: 'Bifrost vs LiteLLM', href: 'platform-landscape.html#gateway-head-to-head' },
        { label: 'The Secho Quadrant', href: 'platform-landscape.html#quadrant' },
        { label: 'Secho&rsquo;s Eye Cycle', href: 'platform-landscape.html#eye-cycle' },
        { label: 'The Takeaway', href: 'platform-landscape.html#takeaway' }
      ]
    },
    {
      label: 'Blog',
      href: 'blog.html',
      match: 'blog',
      dropdown: [
        { label: 'All posts', href: 'blog.html' },
        { label: 'Your AI spend has no owner', href: 'blog-ai-spend-attribution.html' },
        { label: 'Adoption is not impact', href: 'blog-measuring-ai-impact.html' },
        { label: 'Shadow AI is a routing problem', href: 'blog-shadow-ai.html' }
      ]
    },
    {
      label: 'Resources',
      dropdown: [
        { label: 'All resources', href: 'index.html#resources' },
        { label: 'Method Brief (technical)', href: 'method-brief.html' },
        { label: 'Method Brief — PDF', href: 'method-brief.pdf', download: true },
        { label: 'Executive Brief', href: 'one-pager.html' }
      ]
    }
  ];
  // ── Booking ─────────────────────────────────────────────────────────
  // Single source of truth for every "book a session" call to action on the
  // site. Pages use href="index.html#cta"; the script below rewrites those to
  // BOOKING at load, so changing this one line changes every CTA everywhere.
  var BOOKING = 'https://calendar.app.google/p7VpgPPBZJFPcCPz7';
  var CTA = { label: 'Book a Strategy Session', href: BOOKING };
  // Booking opens in a new tab so the reader keeps the site open behind it.
  var EXT = BOOKING.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';

  // ── Helpers ──────────────────────────────────────────────────────────
  var EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
  function fileOf(href) { return (href || '').split('#')[0].split('/').pop() || 'index.html'; }
  var current = location.pathname.split('/').pop() || 'index.html';
  function isActive(item) {
    // `match` marks a whole family of pages as belonging to one nav entry —
    // e.g. Blog owns blog.html and every blog-*.html post.
    if (item.match && current.indexOf(item.match) === 0) return true;
    if (item.href && fileOf(item.href) === current) return true;
    if (item.dropdown) return item.dropdown.some(function (c) { return fileOf(c.href) === current; });
    return false;
  }

  // ── Styles ───────────────────────────────────────────────────────────
  var css = '\
  .site-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:4rem;background:rgba(255,255,255,0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--slate-200);}\
  .site-nav .nav-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;height:100%;display:flex;align-items:center;justify-content:space-between;}\
  .site-nav .nav-logo{display:flex;align-items:center;gap:0.55rem;text-decoration:none;}\
  .site-nav .nav-mark{flex:0 0 auto;width:22px;height:22px;display:block;}\
  .site-nav .nav-mark svg{display:block;width:100%;height:100%;}\
  .site-nav .nav-logo .sub{font-family:var(--font-display);font-size:0.9rem;font-weight:600;color:var(--slate-800);letter-spacing:-0.02em;}\
  .site-nav .nav-links{display:flex;gap:0.4rem;align-items:center;}\
  .site-nav .nav-item{position:relative;}\
  .site-nav .nav-top{display:inline-flex;align-items:center;gap:0.3rem;color:var(--slate-600);text-decoration:none;font-family:var(--font-body);font-size:0.85rem;font-weight:500;line-height:1;padding:0.6rem 0.8rem;background:none;border:none;cursor:pointer;transition:color 0.15s ' + EASE + ';}\
  .site-nav .nav-top:hover{color:var(--slate-900);}\
  .site-nav .nav-item.active > .nav-top{color:var(--primary);}\
  .site-nav .nav-caret{width:9px;height:9px;transition:transform 0.15s ' + EASE + ';opacity:0.7;}\
  .site-nav .nav-item.open .nav-caret{transform:rotate(180deg);}\
  .site-nav .nav-dropdown{display:none;position:absolute;top:100%;left:0;min-width:230px;background:#fff;border:1px solid var(--slate-200);box-shadow:0 12px 30px rgba(15,23,42,0.10);padding:0.4rem;}\
  .site-nav .nav-dropdown a{display:block;padding:0.6rem 0.8rem;color:var(--slate-600);text-decoration:none;font-size:0.85rem;font-weight:500;white-space:nowrap;transition:background 0.12s,color 0.12s;}\
  .site-nav .nav-dropdown a:hover{background:var(--slate-50);color:var(--slate-900);}\
  .site-nav .nav-cta{display:inline-flex;align-items:center;gap:0.5rem;margin-left:0.6rem;padding:0.5rem 1.2rem;background:var(--primary);color:#fff;text-decoration:none;font-family:var(--font-body);font-size:0.85rem;font-weight:600;border:2px solid var(--primary);transition:background 0.15s ' + EASE + ';}\
  .site-nav .nav-cta:hover{background:var(--primary-dark);border-color:var(--primary-dark);}\
  .nav-spacer{height:4rem;}\
  .site-nav .nav-hamburger{display:none;background:none;border:none;cursor:pointer;padding:0.5rem;margin-right:-0.5rem;}\
  .site-nav .nav-hamburger svg{display:block;}\
  .site-nav .nav-hamburger .icon-close{display:none;}\
  .site-nav .nav-hamburger.active .icon-open{display:none;}\
  .site-nav .nav-hamburger.active .icon-close{display:block;}\
  @media (min-width:769px){\
    .site-nav .nav-item.has-dropdown:hover .nav-dropdown,\
    .site-nav .nav-item.has-dropdown:focus-within .nav-dropdown,\
    .site-nav .nav-item.has-dropdown.open .nav-dropdown{display:block;}\
  }\
  @media (min-width:1024px){.site-nav{height:5rem;}.nav-spacer{height:5rem;}.site-nav .nav-mark{width:24px;height:24px;}}\
  @media (max-width:768px){\
    .site-nav{background:#fff;backdrop-filter:none;-webkit-backdrop-filter:none;}\
    .site-nav .nav-hamburger{display:block;}\
    .site-nav .nav-links{display:none;position:fixed;top:4rem;left:0;right:0;bottom:0;background:#fff;flex-direction:column;align-items:stretch;gap:0;padding:1rem 1.5rem 2rem;border-top:1px solid var(--slate-200);overflow-y:auto;overscroll-behavior:contain;}\
    .site-nav .nav-links.open{display:flex;}\
    .site-nav .nav-item{border-bottom:1px solid var(--slate-100);}\
    .site-nav .nav-top{width:100%;justify-content:space-between;padding:1rem 0;font-size:1rem;}\
    .site-nav .nav-dropdown{display:none;position:static;border:none;box-shadow:none;padding:0 0 0.6rem 0.9rem;min-width:0;}\
    .site-nav .nav-item.open .nav-dropdown{display:block;}\
    .site-nav .nav-item.has-link .nav-dropdown{display:none;}\
    .site-nav .nav-item.has-link .nav-caret{display:none;}\
    .site-nav .nav-dropdown a{padding:0.55rem 0;font-size:0.95rem;color:var(--slate-500);}\
    .site-nav .nav-cta{margin:1.2rem 0 0;justify-content:center;padding:0.9rem 1.5rem;}\
  }\
  @media print{.site-nav{display:none;}.nav-spacer{display:none;}}\
  \
  /* ══ Optional second-level nav ══ Any page may add a <nav class="subnav">;\
     styles and scroll-spy live here so it stays one implementation. */\
  :root{--subnav-anchor:calc(4rem + 2.9rem + 1rem);}\
  .subnav{position:sticky;top:4rem;z-index:40;background:#fff;border-top:1px solid var(--slate-200);border-bottom:1px solid var(--slate-200);transition:box-shadow 0.2s ' + EASE + ';}\
  .subnav.pinned{box-shadow:0 8px 20px -14px rgba(15,23,42,0.35);}\
  .subnav-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;height:2.9rem;display:flex;align-items:center;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;}\
  .subnav-inner::-webkit-scrollbar{display:none;}\
  .subnav ol{list-style:none;display:flex;align-items:center;margin:0;padding:0;}\
  .subnav li{display:flex;align-items:center;white-space:nowrap;}\
  .subnav li+li::before{content:"·";color:var(--slate-300);padding:0 0.15rem;}\
  .subnav a{display:block;font-family:var(--font-mono);font-size:0.72rem;letter-spacing:0.06em;color:var(--slate-500);text-decoration:none;padding:0.5rem 0.7rem;border-bottom:2px solid transparent;transition:color 0.15s,border-color 0.15s;}\
  .subnav a:hover{color:var(--slate-900);text-decoration:none;}\
  .subnav li.current a{color:var(--primary);border-bottom-color:var(--primary);}\
  @media (min-width:768px){.subnav-inner{padding:0 2rem;}}\
  @media (min-width:1024px){.subnav{top:5rem;}:root{--subnav-anchor:calc(5rem + 2.9rem + 1rem);}}\
  @media print{.subnav{display:none;}}';

  // Site mark — identical geometry to favicon.svg. Inline so it costs no
  // request and stays crisp at any density.
  var MARK = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" focusable="false">' +
    '<rect width="64" height="64" fill="#7640FF"/>' +
    '<path d="M20 17 L36 32 L20 47" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="square" stroke-linejoin="miter"/>' +
    '<rect x="38" y="41" width="14" height="6" fill="#fff"/></svg>';

  var caretSVG = '<svg class="nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  // ── Build markup ─────────────────────────────────────────────────────
  function itemHTML(item) {
    var active = isActive(item) ? ' active' : '';
    if (item.dropdown) {
      var links = item.dropdown.map(function (c) {
        return '<a href="' + c.href + '"' + (c.download ? ' download' : '') + '>' + c.label + '</a>';
      }).join('');
      // With an href the trigger is a real link: it navigates on click and
      // still opens the menu on hover/focus. Without one it stays a button,
      // because there is nowhere for it to go.
      var trigger = item.href
        ? '<a class="nav-top" href="' + item.href + '" aria-haspopup="true">' + item.label + caretSVG + '</a>'
        : '<button class="nav-top" aria-haspopup="true" aria-expanded="false">' + item.label + caretSVG + '</button>';
      return '<div class="nav-item has-dropdown' + (item.href ? ' has-link' : '') + active + '">' +
        trigger + '<div class="nav-dropdown">' + links + '</div></div>';
    }
    return '<div class="nav-item' + active + '"><a class="nav-top" href="' + item.href + '">' + item.label + '</a></div>';
  }

  var linksHTML = NAV.map(itemHTML).join('') +
    '<a class="nav-cta" href="' + CTA.href + '"' + EXT + '>' + CTA.label + '</a>';

  var navHTML =
    '<nav class="site-nav">' +
      '<div class="nav-inner">' +
        '<a class="nav-logo" href="index.html" aria-label="Agentic SDLC — home">' +
          '<span class="nav-mark" aria-hidden="true">' + MARK + '</span>' +
          '<span class="sub">Agentic SDLC</span></a>' +
        '<div class="nav-links" id="siteNavLinks">' + linksHTML + '</div>' +
        '<button class="nav-hamburger" id="siteNavHamburger" aria-label="Toggle menu" aria-expanded="false">' +
          '<svg class="icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
          '<svg class="icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
    '</nav><div class="nav-spacer"></div>';

  // ── Inject ───────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // ── Behavior ─────────────────────────────────────────────────────────
  var links = document.getElementById('siteNavLinks');
  var hamburger = document.getElementById('siteNavHamburger');

  function closeDrawer() {
    links.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Dropdown toggles (click/tap — works on desktop and mobile).
  // `.has-link` triggers are skipped: they must stay clickable, and in the
  // mobile drawer their children are shown expanded instead of toggled.
  links.querySelectorAll('.nav-item.has-dropdown:not(.has-link) > .nav-top').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item = btn.parentElement;
      var willOpen = !item.classList.contains('open');
      // close sibling dropdowns
      links.querySelectorAll('.nav-item.open').forEach(function (o) {
        if (o !== item) { o.classList.remove('open'); o.querySelector('.nav-top').setAttribute('aria-expanded', 'false'); }
      });
      item.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  // Any real navigation link closes the mobile drawer
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });

  // ── Second-level nav (optional, per page) ───────────────────────────
  // Markup: <nav class="subnav"><div class="subnav-inner"><ol>
  //           <li data-target="section-id"><a href="#section-id">label</a></li>
  //         …</ol></div></nav>
  // Or set data-auto="<selector>" on the <nav> to build the list from the
  // headings that selector matches (used by blog posts, whose headings are
  // per-post). Highlighting is progressive enhancement: with JS off the bar
  // is still a working set of jump links.
  (function initSubnav() {
    var subnav = document.querySelector('.subnav');
    if (!subnav) return;

    var auto = subnav.getAttribute('data-auto');
    if (auto) {
      var heads = Array.prototype.slice.call(document.querySelectorAll(auto));
      if (!heads.length) { subnav.style.display = 'none'; return; }
      var ol = document.createElement('ol');
      heads.forEach(function (h, i) {
        if (!h.id) {
          h.id = (h.textContent || 'section').toLowerCase()
            .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || ('section-' + i);
        }
        var li = document.createElement('li');
        li.setAttribute('data-target', h.id);
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = (h.getAttribute('data-nav') || h.textContent).toLowerCase();
        li.appendChild(a);
        ol.appendChild(li);
      });
      var host = subnav.querySelector('.subnav-inner') || subnav;
      host.innerHTML = '';
      host.appendChild(ol);
    }

    var inner = subnav.querySelector('.subnav-inner') || subnav;
    var items = Array.prototype.slice.call(subnav.querySelectorAll('li[data-target]'));
    var targets = items.map(function (li) { return document.getElementById(li.getAttribute('data-target')); });
    if (!items.length) return;

    // Anchor jumps must clear the fixed nav plus this bar. Driven by a CSS
    // custom property so it follows the breakpoint instead of being frozen
    // at whatever the viewport happened to be when this ran.
    targets.forEach(function (el) { if (el) el.style.scrollMarginTop = 'var(--subnav-anchor)'; });

    // Drop shadow once the bar leaves its resting place.
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    subnav.parentNode.insertBefore(sentinel, subnav);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        subnav.classList.toggle('pinned', !entries[0].isIntersecting);
      }, { threshold: 0 }).observe(sentinel);
    }

    var last = -2;
    function setCurrent(idx) {
      items.forEach(function (li, i) { li.classList.toggle('current', i === idx); });
      // Keep the active chip visible when the bar overflows. Scroll the bar
      // itself only — never the page.
      if (idx > -1 && inner.scrollWidth > inner.clientWidth) {
        var li = items[idx];
        inner.scrollLeft = Math.max(0, li.offsetLeft - (inner.clientWidth - li.offsetWidth) / 2);
      }
    }

    function onScroll() {
      // The section owning the line just under the bar wins. Falling back to
      // "last section that started above the line" keeps the highlight alive
      // in the gaps between sections and lights the final item at page end.
      var line = subnav.getBoundingClientRect().bottom + 8;
      var idx = -1;
      for (var i = 0; i < targets.length; i++) {
        var el = targets[i];
        if (!el) continue;
        var r = el.getBoundingClientRect();
        if (r.top <= line) idx = i;
        if (r.top <= line && r.bottom > line) { idx = i; break; }
      }
      if (idx !== last) { last = idx; setCurrent(idx); }
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  })();

  // Point every booking CTA at BOOKING, wherever it lives on the page.
  // Pages keep href="index.html#cta" as the marker so they still work with
  // JS off (it lands on the CTA section, which is a reasonable fallback).
  Array.prototype.forEach.call(
    document.querySelectorAll('a[href="index.html#cta"], a[href="#cta"]'),
    function (a) {
      a.href = BOOKING;
      if (BOOKING.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
    }
  );

  // Click outside closes any open desktop dropdown
  document.addEventListener('click', function (e) {
    if (!links.contains(e.target)) {
      links.querySelectorAll('.nav-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.nav-top').setAttribute('aria-expanded', 'false');
      });
    }
  });
})();
