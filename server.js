const express = require('express');
const stripe = require('stripe')('sk_test_51QA3sNRqZusjXCWQCkLREf7ITIcvHWNxtVLxG3MX9TGwbkdFL0clZRTmsSpIxfbWVk8CfoH6JaXeeQrek3YWncU600eITOKVDT');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const allowedOrigins = ['https://buymechocolate.vercel.app', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);  
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],  
  allowedHeaders: ['Content-Type', 'Authorization'],  
  credentials: true,  
}));

app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'pln',
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
