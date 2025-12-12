const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

// Configuration MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function fixProducerImages() {
    try {
        console.log('Starting image URL fix...');

        // 1. Corriger les URLs invalides
        const producers = await Producteur.find({});
        let fixedCount = 0;

        for (const producer of producers) {
            let needsUpdate = false;
            let newPhotoUrl = producer.photoUrl;

            if (producer.photoUrl) {
                // Vérifier si l'URL est relative ou absolue
                if (!producer.photoUrl.startsWith('http')) {
                    // Convertir en URL absolue
                    newPhotoUrl = `http://localhost:6300/images/producteurs/${producer.photoUrl}`;
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await Producteur.updateOne(
                    { _id: producer._id },
                    { $set: { photoUrl: newPhotoUrl } }
                );
                fixedCount++;
                console.log(`Fixed URL for ${producer.nom}: ${newPhotoUrl}`);
            }
        }

        // 2. Ajouter images par défaut pour ceux sans image
        const withoutImages = await Producteur.find({
            $or: [
                { photoUrl: null },
                { photoUrl: '' }
            ]
        });

        console.log(`Found ${withoutImages.length} producers without images`);

        for (const producer of withoutImages) {
            const defaultImage = 'http://localhost:6300/images/default-producer.jpg';
            await Producteur.updateOne(
                { _id: producer._id },
                { $set: { photoUrl: defaultImage } }
            );
            console.log(`Added default image for ${producer.nom}`);
        }

        console.log(`Fixed ${fixedCount} image URLs`);
        console.log('Image URL fix completed successfully');

    } catch (error) {
        console.error('Error fixing producer images:', error);
    } finally {
        mongoose.disconnect();
    }
}

// Exécuter le script
fixProducerImages();
