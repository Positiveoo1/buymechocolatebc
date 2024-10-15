// server.js
const express = require('express');
const stripe = require('stripe')('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'); // Use your Secret Key here
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount should be in the smallest currency unit (e.g., cents for USD)
      currency: currency || 'pln', // Set to 'pln' for Polish Zloty
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
