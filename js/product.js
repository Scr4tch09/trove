/* =====================================================================
   TROVE — Product detail page
   ---------------------------------------------------------------------
   Renders the detail view for one product into #product-detail (its
   data-product-id says which). Reuses PRODUCTS, CATEGORIES, t(), lz(),
   formatPrice(), amazonUrl(), categoryFor(), icon() from script.js, so
   this file must load after it. Re-renders on language switch via the
   window.onLanguageChange hook that script.js calls.
   ===================================================================== */

function relatedCardHTML(product) {
  const cat = categoryFor(product.category);
  return `
    <a class="rel-card" href="/produkt/${product.id}.html">
      <div class="rel-card__media${product.image ? ' rel-card__media--photo' : ''} grad-${product.gradientIndex}">
        ${product.image
          ? `<img loading="lazy" src="${product.image}" alt="${lz(product, 'title')}">`
          : `<span class="rel-card__icon">${icon(cat ? cat.icon : 'lifestyle', 'icon-lg')}</span>`}
      </div>
      <span class="rel-card__title">${lz(product, 'title')}</span>
      <span class="rel-card__price">${formatPrice(product.price)}</span>
    </a>`;
}

function renderProductDetail() {
  const host = document.getElementById('product-detail');
  if (!host) return;
  const product = PRODUCTS.find((p) => p.id === host.dataset.productId);
  if (!product) { host.innerHTML = '<p style="padding:4rem 0;text-align:center;">Produkt nicht gefunden.</p>'; return; }

  const cat = categoryFor(product.category);
  const note = (currentLang === 'de' && EDITOR_NOTES_DE[product.id]) || EDITOR_NOTES[product.id] || '';
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  document.title = `${lz(product, 'title')} — TrovePicks`;

  host.innerHTML = `
    <a class="detail__back" href="/index.html#browse-all">${t('detailBack')}</a>
    <div class="detail__grid">
      <div class="detail__media${product.image ? ' detail__media--photo' : ''} grad-${product.gradientIndex}">
        ${product.image
          ? `<img src="${product.image}" alt="${lz(product, 'title')}">`
          : `<span class="detail__media-icon">${icon(cat ? cat.icon : 'lifestyle', 'icon-lg')}</span>`}
      </div>
      <div class="detail__info">
        <a class="eyebrow-tag detail__cat" href="/index.html#categories">${cat ? lz(cat, 'name') : ''}</a>
        <h1 class="detail__title">${lz(product, 'title')}</h1>
        <p class="detail__price">${formatPrice(product.price)}</p>
        <a href="${amazonUrl(product)}" class="btn btn--primary detail__cta" rel="nofollow sponsored noopener" target="_blank">
          ${t('viewOnAmazon')} ${icon('externalLink', 'icon-xs')}
        </a>
        <p class="detail__disclosure">${t('detailDisclosure')}</p>
      </div>
    </div>

    <div class="detail__body">
      <section class="detail__section">
        <h2>${t('detailAbout')}</h2>
        <p>${lz(product, 'description')}</p>
      </section>
      ${note ? `
      <section class="detail__section">
        <h2>${t('detailWhy')}</h2>
        <p class="detail__note">“${note}”</p>
      </section>` : ''}
    </div>

    ${related.length ? `
    <section class="detail__related">
      <h2>${t('detailRelated')}</h2>
      <div class="rel-grid">${related.map(relatedCardHTML).join('')}</div>
    </section>` : ''}`;
}

window.onLanguageChange = renderProductDetail;
document.addEventListener('DOMContentLoaded', renderProductDetail);
