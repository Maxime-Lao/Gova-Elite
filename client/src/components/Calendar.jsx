import React, { useState, useEffect  } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Calendar({ carId }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rentedTimes, setRentedTimes] = useState([]);

  useEffect(() => {
    // Fonction pour récupérer les plages horaires déjà louées pour une voiture spécifique
    const fetchRentedTimes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cars/${carId}`);
        if (response.ok) {
          const carData = await response.json();
          const rents = carData.rents || [];
          // Formater les plages horaires déjà louées pour les exclure des datepickers
          const formattedRentedTimes = rents.map(rent => ({
            startDate: new Date(rent.dateStart),
            endDate: new Date(rent.dateEnd),
          }));
          setRentedTimes(formattedRentedTimes);
        } else {
          console.error('Erreur lors de la récupération des plages horaires louées');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des plages horaires louées:', error);
      }
    };

    if (carId) {
      fetchRentedTimes();
    }
  }, [carId]);

  const excludeDates = rentedTimes.map(rent => {
    const dates = [];
    const currentDate = new Date(rent.startDate);

    while (currentDate <= rent.endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }).flat();

  const filterRentedTimes = time => {
    const currentDate = new Date(time);
    for (const rent of rentedTimes) {
      const rentStart = new Date(rent.startDate);
      const rentEnd = new Date(rent.endDate);
      if (currentDate >= rentStart && currentDate <= rentEnd) {
        return false; // Exclure cette heure
      }
    }
    return true; // Autoriser cette heure
  };

  const handleRentalSubmit = async () => {
    if (startDate && endDate) {
      const requestData = {
        dateStart: startDate.toISOString(),
        dateEnd: endDate.toISOString(),
        totalPrice: 50,
        car: `/api/cars/${carId}`,
      };

      try {
        const response = await fetch('http://localhost:8000/api/rents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/ld+json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          console.log('Location réussie !');
        } else {
          console.error('Erreur lors de la location');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>Planification de la location</h2>
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={60}
        timeCaption="Heure de début"
        minDate={new Date()}
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Date et heure de début"
        excludeDates={excludeDates}
        filterTime={filterRentedTimes} 
      />
      <DatePicker
        selected={endDate}
        onChange={date => setEndDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={60}
        timeCaption="Heure de fin"
        minDate={startDate || new Date()}
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Date et heure de fin"
      />
      <button onClick={handleRentalSubmit}>Louer la voiture</button>
    </div>
  );
}

export default Calendar;
