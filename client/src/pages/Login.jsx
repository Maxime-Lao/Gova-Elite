import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

const Login = () => {
    const initialState = {
        email: '',
        password: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Validation générique pour tous les champs
        Object.keys(formData).forEach((fieldName) => {
            if (!formData[fieldName]) {
                newErrors[fieldName] = 'Ce champ est obligatoire.';
                isValid = false;
            } else {
                newErrors[fieldName] = '';
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8000/api/login', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/ld+json',
                    },
                    body: JSON.stringify(formData),
                });

                console.log(response);

                if (response.data.error) {
                    setSuccessMessage('');
                    setErrors({ email: 'Échec de la connexion. Veuillez vérifier vos informations.' });
                } else {
                    setSuccessMessage('Connexion réussie ! Redirection...');

                    // Ajoutez ici une redirection vers la page d'accueil ou toute autre page nécessaire
                    // Exemple : window.location.href = '/';
                }
            } catch (error) {
                console.error("Une erreur s'est produite : ", error);
                setSuccessMessage('Échec de la connexion. Veuillez vérifier vos informations.');
            }
        }
    };


    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                <Typography variant="h5" component="div" align="center" fontWeight="bold">
                    Login
                </Typography>
                {successMessage && (
                    <Typography variant="body1" color="primary" align="center" gutterBottom>
                        {successMessage}
                    </Typography>
                )}
                <form onSubmit={handleSubmit}>
                    <Box mt={2}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <div>{errors.email}</div>
                    </Box>
                    <Box mt={2}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div>{errors.password}</div>
                    </Box>
                    <Box mt={2} mb={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </Box>
                </form>
            </Paper>
            <Box mt={2} textAlign="center">
                <Link href="/register">Vous n'avez pas de compte? Inscrivez-vous!</Link>
            </Box>
        </Container>
    );
};

export default Login;