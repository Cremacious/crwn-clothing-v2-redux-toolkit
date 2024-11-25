import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';
import { FormContainer, PaymentFormContainer } from './payment-form.styles';

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const paymentHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    try {
      const response = await fetch(
        '/.netlify/functions/create-payment-intent',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: 10369 }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <PaymentFormContainer>
      <FormContainer onSubmit={paymentHandler}>
        <h2>Credit Card Payment</h2>
        <CardElement />
        <Button buttonType={BUTTON_TYPE_CLASSES.inverted}>Pay Now</Button>
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
