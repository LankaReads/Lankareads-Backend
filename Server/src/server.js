const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');

const oauthRouter = require('../routes/oauth');
const requestRouter = require('../routes/request')

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Initialize Stripe with the secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, )
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err.message));

// Define the Subscription schema and model
const subscriptionSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true }, // Ensure email uniqueness
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Define the Delivery schema and model
const deliverySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cartItems: [{ bookName: String, bookPrice: String }], // Array of cart items
    totalPrice: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Delivery = mongoose.model('Delivery', deliverySchema);

// Nodemailer transporter configuration
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

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//register and login with google
app.use('/oauth', oauthRouter);
app.use('/request',requestRouter)

// Import and use book routes
const bookRoutes = require('../routes/Book'); // Adjust path as needed
app.use('/api', bookRoutes); // Adjust this path as needed

// Authentication routes

app.use('/api/auth', authRoutes);


// Route to handle subscription requests
app.post('/subscribe', async (req, res) => {
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

// Route to handle unsubscription requests
app.post('/unsubscribe', async (req, res) => {
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

// GET subscriptions for admin
app.get('/api/subscriptions', async (req, res) => {
    try {
        // Fetch all subscriptions from MongoDB
        const subscriptions = await Subscription.find();
        res.status(200).json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Failed to fetch subscriptions.' });
    }
});

// DELETE endpoint to delete a subscription by email
app.delete('/api/subscriptions/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Find and delete the subscription by email
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


// Route to handle multiple delivery details submissions
app.post('/api/delivery', async (req, res) => {
    const { name, email, phone, address, cartItems, totalPrice } = req.body;
  
    try {
     // Save delivery details to MongoDB
     const newDelivery = new Delivery({
        name,
        email,
        phone,
        address,
        cartItems: cartItems.map(item => ({
          bookName: item.name,
          bookPrice: item.price,
        })),
        totalPrice,
      });
      await newDelivery.save();
  
      // Send confirmation email
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
  

// Route to handle single delivery details submissions
app.post('/api/single/delivery', async (req, res) => {
    const { name, email, phone, address, bookName, bookPrice } = req.body;

    try {
        // Save delivery details to MongoDB
        const newDelivery = new Delivery({ name, email, phone, address, cartItems: [{ bookName, bookPrice }], totalPrice: bookPrice });
        await newDelivery.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Delivery Confirmation',
            text: `Dear ${name},\n\nYour delivery order has been received. Details:\n\nBook: ${bookName}\nPrice: ${bookPrice}\nAddress: ${address}\n\nThank you for your order!`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Delivery details submitted successfully!' });
    } catch (error) {
        console.error('Error submitting delivery details:', error);
        res.status(500).json({ message: 'Failed to submit delivery details.' });
    }
});
// Route to fetch all delivery details
app.get('/api/deliveries', async (req, res) => {
    try {
        const deliveries = await Delivery.find();
        res.status(200).json(deliveries);
    } catch (error) {
        console.error('Error fetching deliveries:', error);
        res.status(500).json({ message: 'Failed to fetch deliveries.' });
    }
});
// Route to handle deleting a delivery by ID
app.delete('/api/deliveries/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDelivery = await Delivery.findByIdAndDelete(id);

        if (!deletedDelivery) {
            return res.status(404).json({ message: 'Delivery not found.' });
        }

        res.status(200).json({ message: 'Delivery deleted successfully.' });
    } catch (error) {
        console.error('Error deleting delivery:', error);
        res.status(500).json({ message: 'Failed to delete delivery.' });
    }
});


app.post('/create-checkout-session', async (req, res) => {
    const { amount, name, image, price, bookdoc,bookId } = req.body;

    try {
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
            throw new Error('BASE_URL is not defined in environment variables.');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: name,  // Display book name
                            images: [image],  // Display book image
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}bookdoc?bookId=${bookId}&name=${encodeURIComponent(name)}&price=${price}&bookdoc=${encodeURIComponent(bookdoc)}&image=${encodeURIComponent(image)}`,
            cancel_url: `${baseUrl}`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout session error:', error);
        res.status(500).json({ message: 'Failed to create checkout session.' });
    }
});

// Backend: Modify /create-cart-checkout-session route
app.post('/create-cart-checkout-session', async (req, res) => {
    const { cart, totalPrice } = req.body;

    try {
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
            throw new Error('BASE_URL is not defined in environment variables.');
        }

        const lineItems = cart.map((book) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: book.name,
                    images: [book.image],
                },
                unit_amount: Math.round(book.price * 100), // Convert to cents
            },
            quantity: book.quantity || 1, // Default to 1 if no quantity provided
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${baseUrl}multiplebookdoc?totalPrice=${totalPrice}`,
            cancel_url: `${baseUrl}/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe cart checkout session error:', error);
        res.status(500).json({ message: 'Failed to create cart checkout session.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
