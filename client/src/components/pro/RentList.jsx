import React, { useEffect, useState } from "react";
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';

export default function RentList({ companieId }) {
    const token = localStorage.getItem('token');
    const [rents, setRents] = useState([]);

    useEffect(() => {
        const getRents = async () => {
            try {
                const response = await fetch(`https://kame-os.fr/api/companies/${companieId}/rents`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }

                const data = await response.json();
                setRents(data);
            } catch (error) {
                console.error(error);
            }
        };

        getRents();
    }, [companieId]);

    return (
        <div className="flex">
            <div className="flex-1 overflow-auto">
                <div className="mt-4 mb-4 flex-1 px-5">
                    <h2 className="mt-5 mb-5 text-3xl">Liste des réservations</h2>
                    <div className="container mx-auto">
                        <div className="flex justify-center">
                            <div className="w-full">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                    <tr className="bg-indigo-700 text-white">
                                        <th>Voiture</th>
                                        <th>Utilisateur</th>
                                        <th>Prix</th>
                                        <th>Date de départ</th>
                                        <th>Date de fin</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rents.map((rent) => (
                                        <tr key={rent.id} className="last:mb-0">
                                            <td>{`${rent.car.model.name} - ${rent.car.model.brand.name}`}</td>
                                            <td>{`${rent.user.firstname} ${rent.user.lastname}`}</td>
                                            <td>{`${rent.totalPrice}€`}</td>
                                            <td>{rent.dateStart ? format(new Date(rent.dateStart), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</td>
                                            <td>{rent.dateEnd ? format(new Date(rent.dateEnd), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};