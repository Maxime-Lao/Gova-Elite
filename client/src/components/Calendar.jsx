import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useGetConnectedUser from "./hooks/useGetConnectedUser.jsx";
import { Grid, Typography, Button, TextField, Modal, Box } from '@mui/material';
import StripePaymentForm from './StripePaymentForm';

function Calendar({ carId, companieId }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [carData, setCarData] = useState(0);
  const user = useGetConnectedUser();
  const [totalPrice, setTotalPrice] = useState(0);
  const [rentedTimes, setRentedTimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isRentButtonDisabled = !startDate || !endDate;

  useEffect(() => {
    const fetchRentedTimes = async () => {
      if (!carId) return;
      try {
        const response = await fetch(`http://localhost:8000/api/cars/${carId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données');
        const carData = await response.json();
        const rents = carData.rents || [];
        
        setCarData(carData);
        setRentedTimes(rents.map(({ dateStart, dateEnd }) => ({
          startDate: new Date(dateStart),
          endDate: new Date(dateEnd),
        })));
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchRentedTimes();
  }, [carId]);

  useEffect(() => {
    if (startDate && endDate && carData && carData.price) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const calculatedTotalPrice = diffDays * carData.price;
      setTotalPrice(calculatedTotalPrice);
    }
  }, [startDate, endDate, carData]);

  const excludeDates = useMemo(() => rentedTimes.flatMap(rent => {
    const dates = [];
    let currentDate = new Date(rent.startDate);
    while (currentDate <= rent.endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }), [rentedTimes]);
 
  const handleRentalSubmit = useCallback(async (paymentIntent) => {
    if (startDate && endDate) {
      const timezoneOffset = new Date().getTimezoneOffset() * 60000;
      const adjustedStartDate = new Date(startDate.getTime() - timezoneOffset);
      const adjustedEndDate = new Date(endDate.getTime() - timezoneOffset);
      const currentDate = new Date(new Date().getTime() - timezoneOffset);

      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const calculatedTotalPrice = diffDays * carData.price;
      
      const totalPrice = calculatedTotalPrice;

      const requestData = {
        dateStart: adjustedStartDate.toISOString(),
        dateEnd: adjustedEndDate.toISOString(),
        totalPrice: totalPrice,
        paymentMethodId: paymentIntent,
        car: `/api/cars/${carId}`,
        user: `/api/users/${user.connectedUser.id}`,
        companie: `/api/companies/${companieId}`,
        createdAt: currentDate.toISOString(),
      };

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
          setStartDate(null);
          setEndDate(null);
        } else {
          setError('Erreur lors de la location');
        }
      } catch (error) {
        console.error(error);
        setError('Erreur lors de la location');
      }
    }
  }, [startDate, endDate, rentedTimes, carId]);

  const handleOpenModal = () => {

    if (!user || !user.connectedUser || user.connectedUser.length === 0) {
      setError('Vous devez être connecté pour pourvoir payer !');
      setSuccessMessage('');
      return;
    }

    const isDatesValid = rentedTimes.every(rent => {
      const selectedStart = startDate.getTime();
      const selectedEnd = endDate.getTime();
      const rentStart = new Date(rent.startDate).getTime();
      const rentEnd = new Date(rent.endDate).getTime();
  
      return !(
        (selectedStart >= rentStart && selectedStart <= rentEnd) ||
        (selectedEnd >= rentStart && selectedEnd <= rentEnd) ||
        (selectedStart <= rentStart && selectedEnd >= rentEnd)
      );
    });
  
    if (!isDatesValid) {
      setError('La voiture n\'est pas disponible pour les dates sélectionnées.');
      setSuccessMessage('');
      return;
    }
  
    setError('');
    setIsModalOpen(true);
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
            />
          </Grid>
          <Grid item xs={12}>
            {startDate && endDate && (
              <Typography variant="h6" gutterBottom>
                Prix total : {totalPrice} €
              </Typography>
            )}

            <Button variant="contained" onClick={handleOpenModal} disabled={isRentButtonDisabled}>
              Louer la voiture
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box >
        <StripePaymentForm onPaymentSuccess={handleRentalSubmit} carPrice={totalPrice}/>
      </Box>
    </Modal>
    </>
  );
}

export default Calendar;
