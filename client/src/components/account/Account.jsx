import React, {useEffect, useState} from 'react';
import {Paper, Typography, Grid, Button, TextField, Box} from '@mui/material';
import useGetConnectedUser from '../hooks/useGetConnectedUser';
import Navbar from "../navbar/Navbar.jsx";

const Account = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const user = useGetConnectedUser();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstname: user.connectedUser?.firstname || '',
        lastname: user.connectedUser?.lastname || '',
        email: user.connectedUser?.email || '',
        phone: user.connectedUser?.phone || '',
    });

    useEffect(() => {
        if (user.connectedUser) {
            setFormData({
                firstname: user.connectedUser.firstname || '',
                lastname: user.connectedUser.lastname || '',
                email: user.connectedUser.email || '',
                phone: user.connectedUser.phone || '',
            });
        }
    }, [user.connectedUser]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData({
            firstname: user.connectedUser?.firstname || '',
            lastname: user.connectedUser?.lastname || '',
            email: user.connectedUser?.email || '',
            phone: user.connectedUser?.phone || '',
        });
    };

    const handleSaveClick = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${user.connectedUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsEditing(false);
                setSuccess('Informations mises à jour avec succès');
            } else {
                setError('Erreur lors de la mise à jour des informations utilisateur');
            }
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour des informations utilisateur');
        }
    };

    return (
        <>
            <Navbar/>
            <div className='mt-4'>
                <Paper style={{ maxWidth: 600, margin: 'auto', padding: '1rem' }}>
                    <Typography variant="h4" gutterBottom>
                        Mon compte
                    </Typography>
                    {
                        success.length ? (
                            <Box mt={2} textAlign="center">
                                <p style={{color: 'green'}}>{success}</p>
                            </Box>
                        ) : null
                    }
                    {
                        error.length ? (
                            <Box mt={2} textAlign="center">
                                <p style={{color: 'red'}}>{error}</p>
                            </Box>
                        ) : null
                    }
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="firstname"
                                label="Prénom"
                                value={formData.firstname}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { position: 'relative' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="lastname"
                                label="Nom"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { position: 'relative' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { position: 'relative' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="phone"
                                label="Numéro de téléphone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { position: 'relative' },
                                }}
                            />
                        </Grid>
                    </Grid>
                    {isEditing ? (
                        <div className="mt-4">
                            <Button onClick={handleSaveClick} variant="contained" color="primary">
                                Sauvegarder
                            </Button>
                            <Button onClick={handleCancelClick} variant="outlined" style={{ marginLeft: '1rem' }}>
                                Annuler
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleEditClick} variant="outlined" style={{ marginTop: '1rem' }}>
                            Modifier
                        </Button>
                    )}
                </Paper>
            </div>
        </>
    );
};

export default Account;
