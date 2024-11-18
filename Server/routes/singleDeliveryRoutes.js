const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

// POST endpoint to handle single and multiple delivery data
router.post('/api/single/delivery', async (req, res) => {
  try {
    const { deliveries } = req.body;

    // If deliveries is an array, handle multiple deliveries
    if (Array.isArray(deliveries)) {
      // Validate each delivery in the array
      for (let i = 0; i < deliveries.length; i++) {
        const { name, email, phone, address, agree, cartItems, totalPrice } = deliveries[i];
        if (!name || !email || !phone || !address || agree === undefined || !cartItems || totalPrice === undefined) {
          return res.status(400).json({ message: `Missing required fields in delivery #${i + 1}` });
        }
      }

      // Save all deliveries to the database
      await Delivery.insertMany(deliveries);
      res.status(201).json({ message: 'Multiple delivery details submitted successfully!' });

    } else {
      // If deliveries is not an array, handle a single delivery
      const { name, email, phone, address, agree, cartItems, totalPrice } = req.body;

      // Validate the presence of required fields
      if (!name || !email || !phone || !address || agree === undefined || !cartItems || totalPrice === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create a new delivery entry
      const newDelivery = new Delivery({
        name,
        email,
        phone,
        address,
        agree,
        cartItems,
        totalPrice,
      });

      // Save to the database
      await newDelivery.save();
      res.status(201).json({ message: 'Single delivery details submitted successfully!' });
    }

  } catch (error) {
    console.error('Error submitting delivery details:', error);
    res.status(500).json({ message: 'Failed to submit delivery details.' });
  }
});

module.exports = router;
