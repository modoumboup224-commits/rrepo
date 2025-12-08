# 🎯 MEMO DE SOUTENANCE - GREEN CARD PROJECT

## 📋 PRESENTATION RAPIDE (30 secondes)
**GreenCard** est une plateforme e-commerce spécialisée dans les produits frais locaux, connectant directement producteurs et consommateurs avec un système de paiement sécurisé Stripe.

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Frontend
- **Technos**: HTML5, CSS3, JavaScript vanilla
- **Serveur**: `localhost:3000` (frontend-server.js)
- **Structure**: Pages responsive avec header/footer réutilisables

### Backend
- **Technos**: Node.js, Express.js, MongoDB
- **Serveurs**: 
  - Principal: `localhost:5000` (server.js)
  - Alternatif: `localhost:8080` (server-get.js)
- **Base de données**: MongoDB Atlas (cloud)

### Microservices
- **Authentification** (JWT tokens)
- **Gestion produits** (CRUD complet)
- **Système de commandes** (workflow complet)
- **Paiement sécurisé** (Stripe)
- **Dashboard analytics** (recommendations.js)

---

## 🔐 FONCTIONNALITÉS CLÉS

### 1. Gestion des utilisateurs
- **3 types d'utilisateurs**: Consommateurs, Producteurs, Admin
- **Inscription séparée**: 
  - `/register-consumer.html`
  - `/register-producer.html`
- **Authentification JWT** avec refresh tokens

### 2. Catalogue produits
- **CRUD complet** pour les producteurs
- **Fiches produits détaillées** avec images
- **Recherche et filtres** (catégories, prix, localisation)

### 3. Système de commandes
- **Workflow complet**:
  1. Panier → 2. Validation → 3. Paiement → 4. Confirmation
- **Gestion des stocks** en temps réel
- **Notifications automatiques** aux producteurs

### 4. Paiement sécurisé
- **Stripe integration** (webhook.js)
- **Paiement CB sécurisé**
- **Gestion des remboursements**
- **Factures automatiques**

### 5. Dashboard producteur
- **Gestion des produits** (ajout/modification/suppression)
- **Suivi des commandes** en temps réel
- **Analytics de ventes** (recommendations.js)
- **Gestion des stocks**

---

## 🚀 ENDPOINTS API PRINCIPAUX

### Authentification
- `POST /api/auth/register` → Inscription
- `POST /api/auth/login` → Connexion
- `POST /api/auth/refresh` → Rafraîchir token

### Produits
- `GET /api/products` → Liste tous les produits
- `GET /api/products/:id` → Détails d'un produit
- `POST /api/products` → Ajouter un produit (producteur)
- `PUT /api/products/:id` → Modifier un produit
- `DELETE /api/products/:id` → Supprimer un produit

### Commandes
- `GET /api/orders` → Liste des commandes
- `POST /api/orders` → Créer une commande
- `GET /api/orders/user/:userId` → Commandes d'un utilisateur
- `PUT /api/orders/:id/status` → Mettre à jour le statut

### Paiement
- `POST /api/payment/create-payment-intent` → Créer paiement
- `POST /api/payment/webhook` → Webhook Stripe

---

## 🛠️ OUTILS DE DÉVELOPPEMENT

### Tests
- **Jest** pour les tests unitaires
- **Postman** pour les tests d'API (collections disponibles)
- **Frontend test server** (localhost:3001)

### Scripts utilitaires
- `npm run dev` → Lance tout le projet
- `npm run test` → Lance les tests
- `npm run seed` → Peuple la BDD avec des données de test

---

## 💡 POINTS FORTS À SOULIGNER

1. **Architecture microservices** bien séparée
2. **Sécurité renforcée** (JWT, validation entrées, HTTPS)
3. **Expérience utilisateur fluide** (SPA-like)
4. **Gestion temps réel** (stocks, commandes)
5. **Évolutivité** (prêt pour scale-up)
6. **Tests automatisés** (couverture >80%)

---

## 🎯 SCÉNARIO DE DÉMO

### Parcours Consommateur
1. Inscription sur `register-consumer.html`
2. Parcours du catalogue `index.html`
3. Ajout au panier `cart.html`
4. Paiement sécurisé
5. Suivi de commande

### Parcours Producteur
1. Inscription sur `register-producer.html`
2. Ajout de produits `producer-product-publish.html`
3. Gestion des commandes `producer-order-management.html`
4. Consultation du dashboard

---

## 📊 CHIFFRES CLÉS
- **+20 endpoints API** documentés
- **3 types d'utilisateurs** avec rôles différenciés
- **100% responsive** mobile/desktop
- **Intégration Stripe** complète
- **Tests automatisés** sur toutes les routes critiques

---

## 🗣️ PHRASES CLÉS POUR LA SOUTENANCE

- *"Notre architecture microservices permet une scalabilité optimale"*
- *"L'intégration Stripe garantit des paiements 100% sécurisés"*
- *"Le système de JWT assure une authentification robuste"*
- *"Notre dashboard producteur offre une vue d'ensemble complète en temps réel"*
- *"Les tests automatisés garantissent la fiabilité du système"*
