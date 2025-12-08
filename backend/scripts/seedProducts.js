require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Producteur = require('../models/Producteur');

const products = [
    { name: 'Pommes Bio', category: 'Fruits', region: 'Normandie', expirationDate: new Date('2024-12-31'), price: 2.5, description: 'Pommes biologiques cultivées en Normandie.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/pomme.jpg' },
    { name: 'Carottes', category: 'Légumes', region: 'Bretagne', expirationDate: new Date('2024-11-15'), price: 1.8, description: 'Carottes fraîches de Bretagne.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/carottes.jpg' },
    { name: 'Miel de Lavande', category: 'Produits de la ruche', region: 'Provence', expirationDate: new Date('2025-06-30'), price: 8.0, description: 'Miel de lavande pur et naturel.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/mdl.jpg' },
    { name: 'Bananes', category: 'Fruits', region: 'Guadeloupe', expirationDate: new Date('2024-10-10'), price: 1.2, description: 'Bananes fraîches de Guadeloupe.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/bananes.jpg' },
    { name: 'Tomates', category: 'Légumes', region: 'Aquitaine', expirationDate: new Date('2024-09-20'), price: 2.0, description: 'Tomates rouges et juteuses.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/tomates.jpg' },
    { name: 'Oranges', category: 'Fruits', region: 'Corse', expirationDate: new Date('2024-12-15'), price: 2.3, description: 'Oranges sucrées de Corse.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/oranges.jpg' },
    { name: 'Concombres', category: 'Légumes', region: 'Pays de la Loire', expirationDate: new Date('2024-09-25'), price: 1.5, description: 'Concombres croquants.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/concombres.jpg' },
    { name: 'Poires', category: 'Fruits', region: 'Alsace', expirationDate: new Date('2024-11-30'), price: 2.1, description: 'Poires juteuses et sucrées.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/poires.jpg' },
    { name: 'Courgettes', category: 'Légumes', region: 'Provence', expirationDate: new Date('2024-10-05'), price: 1.7, description: 'Courgettes fraîches.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/courgettes.jpg' },
    { name: 'Fraises', category: 'Fruits', region: 'Aquitaine', expirationDate: new Date('2024-06-15'), price: 3.0, description: 'Fraises sucrées et parfumées.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/fraises.jpg' },
    { name: 'Choux', category: 'Légumes', region: 'Bretagne', expirationDate: new Date('2024-11-10'), price: 1.9, description: 'Choux verts croquants.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/choux.jpg' },
    { name: 'Cerises', category: 'Fruits', region: 'Rhône-Alpes', expirationDate: new Date('2024-07-20'), price: 4.0, description: 'Cerises rouges et sucrées.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/cerises.jpg' },
    { name: 'Poivrons', category: 'Légumes', region: 'Languedoc', expirationDate: new Date('2024-09-30'), price: 2.2, description: 'Poivrons colorés.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/poivrons.jpg' },
    { name: 'Raisins', category: 'Fruits', region: 'Bordeaux', expirationDate: new Date('2024-10-15'), price: 3.5, description: 'Raisins sucrés.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/raisins.jpg' },
    { name: 'Aubergines', category: 'Légumes', region: 'Provence', expirationDate: new Date('2024-10-20'), price: 2.0, description: 'Aubergines fraîches.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/aubergines.jpg' },
    { name: 'Kiwis', category: 'Fruits', region: 'Nouvelle-Aquitaine', expirationDate: new Date('2024-12-01'), price: 2.8, description: 'Kiwis riches en vitamine C.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/kiwi.jpg' },
    { name: 'Épinards', category: 'Légumes', region: 'Bourgogne', expirationDate: new Date('2024-09-15'), price: 1.6, description: 'Épinards frais.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/epinards.jpg' },
    { name: 'Melons', category: 'Fruits', region: 'Midi-Pyrénées', expirationDate: new Date('2024-08-30'), price: 3.2, description: 'Melons sucrés.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/Melons.jpg' },
    { name: 'Betteraves', category: 'Légumes', region: 'Alsace', expirationDate: new Date('2024-11-05'), price: 1.7, description: 'Betteraves rouges.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/betteraves.jpg' },
    { name: 'Pêches', category: 'Fruits', region: 'Rhône-Alpes', expirationDate: new Date('2024-07-25'), price: 3.1, description: 'Pêches juteuses.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/peches.jpg' },
    { name: 'Navets', category: 'Légumes', region: 'Bretagne', expirationDate: new Date('2024-10-10'), price: 1.5, description: 'Navets frais.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/navets.jpg' },
    { name: 'Abricots', category: 'Fruits', region: 'Provence', expirationDate: new Date('2024-07-15'), price: 3.3, description: 'Abricots sucrés.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/abricots.jpg' },
    { name: 'Pois', category: 'Légumes', region: 'Normandie', expirationDate: new Date('2024-09-05'), price: 1.8, description: 'Pois frais.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/pois.jpg' },
    { name: 'Framboises', category: 'Fruits', region: 'Aquitaine', expirationDate: new Date('2024-06-20'), price: 4.2, description: 'Framboises fraîches.', origin: 'France', impact: 'Faible', imageUrl: '/images/blackbox/framboises.jpg' },
    { name: 'Haricots verts', category: 'Légumes', region: 'Pays de la Loire', expirationDate: new Date('2024-09-15'), price: 2.0, description: 'Haricots verts croquants.', origin: 'France', impact: 'Moyen', imageUrl: '/images/blackbox/haricots.jpg' }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Existing products removed');

        // Find a producer to assign to products
        const producer = await Producteur.findOne();
        if (!producer) {
            console.error('No producer found. Please seed producers first.');
            process.exit(1);
        }

        // Assign producerId to each product
        const productsWithProducer = products.map(p => ({
            ...p,
            producerId: producer._id
        }));

        await Product.insertMany(productsWithProducer);
        console.log('Sample products inserted');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

seed();
