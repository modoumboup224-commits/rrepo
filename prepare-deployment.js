#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script de préparation pour le déploiement GreenCard sur Infomaniak

console.log('🚀 Préparation du déploiement GreenCard...');

// 1. Vérifier la structure des fichiers
console.log('\n📁 Vérification de la structure...');

const requiredFiles = [
    'frontend/index.html',
    'frontend/style.css',
    'frontend/js/auth-navigation.js',
    'frontend/js/product-gallery.js',
    'frontend/images/logo.png'
];

const missingFiles = [];
requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        missingFiles.push(file);
    }
});

if (missingFiles.length > 0) {
    console.error('❌ Fichiers manquants :', missingFiles);
    process.exit(1);
}

// 2. Créer un dossier de déploiement optimisé
const deployDir = './deploy-ready';
if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
    console.log('✅ Dossier de déploiement créé :', deployDir);
}

// 3. Copier les fichiers essentiels
console.log('\n📋 Copie des fichiers...');

// Fonction pour copier récursivement
function copyRecursive(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copier les fichiers principaux
const filesToCopy = [
    { src: 'frontend/index.html', dest: `${deployDir}/index.html` },
    { src: 'frontend/style.css', dest: `${deployDir}/style.css` },
    { src: 'frontend/login-updated.html', dest: `${deployDir}/login.html` },
    { src: 'frontend/register-consumer.html', dest: `${deployDir}/register-consumer.html` },
    { src: 'frontend/register-producer.html', dest: `${deployDir}/register-producer.html` },
    { src: 'frontend/producer-details.html', dest: `${deployDir}/producer-details.html` },
    { src: 'frontend/product-details-working.html', dest: `${deployDir}/product-details.html` },
    { src: 'frontend/cart.html', dest: `${deployDir}/cart.html` },
    { src: 'frontend/dashboard.html', dest: `${deployDir}/dashboard.html` },
    { src: 'frontend/producer-order-management.html', dest: `${deployDir}/producer-order-management.html` }
];

filesToCopy.forEach(file => {
    if (fs.existsSync(file.src)) {
        fs.copyFileSync(file.src, file.dest);
        console.log(`✅ ${file.src} → ${file.dest}`);
    }
});

// Copier les dossiers
const foldersToCopy = [
    { src: 'frontend/js', dest: `${deployDir}/js` },
    { src: 'frontend/images', dest: `${deployDir}/images` },
    { src: 'frontend/assets', dest: `${deployDir}/assets` }
];

foldersToCopy.forEach(folder => {
    if (fs.existsSync(folder.src)) {
        copyRecursive(folder.src, folder.dest);
        console.log(`✅ Dossier ${folder.src} copié`);
    }
});

// 4. Créer un fichier README pour le déploiement
const readmeContent = `# GreenCard - Site Web Déployé

## Structure du site
- **Page d'accueil** : index.html
- **Connexion** : login.html
- **Inscription consommateur** : register-consumer.html
- **Inscription producteur** : register-producer.html
- **Détails producteur** : producer-details.html
- **Détails produit** : product-details.html
- **Panier** : cart.html
- **Tableau de bord** : dashboard.html
- **Gestion commandes** : producer-order-management.html

## Configuration requise
- Backend API endpoint : https://your-backend-url.com
- Images optimisées pour le web
- SSL activé (Let's Encrypt)

## Dernière mise à jour
${new Date().toISOString()}
`;

fs.writeFileSync(`${deployDir}/README.md`, readmeContent);
console.log('✅ README.md créé');

// 5. Créer un fichier .htaccess pour la configuration Apache
const htaccessContent = `# Configuration Apache pour GreenCard

# Activer la compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cacher les fichiers sensibles
<Files ~ "^\\">
    Require all denied
</Files>

# Cacher les fichiers de sauvegarde
<Files ~ "\\.bak$">
    Require all denied
</Files>

# Redirection vers index.html pour SPA
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
`;

fs.writeFileSync(`${deployDir}/.htaccess`, htaccessContent);
console.log('✅ .htaccess créé');

// 6. Vérifier la taille totale
function getTotalSize(dir) {
    let totalSize = 0;
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            totalSize += getTotalSize(filePath);
        } else {
            totalSize += stats.size;
        }
    });

    return totalSize;
}

const totalSize = getTotalSize(deployDir);
console.log(`\n📊 Taille totale du site : ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

console.log('\n🎉 Préparation terminée !');
console.log(`📁 Les fichiers sont prêts dans : ${deployDir}`);
console.log('\n📋 Prochaines étapes :');
console.log('1. Configurez votre connexion FTP avec infomaniak-ftp-config.json');
console.log('2. Transférez tous les fichiers du dossier deploy-ready/ vers votre hébergement Infomaniak');
console.log('3. Vérifiez que votre backend API est accessible');
console.log('4. Testez toutes les fonctionnalités sur votre domaine');
