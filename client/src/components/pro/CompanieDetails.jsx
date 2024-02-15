import React from 'react';

const CompanieDetails = ({ companie }) => {
    const { name, address, city, zipCode, cars } = companie;

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md mb-4">
            <h1 className="text-2xl font-bold mb-2">{name}</h1>
            <p className="text-gray-600 mb-1 font-bold">Address:</p>
            <p className="mb-2">{address}</p>
            <p className="text-gray-600 mb-1">{city}, {zipCode}</p>
            <hr className="my-4 border-t-2 border-gray-300" />
            <div className="mt-4">
                <p className="mb-2 text-gray-600 font-bold">Nombre de voitures: {cars.length}</p>
            </div>
        </div>
    );
};

export default CompanieDetails;
