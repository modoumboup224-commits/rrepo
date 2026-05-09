# Plan d’édition (Catalogue + page Producteurs)

## Information Gathered
- La page `frontend/index.html` contient à la fois :
  - un **Catalogue de Produits** (API `/api/products` + filtres catégorie/région/prix/date)
  - un **Catalogue de Producteurs** (API `/api/producteurs`).
- Le script `frontend/script.js` charge les produits via `/api/products` et rend une carte produit.
- L’ajout au panier se fait via `addToCart(id, name, price, stock)` et **utilise une quantité affichée** avec un *qty picker* (UI `[-]` / `qty-<id>` / `[+]`).
- Le problème rapporté (“Catalogue ne semble pas fonctionner pour afficher tous les produits”, et “il faudrait pouvoir choisir une quantité…”) semble surtout venir du fait que l’UI et/ou la page ciblée n’expose pas une quantité claire pour le prix.
- Les routes backend pertinentes :
  - `backend/routes/products.js` : `GET /api/products` supporte des filtres et `limit`.
  - `backend/routes/producteurs.js` : `GET /api/producteurs`.
- Il n’existe pas (à première vue) de page dédiée “Producteurs” expliquant le fonctionnement et incitant à s’inscrire (en dehors de `register-producer.html`).

## Plan
### A) Fix “Catalogue produits” + quantité
1. Vérifier quelle page l’utilisateur appelle “Catalogue” : actuellement le lien “Catalogue” pointe vers `product-details.html` dans `frontend/header.html`, alors que le catalogue produit listé dynamiquement est sur `frontend/index.html`.
2. Ajouter/assurer une page “Catalogue” cohérente (si nécessaire) en référençant `frontend/index.html` ou en créant un `frontend/catalogue.html` qui réutilise `script.js`.
3. Sur la page catalogue / liste produits, rendre la quantité **visible avant l’action** et calculer le **prix total** basé sur la quantité sélectionnée (au lieu de seulement afficher le prix unitaire).
   - Exemple UI : champ quantité (stepper) + affichage `Total: <prix * qty>`.
   - L’action “Ajouter au panier” ajoute la quantité sélectionnée.
4. Harmoniser l’utilisation de l’ID produit (`_id` vs `id`) entre front et panier. (Le panier est stocké dans `localStorage` et utilise `id` = `_id`.)

> NB: ces points impliquent des modifications dans `frontend/index.html` et/ou `frontend/script.js` et potentiellement `frontend/cart.html` (où la quantité est gérée, mais l’ajout se fait depuis la page catalogue).

### B) Nouvelle page “Producteurs” (inscription + explication)
1. Créer une nouvelle page : `frontend/producteurs.html`.
2. Lister clairement :
   - Comment s’inscrire (lien vers `register-producer.html`).
   - Comment publier (mentionner `producer-product-publish*.html`).
   - Comment gérer ses commandes (`producer-order-management.html`).
   - Avantages (visibilité, lutte anti-gaspi, transparence).
3. Ajouter un lien vers cette page dans le header (ex: via `frontend/header.html`).
4. (Optionnel) Ajouter un lien depuis `register-producer.html` vers la page explicative.

## Dependent Files to be edited
- `frontend/index.html`
- `frontend/script.js`
- `frontend/header.html`
- (nouveau) `frontend/producteurs.html`
- (optionnel) `frontend/register-producer.html`

## Followup steps
- Ouvrir `frontend/index.html` et vérifier :
  - le nombre de produits chargés
  - la capacité de sélectionner une quantité et d’avoir un total clair.
- Ouvrir `frontend/producteurs.html` et vérifier le rendu + liens.
- Lancer les tests backend si disponibles (`npm test` peut nécessiter un script dédié).

<ask_followup_question>
Valides-tu ce plan ? En particulier : faut-il corriger le lien “Catalogue” dans le header (qui pointe vers `product-details.html`) pour que la “page Catalogue” correspondant à la liste dynamique soit celle que l’utilisateur utilise ?
</ask_followup_question>

