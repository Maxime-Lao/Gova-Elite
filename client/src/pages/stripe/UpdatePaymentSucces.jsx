import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import { Typography, Box, Button, Container } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

const UpdatePaymentSuccess = () => {
    const navigate = useNavigate();

    const handlebackHome = () => {
        navigate('/bookings');
    };

    return (
        <div>
            <Navbar />
            <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
            <Box
                sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                backgroundColor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                }}
            >
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography component="h1" variant="h5" gutterBottom>
                Paiement réussi
                </Typography>
                <Typography variant="body1">
                Votre paiement a été traité avec succès. Merci pour votre achat.
                </Typography>
                <Button
                variant="contained"
                color="primary"
                onClick={handlebackHome}
                sx={{ mt: 3, mb: 2 }}
                >
                Retour à mes réservations
                </Button>
            </Box>
            </Container>
        </div>
    );
};

export default UpdatePaymentSuccess;
