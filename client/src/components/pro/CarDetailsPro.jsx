import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import CarSchedule from "./CarSchedule.jsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from "../navbar/Navbar.jsx";
import HorizontalTabs from "../others/HorizontalTabs.jsx";
import CarHistoric from "./CarHistoric.jsx";
import Slider from "react-slick";
import {imageStyle} from "../../pages/Car/CarDetails.jsx";

const getSliderSettings = (numberOfImages) => {
    return {
        dots: true,
        infinite: numberOfImages > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: numberOfImages > 1,
    };
};

const CarDetailsPro = () => {
    const {carId} = useParams();

    const [car, setCar] = useState(null);
    const [reason, setReason] = useState('');
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [errorUnavailability, setErrorUnavailability] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isCarUnavailableRents = car.rents.some((rent) => {
            const rentStartDate = new Date(rent.dateStart);
            const rentEndDate = new Date(rent.dateEnd);

            return (
                (startDate >= rentStartDate && startDate <= rentEndDate) ||
                (endDate >= rentStartDate && endDate <= rentEndDate) ||
                (startDate <= rentStartDate && endDate >= rentEndDate)
            );
        });

        const isCarUnavailableUnavailability = car.unavailability.some((unavailability) => {
            const unavailabilityStartDate = new Date(unavailability.date_start);
            const unavailabilityEndDate = new Date(unavailability.date_end);

            return (
                (startDate >= unavailabilityStartDate && startDate <= unavailabilityEndDate) ||
                (endDate >= unavailabilityStartDate && endDate <= unavailabilityEndDate) ||
                (startDate <= unavailabilityStartDate && endDate >= unavailabilityEndDate)
            );
        });

        if (isCarUnavailableRents || isCarUnavailableUnavailability) {
            setErrorUnavailability('La voiture est déjà indisponible à cette période');
            return;
        }

        if (startDate > endDate) {
            setError('La date de début doit être antérieure à la date de fin');
            return;
        }
        try {
            const response = await fetch('http://195.35.29.110:8000/api/unavailabilities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    car: `/api/cars/${carId}`,
                    dateStart: startDate,
                    dateEnd: endDate,
                    price: price ? Number(price) : null,
                    reason,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setCar((prevCar) => ({
                    ...prevCar,
                    unavailability: [...prevCar.unavailability, responseData],
                }));
            }
            setSuccess('Indisponibilité enregistrée');
            setReason('');
            setErrorUnavailability('');
        }
        catch (error) {
            setError('An error occurred');
        }
    };

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

    const tabsData = [
        { label: 'Planning de la gova', content: <CarSchedule car={ car }/>},
        { label: 'Historique de la Gova', content: <CarHistoric car={ car }/>},
    ];

    return car ? (
        <>
            <Navbar/>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
                <h2 className="text-3xl font-semibold mb-4">
                    {car.model.brand.name} - {car.model.name}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Slider {...getSliderSettings(car.media.length)}>
                            {car.media.length > 0 ? car.media.map((media, index) => (
                                <div key={index}>
                                    <img src={`http://195.35.29.110:8000/media/${media.filePath}`} alt={`Image de voiture ${index + 1}`} style={imageStyle} />
                                </div>
                            )) : (
                                <div>
                                    <img src="https://source.unsplash.com/random" alt="Image par défaut" style={imageStyle} />
                                </div>
                            )}
                        </Slider>
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
                    <p className="text-lg font-semibold mb-2">Saisir une indisponiblilité(révisions, accidents,
                        autres...)</p>
                    {
                        success.length ? (
                            <div className="mt-2 text-center">
                                <p className="text-green-500">{success}</p>
                            </div>
                        ) : null
                    }
                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                    Raison *
                                </label>
                                <input
                                    type="text"
                                    id="reason"
                                    name="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="mt-1 p-2 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-black border-2"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Prix (€)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="mt-1 p-2 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-black border-2"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Date de début *
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="mt-1 p-2 block w-full border-black rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-2"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        <div className="mt-4">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                Date de fin *
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="mt-1 p-2 block w-full border-black rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-2"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                        {
                            error.length ? (
                                <div className="mt-2 text-center">
                                    <p className="text-red-500">{error}</p>
                                </div>
                            ) : null
                        }
                        {
                            errorUnavailability.length ? (
                                <div className="mt-2 text-center">
                                    <p className="text-red-500">{errorUnavailability}</p>
                                </div>
                            ) : null
                        }
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:border-indigo-300"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
                <div className='mt-4'>
                    <HorizontalTabs tabsData={tabsData}/>
                </div>
            </div>
        </>
    ) : null;
};

export default CarDetailsPro;
