import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Calendar({ carId }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
