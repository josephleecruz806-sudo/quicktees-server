const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { total } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Quick Tees Order' },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://quicktees.netlify.app?success=true',
      cancel_url: 'https://quicktees.netlify.app?canceled=true',
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating checkout session');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
