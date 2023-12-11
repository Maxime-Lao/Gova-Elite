import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Paper,
} from '@mui/material';
import sendRequest from "../../services/axiosRequestFunction.js";
import {useNavigate, useParams} from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const params = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password === confirmPassword) {
            sendRequest(
                '/reset_password',
                'post',
                {
                    password: password,
                    token:params.token
                },
                false
            ).then((response) => {
                navigate('/login');
                console.log(response)
            })
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: '2rem' }}>
                <Typography variant="h5" gutterBottom>
                    Réinitialisation du mot de passe
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                label="Nouveau mot de passe"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                label="Confirmer le mot de passe"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {error && (
                                <Box mt={2}>
                                    <Typography color="error">{error}</Typography>
                                </Box>
                            )}
                            {success && (
                                <Box mt={2}>
                                    <Typography color="success">{success}</Typography>
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Réinitialiser le mot de passe
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default ResetPassword;