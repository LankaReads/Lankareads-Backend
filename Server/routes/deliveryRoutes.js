const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const nodemailer = require('nodemailer');

// POST endpoint to handle single delivery data
router.post('/api/delivery', async (req, res) => {
  const { name, email, phone, address, cartItems, totalPrice } = req.body;

  try {
    // Save delivery details to MongoDB
    const newDelivery = new Delivery({
      name,
      email,
      phone,
      address,
      cartItems, // Save cartItems with name and price
      totalPrice,
    });
    await newDelivery.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Delivery Confirmation',
      text: `Dear ${name},\n\nYour delivery order has been received. Details:\n\n${cartItems
        .map((item) => `Book: ${item.name}\nPrice: $${item.price.toFixed(2)}\n`)
        .join('')}\nTotal Price: $${totalPrice.toFixed(2)}\nAddress: ${address}\n\nThank you for your order!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Delivery details submitted successfully!' });
  } catch (error) {
    console.error('Error submitting delivery details:', error);
    res.status(500).json({ message: 'Failed to submit delivery details.' });
  }
});

// Export the router
module.exports = router;
