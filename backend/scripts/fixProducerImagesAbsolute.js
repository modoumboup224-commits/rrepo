const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/greencard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const updateProducerImagesAbsolute = async () => {
    try {
        console.log('🔍 Vérification et correction des chemins d\'accès aux images...');

        // Vérifier les producteurs actuels
        const producteurs = await Producteur.find({});
        console.log(`📊 ${producteurs.length} producteurs trouvés`);

        // Afficher les chemins actuels
        console.log('\n📋 Chemins actuels:');
        producteurs.forEach(p => {
            console.log(`- ${p.nom}: ${p.photoUrl}`);
        });

        // Mettre à jour avec les chemins absolus corrects
        const correctPaths = [
            '/images/blackbox2/1.jpg',
            '/images/blackbox2/11.jpg',
            '/images/blackbox2/111.jpg'
        ];

        let updatedCount = 0;
        for (let i = 0; i < producteurs.length; i++) {
            const producteur = producteurs[i];
            const correctPath = correctPaths[i % correctPaths.length];

            // S'assurer que le chemin commence par /
            if (!correctPath.startsWith('/')) {
                correctPath = '/' + correctPath;
            }

            producteur.photoUrl = correctPath;
            producteur.photoAlt = `Photo de ${producteur.nom}`;
            await producteur.save();
            updatedCount++;
            console.log(`✅ ${producteur.nom}: ${correctPath}`);
        }

        console.log(`\n📋 Résumé: ${updatedCount} producteurs mis à jour`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🏁 Script terminé');
    }
};

updateProducerImagesAbsolute();
