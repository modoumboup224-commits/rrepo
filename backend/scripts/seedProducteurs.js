require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

const producteurs = [
    {
        nom: 'Ferme de Bretagne',
        localisation: 'Bretagne',
        produits: []
    },
    {
        nom: 'Les Jardins du Sud',
        localisation: 'Provence',
        produits: []
    },
    {
        nom: 'Verger Normand',
        localisation: 'Normandie',
        produits: []
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        await Producteur.deleteMany({});
        console.log('Existing producteurs removed');

        await Producteur.insertMany(producteurs);
        console.log('Sample producteurs inserted');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding producteurs:', error);
    }
}

seed();
