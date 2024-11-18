const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    cartItems: [{ bookName: String, bookPrice: Number }],
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
