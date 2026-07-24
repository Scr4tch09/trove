/* =====================================================================
   TrovePicks — cookie consent (Google Consent Mode v2)
   ---------------------------------------------------------------------
   The denied-by-default consent state is set in an inline <head> script
   BEFORE GTM loads (so no analytics/ad storage is used without consent).
   This file renders the banner, and on the visitor's choice updates the
   consent signal and remembers it in localStorage. A small "Cookie-
   Einstellungen" button lets them change or withdraw it any time.
   ===================================================================== */

(function () {
  var KEY = 'tp-consent';
  var lang = (typeof currentLang !== 'undefined')
    ? currentLang
    : ((navigator.language || '').toLowerCase().indexOf('de') === 0 ? 'de' : 'en');

  var T = {
    de: {
      text: 'Wir nutzen Cookies und Analyse-Tools (Google Analytics über Google Tag Manager), um zu verstehen, wie unsere Seite genutzt wird. Notwendige Cookies sind immer aktiv. Mehr dazu in der ',
      privacy: 'Datenschutzerklärung',
      accept: 'Alle akzeptieren',
      reject: 'Nur notwendige',
      settings: 'Cookie-Einstellungen'
    },
    en: {
      text: 'We use cookies and analytics (Google Analytics via Google Tag Manager) to understand how our site is used. Essential cookies are always on. Read more in our ',
      privacy: 'Privacy Policy',
      accept: 'Accept all',
      reject: 'Essential only',
      settings: 'Cookie settings'
    }
  };
  var t = T[lang] || T.de;

  function updateConsent(granted) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied'
      });
    }
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch (e) {}
  }

  function privacyHref() {
    return location.pathname.indexOf('/produkt/') === 0 ? '/datenschutz.html' : 'datenschutz.html';
  }

  function removeBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.parentNode.removeChild(b);
  }

  function decide(granted) {
    updateConsent(granted);
    removeBanner();
    showReopen();
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', t.settings);
    el.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text">' + t.text +
          '<a href="' + privacyHref() + '">' + t.privacy + '</a>.</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="btn btn--secondary" data-consent="reject">' + t.reject + '</button>' +
          '<button type="button" class="btn btn--primary" data-consent="accept">' + t.accept + '</button>' +
        '</div>' +
      '</div>';
    el.querySelector('[data-consent="accept"]').addEventListener('click', function () { decide(true); });
    el.querySelector('[data-consent="reject"]').addEventListener('click', function () { decide(false); });
    document.body.appendChild(el);
  }

  function showReopen() {
    if (document.getElementById('cookie-reopen')) return;
    var b = document.createElement('button');
    b.id = 'cookie-reopen';
    b.type = 'button';
    b.textContent = t.settings;
    b.setAttribute('aria-label', t.settings);
    b.addEventListener('click', function () {
      b.parentNode.removeChild(b);
      showBanner();
    });
    document.body.appendChild(b);
  }

  function init() {
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (stored === 'granted' || stored === 'denied') showReopen();
    else showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
