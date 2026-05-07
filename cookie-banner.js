(function () {
    const STORAGE_KEY = 'cookieConsent';

    function getConsent() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch (_) {
            return null;
        }
    }

    function setConsent(value) {
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch (_) {
            // ignore
        }
    }

    function removeBanner() {
        const el = document.getElementById('cookie-banner');
        if (el) el.remove();
    }

    function ensureStyles() {
        if (document.getElementById('cookie-banner-styles')) return;
        const style = document.createElement('style');
        style.id = 'cookie-banner-styles';
        style.textContent = `
      #cookie-banner {
        position: fixed;
        left: 12px;
        right: 12px;
        bottom: 12px;
        z-index: 999999;
        background: rgba(38, 51, 26, 0.98);
        color: #e7f6e4;
        border-radius: 10px;
        padding: 14px 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        font-family: 'Segoe UI', Arial, sans-serif;
      }
      #cookie-banner .cookie-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
      }
      #cookie-banner .cookie-text {
        font-size: 14px;
        line-height: 1.4;
        max-width: 900px;
      }
      #cookie-banner .cookie-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      #cookie-banner button {
        border: none;
        border-radius: 6px;
        padding: 10px 14px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
      }
      #cookie-banner button.cookie-accept {
        background: #e7f6e4;
        color: #061301;
      }
      #cookie-banner button.cookie-reject {
        background: rgba(231, 246, 228, 0.12);
        color: #e7f6e4;
        border: 1px solid rgba(231, 246, 228, 0.35);
      }
      #cookie-banner button:active {
        transform: translateY(1px);
      }
      @media (max-width: 520px) {
        #cookie-banner .cookie-row {
          align-items: flex-start;
        }
        #cookie-banner .cookie-actions {
          width: 100%;
          justify-content: flex-end;
        }
      }
    `;
        document.head.appendChild(style);
    }

    function createBanner() {
        if (document.getElementById('cookie-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
      <div class="cookie-row">
        <div class="cookie-text">Ce site utilise des cookies afin d’améliorer votre expérience utilisateur.</div>
        <div class="cookie-actions">
          <button class="cookie-accept" type="button" id="cookie-accept">Accepter</button>
          <button class="cookie-reject" type="button" id="cookie-reject">Refuser</button>
        </div>
      </div>
    `;

        banner.querySelector('#cookie-accept').addEventListener('click', function () {
            setConsent('accepted');
            removeBanner();
        });

        banner.querySelector('#cookie-reject').addEventListener('click', function () {
            setConsent('rejected');
            removeBanner();
        });

        document.body.appendChild(banner);
    }

    document.addEventListener('DOMContentLoaded', function () {
        ensureStyles();
        const consent = getConsent();
        if (consent) return; // already decided
        createBanner();
    });
})();

