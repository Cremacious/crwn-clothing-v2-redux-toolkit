require('dotenv').config();

// netlify/functions/create-payment-intent.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  try {
    const { amount } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentIntent }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// exports.handler = async function (event, context, callback) {
//   try {
//     const { amount } = JSON.parse(event.body);
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//       payment_method_types: ['card'],
//     });
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ error }),
//     };
//   }
// };
