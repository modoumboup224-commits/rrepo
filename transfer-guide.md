# Guide de transfert des fichiers vers Infomaniak

## Méthode 1 : VS Code avec ftp-simple (Recommandée)

### Étape 1 : Installer l'extension
1. Ouvrez VS Code
2. Allez dans Extensions (Ctrl+Shift+X)
3. Recherchez "ftp-simple" et installez-la

### Étape 2 : Configurer la connexion
1. Appuyez sur `Ctrl+Shift+P`
2. Tapez "ftp-simple: Config" et sélectionnez
3. Remplacez le contenu par celui de `infomaniak-ftp-config.json`
4. Modifiez vos identifiants :
   ```json
   "username": "votre-email@domaine.com",
   "password": "votre-mot-de-passe-ftp"
   ```

### Étape 3 : Transférer les fichiers
1. Appuyez sur `Ctrl+Shift+P`
2. Tapez "ftp-simple: Connect"
3. Sélectionnez votre configuration
4. Une fois connecté, naviguez vers `/www/`
5. Cliquez droit sur le dossier `deploy-ready/` → "Upload All"

## Méthode 2 : FileZilla (Interface graphique)

### Étape 1 : Télécharger et installer
1. Téléchargez FileZilla depuis https://filezilla-project.org
2. Installez et ouvrez l'application

### Étape 2 : Configurer la connexion
1. Ouvrez FileZilla
2. En haut, configurez :
   - **Hôte** : ftp.infomaniak.com
   - **Nom d'utilisateur** : votre-email@domaine.com
   - **Mot de passe** : votre mot de passe FTP
   - **Port** : 21

### Étape 3 : Transférer les fichiers
1. Cliquez sur "Connexion rapide"
2. Dans le panneau de droite (serveur distant), naviguez vers `/www/`
3. Dans le panneau de gauche (votre ordinateur), naviguez vers `C:/Users/FX706/Desktop/GreenCard/deploy-ready/`
4. Sélectionnez tous les fichiers et dossiers
5. Faites glisser vers le panneau droit ou clic droit → "Téléverser"

## Méthode 3 : WinSCP (Windows)

### Étape 1 : Télécharger et installer
1. Téléchargez WinSCP depuis https://winscp.net
2. Installez et ouvrez l'application

### Étape 2 : Configurer la session
1. Cliquez sur "Nouvelle session"
2. Configurez :
   - **Protocole** : FTP
   - **Nom d'hôte** : ftp.infomaniak.com
   - **Nom d'utilisateur** : votre-email@domaine.com
   - **Mot de passe** : votre mot de passe FTP
   - **Port** : 21

### Étape 3 : Transférer les fichiers
1. Cliquez sur "Connexion"
2. Dans le panneau droit, naviguez vers `/www/`
3. Dans le panneau gauche, naviguez vers `deploy-ready/`
4. Sélectionnez tous les fichiers et dossiers
5. Cliquez sur "Téléverser" ou faites glisser

## Méthode 4 : Commande Windows (FTP via CMD)

### Étape 1 : Ouvrir le terminal
1. Appuyez sur `Win+R`
2. Tapez `cmd` et Entrée

### Étape 2 : Commandes FTP
```cmd
ftp ftp.infomaniak.com
# Entrez votre nom d'utilisateur
# Entrez votre mot de passe
cd www
lcd C:\Users\FX706\Desktop\GreenCard\deploy-ready
binary
mput *
bye
```

## Vérification après transfert

### Étape 1 : Vérifier l'accès
1. Ouvrez votre navigateur
2. Allez à votre domaine (ex: https://votredomaine.com)
3. Vérifiez que la page d'accueil s'affiche

### Étape 2 : Tester les fonctionnalités
- Testez la navigation entre les pages
- Vérifiez que toutes les images s'affichent
- Testez les formulaires d'inscription
- Vérifiez le panier

## Dépannage

### Erreur "Connexion refusée"
- Vérifiez vos identifiants
- Contactez le support Infomaniak si nécessaire

### Erreur "Permission refusée"
- Assurez-vous d'avoir les droits d'écriture sur /www/
- Contactez Infomaniak pour vérifier les permissions

### Fichiers non visibles après transfert
- Attendez 5-10 minutes pour la propagation
- Videz le cache de votre navigateur
- Vérifiez que les fichiers sont bien dans /www/ et pas dans un sous-dossier
