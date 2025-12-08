const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/greencard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const updateProducerPhotos = async () => {
    try {
        // Ajouter des photos par défaut aux producteurs sans photo
        const result = await Producteur.updateMany(
            { photoUrl: { $exists: false } },
            {
                $set: {
                    photoUrl: '/images/default-producer.jpg',
                    photoAlt: 'Photo du producteur'
                }
            }
        );

        console.log(`${result.modifiedCount} producteurs mis à jour avec des photos par défaut`);

        // Mettre à jour des producteurs spécifiques avec des photos existantes
        const producers = [
            { nom: 'Ferme Martin', photo: '/images/blackbox/abricots.jpg' },
            { nom: 'Bio Valley', photo: '/images/blackbox/bananes.jpg' },
            { nom: 'Les Jardins du Soleil', photo: '/images/blackbox/carottes.jpg' }
        ];

        for (const producer of producers) {
            await Producteur.updateOne(
                { nom: producer.nom },
                { $set: { photoUrl: producer.photo } }
            );
            console.log(`Photo mise à jour pour ${producer.nom}`);
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateProducerPhotos();
