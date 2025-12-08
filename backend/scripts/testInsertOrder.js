const mongoose = require('mongoose');
const Order = require('../models/Order');

async function testInsertOrder() {
    try {
        await mongoose.connect('mongodb://localhost:27017/your_database_name');

        const testOrder = new Order({
            userId: new mongoose.Types.ObjectId('688207da920fc041dcd33a71'),
            products: [
                {
                    productId: new mongoose.Types.ObjectId('68833466b3092a4e052a25bf'),
                    name: 'Test Product',
                    quantity: 2,
                    price: 10.5,
                },
            ],
            status: 'paid',
        });

        const savedOrder = await testOrder.save();
        console.log('Order saved successfully:', savedOrder);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error inserting test order:', error);
    }
}

testInsertOrder();
