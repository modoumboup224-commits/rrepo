const mongoose = require('mongoose');

const producteurSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    nom: { type: String, required: false, default: '' },
    localisation: { type: String, required: false, default: '' },
    produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    photoUrl: { type: String, default: null },
    photoAlt: { type: String, default: 'Photo du producteur' },
    isProfileComplete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Producteur', producteurSchema);
