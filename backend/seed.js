require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Data adapted from frontend data.js
const PRODUCTS = [
  {
    name: 'Gold Tilet Classic Kemis', sku: 'HH-W-001', price: 189,
    description: 'A masterpiece of traditional weaving. Hand-spun cotton adorned with intricate gold Tilet, perfect for formal events and holidays.',
    category: "Women's", stock: 34, status: 'in', image: '/assets/hero_model.png',
    rating: 4.9, reviews: 128, sizes: ['S', 'M', 'L', 'XL', 'Custom'], colors: ['white', 'gold']
  },
  {
    name: 'Royal Ceremonial Suit', sku: 'HH-M-003', price: 145,
    description: 'Classic men\'s traditional suit featuring subtle embroidery. Handwoven for breathable comfort and timeless elegance.',
    category: "Men's", stock: 5, status: 'low', image: '/assets/mens_outfit.png',
    rating: 4.8, reviews: 56, sizes: ['M', 'L', 'XL'], colors: ['white', 'black']
  },
  {
    name: 'Empress Bridal Kemis', sku: 'HH-B-007', price: 320, oldPrice: 380,
    description: 'The ultimate bridal statement piece. Features heavy, detailed hand-embroidery and premium natural cotton.',
    category: 'Bridal', stock: 12, status: 'in', image: '/assets/wedding.png',
    rating: 5.0, reviews: 34, sizes: ['Custom'], colors: ['white', 'gold', 'silver']
  },
  {
    name: 'Mini Heritage Family Set', sku: 'HH-F-012', price: 280,
    description: 'Matching traditional outfits for the whole family. Perfectly coordinated Tilet designs for unforgettable family photos.',
    category: "Children's", stock: 0, status: 'out', image: '/assets/children.png',
    rating: 4.7, reviews: 42, sizes: ['S', 'M', 'L'], colors: ['white']
  },
  {
    name: 'Artisan Silver Set', sku: 'HH-A-004', price: 68,
    description: 'Handcrafted traditional Ethiopian silver jewelry set from Lalibela. Includes necklace, earrings, and bracelet.',
    category: 'Accessories', stock: 28, status: 'in', image: '/assets/accessories.png',
    rating: 4.9, reviews: 89, sizes: ['One Size'], colors: ['silver']
  }
];

const ORDERS = [
  { orderId: 'HH-8821', product: 'Gold Tilet Classic Kemis', sub: 'Size: M, Thread: Gold', customer: 'Meron Tadesse', country: 'USA', status: 'delivered', amount: 189, date: 'Jul 8, 2025', image: '/assets/hero_model.png' },
  { orderId: 'HH-8820', product: 'Artisan Silver Set', sub: 'Lalibela Collection', customer: 'Sara Kifle', country: 'Sweden', status: 'shipped', amount: 68, date: 'Jul 7, 2025', image: '/assets/accessories.png' },
  { orderId: 'HH-8819', product: 'Empress Bridal Kemis', sub: 'Custom Measurements', customer: 'Yonas Abebe', country: 'Canada', status: 'processing', amount: 320, date: 'Jul 7, 2025', image: '/assets/wedding.png' },
  { orderId: 'HH-8818', product: 'Royal Ceremonial Suit', sub: 'Size: L', customer: 'Dawit Mekonnen', country: 'Ethiopia', status: 'pending', amount: 145, date: 'Jul 6, 2025', image: '/assets/mens_outfit.png' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habesha_heritage');
    console.log('✅ Connected to MongoDB for Seeding');

    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing data');

    await Product.insertMany(PRODUCTS);
    await Order.insertMany(ORDERS);
    console.log('🌱 Seeded new data successfully');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seed();
