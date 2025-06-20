const express = require('express');
const Stripe = require('stripe');
const { generatePromptPayQR } = require('./promptpay');
const app = express();
// Allow requests from any origin so the React frontend running on a different
// port can communicate with this server during development.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: { name: 'Credits' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Generate and display PromptPay QR code
app.get('/pay', async (req, res) => {
  const { recipient, amount } = req.query;
  try {
    const qrUrl = await generatePromptPayQR(recipient, amount);
    res.send(`<!doctype html><html><body><img src="${qrUrl}" alt="PromptPay QR"></body></html>`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.listen(4242, () => console.log('Server running on port 4242'));
