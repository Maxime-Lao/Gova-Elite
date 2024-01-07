import React from 'react';
import { Typography, Divider } from '@mui/material';

const CompanieDetails = ({ companie }) => {
    const { name, address, city, zipCode, cars } = companie;

    const rootStyle = {
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '16px',
    };

    const titleStyle = {
        marginBottom: '8px',
    };

    const addressStyle = {
        marginBottom: '8px',
        fontWeight: 'bold',
    };

    const carsInfoStyle = {
        marginTop: '16px',
    };

    return (
        <div style={rootStyle}>
            <Typography variant="h5" style={titleStyle}>
                {name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" style={addressStyle}>
                Address:
            </Typography>
            <Typography variant="body1">{address}</Typography>
            <Typography variant="body1">{city}, {zipCode}</Typography>
            <Divider />
            <div style={carsInfoStyle}>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Nombre de voitures: {cars.length}
                </Typography>
                {/* Ajoute ici la logique pour afficher les détails des voitures */}
            </div>
        </div>
    );
};

export default CompanieDetails;