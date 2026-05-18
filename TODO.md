# TODO - Consentement cookies (RGPD) - GreenCart

## Étapes
- [x] Remplacer `frontend/cookie-banner.js` (stub) par une implémentation complète : bandeau + modal "Personnaliser".

- [ ] Ajouter le CSS du bandeau/modal dans `frontend/style.css` (animations, responsive, icône cookie, accessibilité visuelle).
- [ ] Vérifier le comportement localStorage :
  - [ ] si `cookieConsent` existe => ne plus afficher
  - [ ] Accepter => `cookieConsent = accepted`
  - [ ] Refuser => `cookieConsent = refused`
  - [ ] Personnaliser => persisté (analytique/marketing) + décision finale accepted/refused
- [ ] Intégration : confirmer que les pages chargent déjà `/cookie-banner.js`.
- [ ] Contrôles accessibilité :
  - [ ] navigation clavier (Tab / Enter)
  - [ ] fermeture modal via Escape
  - [ ] focus modal et retour focus
- [ ] Tests manuels desktop/mobile.

