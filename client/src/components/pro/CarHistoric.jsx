import React from 'react';

const CarHistoric = ({ car }) => {

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Historique de location de la voiture</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Numéro</th>
                        <th className="border border-gray-300 px-4 py-2">Date de début</th>
                        <th className="border border-gray-300 px-4 py-2">Date de fin</th>
                        <th className="border border-gray-300 px-4 py-2">Locataire</th>
                        <th className="border border-gray-300 px-4 py-2">Prix</th>
                    </tr>
                    </thead>
                    <tbody>
                    {car.rents.map((rent, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{index+ 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatDate(rent.dateStart)}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatDate(rent.endDate)}</td>
                            <td className="border border-gray-300 px-4 py-2">{`${rent.user.firstname} ${rent.user.lastname}`}</td>
                            <td className="border border-gray-300 px-4 py-2">{rent.totalPrice} €</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CarHistoric;
