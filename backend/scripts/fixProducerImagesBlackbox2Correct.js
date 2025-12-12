const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/greencart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const updateProducerImagesBlackbox2 = async () => {
    try {
        console.log('🔍 Mise à jour des images des producteurs avec blackbox2...');

        // Images disponibles dans blackbox2
        const availableImages = [
            '/images/blackbox2/1.jpg',
            '/images/blackbox2/11.jpg',
            '/images/blackbox2/111.jpg'
        ];

        // 1. Récupérer tous les producteurs
        const producteurs = await Producteur.find({});
        console.log(`📊 ${producteurs.length} producteurs trouvés`);

        let updatedCount = 0;

        // 2. Mettre à jour chaque producteur avec une image de blackbox2
        for (let i = 0; i < producteurs.length; i++) {
            const producteur = producteurs[i];
            const randomImage = availableImages[i % availableImages.length];

            producteur.photoUrl = randomImage;
            producteur.photoAlt = `Photo de ${producteur.nom}`;
            await producteur.save();
            updatedCount++;
            console.log(`✅ ${producteur.nom}: ${producteur.photoUrl}`);
        }

        console.log(`\n📋 Résumé: ${updatedCount} producteurs mis à jour avec des images de blackbox2`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🏁 Script terminé');
    }
};

updateProducerImagesBlackbox2();
