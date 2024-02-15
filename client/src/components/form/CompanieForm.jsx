import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import useGetConnectedUser from '../hooks/useGetConnectedUser';
import { useNavigate } from 'react-router-dom';

function CompanieForm() {
    const token = localStorage.getItem('token');
    const user = useGetConnectedUser();
    const navigate = useNavigate();

    const [companie, setCompanie] = useState({
        name: '',
        address: '',
        zipCode: '',
        city: '',
        createdAt: new Date().toISOString(),
    });
    const [kbisFile, setKbisFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanie({ ...companie, [name]: value });
    };

    const handleFileChange = (e) => {
        setKbisFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(companie).forEach(key => {
            formData.append(key, companie[key]);
        });
        if (kbisFile) {
            formData.append('kbis', kbisFile);
        }

        if (user && user.connectedUser.id) {
            formData.append('userId', user.connectedUser.id);
        }        

        try {
            const response = await fetch('http://localhost:8000/api/companies', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            navigate('/');
        } catch (error) {
            console.error('Error creating companie:', error);
        }
    };

    return (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 7, mb: 7 }}>
            <Grid item xs={12} sm={6}>
                <Box mt={2} textAlign="center">
                    <h1>Créer une entreprise</h1>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="name"
                        value={companie.name}
                        onChange={handleChange}
                        label="Nom de l'entreprise"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="address"
                        value={companie.address}
                        onChange={handleChange}
                        label="Adresse"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="zipCode"
                        value={companie.zipCode}
                        onChange={handleChange}
                        type="number"
                        label="Code Postal"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="city"
                        value={companie.city}
                        onChange={handleChange}
                        label="Ville"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                        <input
                            type="file"
                            name="kbis"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        style={{ marginTop: '1rem' }}
                    >
                        Enregistrer
                    </Button>
                </form>
            </Grid>
        </Grid>
    );
}

export default CompanieForm;
