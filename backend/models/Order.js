const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
    comment: { type: String, default: '' }
});

module.exports = mongoose.model('Order', orderSchema);
