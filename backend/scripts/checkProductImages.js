const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: __dirname + '/../.env' });

async function checkImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find().limit(5);
    products.forEach(p => {
      console.log('Product: ' + p.name + ', imageUrl: ' + p.imageUrl);
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkImages();
