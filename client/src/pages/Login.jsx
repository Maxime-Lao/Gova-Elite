import React, { useState } from "react";
import { TextField, Button, Grid ,Box, Typography } from "@mui/material";
import sendRequest from "../services/axiosRequestFunction";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await sendRequest(
                '/auth',
                'post',
                {
                    email: email,
                    password: password,
                },
                false
            );

            localStorage.setItem('token', response.token);
            localStorage.setItem('refresh_token', response.refresh_token);
            localStorage.setItem('email', email);
            navigate('/');
        } catch (error) {
            // En cas d'erreur, mettez le message d'erreur dans l'état 'error'
            setError(error.response.data.message);
        }
    };

    const linkStyle = {
        cursor: 'pointer',
        textDecoration: 'underline',
        color: 'blue',
    };

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={12} sm={6}>
                <Box mt={2} textAlign="center">
                    <h2>Connectez-vous !</h2>
                </Box>
                {
                    error.length ? (
                        <Box mt={2} textAlign="center">
                            <p style={{color: 'red'}}>{error}</p>
                        </Box>
                    ) : null
                }
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Box mt={2} textAlign="left">
                        <Typography onClick={() => navigate('/login/identify')} style={linkStyle}>
                            Mot de passe oublié?
                        </Typography>
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        style={{ marginTop: '1rem' }}
                    >
                        Se connecter
                    </Button>
                </form>
            </Grid>
            <Box mt={2} textAlign="center">
                <Typography onClick={() => navigate('/register')} style={linkStyle}>
                    Vous n'avez pas de compte? Inscrivez-vous!
                </Typography>
            </Box>
        </Grid>
    );
}
