import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import sendRequest from "../../services/axiosRequestFunction.js";

const IdentifyEmail = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        sendRequest(
            '/forgot_password_send_email',
            'post',
            {
                email: email,
            },
            false
        ).then((response) => {
            setSuccess('Un e-mail vous a été envoyé !')
        })

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
                    <Typography color="success">{success}</Typography>
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