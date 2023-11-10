import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import {RequiredField} from "../components/form/RequiredField.jsx";

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const minLength = 8;

    if (!regex.test(password) || password.length < minLength ) {
        return "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial et doit avoir au moins 8 caractères.";
    }

    if (password.length < minLength) {
        return `Le mot de passe doit avoir au moins ${minLength} caractères.`;
    }

    return null;
}

const Register = () => {
    const initialState = {
        email: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: '',
        phone: '',
        showPassword: false,
    };

    const [formData, setFormData] = useState(initialState);

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [successMessage, setSuccessMessage] = useState('');


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTogglePasswordVisibility = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword,
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            newErrors.password = passwordError;
            isValid = false;
        } else {
            newErrors.password = '';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
            isValid = false;
        } else {
            newErrors.confirmPassword = '';
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:8000/api/register', {
                    ...formData,
                    token: 'ok',
                });

                setFormData(initialState);
                setSuccessMessage('Votre compte a été créé, vous allez recevoir un email de validation.');
            } catch (error) {
                console.error("Une erreur s'est produite : ", error);
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                <Typography variant="h5" component="div" align="center">
                    Créer votre compte!
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
                    </Box>
                    <Box mt={2}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            type={formData.showPassword ? 'text' : 'password'}
                            fullWidth
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                        >
                                            {formData.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box mt={2}>
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            type={formData.showPassword ? 'text' : 'password'}
                            fullWidth
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                        >
                                            {formData.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box mt={2}>
                        <TextField
                            label="Firstname"
                            variant="outlined"
                            fullWidth
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                    </Box>
                    <Box mt={2}>
                        <TextField
                            label="Lastname"
                            variant="outlined"
                            fullWidth
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                    </Box>
                    <Box mt={2}>
                        <TextField
                            label="Phone number"
                            variant="outlined"
                            fullWidth
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Box>
                    <Box mt={2}>
                        <RequiredField />
                    </Box>
                    <Box mt={2} mb={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
                        </Button>
                    </Box>
                </form>
            </Paper>
            <Box mt={2} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                    Your additional content or links here
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
