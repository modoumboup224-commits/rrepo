const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greencard';

async function verifyImages() {
    try {
        await mongoose.connect(MONGODB_URI);

        const producteurs = await Producteur.find({});

        console.log('=== Vérification des images des producteurs ===');
        console.log(`Total producteurs: ${producteurs.length}\n`);

        const blackbox2Images = [
            '/images/blackbox2/1.jpg',
            '/images/blackbox2/11.jpg',
            '/images/blackbox2/111.jpg'
        ];

        let correctCount = 0;
        let incorrectCount = 0;

        producteurs.forEach((producteur, index) => {
            const isCorrect = blackbox2Images.includes(producteur.photoUrl);
            console.log(`${index + 1}. ${producteur.nom}: ${producteur.photoUrl} ${isCorrect ? '✅' : '❌'}`);

            if (isCorrect) correctCount++;
            else incorrectCount++;
        });

        console.log(`\nRésumé:`);
        console.log(`✅ Images correctes: ${correctCount}`);
        console.log(`❌ Images incorrectes: ${incorrectCount}`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyImages();
