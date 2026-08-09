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
    <a class="detail__back" href="/kategorien.html">${t('detailBack')}</a>
    <div class="detail__grid">
      <div class="detail__media${product.image ? ' detail__media--photo' : ''} grad-${product.gradientIndex}">
        ${product.image
          ? `<img src="${product.image}" alt="${lz(product, 'title')}">`
          : `<span class="detail__media-icon">${icon(cat ? cat.icon : 'lifestyle', 'icon-lg')}</span>`}
      </div>
      <div class="detail__info">
        <a class="eyebrow-tag detail__cat" href="/kategorien.html">${cat ? lz(cat, 'name') : ''}</a>
        <h1 class="detail__title">${lz(product, 'title')}</h1>
        <p class="detail__price">${formatPrice(product.price)}${(() => {
          const deal = dealInfo(product);
          return deal
            ? `<span class="detail__deal"><s class="price-was">${t('dealWas')} ${formatPrice(deal.prevPrice)}</s><span class="detail__deal-pct">−${deal.percent} %</span></span>`
            : '';
        })()}</p>
        <div class="detail__actions">
          <a href="${amazonUrl(product)}" class="btn btn--primary detail__cta" rel="nofollow sponsored noopener" target="_blank">
            ${t('viewOnAmazon')} ${icon('externalLink', 'icon-xs')}
          </a>
          <button type="button" class="btn btn--secondary detail__fav${isFavorite(product.id) ? ' is-active' : ''}">
            ${icon('heart', 'icon-xs')}<span class="detail__fav-label">${isFavorite(product.id) ? t('favSaved') : t('favSave')}</span>
          </button>
          <button type="button" class="btn btn--secondary detail__share">
            ${icon('share', 'icon-xs')}<span class="detail__share-label">${t('share')}</span>
          </button>
        </div>
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

  const favBtn = host.querySelector('.detail__fav');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const now = toggleFavorite(product.id);
      favBtn.classList.toggle('is-active', now);
      const label = favBtn.querySelector('.detail__fav-label');
      if (label) label.textContent = now ? t('favSaved') : t('favSave');
      updateFavCount();
    });
  }

  const shareBtn = host.querySelector('.detail__share');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const data = { title: lz(product, 'title') + ' — TrovePicks', url: location.href };
      if (navigator.share) {
        try { await navigator.share(data); } catch (e) {}
        return;
      }
      // Desktop fallback: copy the link (modern API, then a legacy method).
      let ok = false;
      try { await navigator.clipboard.writeText(location.href); ok = true; } catch (e) {}
      if (!ok) {
        try {
          const ta = document.createElement('textarea');
          ta.value = location.href;
          ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.focus(); ta.select();
          ok = document.execCommand('copy');
          document.body.removeChild(ta);
        } catch (e) {}
      }
      const label = shareBtn.querySelector('.detail__share-label');
      if (label) {
        const orig = label.textContent;
        label.textContent = t('shareCopied');
        setTimeout(() => { label.textContent = orig; }, 2000);
      }
    });
  }
}

window.onLanguageChange = renderProductDetail;
document.addEventListener('DOMContentLoaded', renderProductDetail);
