import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Calendar from "../../components/Calendar";

function CarDetails() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
  
    useEffect(() => {
      fetch(`http://localhost:8000/api/cars/${id}`)
        .then(response => response.json())
        .then(data => setCar(data))
        .catch(error => console.error(error));
    }, [id]);
  
    if (!car) {
      return <div>Chargement...</div>;
    }
  
    return (
      <div>
        <Navbar />
        <h2>Les détails de la voiture</h2>
        <p>Année: {car.year}</p>
        <p>Chevaux: {car.horses}</p>
        <p>Nombre de places: {car.nbSeats}</p>
        <p>Nombre de portes: {car.nbDoors}</p>
        <p>Prix: {car.price}</p>
        <p>Kilométrage: {car.mileage}</p>
        <p>Model: {car.model.name}</p>
        <p>Type d'engrenage: {car.gear.name}</p>
        <p>Type d'energie: {car.energy.name}</p>
        <p>Nom de la companie: {car.companie.name}</p>
        
        <Calendar carId={id}  />
      </div>
    );
}
  
export default CarDetails;
