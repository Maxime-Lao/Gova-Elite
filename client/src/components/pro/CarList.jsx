import React from 'react';
import CarItem from './CarItem';

const CarList = ({ cars }) => {
    const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
    };

    const itemStyle = {
        width: '500px',
        marginBottom: '20px',
    };

    return (
        <div>
            {cars.length ? (
                <div style={containerStyle}>
                    {cars.map((car) => (
                        <div key={car.id} style={itemStyle}>
                            <CarItem car={car} />
                        </div>
                    ))}
                </div>
            ) : (
                <h2>Vous n'avez pas encore de voiture enregistrée</h2>
            )}
        </div>
    );
};

export default CarList;
