/* =====================================================================
   TROVE — i18n
   ---------------------------------------------------------------------
   UI strings per language. Product, category, collection and FAQ texts
   live next to their English source in script.js as *_de fields — this
   file only holds the interface chrome plus the helpers t() and lz().
   Initial language: German browsers get German, everyone else English.
   ===================================================================== */

const LANGS = ['en', 'de'];

const I18N = {
  en: {
    pageTitle: 'Trove — Products Worth Discovering',
    skip: 'Skip to content',
    navHome: 'Home', navCategories: 'Categories', navTrending: 'Trending', navAbout: 'About', navContact: 'Contact',
    searchPlaceholderOverlay: 'Search products, categories, or problems to solve…',
    searchHint: 'Press Enter to jump to full results, or Esc to close.',
    heroEyebrow: 'Curated by humans, not algorithms',
    heroHeadline: 'Products Worth Discovering.',
    heroSubtitle: 'We hand-pick useful, clever and unique products that genuinely improve everyday life.',
    heroCta: 'Explore Products', heroSecondary: 'See how we choose →',
    featuredEyebrow: 'Featured', featuredTitle: 'Featured Products', featuredSubtitle: "The picks we'd tell a friend about first.",
    viewAll: 'View all products →',
    trendingEyebrow: 'Right now', trendingTitle: 'Trending Right Now', trendingSubtitle: "What's getting the most clicks and saves this week.",
    lovedEyebrow: 'Ranked', lovedTitle: 'Most Loved This Month', lovedSubtitle: 'The picks we find ourselves recommending again and again.',
    categoriesEyebrow: 'Browse', categoriesTitle: 'Shop by Category', categoriesSubtitle: "Twelve ways into the catalog, depending on what you're solving for.",
    editorsEyebrow: 'In our own words', editorsTitle: "Editor's Picks", editorsSubtitle: 'Products our team uses often enough to have an opinion about.',
    collectionsEyebrow: 'Collections', collectionsTitle: 'Curated Collections', collectionsSubtitle: "Themed groups for when you're upgrading more than one thing at once.",
    newEyebrow: 'Just added', newTitle: 'New Discoveries', newSubtitle: 'Fresh finds from the past couple of weeks.',
    browseEyebrow: 'Full catalog', browseTitle: 'Browse Everything', browseSubtitle: 'Search, filter by category, or sort by what matters most to you.',
    searchPlaceholder: 'Search products…',
    allCategories: 'All categories',
    sortUseful: 'Sort: Most Useful', sortTrending: 'Sort: Trending', sortNewest: 'Sort: Newest',
    product: 'product', products: 'products',
    emptyTitle: 'No products match those filters.', emptyClear: 'Clear filters',
    newsletterTitle: 'Never miss a great find.',
    newsletterText: 'Get our best product discoveries in your inbox, roughly twice a month. No spam, ever.',
    newsletterPlaceholder: 'you@email.com', newsletterButton: 'Subscribe',
    newsletterSuccess: "You're in — check your inbox to confirm.",
    newsletterPrivacy: 'We respect your inbox. Unsubscribe anytime.',
    faqEyebrow: 'Questions', faqTitle: 'Questions, Answered', faqSubtitle: 'Everything people usually ask before their first order.',
    footerBlurb: "Trove is an independent product discovery guide. We spend hours researching, testing, and comparing so you don't have to.",
    footerExplore: 'Explore', footerCompany: 'Company', footerLegal: 'Legal',
    footerNew: 'New Discoveries', footerBrowseAll: 'Browse all', footerAffiliate: 'Affiliate Disclaimer',
    footerDisclaimer: 'Trove participates in the Amazon EU Associates Programme, an affiliate advertising programme designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.de. As an Amazon Associate, we earn from qualifying purchases — at no additional cost to you. We only link to products we believe are genuinely worth your time.<br><strong>Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</strong>',
    footerRights: 'Trove. All rights reserved.',
    footerTagline: 'Independent. Unsponsored. Opinionated.',
    viewOnAmazon: 'View on Amazon',
    ribbonEditors: "Editor's Pick", ribbonNew: 'New', ribbonTrending: 'Trending',
    picks: 'picks',
  },
  de: {
    pageTitle: 'Trove — Produkte, die es zu entdecken lohnt',
    skip: 'Zum Inhalt springen',
    navHome: 'Start', navCategories: 'Kategorien', navTrending: 'Trending', navAbout: 'Über uns', navContact: 'Kontakt',
    searchPlaceholderOverlay: 'Produkte, Kategorien oder Probleme suchen …',
    searchHint: 'Enter springt zu allen Ergebnissen, Esc schließt.',
    heroEyebrow: 'Von Menschen kuratiert, nicht von Algorithmen',
    heroHeadline: 'Produkte, die es zu entdecken lohnt.',
    heroSubtitle: 'Wir wählen von Hand nützliche, clevere und besondere Produkte aus, die den Alltag wirklich besser machen.',
    heroCta: 'Produkte entdecken', heroSecondary: 'So wählen wir aus →',
    featuredEyebrow: 'Empfohlen', featuredTitle: 'Empfohlene Produkte', featuredSubtitle: 'Die Picks, von denen wir Freunden zuerst erzählen würden.',
    viewAll: 'Alle Produkte ansehen →',
    trendingEyebrow: 'Gerade jetzt', trendingTitle: 'Gerade im Trend', trendingSubtitle: 'Was diese Woche die meisten Klicks bekommt.',
    lovedEyebrow: 'Rangliste', lovedTitle: 'Die Lieblinge des Monats', lovedSubtitle: 'Die Picks, die wir immer wieder empfehlen.',
    categoriesEyebrow: 'Stöbern', categoriesTitle: 'Nach Kategorie shoppen', categoriesSubtitle: 'Zwölf Wege in den Katalog — je nachdem, was du lösen willst.',
    editorsEyebrow: 'In unseren eigenen Worten', editorsTitle: 'Redaktions-Favoriten', editorsSubtitle: 'Produkte, die wir oft genug nutzen, um eine Meinung zu haben.',
    collectionsEyebrow: 'Kollektionen', collectionsTitle: 'Kuratierte Kollektionen', collectionsSubtitle: 'Themenpakete für alle, die gleich mehrere Dinge upgraden.',
    newEyebrow: 'Gerade neu', newTitle: 'Neu entdeckt', newSubtitle: 'Frische Funde der letzten Wochen.',
    browseEyebrow: 'Ganzer Katalog', browseTitle: 'Alles durchstöbern', browseSubtitle: 'Suche, filtere nach Kategorie oder sortiere nach dem, was dir wichtig ist.',
    searchPlaceholder: 'Produkte suchen …',
    allCategories: 'Alle Kategorien',
    sortUseful: 'Sortierung: Nützlichste', sortTrending: 'Sortierung: Trending', sortNewest: 'Sortierung: Neueste',
    product: 'Produkt', products: 'Produkte',
    emptyTitle: 'Keine Produkte passen zu diesen Filtern.', emptyClear: 'Filter zurücksetzen',
    newsletterTitle: 'Verpasse keinen guten Fund.',
    newsletterText: 'Unsere besten Entdeckungen etwa zweimal im Monat in deinem Postfach. Kein Spam, versprochen.',
    newsletterPlaceholder: 'du@email.de', newsletterButton: 'Abonnieren',
    newsletterSuccess: 'Du bist dabei — bestätige kurz in deinem Postfach.',
    newsletterPrivacy: 'Wir respektieren dein Postfach. Jederzeit abbestellbar.',
    faqEyebrow: 'Fragen', faqTitle: 'Fragen & Antworten', faqSubtitle: 'Alles, was vor der ersten Bestellung gefragt wird.',
    footerBlurb: 'Trove ist ein unabhängiger Produkt-Guide. Wir recherchieren, testen und vergleichen stundenlang — damit du es nicht musst.',
    footerExplore: 'Entdecken', footerCompany: 'Unternehmen', footerLegal: 'Rechtliches',
    footerNew: 'Neu entdeckt', footerBrowseAll: 'Alles durchstöbern', footerAffiliate: 'Affiliate-Hinweis',
    footerDisclaimer: 'Trove nimmt am Amazon EU-Partnerprogramm teil, einem Affiliate-Programm, über das Websites durch Werbung und Verlinkung zu Amazon.de Werbekostenerstattungen verdienen können. <strong>Als Amazon-Partner verdienen wir an qualifizierten Verkäufen</strong> — ohne Mehrkosten für dich. Wir verlinken nur Produkte, die uns wirklich überzeugt haben.',
    footerRights: 'Trove. Alle Rechte vorbehalten.',
    footerTagline: 'Unabhängig. Ungesponsert. Mit Meinung.',
    viewOnAmazon: 'Bei Amazon ansehen',
    ribbonEditors: 'Redaktions-Tipp', ribbonNew: 'Neu', ribbonTrending: 'Trending',
    picks: 'Picks',
  },
};

// Kept in memory only (like dark mode); German browsers start in German.
let currentLang = (navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

/* Localized field access with English fallback:
   lz(product, 'title') returns product.title_de in German mode when it
   exists, product.title otherwise. */
function lz(obj, field) {
  if (currentLang !== 'en') {
    const v = obj[field + '_' + currentLang];
    if (v) return v;
  }
  return obj[field];
}

function applyI18nStatic() {
  document.documentElement.lang = currentLang;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
}
