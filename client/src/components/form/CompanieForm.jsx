import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import useGetConnectedUser from '../hooks/useGetConnectedUser';
import { useNavigate } from 'react-router-dom';

function CompanieForm() {
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

        console.log(user);
        if (user && user.connectedUser.id) {
            formData.append('userId', user.connectedUser.id);
        }        

        try {
            const response = await fetch('http://195.35.29.110:8000/api/companies', {
                method: 'POST',
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
        <Grid container spacing={2} justifyContent="center">
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
                    />
                    <TextField
                        name="address"
                        value={companie.address}
                        onChange={handleChange}
                        label="Adresse"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="zipCode"
                        value={companie.zipCode}
                        onChange={handleChange}
                        label="Code Postal"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="city"
                        value={companie.city}
                        onChange={handleChange}
                        label="Ville"
                        fullWidth
                        margin="normal"
                    />
                    <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                        <input
                            type="file"
                            name="kbis"
                            onChange={handleFileChange}
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
