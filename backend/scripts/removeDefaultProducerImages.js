const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencard', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const removeDefaultImages = async () => {
    try {
        await connectDB();

        // Find all producers with default image
        const result = await Producteur.updateMany(
            { photoUrl: '/images/default-producer.jpg' },
            { $set: { photoUrl: null } }
        );

        console.log(`Updated ${result.modifiedCount} producers to remove default images`);

        // Verify the update
        const remainingDefaults = await Producteur.countDocuments({ photoUrl: '/images/default-producer.jpg' });
        console.log(`Remaining producers with default images: ${remainingDefaults}`);

        process.exit(0);
    } catch (error) {
        console.error('Error removing default images:', error);
        process.exit(1);
    }
};

removeDefaultImages();
