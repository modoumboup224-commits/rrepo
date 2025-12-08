require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function updateImageUrls() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        for (const product of products) {
            if (product.imageUrl && product.imageUrl.startsWith('frontend/')) {
                const newImageUrl = product.imageUrl.replace('frontend/', '/images/');
                product.imageUrl = newImageUrl;
                await product.save();
                console.log(`Updated imageUrl for product ${product.name} to ${newImageUrl}`);
            }
            if (product.imageUrl && product.imageUrl.startsWith('fronteend/')) {
                const newImageUrl = product.imageUrl.replace('fronteend/', '/images/');
                product.imageUrl = newImageUrl;
                await product.save();
                console.log(`Updated imageUrl for product ${product.name} to ${newImageUrl}`);
            }
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error updating image URLs:', error);
    }
}

updateImageUrls();
