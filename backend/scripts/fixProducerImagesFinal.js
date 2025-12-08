const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');
const fs = require('fs');
const path = require('path');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/greencard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const updateProducerImagesFinal = async () => {
    try {
        console.log('🔍 Mise à jour finale des images des producteurs...');

        // Images disponibles
        const availableImages = [
            '/images/blackbox/abricots.jpg',
            '/images/blackbox/bananes.jpg',
            '/images/blackbox/carottes.jpg',
            '/images/blackbox/cerises.jpg',
            '/images/blackbox/choux.jpg',
            '/images/blackbox/concombres.jpg',
            '/images/blackbox/courgettes.jpg',
            '/images/blackbox/epinards.jpg',
            '/images/blackbox/fraises.jpg',
            '/images/blackbox/framboises.jpg',
            '/images/blackbox/haricots.jpg',
            '/images/blackbox/kiwi.jpg',
            '/images/blackbox/mdl.jpg',
            '/images/blackbox/Melons.jpg',
            '/images/blackbox/navets.jpg',
            '/images/blackbox/oranges.jpg',
            '/images/blackbox/peches.jpg',
            '/images/blackbox/poires.jpg',
            '/images/blackbox/pois.jpg',
            '/images/blackbox/poivrons.jpg',
            '/images/blackbox/pomme.jpg',
            '/images/blackbox/raisins.jpg',
            '/images/blackbox/tomates.jpg'
        ];

        // 1. Récupérer tous les producteurs
        const producteurs = await Producteur.find({});
        console.log(`📊 ${producteurs.length} producteurs trouvés`);

        let updatedCount = 0;

        // 2. Mettre à jour chaque producteur avec une image aléatoire
        for (let i = 0; i < producteurs.length; i++) {
            const producteur = producteurs[i];
            const randomImage = availableImages[i % availableImages.length];

            producteur.photoUrl = randomImage;
            producteur.photoAlt = `Photo de ${producteur.nom}`;
            await producteur.save();
            updatedCount++;
            console.log(`✅ ${producteur.nom}: ${producteur.photoUrl}`);
        }

        console.log(`\n📋 Résumé: ${updatedCount} producteurs mis à jour avec de nouvelles images`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🏁 Script terminé');
    }
};

updateProducerImagesFinal();
