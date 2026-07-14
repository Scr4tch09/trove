/* =====================================================================
   TROVE — Product Discovery Site
   ---------------------------------------------------------------------
   Structure of this file:
     1. Icon system        – hand-drawn inline SVG icon set
     2. Data               – products, categories, collections, FAQ
     3. Formatting helpers – price, category lookup, badges
     4. Card templates     – HTML string builders for each card type
     5. Mount functions    – inject data-driven markup into the page
     6. Browse & filter    – search / category / sort logic
     7. Interactions       – dark mode, nav, search overlay, FAQ, etc.
     8. Init               – bootstraps everything on DOMContentLoaded

   NOTE ON PERSISTENCE: dark-mode and filter state are kept in memory
   only (no localStorage) so this file runs anywhere, including inside
   a sandboxed preview. For a real deployment you can persist the
   theme choice with localStorage — see initDarkMode() below.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. ICON SYSTEM
   Every icon is stroke-based on a 24x24 grid so they share one visual
   language. icon(name) wraps the path data in a consistent <svg>.
   --------------------------------------------------------------------- */

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
  sun: '<circle cx="12" cy="12" r="4.5"></circle><line x1="12" y1="2.5" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="21.5"></line><line x1="4.3" y1="4.3" x2="6" y2="6"></line><line x1="18" y1="18" x2="19.7" y2="19.7"></line><line x1="2.5" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="21.5" y2="12"></line><line x1="4.3" y1="19.7" x2="6" y2="18"></line><line x1="18" y1="6" x2="19.7" y2="4.3"></line>',
  moon: '<path d="M20.5 14.6A8.5 8.5 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z"></path>',
  menu: '<line x1="3.5" y1="7" x2="20.5" y2="7"></line><line x1="3.5" y1="12" x2="20.5" y2="12"></line><line x1="3.5" y1="17" x2="20.5" y2="17"></line>',
  close: '<line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line>',
  chevronDown: '<polyline points="6 9 12 15 18 9"></polyline>',
  arrowUp: '<line x1="12" y1="19" x2="12" y2="6"></line><polyline points="6 12 12 6 18 12"></polyline>',
  arrowRight: '<line x1="4" y1="12" x2="20" y2="12"></line><polyline points="14 6 20 12 14 18"></polyline>',
  externalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"></rect><path d="m3 7 9 6 9-6"></path>',
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  filter: '<polygon points="4 4 20 4 14 12 14 19 10 21 10 12 4 4"></polygon>',
  flame: '<path d="M12 2.5c1.2 3 -1.8 4.3 -1.8 7.3a2.8 2.8 0 0 0 5.6 0c0-1.6-.6-2.4-.6-2.4s1.8.9 1.8 4.3a4.9 4.9 0 0 1-9.8 0c0-5.1 3.4-6.3 4.8-9.2z"></path>',
  award: '<circle cx="12" cy="8" r="5.5"></circle><path d="M8.2 12.8 6.5 21l5.5-3.2L17.5 21l-1.7-8.2"></path>',
  sparkle: '<path d="M12 2.5 13.6 8 19 9.6 13.6 11.2 12 16.7 10.4 11.2 5 9.6 10.4 8z"></path><path d="M19 14.5 19.7 17 22 17.7 19.7 18.4 19 20.8 18.3 18.4 16 17.7 18.3 17z"></path>',
  home: '<path d="M3.5 11 12 4l8.5 7"></path><path d="M5.5 9.5V19a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1V9.5"></path>',
  kitchen: '<path d="M4.5 11.5h15v3a5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5z"></path><line x1="2.2" y1="11.5" x2="4.5" y2="11.5"></line><line x1="19.5" y1="11.5" x2="21.8" y2="11.5"></line><line x1="12" y1="5" x2="12" y2="8.5"></line>',
  office: '<rect x="2.5" y="7" width="19" height="13" rx="2"></rect><path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7"></path><line x1="2.5" y1="13" x2="21.5" y2="13"></line>',
  tech: '<rect x="4" y="3.5" width="16" height="12" rx="1.5"></rect><path d="M2 19.5h20l-2-4H4z"></path>',
  travel: '<path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4z"></path>',
  car: '<path d="M5 11 6.4 6.6A2 2 0 0 1 8.3 5.2h7.4a2 2 0 0 1 1.9 1.4L19 11"></path><rect x="2.8" y="11" width="18.4" height="6" rx="2"></rect><circle cx="7.3" cy="17.3" r="1.6"></circle><circle cx="16.7" cy="17.3" r="1.6"></circle>',
  fitness: '<path d="M6.5 7v10"></path><path d="M17.5 7v10"></path><path d="M2.5 10v4"></path><path d="M21.5 10v4"></path><line x1="6.5" y1="12" x2="17.5" y2="12"></line>',
  organization: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"></rect><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"></rect><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"></rect><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"></rect>',
  edc: '<circle cx="7.5" cy="14.5" r="4"></circle><path d="M10.5 11.5 19.5 2.5"></path><path d="M15.5 6.5 18 9"></path><path d="M18 3.5 20.5 6"></path>',
  smartGadgets: '<polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2"></polygon>',
  pet: '<circle cx="7.5" cy="8.5" r="1.9"></circle><circle cx="12" cy="6.3" r="1.9"></circle><circle cx="16.5" cy="8.5" r="1.9"></circle><path d="M8 15c0-2.2 1.9-3.5 4-3.5s4 1.3 4 3.5-2 4.3-4 4.3-4-2.1-4-4.3z"></path>',
  lifestyle: '<path d="M12 2.5 13.6 8 19 9.6 13.6 11.2 12 16.7 10.4 11.2 5 9.6 10.4 8z"></path><path d="M19 14.5 19.7 17 22 17.7 19.7 18.4 19 20.8 18.3 18.4 16 17.7 18.3 17z"></path>',
  twitterX: '<line x1="4" y1="4" x2="20" y2="20"></line><line x1="20" y1="4" x2="4" y2="20"></line>',
  instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"></rect><circle cx="12" cy="12" r="4.3"></circle><circle cx="17.6" cy="6.4" r="0.6" fill="currentColor"></circle>',
  pinterest: '<circle cx="12" cy="12" r="9.5"></circle><path d="M9.2 18c1-2.7 1.3-5 1.3-6.9a2.3 2.3 0 0 1 4.5-.6c0 1.6-1 3-2.6 3"></path>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"></rect><polygon points="10 9.3 15.5 12 10 14.7" fill="currentColor" stroke="none"></polygon>',
};

function icon(name, extraClass) {
  const content = ICONS[name] || '';
  return `<svg class="icon${extraClass ? ' ' + extraClass : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${content}</svg>`;
}


/* ---------------------------------------------------------------------
   2. DATA
   In a production build, PRODUCTS would come from a CMS or database —
   the render layer below already treats it as an external data source,
   so swapping the source later means changing only this section.
   --------------------------------------------------------------------- */

const CATEGORIES = [
  { slug: 'home', name: 'Home', icon: 'home' },
  { slug: 'kitchen', name: 'Kitchen', icon: 'kitchen' },
  { slug: 'office', name: 'Office', icon: 'office' },
  { slug: 'tech', name: 'Tech', icon: 'tech' },
  { slug: 'travel', name: 'Travel', icon: 'travel' },
  { slug: 'car', name: 'Car Accessories', icon: 'car' },
  { slug: 'fitness', name: 'Fitness', icon: 'fitness' },
  { slug: 'organization', name: 'Organization', icon: 'organization' },
  { slug: 'edc', name: 'Everyday Carry', icon: 'edc' },
  { slug: 'smart-gadgets', name: 'Smart Gadgets', icon: 'smartGadgets' },
  { slug: 'pet', name: 'Pet Products', icon: 'pet' },
  { slug: 'lifestyle', name: 'Lifestyle', icon: 'lifestyle' },
];

const PRODUCTS = [
  { id: 'herb-keeper', asin: 'B01A6VUH50', image: 'https://m.media-amazon.com/images/I/71BWglW7M6L._AC_SX425_.jpg', title: 'Fresh Herb Keeper', category: 'kitchen', description: 'An acrylic herb keeper with a water reservoir that keeps cut basil and parsley fresh for weeks, not days.', price: 26.13, tags: ['featured', 'trending'], dateAdded: '2026-06-18', trendingScore: 92, usefulScore: 95, gradientIndex: 0 },
  { id: 'cable-strip', asin: 'B0DXDVLV4W', image: 'https://m.media-amazon.com/images/I/61UGOC37W7L._AC_SY450_.jpg', title: 'Magnetic Cable Clips (6-Pack)', category: 'office', description: 'Self-adhesive magnetic clips that keep charging cables snapped in place on your desk — grab and release one-handed.', price: 6.45, tags: ['featured', 'editors-pick'], dateAdded: '2026-05-28', trendingScore: 75, usefulScore: 91, gradientIndex: 2 },
  { id: 'bt-tracker', asin: 'B0GWZRRXQF', image: 'https://m.media-amazon.com/images/I/714uZHoSTCL._AC_SX425_.jpg', title: 'Bluetooth Key Finder (4-Pack)', category: 'tech', description: 'Coin-sized tags that locate keys, bags, or luggage through Apple Find My or Google Find My Device.', price: 29.98, tags: ['trending', 'most-loved'], dateAdded: '2026-06-05', trendingScore: 98, usefulScore: 90, gradientIndex: 3 },
  { id: 'packing-cubes', asin: 'B0BY4RWC19', image: 'https://m.media-amazon.com/images/I/81sYsumXLZL._AC_SY450_.jpg', title: 'Compression Packing Cubes Set', category: 'travel', description: 'A seven-piece compression set made from recycled bottles that shrinks clothing by a third, so carry-on-only trips actually work.', price: 38.24, tags: ['featured', 'editors-pick'], dateAdded: '2026-06-22', trendingScore: 80, usefulScore: 93, gradientIndex: 4 },
  { id: 'trunk-organizer', asin: 'B08B446GFC', image: 'https://m.media-amazon.com/images/I/81tOvk78l4L._AC_SX425_.jpg', title: 'Collapsible Trunk Organizer', category: 'car', description: 'A 65-litre collapsible boot organizer with dividers, straps, and a non-slip base, so shopping stops sliding around.', price: 37.99, tags: ['new'], dateAdded: '2026-07-08', trendingScore: 55, usefulScore: 78, gradientIndex: 5 },
  { id: 'massage-gun', asin: 'B0G1T184VK', image: 'https://m.media-amazon.com/images/I/61tdBTgHA5L._AC_SY355_.jpg', title: 'Massage Gun Mini', category: 'fitness', description: 'Pocket-sized percussion massager with enough power for a full post-run recovery.', price: 39.99, tags: ['trending', 'featured'], dateAdded: '2026-06-10', trendingScore: 88, usefulScore: 85, gradientIndex: 0 },
  { id: 'drawer-dividers', asin: 'B0D7YZ83PS', image: 'https://m.media-amazon.com/images/I/81xPZ4Mo-rL._AC_SY300_SX300_QL70_ML2_.jpg', title: 'Drawer Organizer Trays (25-Piece)', category: 'organization', description: 'Twenty-five trays in four sizes that mix and match to bring order to any drawer — desk, kitchen, or makeup.', price: 21.99, tags: ['editors-pick'], dateAdded: '2026-05-20', trendingScore: 60, usefulScore: 87, gradientIndex: 1 },
  { id: 'pry-tool', asin: 'B07RFH1M4J', image: 'https://m.media-amazon.com/images/I/717EADe2wOL._AC_SX425_.jpg', title: 'Keychain Multitool', category: 'edc', description: 'A flat stainless-steel key tool with 20 functions that opens boxes and bottles, scrapes, and screws — and still fits on a keyring.', price: 9.75, tags: ['new', 'trending'], dateAdded: '2026-07-05', trendingScore: 84, usefulScore: 82, gradientIndex: 2 },
  { id: 'smart-bottle', asin: 'B0DR8HDCN4', image: 'https://m.media-amazon.com/images/I/612-vt5RZSL._AC_SY300_SX300_QL70_ML2_.jpg', title: 'Smart Hydration Water Bottle', category: 'smart-gadgets', description: 'An insulated 710 ml steel bottle that tracks how much you drink and reminds you when you fall behind.', price: 49.99, tags: ['featured', 'most-loved'], dateAdded: '2026-06-01', trendingScore: 76, usefulScore: 84, gradientIndex: 3 },
  { id: 'treat-ball', asin: 'B0DHZZN2VX', image: 'https://m.media-amazon.com/images/I/7102yH7FuuL._AC_SX425_.jpg', title: 'Self-Rolling Dog Ball', category: 'pet', description: 'Rolls and bounces on its own in three play modes to keep dogs busy — waterproof and USB-C rechargeable.', price: 33.91, tags: ['trending'], dateAdded: '2026-06-14', trendingScore: 79, usefulScore: 80, gradientIndex: 4 },
  { id: 'sunrise-alarm', asin: 'B0C5M5C8NG', image: 'https://m.media-amazon.com/images/I/61R6-9Y-OGL._AC_SX425_.jpg', title: 'Sunrise Alarm Clock Light', category: 'lifestyle', description: 'Fades in like a sunrise over 30 minutes so you wake up before the alarm ever sounds.', price: 37.99, tags: ['editors-pick', 'new'], dateAdded: '2026-06-29', trendingScore: 71, usefulScore: 90, gradientIndex: 5 },
  { id: 'jar-opener', asin: 'B09PVLGLLM', image: 'https://m.media-amazon.com/images/I/716EE3A7QxL._AC_SY450_.jpg', title: 'One-Handed Jar Opener', category: 'kitchen', description: "A textured lever that grips any lid size, so one twist opens jars sore hands can't.", price: 19.99, tags: ['new'], dateAdded: '2026-07-01', trendingScore: 45, usefulScore: 83, gradientIndex: 0 },
  { id: 'laptop-riser', asin: 'B0FX4LFBD8', image: 'https://m.media-amazon.com/images/I/71kLF5M+yNL._AC_SX425_.jpg', title: 'Adjustable Laptop Stand', category: 'office', description: 'Lifts your screen to eye level on a 360-degree rotating base — fits every laptop from 10 to 15.6 inches.', price: 16.14, tags: ['most-loved'], dateAdded: '2026-05-15', trendingScore: 58, usefulScore: 86, gradientIndex: 1 },
  { id: 'travel-adapter', asin: 'B0C69B2KJX', image: 'https://m.media-amazon.com/images/I/61lIgCzGYaL._AC_SY300_SX300_QL70_ML2_.jpg', title: 'Universal Travel Adapter', category: 'travel', description: 'One adapter for outlets in 150+ countries, with two USB-A and two USB-C ports to charge four devices at once.', price: 15.29, tags: ['featured', 'most-loved'], dateAdded: '2026-06-08', trendingScore: 82, usefulScore: 92, gradientIndex: 2 },
  { id: 'passport-organizer', asin: 'B07MPP7R34', image: 'https://m.media-amazon.com/images/I/81Khm-osyTL._AC_SY300_SX300_QL70_ML2_.jpg', title: 'RFID-Blocking Passport Organizer', category: 'travel', description: 'Holds passports, boarding passes, and cards while blocking wireless skimming.', price: 9.34, tags: ['new'], dateAdded: '2026-07-10', trendingScore: 40, usefulScore: 75, gradientIndex: 3 },
  { id: 'rfid-wallet', asin: 'B08KS9WCCV', image: 'https://m.media-amazon.com/images/I/81coE66hm8L._AC_SY450_.jpg', title: 'Slim RFID Wallet', category: 'edc', description: 'Carries your cards plus coins in a case slimmer than a phone, with RFID blocking built in.', price: 37.42, tags: ['editors-pick', 'most-loved'], dateAdded: '2026-05-25', trendingScore: 68, usefulScore: 89, gradientIndex: 4 },
  { id: 'cat-groomer', asin: 'B0949HSVBH', image: 'https://m.media-amazon.com/images/I/71H2BlaY4uL._SY355_PIbundle-4,TopRight,0,0_AA355SH20_.jpg', title: 'Cat Self-Groomer Corner Brush', category: 'pet', description: 'Mounts on any wall corner so your cat brushes itself while you do literally nothing.', price: 19.99, tags: ['new', 'trending'], dateAdded: '2026-07-06', trendingScore: 63, usefulScore: 77, gradientIndex: 5 },
];

const EDITOR_NOTES = {
  'cable-strip': 'The five-second fix for a desk that always looks like a mess.',
  'packing-cubes': "The only travel purchase that's changed how we actually pack.",
  'drawer-dividers': "Solves the 'everything drawer' problem for good.",
  'sunrise-alarm': 'We were skeptical. Then we tried waking up without a blaring alarm.',
  'rfid-wallet': 'Half the thickness of a normal wallet, none of the compromise.',
};

const COLLECTIONS = [
  { id: 'desk-upgrade', title: 'The Desk Upgrade', description: 'Small changes that make an 8-hour workday feel shorter.', categories: ['office', 'tech'], icon: 'office', gradientIndex: 2 },
  { id: 'travel-ready', title: 'Ready to Travel', description: 'Everything that earns its place in a carry-on.', categories: ['travel'], icon: 'travel', gradientIndex: 4 },
  { id: 'smart-home', title: 'Smart Home, Simplified', description: 'Small upgrades with an outsized effect on daily life.', categories: ['smart-gadgets', 'home'], icon: 'smartGadgets', gradientIndex: 0 },
];

const FAQS = [
  { q: 'How do you choose which products to feature?', a: 'Every product is used or researched before it\u2019s listed. We look for things that solve a real, specific problem \u2014 not just items with good marketing.' },
  { q: 'Does clicking your links cost me anything extra?', a: "No. Prices stay exactly the same whether you use our link or go directly to the retailer. The commission comes from the retailer's marketing budget, not your wallet." },
  { q: 'Are you affiliated with Amazon?', a: "We participate in the Amazon Associates program and earn a commission on qualifying purchases, but we're an independent site \u2014 not owned or operated by Amazon." },
  { q: 'How often do you add new products?', a: 'A few times a week. Check New Discoveries below if you want to see what just landed.' },
  { q: 'Can I suggest a product?', a: "Yes \u2014 send it through the contact link. If it fits what we look for, we'll test it." },
  { q: 'Do brands pay to be featured?', a: "No. Placement isn't for sale, and it never will be \u2014 that's the only way these picks stay worth trusting." },
];


/* ---------------------------------------------------------------------
   3 + 4. FORMATTING HELPERS & CARD TEMPLATES
   --------------------------------------------------------------------- */

function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}

function categoryFor(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}

function primaryBadge(product) {
  if (product.tags.includes('editors-pick')) return { label: "Editor's Pick", type: 'editors', icon: 'award' };
  if (product.tags.includes('new')) return { label: 'New', type: 'new', icon: null };
  if (product.tags.includes('trending')) return { label: 'Trending', type: 'trending', icon: 'flame' };
  return null;
}

/* Amazon PartnerNet affiliate links.
   Products with an `asin` field link straight to their amazon.de product
   page; without one the button falls back to an Amazon search for the
   product title. The tag counts toward the partner account either way. */
const AFFILIATE_TAG = 'trovepicks-21';

function amazonUrl(product) {
  if (product.asin) return `https://www.amazon.de/dp/${product.asin}?tag=${AFFILIATE_TAG}`;
  return `https://www.amazon.de/s?k=${encodeURIComponent(product.title)}&tag=${AFFILIATE_TAG}`;
}

function productCardHTML(product) {
  const cat = categoryFor(product.category);
  const badge = primaryBadge(product);
  return `
    <article class="product-card reveal" data-category="${product.category}">
      <div class="product-card__media${product.image ? ' product-card__media--photo' : ''} grad-${product.gradientIndex}">
        ${badge ? `<span class="ribbon ribbon--${badge.type}">${badge.icon ? icon(badge.icon, 'icon-xs') : ''}${badge.label}</span>` : ''}
        ${product.image
          ? `<img class="product-card__media-img" loading="lazy" src="${product.image}" alt="${product.title}">`
          : `<span class="product-card__media-icon" role="img" aria-label="${product.title} placeholder image">${icon(cat ? cat.icon : 'lifestyle', 'icon-lg')}</span>`}
      </div>
      <div class="product-card__body">
        <span class="eyebrow-tag">${cat ? cat.name : ''}</span>
        <h3 class="product-card__title">${product.title}</h3>
        <p class="product-card__desc">${product.description}</p>
      </div>
      <div class="product-card__footer">
        <span class="product-card__price">${formatPrice(product.price)}</span>
        <a href="${amazonUrl(product)}" class="btn btn--card" rel="nofollow sponsored noopener" target="_blank" aria-label="View ${product.title} on Amazon, opens in a new tab">
          View on Amazon ${icon('externalLink', 'icon-xs')}
        </a>
      </div>
    </article>`;
}

function editorsPickCardHTML(product) {
  const cat = categoryFor(product.category);
  const note = EDITOR_NOTES[product.id] || product.description;
  return `
    <article class="product-card product-card--editorial reveal" data-category="${product.category}">
      <div class="product-card__media${product.image ? ' product-card__media--photo' : ''} grad-${product.gradientIndex}">
        <span class="ribbon ribbon--editors">${icon('award', 'icon-xs')}Editor's Pick</span>
        ${product.image
          ? `<img class="product-card__media-img" loading="lazy" src="${product.image}" alt="${product.title}">`
          : `<span class="product-card__media-icon" role="img" aria-label="${product.title} placeholder image">${icon(cat ? cat.icon : 'lifestyle', 'icon-lg')}</span>`}
      </div>
      <div class="product-card__body">
        <span class="eyebrow-tag">${cat ? cat.name : ''}</span>
        <h3 class="product-card__title">${product.title}</h3>
        <p class="product-card__note">\u201C${note}\u201D</p>
      </div>
      <div class="product-card__footer">
        <span class="product-card__price">${formatPrice(product.price)}</span>
        <a href="${amazonUrl(product)}" class="btn btn--card" rel="nofollow sponsored noopener" target="_blank" aria-label="View ${product.title} on Amazon, opens in a new tab">
          View on Amazon ${icon('externalLink', 'icon-xs')}
        </a>
      </div>
    </article>`;
}

function mostLovedItemHTML(product, rank) {
  const cat = categoryFor(product.category);
  return `
    <li class="rank-item reveal">
      <span class="rank-item__number">${String(rank).padStart(2, '0')}</span>
      <span class="rank-item__icon grad-${product.gradientIndex}">${icon(cat ? cat.icon : 'lifestyle')}</span>
      <span class="rank-item__info">
        <span class="rank-item__title">${product.title}</span>
        <span class="rank-item__meta">${cat ? cat.name : ''}</span>
      </span>
      <span class="rank-item__price">${formatPrice(product.price)}</span>
    </li>`;
}

function categoryCardHTML(cat) {
  const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
  return `
    <button type="button" class="category-card reveal" data-category="${cat.slug}">
      <span class="category-card__icon">${icon(cat.icon, 'icon-lg')}</span>
      <span class="category-card__name">${cat.name}</span>
      <span class="category-card__count">${count} picks</span>
    </button>`;
}

function collectionCardHTML(collection) {
  const count = PRODUCTS.filter((p) => collection.categories.includes(p.category)).length;
  return `
    <a href="#browse-all" class="collection-card reveal grad-${collection.gradientIndex}">
      <span class="collection-card__icon">${icon(collection.icon, 'icon-lg')}</span>
      <h3 class="collection-card__title">${collection.title}</h3>
      <p class="collection-card__desc">${collection.description}</p>
      <span class="collection-card__count">${count} picks ${icon('arrowRight', 'icon-xs')}</span>
    </a>`;
}

function emptyStateHTML() {
  return `
    <div class="browse-empty is-visible">
      ${icon('search', 'icon-lg')}
      <p>No products match those filters.</p>
      <button type="button" class="btn btn--secondary" id="browse-empty-clear">Clear filters</button>
    </div>`;
}


/* ---------------------------------------------------------------------
   5. MOUNT FUNCTIONS
   --------------------------------------------------------------------- */

function mountGrid(containerId, list, builder) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(builder || productCardHTML).join('');
}

function mountHeroCollage() {
  const el = document.getElementById('hero-collage');
  if (!el) return;
  const picks = [
    { id: 'bt-tracker', rotate: '-7deg', speed: '0.06' },
    { id: 'herb-keeper', rotate: '4deg', speed: '0.1' },
    { id: 'smart-bottle', rotate: '-3deg', speed: '0.03' },
  ];
  el.innerHTML = picks.map(({ id, rotate, speed }) => {
    const p = PRODUCTS.find((pr) => pr.id === id);
    if (!p) return '';
    const cat = categoryFor(p.category);
    return `
      <div class="hero-card grad-${p.gradientIndex}" style="--card-rotate:${rotate}" data-parallax-speed="${speed}">
        <span class="hero-card__icon">${icon(cat ? cat.icon : 'lifestyle', 'icon-lg')}</span>
        <span class="hero-card__title">${p.title}</span>
        <span class="hero-card__rating">${cat ? cat.name : ''}</span>
      </div>`;
  }).join('');
}

function mountCategories() {
  const el = document.getElementById('categories-grid');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(categoryCardHTML).join('');
  el.querySelectorAll('.category-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      const select = document.getElementById('browse-category-select');
      if (select) select.value = currentCategory;
      renderBrowseAll();
      scrollToEl(document.getElementById('browse-all'));
    });
  });
}

function mountMostLoved() {
  const list = PRODUCTS.filter((p) => p.tags.includes('most-loved'))
    .sort((a, b) => b.usefulScore - a.usefulScore)
    .slice(0, 5);
  const el = document.getElementById('most-loved-list');
  if (!el) return;
  el.innerHTML = list.map((p, i) => mostLovedItemHTML(p, i + 1)).join('');
}

function mountCollections() {
  mountGrid('collections-grid', COLLECTIONS, collectionCardHTML);
}

function mountFAQ() {
  const el = document.getElementById('faq-list');
  if (!el) return;
  el.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item reveal">
      <button type="button" class="faq-question" id="faq-q-${i}" aria-expanded="false" aria-controls="faq-a-${i}">
        <span>${f.q}</span>
        ${icon('chevronDown', 'faq-chevron')}
      </button>
      <div class="faq-answer" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
        <p>${f.a}</p>
      </div>
    </div>`).join('');
  el.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      el.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function populateCategorySelect() {
  const select = document.getElementById('browse-category-select');
  if (!select) return;
  select.innerHTML = ['<option value="all">All categories</option>']
    .concat(CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`))
    .join('');
}


/* ---------------------------------------------------------------------
   6. BROWSE & FILTER (search + category + sort over the full catalog)
   --------------------------------------------------------------------- */

let currentSearch = '';
let currentCategory = 'all';
let currentSort = 'useful';

const SORT_FIELD = {
  useful: 'usefulScore',
  trending: 'trendingScore',
  newest: 'dateAdded',
};

function getFilteredProducts() {
  let list = PRODUCTS.slice();
  if (currentCategory !== 'all') {
    list = list.filter((p) => p.category === currentCategory);
  }
  const q = currentSearch.trim().toLowerCase();
  if (q) {
    list = list.filter((p) => {
      const cat = categoryFor(p.category);
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (cat && cat.name.toLowerCase().includes(q))
      );
    });
  }
  const field = SORT_FIELD[currentSort] || 'usefulScore';
  list.sort((a, b) => {
    if (field === 'dateAdded') return new Date(b.dateAdded) - new Date(a.dateAdded);
    return b[field] - a[field];
  });
  return list;
}

function renderBrowseAll() {
  const list = getFilteredProducts();
  const grid = document.getElementById('browse-grid');
  const count = document.getElementById('browse-count');
  if (count) count.textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
  if (!grid) return;
  grid.innerHTML = list.length ? list.map(productCardHTML).join('') : emptyStateHTML();
  observeReveals(grid);
}

function resetBrowseFilters() {
  currentSearch = '';
  currentCategory = 'all';
  currentSort = 'useful';
  const searchInput = document.getElementById('browse-search-input');
  const categorySelect = document.getElementById('browse-category-select');
  const sortSelect = document.getElementById('browse-sort-select');
  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = 'all';
  if (sortSelect) sortSelect.value = 'useful';
  renderBrowseAll();
}

function initBrowseControls() {
  const searchInput = document.getElementById('browse-search-input');
  const categorySelect = document.getElementById('browse-category-select');
  const sortSelect = document.getElementById('browse-sort-select');
  if (searchInput) searchInput.addEventListener('input', (e) => { currentSearch = e.target.value; renderBrowseAll(); });
  if (categorySelect) categorySelect.addEventListener('change', (e) => { currentCategory = e.target.value; renderBrowseAll(); });
  if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; renderBrowseAll(); });
  const grid = document.getElementById('browse-grid');
  if (grid) grid.addEventListener('click', (e) => { if (e.target.closest('#browse-empty-clear')) resetBrowseFilters(); });
}


/* ---------------------------------------------------------------------
   7. INTERACTIONS
   --------------------------------------------------------------------- */

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollToEl(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

function initDarkMode() {
  const root = document.documentElement;
  // Detect the system preference. Not persisted to localStorage here so
  // this works inside sandboxed previews — for a real deployment, wrap
  // a localStorage read/write in try/catch and use it in place of this.
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.classList.add('dark');
  }
  updateThemeToggle();
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.classList.toggle('dark');
      updateThemeToggle();
    });
  });
}

function updateThemeToggle() {
  const isDark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.innerHTML = icon(isDark ? 'sun' : 'moon');
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

function initMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;
  const setOpen = (open) => {
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = icon(open ? 'close' : 'menu');
    document.body.classList.toggle('nav-open', open);
  };
  toggle.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')));
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

function initSearchOverlay() {
  const openBtn = document.querySelector('[data-search-open]');
  const overlay = document.getElementById('search-overlay');
  const closeBtn = document.querySelector('[data-search-close]');
  const input = document.getElementById('search-overlay-input');
  const form = document.getElementById('search-overlay-form');
  if (!openBtn || !overlay) return;

  const open = () => {
    overlay.classList.add('is-open');
    document.body.classList.add('nav-open');
    window.setTimeout(() => input && input.focus(), 150);
  };
  const close = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      currentSearch = input ? input.value : '';
      const mainSearch = document.getElementById('browse-search-input');
      if (mainSearch) mainSearch.value = currentSearch;
      renderBrowseAll();
      close();
      scrollToEl(document.getElementById('browse-all'));
    });
  }
}

function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const success = document.getElementById('newsletter-success');
    if (input && input.value) {
      form.hidden = true;
      if (success) success.hidden = false;
    }
  });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 700);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));
}

function initHeroParallax() {
  const cards = document.querySelectorAll('[data-parallax-speed]');
  if (!cards.length || prefersReducedMotion()) return;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    cards.forEach((card) => {
      const speed = parseFloat(card.dataset.parallaxSpeed || '0');
      card.style.setProperty('--parallax-y', `${Math.min(y * speed, 60)}px`);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

// Shared so elements rendered after page load (e.g. browse-grid re-renders on
// search/filter) can be handed to the same observer via observeReveals().
let revealObserver = null;
let revealInitialized = false;

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  revealInitialized = true;
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  elements.forEach((el) => revealObserver.observe(el));
}

function observeReveals(container) {
  if (!container || !revealInitialized) return; // before init, initScrollReveal picks them up
  const elements = container.querySelectorAll('.reveal:not(.is-visible)');
  if (revealObserver) elements.forEach((el) => revealObserver.observe(el));
  else elements.forEach((el) => el.classList.add('is-visible'));
}

function setYearInFooter() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = String(new Date().getFullYear());
}


/* ---------------------------------------------------------------------
   8. INIT
   --------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  mountHeroCollage();
  mountGrid('featured-grid', PRODUCTS.filter((p) => p.tags.includes('featured')).slice(0, 4));
  mountGrid('trending-grid', PRODUCTS.filter((p) => p.tags.includes('trending')).sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 4));
  mountMostLoved();
  mountCategories();
  mountGrid('editors-grid', PRODUCTS.filter((p) => p.tags.includes('editors-pick')).slice(0, 4), editorsPickCardHTML);
  mountCollections();
  mountGrid('new-grid', PRODUCTS.filter((p) => p.tags.includes('new')).sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 4));
  populateCategorySelect();
  renderBrowseAll();
  mountFAQ();

  initDarkMode();
  initMobileNav();
  initSearchOverlay();
  initBrowseControls();
  initNewsletter();
  initBackToTop();
  initHeroParallax();
  setYearInFooter();

  // Runs last so every mounted element above already exists in the DOM.
  initScrollReveal();
});
