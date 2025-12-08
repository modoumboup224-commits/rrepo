const mongoose = require('mongoose');
const Order = require('../models/Order');

async function listAllOrders() {
    try {
        await mongoose.connect('mongodb://localhost:27017/your_database_name');

        const orders = await Order.find({});
        console.log('All orders in database:', orders);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error listing all orders:', error);
    }
}

listAllOrders();
