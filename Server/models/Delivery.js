const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  cartItems: [
    {
      name: { type: String, required: true }, // Include book name
      price: { type: Number, required: true }, // Include book price
    }
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery;
