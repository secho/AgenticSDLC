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
  var NAV = [
    {
      label: 'The Approach',
      dropdown: [
        { label: 'The Problem', href: 'index.html#problem' },
        { label: 'From Copilots to Agents', href: 'index.html#shift' },
        { label: 'Principles', href: 'index.html#principles' },
        { label: 'Architecture', href: 'index.html#architecture' },
        { label: 'Governance', href: 'index.html#governance' },
        { label: 'Roadmap', href: 'index.html#roadmap' }
      ]
    },
    { label: 'Platform Landscape', href: 'platform-landscape.html' },
    {
      label: 'Resources',
      dropdown: [
        { label: 'Executive Brief', href: 'one-pager.html' }
      ]
    }
  ];
  var CTA = { label: 'Book a Strategy Session', href: 'index.html#cta' };

  // ── Helpers ──────────────────────────────────────────────────────────
  var EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
  function fileOf(href) { return (href || '').split('#')[0].split('/').pop() || 'index.html'; }
  var current = location.pathname.split('/').pop() || 'index.html';
  function isActive(item) {
    if (item.href && fileOf(item.href) === current) return true;
    if (item.dropdown) return item.dropdown.some(function (c) { return fileOf(c.href) === current; });
    return false;
  }

  // ── Styles ───────────────────────────────────────────────────────────
  var css = '\
  .site-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:4rem;background:rgba(255,255,255,0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--slate-200);}\
  .site-nav .nav-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;height:100%;display:flex;align-items:center;justify-content:space-between;}\
  .site-nav .nav-logo{display:flex;align-items:center;gap:0.75rem;text-decoration:none;}\
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
  @media (min-width:1024px){.site-nav{height:5rem;}.nav-spacer{height:5rem;}}\
  @media (max-width:768px){\
    .site-nav{background:#fff;backdrop-filter:none;-webkit-backdrop-filter:none;}\
    .site-nav .nav-hamburger{display:block;}\
    .site-nav .nav-links{display:none;position:fixed;top:4rem;left:0;right:0;bottom:0;background:#fff;flex-direction:column;align-items:stretch;gap:0;padding:1rem 1.5rem 2rem;border-top:1px solid var(--slate-200);overflow-y:auto;overscroll-behavior:contain;}\
    .site-nav .nav-links.open{display:flex;}\
    .site-nav .nav-item{border-bottom:1px solid var(--slate-100);}\
    .site-nav .nav-top{width:100%;justify-content:space-between;padding:1rem 0;font-size:1rem;}\
    .site-nav .nav-dropdown{display:none;position:static;border:none;box-shadow:none;padding:0 0 0.6rem 0.9rem;min-width:0;}\
    .site-nav .nav-item.open .nav-dropdown{display:block;}\
    .site-nav .nav-dropdown a{padding:0.55rem 0;font-size:0.95rem;color:var(--slate-500);}\
    .site-nav .nav-cta{margin:1.2rem 0 0;justify-content:center;padding:0.9rem 1.5rem;}\
  }\
  @media print{.site-nav{display:none;}.nav-spacer{display:none;}}';

  var caretSVG = '<svg class="nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  // ── Build markup ─────────────────────────────────────────────────────
  function itemHTML(item) {
    var active = isActive(item) ? ' active' : '';
    if (item.dropdown) {
      var links = item.dropdown.map(function (c) {
        return '<a href="' + c.href + '">' + c.label + '</a>';
      }).join('');
      return '<div class="nav-item has-dropdown' + active + '">' +
        '<button class="nav-top" aria-haspopup="true" aria-expanded="false">' + item.label + caretSVG + '</button>' +
        '<div class="nav-dropdown">' + links + '</div></div>';
    }
    return '<div class="nav-item' + active + '"><a class="nav-top" href="' + item.href + '">' + item.label + '</a></div>';
  }

  var linksHTML = NAV.map(itemHTML).join('') +
    '<a class="nav-cta" href="' + CTA.href + '">' + CTA.label + '</a>';

  var navHTML =
    '<nav class="site-nav">' +
      '<div class="nav-inner">' +
        '<a class="nav-logo" href="index.html"><span class="sub">Agentic SDLC</span></a>' +
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

  // Dropdown toggles (click/tap — works on desktop and mobile)
  links.querySelectorAll('.nav-item.has-dropdown > .nav-top').forEach(function (btn) {
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
