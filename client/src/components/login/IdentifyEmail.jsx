import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import send from "../../services/axiosRequest.js";

const IdentifyEmail = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await send(
                '/forgot_password_send_email',
                'post',
                {
                    email: email,
                },
                false
            );
            setSuccess(response);
        } catch (error) {
            setError(error.response.data);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom textAlign="center">
                Mot de passe oublié ?
            </Typography>
            <Typography gutterBottom textAlign="center">
                Veuillez saisir votre adresse e-mail afin de recevoir un lien pour réinitialiser votre mot de passe.
            </Typography>
            {success && (
                <Box mt={2}>
                    <Alert severity="success">{success}</Alert>
                </Box>
            )}
            {error && (
                <Box mt={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <TextField
                        type="email"
                        label="Adresse e-mail"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                        margin="normal"
                        required
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Réinitialiser le mot de passe
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default IdentifyEmail;