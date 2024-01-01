import React, {useEffect, useState} from 'react';
import {Paper, Typography, Grid, Button, TextField, Box} from '@mui/material';
import useGetConnectedUser from '../hooks/useGetConnectedUser';

const Account = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const user = useGetConnectedUser();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstname: user.connectedUser?.firstname,
        lastname: user.connectedUser?.lastname,
        email: user.connectedUser?.email,
        phone: user.connectedUser?.phone,
    });

    useEffect(() => {
        setFormData({
            firstname: user.connectedUser?.firstname,
            lastname: user.connectedUser?.lastname,
            email: user.connectedUser?.email,
            phone: user.connectedUser?.phone,
        });
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
        // Réinitialiser le formulaire aux valeurs actuelles de l'utilisateur connecté
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
                    'Content-Type': 'application/merge-patch+json', // Spécification du type de contenu attendu
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsEditing(false);
                setSuccess('Informations mises à jour avec succès');
                // Mettre à jour l'utilisateur ou effectuer toute autre action nécessaire après la mise à jour
            } else {
                setError('Erreur lors de la mise à jour des informations utilisateur');
            }
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour des informations utilisateur');
            // Gérer l'erreur, afficher un message à l'utilisateur, etc.
        }
    };

    return (
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
                <div>
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
    );
};

export default Account;
