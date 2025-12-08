const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');
const fs = require('fs');
const path = require('path');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/greencard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Chemins des images depuis blackbox2
const imagePaths = {
    default: '/images/default-producer.jpg',
    available: [
        '/images/blackbox2/1.jpg',
        '/images/blackbox2/11.jpg',
        '/images/blackbox2/111.jpg'
    ]
};

// Vérifier si un fichier existe
function checkImageExists(imagePath) {
    // Convertir le chemin web en chemin système de fichiers
    const fullPath = path.join(__dirname, '../../frontend', imagePath);
    return fs.existsSync(fullPath);
}

// Script principal
const updateProducerImagesBlackbox2 = async () => {
    try {
        console.log('🔍 Mise à jour des images des producteurs avec blackbox2...');
        console.log('📁 Utilisation des images depuis blackbox2/');

        // 1. Vérifier et créer l'image par défaut si nécessaire
        const defaultImagePath = path.join(__dirname, '../../frontend/images/default-producer.jpg');
        if (!fs.existsSync(defaultImagePath)) {
            console.log('⚠️ Image par défaut manquante, création...');
            const sourceImage = path.join(__dirname, '../../frontend/images/blackbox2/1.jpg');
            fs.copyFileSync(sourceImage, defaultImagePath);
            console.log('✅ Image par défaut créée');
        }

        // 2. Récupérer tous les producteurs
        const producteurs = await Producteur.find({});
        console.log(`📊 ${producteurs.length} producteurs trouvés`);

        let updatedCount = 0;
        let fixedCount = 0;

        // 3. Vérifier et corriger chaque producteur
        for (const producteur of producteurs) {
            let needsUpdate = false;
            let oldPhotoUrl = producteur.photoUrl;

            // Vérifier si l'image existe
            if (!producteur.photoUrl || !checkImageExists(producteur.photoUrl)) {
                console.log(`⚠️ Image manquante pour ${producteur.nom}: ${producteur.photoUrl}`);

                // Assigner une image aléatoire parmi les disponibles dans blackbox2
                const randomImage = imagePaths.available[Math.floor(Math.random() * imagePaths.available.length)];
                producteur.photoUrl = randomImage;
                producteur.photoAlt = `Photo de ${producteur.nom}`;
                needsUpdate = true;
                fixedCount++;
            }

            // Vérifier si le chemin est correct
            if (producteur.photoUrl && !producteur.photoUrl.startsWith('/images/')) {
                console.log(`⚠️ Chemin incorrect pour ${producteur.nom}: ${producteur.photoUrl}`);
                producteur.photoUrl = imagePaths.available[0]; // Utiliser la première image de blackbox2
                needsUpdate = true;
            }

            if (needsUpdate) {
                await producteur.save();
                console.log(`✅ ${producteur.nom}: ${oldPhotoUrl} → ${producteur.photoUrl}`);
                updatedCount++;
            }
        }

        // 4. Ajouter des images spécifiques pour les producteurs connus avec les nouvelles images
        const knownProducers = [
            { nom: 'Ferme Martin', photo: '/images/blackbox2/1.jpg' },
            { nom: 'Bio Valley', photo: '/images/blackbox2/11.jpg' },
            { nom: 'Les Jardins du Soleil', photo: '/images/blackbox2/111.jpg' },
            { nom: 'Ferme Bio', photo: '/images/blackbox2/1.jpg' },
            { nom: 'Terroir Local', photo: '/images/blackbox2/11.jpg' }
        ];

        for (const producer of knownProducers) {
            const existing = await Producteur.findOne({ nom: producer.nom });
            if (existing && checkImageExists(producer.photo)) {
                existing.photoUrl = producer.photo;
                existing.photoAlt = `Photo de ${producer.nom}`;
                await existing.save();
                console.log(`✅ Image mise à jour pour ${producer.nom}`);
            }
        }

        // 5. Afficher le résumé
        console.log('\n📋 Résumé:');
        console.log(`- ${updatedCount} producteurs mis à jour`);
        console.log(`- ${fixedCount} images manquantes corrigées`);
        console.log(`- ${producteurs.length} producteurs vérifiés`);

        // 6. Lister les images disponibles
        console.log('\n📸 Images disponibles dans blackbox2/:');
        imagePaths.available.forEach(img => {
            const exists = checkImageExists(img);
            console.log(`- ${img}: ${exists ? '✅' : '❌'}`);
        });

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🏁 Script terminé');
    }
};

// Fonction de vérification rapide
const quickCheck = async () => {
    try {
        const producteurs = await Producteur.find({});
        console.log('\n🔍 Vérification rapide des images:');

        for (const producteur of producteurs) {
            const exists = checkImageExists(producteur.photoUrl);
            console.log(`${producteur.nom}: ${producteur.photoUrl} - ${exists ? '✅' : '❌'}`);
        }
    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Exécuter le script principal
if (require.main === module) {
    updateProducerImagesBlackbox2();
}

module.exports = { updateProducerImagesBlackbox2, quickCheck };
