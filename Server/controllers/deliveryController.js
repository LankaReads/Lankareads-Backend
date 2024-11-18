const mongoose = require('mongoose');

// Define the delivery schema
const deliverySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  bookName: { type: String, required: true },
  bookPrice: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the delivery model
const Delivery = mongoose.model('Delivery', deliverySchema);

// Handle delivery submission
exports.handleDelivery = async (req, res) => {
  const { name, email, phone, address, bookName, bookPrice } = req.body;

  try {
    // Save delivery details to MongoDB
    const newDelivery = new Delivery({
      name,
      email,
      phone,
      address,
      bookName,
      bookPrice,
    });

    await newDelivery.save();
    res.status(200).json({ message: 'Delivery details saved successfully.' });
  } catch (error) {
    console.error('Error saving delivery details:', error);
    res.status(500).json({ message: 'Failed to save delivery details.' });
  }
};
