const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // e.g. HH-8821
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  amount: { type: Number, required: true },
  items: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
