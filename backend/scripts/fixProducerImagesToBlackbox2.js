const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greencard';

// Images disponibles dans images/blackbox2/
const blackbox2Images = [
    '/images/blackbox2/1.jpg',
    '/images/blackbox2/11.jpg',
    '/images/blackbox2/111.jpg'
];

async function fixProducerImages() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB');

        // Récupérer tous les producteurs
        const producteurs = await Producteur.find({});
        console.log(`Trouvé ${producteurs.length} producteurs`);

        let updatedCount = 0;

        for (let i = 0; i < producteurs.length; i++) {
            const producteur = producteurs[i];

            // Assigner une image de blackbox2 en rotation
            const newImageUrl = blackbox2Images[i % blackbox2Images.length];

            // Vérifier si l'image actuelle est différente
            if (producteur.photoUrl !== newImageUrl) {
                producteur.photoUrl = newImageUrl;
                producteur.photoAlt = `Photo de ${producteur.nom}`;

                await producteur.save();
                updatedCount++;
                console.log(`✓ Producteur ${producteur.nom} mis à jour avec: ${newImageUrl}`);
            }
        }

        console.log(`\n✅ Terminé! ${updatedCount} producteurs ont été mis à jour avec les images de blackbox2`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Déconnexion de MongoDB');
    }
}

// Exécuter le script
fixProducerImages();
