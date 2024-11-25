import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';
import { FormContainer, PaymentFormContainer } from './payment-form.styles';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectCartTotal } from '../../store/cart/cart.selector';
import { selectCurrentUser } from '../../store/user/user.selector';

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const amount = useSelector(selectCartTotal);
  const currentUser = useSelector(selectCurrentUser);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const paymentHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsProcessingPayment(true);
    try {
      const response = await fetch(
        '/.netlify/functions/create-payment-intent',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: amount * 100 }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const clientSecret = data.paymentIntent.client_secret;
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
        billing_details: {
          name: currentUser ? currentUser.displayName : 'Guest',
        },
      });

      setIsProcessingPayment(false);

      if (paymentResult.error) {
        alert(paymentResult.error, 'Payment failed');
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          alert('Payment successful');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <PaymentFormContainer>
      <FormContainer onSubmit={paymentHandler}>
        <h2>Credit Card Payment</h2>
        <CardElement />
        <Button
          disabled={isProcessingPayment}
          buttonType={BUTTON_TYPE_CLASSES.inverted}
        >
          Pay Now
        </Button>
      </FormContainer>
    </PaymentFormContainer>
  );
}

export default PaymentForm;

// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';
// import { FormContainer, PaymentFormContainer } from './payment-form.styles';

// function PaymentForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   const paymentHandler = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       return;
//     }
//     const response = await fetch('./netlify/functions/create-payment-intent.js', {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ amount: 10369 }),
//     }).then((res) => res.json());
//     console.log(response);
//   };

//   return (
//     <PaymentFormContainer>
//       <FormContainer onSubmit={paymentHandler}>
//         <h2>Credit Card Payment</h2>
//         <CardElement />
//         <Button buttonType={BUTTON_TYPE_CLASSES.inverted}>Pay Now</Button>
//       </FormContainer>
//     </PaymentFormContainer>
//   );
// }

// export default PaymentForm;
