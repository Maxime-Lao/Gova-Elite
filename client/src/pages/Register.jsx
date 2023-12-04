import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem, Box, Link, Input
} from '@mui/material';
import sendRequest from "../services/axiosRequestFunction";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('');
    const [kbis, setKbis] = useState('');
    const [showKbis, setShowKbis] = useState(false);
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        sendRequest(
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
            },
            false
        ).then(response =>
            navigate("/login"))
            .catch(error => console.error("Erreur lors de l'inscription:", error));
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        if (e.target.value === 'professionnel') {
            setShowKbis(true);
        } else {
            setShowKbis(false);
            setKbis('');
        }
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
                <Box mt={2} textAlign="center">
                    <h2>Inscrivez-vous !</h2>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nom"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Prénom"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Téléphone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Rôle</InputLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            onChange={handleRoleChange}
                        >
                            <MenuItem value="particulier">Particulier</MenuItem>
                            <MenuItem value="professionnel">Professionnel</MenuItem>
                        </Select>
                    </FormControl>
                    {showKbis && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="kbis-file">KBIS</InputLabel>
                            <Input
                                id="kbis-file"
                                type="file"
                                onChange={(e) => setKbisFile(e.target.files[0])}
                                fullWidth
                            />
                        </FormControl>
                    )}
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
                    <Link href="/login">Vous n'avez pas de compte? Inscrivez-vous!</Link>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Register;
