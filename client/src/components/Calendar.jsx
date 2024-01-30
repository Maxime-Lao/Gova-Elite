import React, { useState, useEffect  } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Grid, Typography, Button, TextField } from '@mui/material';

function Calendar({ carId }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rentedTimes, setRentedTimes] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const currentDate = new Date();

  const isRentButtonDisabled = !startDate || !endDate;

  useEffect(() => {
    const fetchRentedTimes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cars/${carId}`);
        if (response.ok) {
          const carData = await response.json();
          const rents = carData.rents || [];
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
 
  const handleRentalSubmit = async () => {
    if (startDate && endDate) {
      const requestData = {
        dateStart: startDate.toISOString(),
        dateEnd: endDate.toISOString(),
        totalPrice: 50,
        car: `/api/cars/${carId}`,
        user: `/api/users/21`,
        createdAt: currentDate.toISOString().slice(0, 19).replace('T', ' '),
      };

      const isDatesValid = rentedTimes.every(rent => {
        const selectedStart = startDate.getTime();
        const selectedEnd = endDate.getTime();
        const rentStart = new Date(rent.startDate).getTime();
        const rentEnd = new Date(rent.endDate).getTime();

        if (
          (selectedStart >= rentStart && selectedStart <= rentEnd) ||
          (selectedEnd >= rentStart && selectedEnd <= rentEnd) ||
          (selectedStart <= rentStart && selectedEnd >= rentEnd)
        ) {
          return false;
        }
        return true;
      });

      if (!isDatesValid) {
        setError('La voiture n\'est pas disponible pour les dates sélectionnées.');
        setSuccessMessage('');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/rents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json+ld',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const newReservation = {
            startDate: startDate,
            endDate: endDate,
          };
          setRentedTimes([...rentedTimes, newReservation]);

          setSuccessMessage('Votre réservation a été effectuée avec succès!');
          setError('');
        } else {
          setError('Erreur lors de la location');
        }
      } catch (error) {
        console.error(error);
        setError('Erreur lors de la location');
      }
    }
  };

  return (
    <>
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={10}>
        <Typography variant="h4" component="h2">
          Planification de la location
        </Typography>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
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
              //filterTime={filterRentedTimes} 
            />
          </Grid>
          <Grid item xs={12}>
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
              excludeDates={excludeDates}
              //filterTime={filterRentedTimes}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleRentalSubmit} disabled={isRentButtonDisabled}>
              Louer la voiture
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    </>
  );
}

export default Calendar;
