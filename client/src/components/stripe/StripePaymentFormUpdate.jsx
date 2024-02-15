import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import StripeCheckoutFormUpdate from './StripeCheckoutFormUpdate';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

const StripePaymentFormUpdate = ({ onPaymentSuccess, rentId, originalPaymentIntentId, carPrice }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutFormUpdate onPaymentSuccess={onPaymentSuccess} rentId={rentId} originalPaymentIntentId={originalPaymentIntentId} carPrice={carPrice}/>
    </Elements>
  );
};

export default StripePaymentFormUpdate;
