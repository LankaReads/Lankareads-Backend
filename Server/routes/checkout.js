const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ensure your Stripe secret key is set in environment variables
const app = express();
app.use(express.json()); // To parse JSON bodies

// Route to create a checkout session with Stripe
app.post('/create-checkout-session', async (req, res) => {
    const { amount, bookId, name, image, price,bookdoc } = req.body;

    try {
        // Ensure BASE_URL is defined
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
            throw new Error('BASE_URL is not defined in environment variables.');
        }

        // Create a checkout session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: name, // Book title
                            images: [image], // Book image URL
                        },
                        unit_amount: amount, // Amount in cents
                    },
                    quantity: 1, // Quantity of the book
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/success`, // Redirect after successful payment
            cancel_url: `${baseUrl}/cancel`, // Redirect if payment is canceled
            metadata: {
                bookId: bookId,
                bookName: name,
                bookPrice: price,
                bookDoc: bookdoc,
            },
        });

        // Respond with the session URL
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error.message);
        res.status(500).json({ message: 'Failed to create checkout session.' });
    }
});

// Set up your server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
