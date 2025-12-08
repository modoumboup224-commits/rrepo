const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');
const fs = require('fs');
const path = require('path');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/greencard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Vérifier la connexion
mongoose.connection.on('connected', () => {
    console.log('✅ Connecté à MongoDB');
});

// Vérifier les images
const verifyProducerImages = async () => {
    try {
        console.log('🔍 Vérification des images des producteurs...');

        const producteurs = await Producteur.find({});
        console.log(`📊 ${producteurs.length} producteurs trouvés`);

        let validImages = 0;
        let missingImages = 0;
        let brokenPaths = 0;

        for (const producteur of producteurs) {
            const imagePath = path.join(__dirname, '../../frontend', producteur.photoUrl);
            const exists = fs.existsSync(imagePath);

            if (exists) {
                validImages++;
                console.log(`✅ ${producteur.nom}: ${producteur.photoUrl}`);
            } else {
                missingImages++;
                console.log(`❌ ${producteur.nom}: ${producteur.photoUrl} - Image manquante`);
            }
        }

        console.log('\n📋 Résumé:');
        console.log(`- Images valides: ${validImages}`);
        console.log(`- Images manquantes: ${missingImages}`);
        console.log(`- Total: ${producteurs.length}`);

        // Statistiques
        const stats = {
            total: producteurs.length,
            valid: validImages,
            missing: missingImages,
            percentage: Math.round((validImages / producteurs.length) * 100)
        };

        console.log(`\n📊 Statistiques: ${stats.percentage}% des images sont valides`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Exécuter la vérification
verifyProducerImages();
