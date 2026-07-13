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

- **Affiliate links**: every "View on Amazon" button is `href="#"`. Search `js/script.js` for `Replace href="#"` to find both spots (`productCardHTML` and `editorsPickCardHTML`) and wire in real Amazon affiliate links per product.
- **Product data**: all 18 products, their categories, ratings, and prices live in the `PRODUCTS` array near the top of `js/script.js`. Add, remove, or edit entries there — every section on the page (Featured, Trending, Editor's Picks, category counts, the searchable catalog) renders from that one array, so nothing else needs to change.
- **Images**: product cards currently show an icon-on-gradient placeholder instead of a photo (`.product-card__media`), by design. To use real product photos, swap that `<span>` in `productCardHTML()` / `editorsPickCardHTML()` for an `<img loading="lazy" src="..." alt="...">`.
- **Dark mode**: currently detects system preference on load and toggles in memory for the session (no `localStorage`, to keep it portable). To persist the choice across visits, wrap a `localStorage` read/write in `initDarkMode()` in a `try/catch`.
- **Newsletter form**: `initNewsletter()` currently just shows a success message on submit. Point the form at your actual email provider (Mailchimp, ConvertKit, a serverless function, etc.).
- **Fonts**: loaded from Google Fonts via `@import` at the top of `style.css` (Sora, Manrope, Inter). Swap or self-host if you'd rather not depend on the Google Fonts CDN.
