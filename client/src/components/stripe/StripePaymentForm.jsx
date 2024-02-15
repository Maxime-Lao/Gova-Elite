import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

const StripePaymentForm = ({ onPaymentSuccess, carPrice }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm onPaymentSuccess={onPaymentSuccess} carPrice={carPrice}/>
    </Elements>
  );
};

export default StripePaymentForm;
