(function () {
  'use strict';

  const STORAGE_KEY = 'cookieConsent';
  const PREFS_KEY = 'cookiePreferences';
  const CONSENT_ACCEPTED = 'accepted';
  const CONSENT_REFUSED = 'refused';

  const TEXT =
    "GreenCart utilise des cookies afin d’améliorer votre expérience utilisateur, mesurer l’audience du site et proposer des contenus adaptés.";

  const POLICY_URL = '/politique-confidentialite';

  const DEFAULT_PREFS = {
    necessary: true,
    analytics: true,
    marketing: false,
  };

  function safeReadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore (private mode / blocked storage)
    }
  }

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function computeFinalDecision(prefs) {
    // RGPD: si analytics OU marketing sont ON => accepted, sinon refused
    return prefs.analytics || prefs.marketing ? CONSENT_ACCEPTED : CONSENT_REFUSED;
  }

  function ensureStyles() {
    if (document.getElementById('greencart-cookie-banner-styles')) return;

    const style = document.createElement('style');
    style.id = 'greencart-cookie-banner-styles';
    style.textContent = `
      :root {
        --gc-green-950: #061301;
        --gc-green-900: #26331a;
        --gc-green-800: #2a3b12;
        --gc-ink: #0f1b10;
        --gc-bg: rgba(255,255,255,.82);
        --gc-shadow: 0 10px 30px rgba(0,0,0,.18);
        --gc-radius: 16px;
      }

      .gc-cookie-banner {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 16px;
        z-index: 9999;
        display: flex;
        justify-content: center;
        padding: 0 12px;
        pointer-events: none;
      }

      .gc-cookie-banner.is-hidden { display: none; }

      .gc-cookie-card {
        width: min(980px, 100%);
        background: var(--gc-bg);
        border: 1px solid rgba(38,51,26,.18);
        border-radius: var(--gc-radius);
        box-shadow: var(--gc-shadow);
        backdrop-filter: blur(10px);
        padding: 14px 14px;
        display: grid;
        grid-template-columns: 1.25fr auto;
        gap: 12px;
        align-items: center;
        pointer-events: auto;
        transform: translateY(14px);
        opacity: 0;
        animation: gcCookieFadeUp .35s ease-out forwards;
      }

      @keyframes gcCookieFadeUp {
        to { transform: translateY(0); opacity: 1; }
      }

      .gc-cookie-content {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .gc-cookie-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgba(38,51,26,.08);
        display: grid;
        place-items: center;
        flex: 0 0 auto;
        color: var(--gc-green-900);
      }

      .gc-cookie-text {
        color: var(--gc-ink);
        font-size: 14.5px;
        line-height: 1.35;
      }

      .gc-cookie-text a {
        color: var(--gc-green-900);
        font-weight: 700;
        text-decoration: none;
        border-bottom: 1px solid rgba(38,51,26,.35);
      }
      .gc-cookie-text a:hover { border-bottom-color: rgba(38,51,26,.7); }

      .gc-cookie-actions {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
      }

      .gc-btn {
        border: 1px solid transparent;
        border-radius: 12px;
        padding: 10px 14px;
        font-weight: 800;
        cursor: pointer;
        font-size: 14px;
        transition: transform .08s ease, background-color .15s ease, border-color .15s ease;
      }

      .gc-btn:active { transform: translateY(1px); }
      .gc-btn:focus-visible { outline: 3px solid rgba(38,51,26,.35); outline-offset: 2px; }

      .gc-btn-primary {
        background: var(--gc-green-900);
        color: #fff;
        border-color: rgba(0,0,0,.05);
      }
      .gc-btn-primary:hover { background: var(--gc-green-800); }

      .gc-btn-ghost {
        background: rgba(255,255,255,.65);
        color: var(--gc-green-900);
        border-color: rgba(38,51,26,.25);
      }
      .gc-btn-ghost:hover {
        background: rgba(255,255,255,.9);
        border-color: rgba(38,51,26,.4);
      }

      .gc-btn-danger {
        background: rgba(38,51,26,.08);
        color: var(--gc-green-900);
        border-color: rgba(38,51,26,.25);
      }
      .gc-btn-danger:hover {
        background: rgba(38,51,26,.12);
      }

      /* Modal */
      .gc-cookie-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0,0,0,.45);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 18px;
      }

      .gc-cookie-modal {
        width: min(720px, 100%);
        background: rgba(255,255,255,.92);
        border: 1px solid rgba(38,51,26,.18);
        border-radius: 18px;
        box-shadow: var(--gc-shadow);
        backdrop-filter: blur(10px);
        overflow: hidden;
        transform: translateY(10px);
        opacity: 0;
        animation: gcModalIn .22s ease-out forwards;
      }

      @keyframes gcModalIn {
        to { transform: translateY(0); opacity: 1; }
      }

      .gc-cookie-modal-header {
        padding: 14px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(38,51,26,.12);
      }

      .gc-cookie-modal-title {
        display: flex;
        gap: 10px;
        align-items: center;
        font-weight: 900;
        color: var(--gc-green-900);
      }

      .gc-cookie-modal-body {
        padding: 14px;
      }

      .gc-pref-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 12px;
        border-radius: 14px;
        background: rgba(38,51,26,.06);
        border: 1px solid rgba(38,51,26,.10);
        margin-bottom: 10px;
      }

      .gc-pref-label {
        display: grid;
        gap: 4px;
      }
      .gc-pref-label strong {
        color: var(--gc-green-900);
        font-size: 14.5px;
      }
      .gc-pref-label span {
        color: rgba(15,27,16,.75);
        font-size: 12.5px;
      }

      .gc-switch {
        position: relative;
        width: 48px;
        height: 28px;
        flex: 0 0 auto;
      }

      .gc-switch input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }

      .gc-slider {
        position: absolute;
        inset: 0;
        background: rgba(38,51,26,.22);
        border-radius: 999px;
        transition: background-color .15s ease;
      }

      .gc-slider::after {
        content: '';
        position: absolute;
        height: 22px;
        width: 22px;
        left: 3px;
        top: 3px;
        background: #fff;
        border-radius: 50%;
        transition: transform .15s ease;
        box-shadow: 0 6px 16px rgba(0,0,0,.18);
      }

      .gc-switch input:checked + .gc-slider {
        background: var(--gc-green-900);
      }

      .gc-switch input:checked + .gc-slider::after {
        transform: translateX(20px);
      }

      .gc-switch input:disabled { cursor: not-allowed; }
      .gc-switch input:disabled + .gc-slider {
        background: rgba(38,51,26,.18);
      }

      .gc-cookie-modal-footer {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        padding: 14px;
        border-top: 1px solid rgba(38,51,26,.12);
      }

      @media (max-width: 720px) {
        .gc-cookie-card {
          grid-template-columns: 1fr;
          align-items: start;
        }
        .gc-cookie-actions { justify-content: flex-start; }
      }
    `;

    document.head.appendChild(style);
  }

  function getCookieBannerMarkup() {
    const banner = document.createElement('div');
    banner.className = 'gc-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Bandeau cookies');

    const cookieCard = document.createElement('div');
    cookieCard.className = 'gc-cookie-card';

    cookieCard.innerHTML = `
      <div class="gc-cookie-content">
        <div class="gc-cookie-icon" aria-hidden="true">
          <span style="font-size:18px;">🍪</span>
        </div>
        <div class="gc-cookie-text">
          ${escapeHTML(TEXT)}
          <span> </span>
          <a href="${POLICY_URL}" target="_self" rel="noopener">En savoir plus</a>
        </div>
      </div>
      <div class="gc-cookie-actions">
        <button type="button" class="gc-btn gc-btn-primary" data-cookie-action="accept" aria-label="Accepter les cookies">Accepter</button>
        <button type="button" class="gc-btn gc-btn-danger" data-cookie-action="refuse" aria-label="Refuser les cookies">Refuser</button>
        <button type="button" class="gc-btn gc-btn-ghost" data-cookie-action="customize" aria-label="Personnaliser les préférences cookies">Personnaliser</button>
      </div>
    `;

    banner.appendChild(cookieCard);
    return banner;
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '<')
      .replaceAll('>', '>')
      .replaceAll('"', '"')
      .replaceAll("'", '&#039;');
  }

  function openModal(onSubmitFinal) {
    const previousActive = document.activeElement;

    const overlay = document.createElement('div');
    overlay.className = 'gc-cookie-modal-overlay';
    overlay.setAttribute('role', 'presentation');

    const modal = document.createElement('div');
    modal.className = 'gc-cookie-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Personnaliser les cookies');

    overlay.appendChild(modal);

    const prefs = safeReadJSON(PREFS_KEY, DEFAULT_PREFS);

    modal.innerHTML = `
      <div class="gc-cookie-modal-header">
        <div class="gc-cookie-modal-title">
          <span aria-hidden="true">🍪</span>
          <span>Personnaliser vos préférences cookies</span>
        </div>
        <button type="button" class="gc-btn gc-btn-ghost" data-cookie-close aria-label="Fermer la fenêtre">✕</button>
      </div>
      <div class="gc-cookie-modal-body">
        <div class="gc-pref-row">
          <div class="gc-pref-label">
            <strong>COOKIES NÉCESSAIRES</strong>
            <span>Toujours activés pour le fonctionnement du site.</span>
          </div>
          <label class="gc-switch" aria-label="Cookies nécessaires">
            <input type="checkbox" checked disabled />
            <span class="gc-slider" aria-hidden="true"></span>
          </label>
        </div>

        <div class="gc-pref-row">
          <div class="gc-pref-label">
            <strong>COOKIES ANALYTIQUES</strong>
            <span>Aident à mesurer l’audience du site.</span>
          </div>
          <label class="gc-switch" aria-label="Cookies analytiques">
            <input id="gcToggleAnalytics" type="checkbox" ${prefs.analytics ? 'checked' : ''} />
            <span class="gc-slider" aria-hidden="true"></span>
          </label>
        </div>

        <div class="gc-pref-row" style="margin-bottom: 0;">
          <div class="gc-pref-label">
            <strong>COOKIES MARKETING</strong>
            <span>Permettent de proposer des contenus adaptés.</span>
          </div>
          <label class="gc-switch" aria-label="Cookies marketing">
            <input id="gcToggleMarketing" type="checkbox" ${prefs.marketing ? 'checked' : ''} />
            <span class="gc-slider" aria-hidden="true"></span>
          </label>
        </div>
      </div>
      <div class="gc-cookie-modal-footer">
        <button type="button" class="gc-btn gc-btn-primary" data-cookie-save aria-label="Enregistrer mes préférences">Enregistrer mes préférences</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const btnClose = modal.querySelector('[data-cookie-close]');
    const btnSave = modal.querySelector('[data-cookie-save]');
    const toggleAnalytics = modal.querySelector('#gcToggleAnalytics');
    const toggleMarketing = modal.querySelector('#gcToggleMarketing');

    function closeModal() {
      overlay.remove();
      if (previousActive && typeof previousActive.focus === 'function') {
        previousActive.focus();
      }
    }

    function save() {
      const nextPrefs = {
        necessary: true,
        analytics: !!toggleAnalytics.checked,
        marketing: !!toggleMarketing.checked,
      };

      safeSetItem(PREFS_KEY, JSON.stringify(nextPrefs));

      const decision = computeFinalDecision(nextPrefs);
      safeSetItem(STORAGE_KEY, decision);

      closeModal();
      onSubmitFinal(decision);
    }

    btnClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    btnSave.addEventListener('click', save);

    document.addEventListener(
      'keydown',
      function onKeyDown(e) {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', onKeyDown);
          closeModal();
        }
      },
      { once: false }
    );

    // Focus management minimal: focus Save button
    setTimeout(() => {
      if (btnSave) btnSave.focus();
    }, 0);
  }

  function initBanner() {
    // Ne jamais empêcher l'affichage si localStorage est indisponible/bloqué.
    // On testera la lecture/écriture via safeReadJSON/safeSetItem.
    if (!window) return;

    const existing = getConsent();
    if (existing === CONSENT_ACCEPTED || existing === CONSENT_REFUSED) return;

    ensureStyles();

    const banner = getCookieBannerMarkup();

    const bannerActions = banner.querySelector('.gc-cookie-actions');
    bannerActions.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-cookie-action]');
      if (!btn) return;

      const action = btn.getAttribute('data-cookie-action');
      if (action === 'accept') {
        safeSetItem(PREFS_KEY, JSON.stringify(DEFAULT_PREFS));
        safeSetItem(STORAGE_KEY, CONSENT_ACCEPTED);
        banner.remove();
      } else if (action === 'refuse') {
        safeSetItem(PREFS_KEY, JSON.stringify({ necessary: true, analytics: false, marketing: false }));
        safeSetItem(STORAGE_KEY, CONSENT_REFUSED);
        banner.remove();
      } else if (action === 'customize') {
        openModal(() => {
          const remaining = document.querySelector('.gc-cookie-banner');
          if (remaining) remaining.remove();
        });
      }
    });

    document.body.appendChild(banner);
  }

  console.log('[cookie-banner] script start, readyState=', document.readyState);
  if (document.readyState === 'loading') {
    console.log('[cookie-banner] waiting DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[cookie-banner] DOMContentLoaded -> initBanner');
      initBanner();
      console.log('[cookie-banner] after initBanner bannerExists=', !!document.querySelector('.gc-cookie-banner'));
    });
  } else {
    console.log('[cookie-banner] initBanner now');
    initBanner();
    console.log('[cookie-banner] after initBanner bannerExists=', !!document.querySelector('.gc-cookie-banner'));
  }
})();


