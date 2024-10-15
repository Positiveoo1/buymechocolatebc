const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Make sure you are using your Stripe secret key

const app = express();

// Step 1: Define allowed origins
const allowedOrigins = ['https://buymechocolate.vercel.app', 'http://localhost:3000']; // Add both your production and local domains

// Step 2: Configure CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Stripe Payment Intent Route
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in smallest unit (e.g., cents for USD)
      currency: currency || 'pln', // Set default to PLN if not provided
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the server on port 5000 or the environment port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
