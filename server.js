const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your Secret Key from environment variables

const app = express();

// CORS configuration: Allow only requests from your frontend URL
app.use(cors({
  origin: 'https://buymechocolate.vercel.app/', // Replace with your actual frontend URL
  methods: ['POST'], // Restrict to POST requests if that's all you need
}));

app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create a PaymentIntent with the provided amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in the smallest currency unit (e.g., cents)
      currency: currency || 'pln', // Default to PLN (Polish Zloty)
    });

    // Send back the client secret to the frontend
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
