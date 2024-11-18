const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// POST endpoint to handle subscription requests
router.post('/subscribe', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Check if the user is already subscribed
        const existingSubscription = await Subscription.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({ message: 'Email is already subscribed.' });
        }

        // Save subscription details to MongoDB
        const newSubscription = new Subscription({ name, email });
        await newSubscription.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank You for Subscribing!',
            text: `Dear ${name},\n\nThank you for subscribing to our updates! We will keep you informed.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Subscription successful! Confirmation email sent.' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ message: 'Subscription failed.' });
    }
});

// POST endpoint to handle unsubscription requests
router.post('/unsubscribe', async (req, res) => {
    const { email } = req.body;

    try {
        // Find and delete the subscription from MongoDB
        const deletedSubscription = await Subscription.findOneAndDelete({ email });

        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Email not found. Unsubscription failed.' });
        }

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'You have unsubscribed',
            text: 'You have successfully unsubscribed from our updates.',
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Unsubscription successful! Confirmation email sent.' });
    } catch (error) {
        console.error('Unsubscription error:', error);
        res.status(500).json({ message: 'Unsubscription failed.' });
    }
});

// GET endpoint to fetch all subscriptions
router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Failed to fetch subscriptions.' });
    }
});

// DELETE endpoint to delete a subscription by email
router.delete('/subscriptions/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const deletedSubscription = await Subscription.findOneAndDelete({ email });

        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }

        res.status(200).json({ message: 'Subscription deleted successfully.' });
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ message: 'Failed to delete subscription.' });
    }
});

module.exports = router;
