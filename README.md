# Trove — Product Discovery Website

A hand-picked, curated product-discovery site. Vanilla HTML, CSS, and JavaScript — no build step, no framework, no dependencies to install.

## Structure

```
trove/
├── index.html      Markup + SEO meta tags
├── css/
│   └── style.css   Design tokens, components, dark mode, responsive rules
├── js/
│   └── script.js   Product/category data, rendering, search/filter/sort, interactions
└── README.md
```

## Running it

No build step needed. Either:

- Double-click `index.html` to open it directly in a browser, or
- Serve the folder locally for the best experience (some browsers restrict things like `fetch` on `file://` — this site doesn't use `fetch`, but a local server is still good practice):

  ```
  cd trove
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`.

## Before you launch this for real

- **Affiliate links**: every "View on Amazon" button carries the PartnerNet tag (`AFFILIATE_TAG` in `js/script.js`). Products without an `asin` field link to an amazon.de search for their title; add `asin: 'B0XXXXXXXX'` to a product in the `PRODUCTS` array to link straight to its product page.
- **Product data**: all 18 products, their categories, ratings, and prices live in the `PRODUCTS` array near the top of `js/script.js`. Add, remove, or edit entries there — every section on the page (Featured, Trending, Editor's Picks, category counts, the searchable catalog) renders from that one array, so nothing else needs to change.
- **Images**: product cards currently show an icon-on-gradient placeholder instead of a photo (`.product-card__media`), by design. To use real product photos, swap that `<span>` in `productCardHTML()` / `editorsPickCardHTML()` for an `<img loading="lazy" src="..." alt="...">`.
- **Dark mode**: currently detects system preference on load and toggles in memory for the session (no `localStorage`, to keep it portable). To persist the choice across visits, wrap a `localStorage` read/write in `initDarkMode()` in a `try/catch`.
- **Newsletter form**: `initNewsletter()` currently just shows a success message on submit. Point the form at your actual email provider (Mailchimp, ConvertKit, a serverless function, etc.).
- **Fonts**: Sora, Manrope, and Inter are self-hosted as variable WOFF2 files in `fonts/` (latin subset), declared via `@font-face` at the top of `style.css` — no Google Fonts CDN dependency, GDPR-friendly.
