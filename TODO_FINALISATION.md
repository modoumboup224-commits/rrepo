# ✅ TODO - FINALISATION GREEN CARD PROJECT

## 🔍 Vérifications Critiques (Avant Soutenance)

### 1. Tests de Base
- [ ] Lancer le serveur backend: `cd backend && npm start`
- [ ] Vérifier MongoDB connection
- [ ] Tester Swagger UI: http://localhost:6300/api-docs
- [ ] Vérifier le frontend: http://localhost:3000

### 2. Tests des Parcours Utilisateur
- [ ] **Parcours Consommateur**:
  - [ ] Inscription sur register-consumer.html
  - [ ] Connexion login-updated.html
  - [ ] Navigation catalogue index.html
  - [ ] Ajout au panier cart.html
  - [ ] Processus de commande complet

- [ ] **Parcours Producteur**:
  - [ ] Inscription sur register-producer.html
  - [ ] Ajout de produits producer-product-publish.html
  - [ ] Gestion des commandes producer-order-management.html
  - [ ] Dashboard producteur

### 3. Tests API Critiques
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] GET /api/products
- [ ] POST /api/orders
- [ ] POST /api/payment/create-payment-intent
- [ ] Webhook Stripe test

### 4. Tests de Sécurité
- [ ] Vérifier HTTPS (si déployé)
- [ ] Tester JWT tokens expiration
- [ ] Validation des entrées utilisateur
- [ ] Protection contre injection MongoDB

### 5. Tests de Performance
- [ ] Temps de chargement des pages
- [ ] Responsive design mobile
- [ ] Gestion des images (lazy loading)
- [ ] Cache des requêtes API

### 6. Tests de Données
- [ ] Script de seeding: `node backend/scripts/seedGreencardProducts.js`
- [ ] Vérifier données de démonstration
- [ ] Images produits chargées correctement
- [ ] Stocks mis à jour après commandes

### 7. Documentation & Présentation
- [ ] README.md complet
- [ ] Collection Postman testée
- [ ] Vidéo de démonstration (optionnel)
- [ ] Slides de présentation prêts

### 8. Configuration Finale
- [ ] Variables d'environnement (.env)
- [ ] Ports configurés correctement
- [ ] Logs d'erreur propres
- [ ] Messages d'erreur utilisateur friendly

## 🚀 Commandes de Lancement Rapide

```bash
# Terminal 1 - Backend
cd backend
npm start
# → http://localhost:6300

# Terminal 2 - Frontend
cd ..
npm run dev
# → http://localhost:3000

# Terminal 3 - Tests (optionnel)
cd backend
npm test
```

## 📊 Points de Vérification Soutenance

1. **Démo 1**: Inscription + connexion
2. **Démo 2**: Ajout produit au panier
3. **Démo 3**: Paiement Stripe (mode test)
4. **Démo 4**: Dashboard producteur
5. **Démo 5**: Documentation Swagger

## 🎯 Checklist Finale (2 minutes avant)

- [ ] Tous les serveurs démarrés
- [ ] Données de démo présentes
- [ ] Navigateur avec onglets prêts:
  - [ ] http://localhost:3000
  - [ ] http://localhost:6300/api-docs
- [ ] Postman ouvert avec collections
- [ ] Terminal avec logs visibles
