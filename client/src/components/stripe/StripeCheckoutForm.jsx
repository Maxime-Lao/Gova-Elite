import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Card, CardContent, LinearProgress, Snackbar, Alert } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';

const StripeCheckoutForm = ({ onPaymentSuccess, carPrice }) => {
  const stripe = useStripe();
  const token = localStorage.getItem('token');
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
      setError(error.message);
      setLoading(false);
    } else {      
      fetch('http://localhost:8000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({paymentMethodId: paymentMethod.id, amount: carPrice}),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          onPaymentSuccess(data.paymentIntent.id);
          navigate('/payment-success');
        } else {
          console.log('Erreur de paiement', data.error);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setLoading(false);
      });
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 2 , position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400}}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <PaymentIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
            Informations de paiement
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Prix total : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(carPrice)}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <CardElement options={{style: {base: {fontSize: '16px', fontFamily: '"Roboto", sans-serif', '::placeholder': {color: '#aab7c4'}}}}} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!stripe || loading}
                    color="primary"
                    startIcon={<PaymentIcon />}
                >
                    {loading ? 'Traitement...' : 'Payer'}
                </Button>
                {loading && (
                    <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                    </Box>
                )}
            </Box>
          </form>
        </CardContent>
      </Card>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StripeCheckoutForm;
