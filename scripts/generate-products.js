/* Generates produkt/{id}.html for every product in js/script.js.
   Each page has baked-in German SEO/OpenGraph tags (so link previews and
   Google see real per-product content) and reuses the site chrome + the
   client-side i18n/detail renderer for the interactive, bilingual part.
   Run after every product change:  node scripts/generate-products.js */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js', 'script.js'), 'utf8');
function extractArray(name) {
  const start = src.indexOf(`const ${name} = [`);
  const open = src.indexOf('[', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    if (src[i] === ']') depth--;
    if (depth === 0) return eval(src.slice(open, i + 1));
  }
}
const PRODUCTS = extractArray('PRODUCTS');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='28' y2='28' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23F59E0B'/%3E%3Cstop offset='1' stop-color='%23EF4444'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='28' height='28' rx='8' fill='url(%23g)'/%3E%3Cpath d='M9 8h10l3.5 5L14 22 5.5 13z' fill='%23fff'/%3E%3Cpath d='M9 8l2.5 5h-6zM19 8l-2.5 5h6z' fill='%23FFE3C2'/%3E%3Cpath d='M5.5 13h17L14 22z' fill='%23FFD1A1'/%3E%3C/svg%3E";

const LOGO = `<svg class="logo__mark" width="30" height="30" viewBox="0 0 28 28" aria-hidden="true"><defs><linearGradient id="logoGradNav" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F59E0B"/><stop offset="1" stop-color="#EF4444"/></linearGradient></defs><rect width="28" height="28" rx="8" fill="url(#logoGradNav)"/><path d="M9 8h10l3.5 5L14 22 5.5 13z" fill="#fff"/><path d="M9 8l2.5 5h-6zM19 8l-2.5 5h6z" fill="#FFE3C2"/><path d="M5.5 13h17L14 22z" fill="#FFD1A1"/></svg>`;

const NAV = `
  <header class="nav" id="top">
    <div class="container nav__inner">
      <a href="/index.html" class="logo" aria-label="TrovePicks home">${LOGO} TrovePicks</a>
      <nav class="nav__links" aria-label="Primary">
        <a href="/index.html" data-i18n="navHome">Home</a>
        <a href="/index.html#categories" data-i18n="navCategories">Categories</a>
        <a href="/index.html#trending" data-i18n="navTrending">Trending</a>
        <a href="/about.html" data-i18n="navAbout">About</a>
        <a href="mailto:info@trovepicks.de" data-i18n="navContact">Contact</a>
      </nav>
      <div class="nav__actions">
        <button type="button" class="btn--ghost-icon lang-btn" data-lang-switch="en" aria-label="English" title="English"><svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#012169"/><path d="M0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="3"/><path d="M0 0 24 16M24 0 0 16" stroke="#C8102E" stroke-width="1.4"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5"/><path d="M12 0v16M0 8h24" stroke="#C8102E" stroke-width="3"/></svg></button>
        <button type="button" class="btn--ghost-icon lang-btn" data-lang-switch="de" aria-label="Deutsch" title="Deutsch"><svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.4" y="0" fill="#000"/><rect width="24" height="5.4" y="5.3" fill="#DD0000"/><rect width="24" height="5.4" y="10.6" fill="#FFCC00"/></svg></button>
        <button type="button" class="btn--ghost-icon" data-theme-toggle aria-label="Toggle dark mode"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z"></path></svg></button>
      </div>
    </div>
  </header>`;

const FOOTER = `
  <footer class="footer">
    <div class="container">
      <div class="footer__bottom">
        <span>© <span id="current-year">2026</span> <span data-i18n="footerRights">TrovePicks. All rights reserved.</span></span>
        <span><a href="/about.html" data-i18n="navAbout">About</a> · <a href="/impressum.html">Impressum</a> · <a href="/datenschutz.html">Datenschutz</a></span>
      </div>
      <p class="footer__disclaimer" style="margin-top:1.5rem" data-i18n="detailDisclosure">As an Amazon Associate we earn from qualifying purchases — at no extra cost to you.</p>
      <p class="footer__disclaimer" data-i18n="priceNotice">Prices last updated July 14, 2026.</p>
    </div>
  </footer>`;

function pageHTML(p) {
  const title = p.title_de || p.title;
  const desc = p.description_de || p.description;
  const url = `https://trovepicks.de/produkt/${p.id}.html`;
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} — TrovePicks</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#F59E0B">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="TrovePicks">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  ${p.image ? `<meta property="og:image" content="${p.image}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  ${p.image ? `<meta name="twitter:image" content="${p.image}">` : ''}
  <link rel="icon" type="image/svg+xml" href="${FAVICON}">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <a href="#product-detail" class="skip-link" data-i18n="skip">Skip to content</a>
${NAV}
  <main id="main-content" class="container">
    <div class="detail" id="product-detail" data-product-id="${p.id}"></div>
  </main>
${FOOTER}
  <button type="button" id="back-to-top" aria-label="Back to top"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="6"></line><polyline points="6 12 12 6 18 12"></polyline></svg></button>
  <script src="/js/i18n.js"></script>
  <script src="/js/script.js"></script>
  <script src="/js/product.js"></script>
</body>
</html>
`;
}

const outDir = path.join(root, 'produkt');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
let n = 0;
for (const p of PRODUCTS) { fs.writeFileSync(path.join(outDir, `${p.id}.html`), pageHTML(p), 'utf8'); n++; }
console.log(`${n} Produktseiten geschrieben nach produkt/`);
