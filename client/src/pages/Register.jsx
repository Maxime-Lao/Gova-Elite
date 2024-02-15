import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem, Box, Link, Input, Typography
} from '@mui/material';
import send from "../services/axiosRequest.js";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        send(
            '/api/users',
            'post',
            {
                email: email,
                plainPassword: password,
                firstname: firstname,
                lastname: lastname,
                roles: role === 'professionnel' ? ['ROLE_PRO'] : ['ROLE_USER'],
                phone: phone,
                password: password,
                isVerified: false
            },
            false
        ).then(response => navigate("/login"))
            .catch(error => {
                setError(error.response.data['hydra:description']);
                //setError(error.response.data.message);
            });
    }

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const linkStyle = {
        cursor: 'pointer',
        textDecoration: 'underline',
        color: 'blue',
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
                <Box mt={2} textAlign="center">
                    <h2>Inscrivez-vous !</h2>
                </Box>
                {
                    success.length ? (
                        <Box mt={2} textAlign="center">
                            <p style={{color: 'green'}}>{success}</p>
                        </Box>
                    ) : null
                }
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nom"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Prénom"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        autoComplete="email"
                        required
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        autoComplete="new-password"
                        required
                    />
                    <TextField
                        label="Téléphone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Rôle *</InputLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            onChange={handleRoleChange}
                            required
                        >
                            <MenuItem value="particulier">Particulier</MenuItem>
                            <MenuItem value="professionnel">Professionnel</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        error.length ? (
                            <Box mt={2} textAlign="center">
                                <p style={{color: 'red'}}>{error}</p>
                            </Box>
                        ) : null
                    }
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        style={{ marginTop: '1rem' }}
                    >
                        S'inscrire
                    </Button>
                </form>
                <Box mt={2} textAlign="center">
                    <Typography onClick={() => navigate('/login')} style={linkStyle}>
                        Vous avez déjà un compte? Connectez-vous!
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Register;
