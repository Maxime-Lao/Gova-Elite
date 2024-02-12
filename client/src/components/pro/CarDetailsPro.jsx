import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import CarSchedule from "./CarSchedule.jsx";

const CarDetailsPro = () => {
    const {carId} = useParams();

    const [car, setCar] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await fetch(`http://195.35.29.110:8000/api/cars/${carId}`);
                if (!response.ok) {
                    throw new Error('An error occurred');
                }
                const data = await response.json();
                setCar(data);
            } catch (error) {
                console.error('Error fetching car:', error);
            }
        };
        fetchCar();
    }, []);

    return car ? (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-3xl font-semibold mb-4">
                {car.model.brand.name} - {car.model.name}
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <img
                        src={car.media.length > 0 ? `http://localhost:8000/media/${car.media[0].filePath}` : 'https://source.unsplash.com/random'}
                        alt="Car Image"
                        className="w-full h-auto"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-lg font-semibold mb-2">Kilométrage:</p>
                        <p className="text-gray-700 mb-4">{car.mileage} km</p>
                        <p className="text-lg font-semibold mb-2">Prix:</p>
                        <p className="text-gray-700 mb-4">{car.price} €</p>
                        <p className="text-lg font-semibold mb-2">Année:</p>
                        <p className="text-gray-700 mb-4">{car.year}</p>
                        <p className="text-lg font-semibold mb-2">Cheveaux:</p>
                        <p className="text-gray-700 mb-4">{car.horses}</p>
                        <p className="text-lg font-semibold mb-2">Catégorie:</p>
                        <p className="text-gray-700 mb-4">{car.category.libelle}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold mb-2">Carburant:</p>
                        <p className="text-gray-700 mb-4">{car.energy.name}</p>
                        <p className="text-lg font-semibold mb-2">Portes:</p>
                        <p className="text-gray-700 mb-4">{car.doors}</p>
                        <p className="text-lg font-semibold mb-2">Boîte de vitesse:</p>
                        <p className="text-gray-700 mb-4">{car.gear.name}</p>
                        <p className="text-lg font-semibold mb-2">Nombre de places:</p>
                        <p className="text-gray-700 mb-4">{car.nbSeats}</p>
                        <p className="text-lg font-semibold mb-2">Carburant:</p>
                        <p className="text-gray-700 mb-4">{car.energy.name}</p>
                    </div>
                </div>
            </div>
            <div>
                <p className="text-lg font-semibold mb-2">Description:</p>
                <p className="text-gray-700 mb-4">{car.description}</p>
            </div>
            <div>
                <p className="text-lg font-semibold mb-2">Planning de la gova</p>
                <CarSchedule rents={car.rents}/>
            </div>
        </div>
    ) : null;
};

export default CarDetailsPro;
