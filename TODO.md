# TODO - Conversion routes backend (CommonJS -> ES Modules)

## Étape 1 — Analyse (fait)
- Vérifier la présence de CommonJS dans les routes.

## Étape 2 — Conversion ciblée
- Convertir `backend/routes/webhook.js` en ES Modules (`import`/`export default`). (fait)


## Étape 3 — Tests locaux
- Lancer le serveur (ou un test minimal) pour vérifier que `server.js` charge bien la route webhook.

## Étape 4 — Suivi (au fur et à mesure)
- Convertir les autres routes référencées par `backend/server.js` jusqu’à ce que Render démarre sans crash.

