const express = require('express');
const stripe = require('stripe')(process.env.stripe_secret_key); // 🔑 replace
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/create-checkout-session', async (req,res)=>{

 const session = await stripe.checkout.sessions.create({
  payment_method_types:['card'],
  mode:'payment',
  line_items:[{
    price_data:{
      currency:'usd',
      product_data:{ name:'Custom T-Shirt Order' },
      unit_amount: req.body.total * 100
    },
    quantity:1
  }],
  success_url:'http://localhost:3000/success.html',
  cancel_url:'http://localhost:3000'
 });

 res.json({ url: session.url });
});

app.listen(3000,()=>console.log('Server running'));