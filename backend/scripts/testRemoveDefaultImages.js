const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

// Test script to verify default images are removed
const testRemoveDefaultImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencard', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Check current state
        const producersWithDefault = await Producteur.find({ photoUrl: '/images/default-producer.jpg' });
        console.log(`Found ${producersWithDefault.length} producers with default images`);

        // Check producers without images
        const producersWithoutImages = await Producteur.find({
            $or: [
                { photoUrl: null },
                { photoUrl: { $exists: false } }
            ]
        });
        console.log(`Found ${producersWithoutImages.length} producers without images`);

        process.exit(0);
    } catch (error) {
        console.error('Error testing:', error);
        process.exit(1);
    }
};

testRemoveDefaultImages();
