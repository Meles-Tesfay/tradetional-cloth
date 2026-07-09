const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  description: { type: String },
  category: { type: String, required: true },
  gender: { type: String, enum: ['women', 'men', 'children', 'unisex'], default: 'unisex' },
  badge: { type: String, enum: ['bestseller', 'new', 'sale', ''], default: '' },
  stock: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['in', 'low', 'out'], default: 'in' },
  image: { type: String },
  rating: { type: Number, default: 5.0 },
  reviews: { type: Number, default: 0 },
  sizes: [String],
  colors: [String],
  tags: [String],
  origin: { type: String, default: 'Ethiopia' },
  material: { type: String, default: '100% Handwoven Cotton' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
