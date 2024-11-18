const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

const subscriptionSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Route to handle subscription
app.post('/subscribe', async (req, res) => {
    const { name, email } = req.body;

    try {
        const newSubscription = new Subscription({ name, email });
        await newSubscription.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank You for Subscribing!',
            text: `Dear ${name},\n\nThank you for subscribing to our updates! We will keep you informed.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error while sending email:', error);
                return res.status(500).json({ message: 'Subscription succeeded, but email failed.' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: 'You have successfully subscribed!' });
            }
        });
    } catch (error) {
        console.error('Error during subscription:', error);
        return res.status(500).json({ message: 'Subscription failed.' });
    }
});

app.listen(port, () => {
    console.log(`Email server is running on port: ${port}`);
});
