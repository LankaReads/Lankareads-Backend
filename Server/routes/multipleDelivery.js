const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const nodemailer = require('nodemailer');
const transporter = require('../config/nodemailer');

// Route to handle multiple items (cart) delivery details submissions
router.post('/', async (req, res) => {
    const { name, email, phone, address, cartItems, totalPrice } = req.body;

    try {
        const newDelivery = new Delivery({ name, email, phone, address, cartItems, totalPrice });
        await newDelivery.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Delivery Confirmation',
            text: `Dear ${name},\n\nYour delivery order has been received. Details:\n\n${cartItems.map(item => `Book: ${item.bookName}\nPrice: ${item.bookPrice}\n`).join('')}\nTotal Price: ${totalPrice}\nAddress: ${address}\n\nThank you for your order!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Delivery details submitted, but email failed to send.' });
            } else {
                return res.status(200).json({ message: 'Delivery details submitted successfully!' });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to submit delivery details.' });
    }
});

module.exports = router;
