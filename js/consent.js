/* EEVSEC privacy choices. This site has no analytics or advertising stack;
   the manager records a first-party choice cookie and gates the theme
   preference stored in local storage. */
(() => {
  'use strict';

  const COOKIE = 'eevsec_consent';
  const VERSION = 1;
  const MAX_AGE = 60 * 60 * 24 * 365;
  const banner = document.getElementById('consentNotice');
  if (!banner) return;

  const settings = document.getElementById('consentSettings');
  const preferenceInput = banner.querySelector('[name="consent-preferences"]');
  let consent = readCookie();

  function readCookie() {
    const entry = document.cookie.split('; ').find((item) => item.startsWith(`${COOKIE}=`));
    if (!entry) return null;
    try {
      const value = JSON.parse(decodeURIComponent(entry.slice(COOKIE.length + 1)));
      return value && value.version === VERSION ? value : null;
    } catch (error) {
      return null;
    }
  }

  function storeCookie(value) {
    const encoded = encodeURIComponent(JSON.stringify(value));
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE}=${encoded}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  }

  function removeThemePreference() {
    try { localStorage.removeItem('eevsec-services-theme'); } catch (error) {}
  }

  function publish() {
    window.eevsecConsent = {
      has(category) {
        return category === 'necessary' || consent?.[category] === true;
      },
      open: () => show(true)
    };
    window.dispatchEvent(new CustomEvent('eevsec:consent', { detail: consent }));
  }

  function show(manage) {
    banner.hidden = false;
    banner.classList.toggle('is-managing', manage);
    if (settings) settings.hidden = !manage;
    if (preferenceInput) preferenceInput.checked = Boolean(consent?.preferences);
    requestAnimationFrame(() => banner.classList.add('is-in'));
    if (manage && preferenceInput) preferenceInput.focus();
  }

  function hide() {
    banner.classList.remove('is-in');
    banner.classList.remove('is-managing');
    window.setTimeout(() => {
      if (!banner.classList.contains('is-in')) banner.hidden = true;
    }, 450);
  }

  function save(preferences) {
    consent = {
      version: VERSION,
      necessary: true,
      preferences: Boolean(preferences),
      analytics: false,
      marketing: false,
      updatedAt: new Date().toISOString()
    };
    storeCookie(consent);
    if (!consent.preferences) removeThemePreference();
    publish();
    hide();
  }

  banner.addEventListener('click', (event) => {
    const action = event.target.closest('[data-consent-action]')?.dataset.consentAction;
    if (!action) return;
    if (action === 'necessary') save(false);
    if (action === 'all') save(true);
    if (action === 'manage') show(true);
    if (action === 'save') save(preferenceInput?.checked);
  });

  document.querySelectorAll('[data-consent-open]').forEach((control) => {
    control.addEventListener('click', (event) => {
      event.preventDefault();
      show(true);
    });
  });

  document.addEventListener('keydown', (event) => {
    // Keep the initial choice visible until the visitor records a decision.
    if (event.key === 'Escape' && !banner.hidden && consent) hide();
  });

  publish();
  if (!consent) show(false);
})();
