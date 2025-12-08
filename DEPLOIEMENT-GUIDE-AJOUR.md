# 🚨 Guide de Dépannage - Problème de Déploiement FTP

## ❌ Problème Identifié
Les logs FTP montrent une erreur `530 Login incorrect` à chaque tentative de connexion.

## 🔍 Vérifications à Effectuer

### 1. Vérifier les Credentials FTP
Les credentials actuels dans `deploy-final-corrected.bat` sont :
- **Username**: `eq8a66_temp_1`
- **Password**: `Wxcvbnm09@`
- **Host**: `eq8a66.ftp.infomaniak.com`

### 2. Obtenir les Bons Credentials
Pour obtenir les credentials corrects :

1. **Se connecter à l'espace client Infomaniak** :
   - Aller sur https://manager.infomaniak.com
   - Se connecter avec votre compte

2. **Trouver les informations FTP** :
   - Aller dans `Hébergement` → Votre hébergement → `FTP`
   - Noter les informations suivantes :
     - **Serveur FTP** : (souvent `ftp.infomaniak.com` ou `votre-domaine.com`)
     - **Nom d'utilisateur** : (format: `votre-compte_login`)
     - **Mot de passe** : (peut être différent de votre mot de passe principal)

### 3. Mettre à jour les Scripts

#### A. Mettre à jour `deploy-final-corrected.bat`
Remplacer les lignes :
```batch
set HOST=eq8a66.ftp.infomaniak.com
set USERNAME=eq8a66_temp_1
set PASSWORD=Wxcvbnm09@
```

Par les nouveaux credentials.

#### B. Mettre à jour `infomaniak-ftp-config.json`
```json
{
    "name": "GreenCard - Infomaniak",
    "host": "ftp.infomaniak.com",
    "port": 21,
    "type": "ftp",
    "username": "VOTRE_NOUVEL_USERNAME",
    "password": "VOTRE_NOUVEAU_PASSWORD",
    "path": "/",
    "remotePath": "/www"
}
```

### 4. Tester la Connexion
1. **Exécuter le test** :
   ```batch
   test-ftp-credentials.bat
   ```

2. **Vérifier le fichier de log** :
   - Ouvrir `test-connection.log`
   - Chercher `230 Login successful` au lieu de `530 Login incorrect`

### 5. Redéployer
Une fois les credentials corrects :
```batch
deploy-final-corrected.bat
```

## 🛠️ Alternative : Déploiement Manuel

Si les problèmes persistent, utiliser un client FTP manuel :

1. **Télécharger FileZilla** (gratuit)
2. **Se connecter avec les bons credentials**
3. **Uploader le contenu du dossier `deploy-ready` vers `/www`**

## 📋 Checklist de Vérification
- [ ] Credentials FTP vérifiés et corrects
- [ ] Scripts de déploiement mis à jour
- [ ] Test de connexion réussi
- [ ] Dossier `deploy-ready` prêt
- [ ] Redéploiement effectué
- [ ] Site accessible sur http://greencart.sbs

## 🔗 Ressources Utiles
- [Guide Infomaniak FTP](https://www.infomaniak.com/fr/support/faq/1940)
- [WinSCP Documentation](https://winscp.net/eng/docs/start)
- [Support Infomaniak](https://www.infomaniak.com/fr/support)
