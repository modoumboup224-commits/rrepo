# Guide de déploiement GreenCard sur Infomaniak

## Étape 1: Préparation des fichiers

### 1.1 Optimisation des images
Avant le déploiement, optimisez vos images pour le web :

```bash
# Installer imagemin-cli pour optimiser les images
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant

# Optimiser toutes les images
imagemin frontend/images/**/*.{jpg,png} --out-dir=frontend/images/optimized
```

### 1.2 Minification des fichiers CSS et JS
```bash
# Installer des outils de minification
npm install -g clean-css-cli uglify-js

# Minifier les fichiers
cleancss -o frontend/style.min.css frontend/style.css
uglifyjs frontend/js/*.js -o frontend/js/app.min.js
```

## Étape 2: Configuration FTP Infomaniak

### 2.1 Informations de connexion
Connectez-vous à votre espace client Infomaniak :
- **Espace client** : https://manager.infomaniak.com
- **Hébergement** → **Votre site** → **FTP & SSH**

### 2.2 Paramètres FTP
- **Hôte** : ftp.infomaniak.com ou votredomaine.com
- **Port** : 21 (FTP) ou 22 (SFTP)
- **Utilisateur** : [votre-username]@[votre-domaine].com
- **Mot de passe** : [votre-mot-de-passe-ftp]

## Étape 3: Structure de déploiement

### 3.1 Structure des dossiers sur Infomaniak
```
/www/
├── index.html
├── style.css
├── js/
│   ├── auth-navigation.js
│   └── product-gallery.js
├── images/
│   ├── logo.png
│   ├── bg.jpg
│   ├── blackbox/
│   ├── blackbox2/
│   ├── nos_meilleures_ventes/
│   └── nos_plantes/
├── producer-details.html
├── product-details.html
├── register-consumer.html
├── register-producer.html
├── login-updated.html
├── cart.html
└── dashboard.html
```

## Étape 4: Méthodes de déploiement

### 4.1 Méthode 1: VS Code avec ftp-simple
1. Ouvrez VS Code
2. Appuyez sur `Ctrl+Shift+P` → "ftp-simple: Config"
3. Remplacez le contenu par celui du fichier `infomaniak-ftp-config.json`
4. Modifiez username et password avec vos identifiants
5. Sauvegardez et connectez-vous

### 4.2 Méthode 2: FileZilla
1. Téléchargez FileZilla
2. Configurez avec les paramètres FTP
3. Glissez-déposez les fichiers du dossier `frontend/` vers `/www/`

### 4.3 Méthode 3: WinSCP (Windows)
1. Téléchargez WinSCP
2. Session → Nouvelle session
3. Entrez les paramètres FTP
4. Transférez les fichiers

## Étape 5: Vérification post-déploiement

### 5.1 Tester le site
- Accédez à votre domaine
- Vérifiez toutes les pages :
  - Page d'accueil
  - Inscription producteur
  - Connexion
  - Produits
  - Panier

### 5.2 Vérifier les liens
- Tous les liens doivent fonctionner
- Les images doivent s'afficher correctement
- Les formulaires doivent soumettre vers le bon backend

## Étape 6: Configuration DNS (si nécessaire)

### 6.1 Pointer le domaine vers Infomaniak
Si votre domaine est ailleurs, configurez les DNS :
- **A Record** : pointe vers l'IP d'Infomaniak
- **CNAME** : www pointe vers votre domaine principal

## Étape 7: SSL/HTTPS

### 7.1 Activer le certificat SSL
1. Dans le manager Infomaniak
2. Hébergement → SSL → Activer Let's Encrypt
3. Attendre 15-30 minutes pour la propagation

## Dépannage

### Problèmes courants
1. **Images non chargées** : vérifier les chemins (utiliser des chemins relatifs)
2. **CSS non appliqué** : vérifier l'encodage et les chemins
3. **Erreur 404** : vérifier que index.html est bien à la racine
4. **Connexion FTP refusée** : vérifier identifiants et pare-feu

### Support Infomaniak
- **Chat** : Disponible sur le manager
- **Email** : support@infomaniak.com
- **Téléphone** : 0842 000 842
