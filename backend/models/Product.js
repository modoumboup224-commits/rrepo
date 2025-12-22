import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    region: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    price: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true, default: 0 },
    producerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producteur', required: true },
    description: { type: String },
    origin: { type: String },
    impact: { type: String },
    imageUrl: { type: String }, // Pour compatibilité rétroactive
    images: [{ type: String }] // Tableau d'URLs d'images
});

export default mongoose.model('Product', productSchema);
