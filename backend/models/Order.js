const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // e.g. HH-8821
  product: { type: String, required: true },
  sub: { type: String }, // sub title/category
  customer: { type: String, required: true },
  country: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  amount: { type: Number, required: true },
  image: { type: String },
  date: { type: String }, // formatted date string for simplicity
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
