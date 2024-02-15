import React, { useState, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from "react-router-dom";
import StripePaymentFormUpdate from '../../stripe/StripePaymentFormUpdate';
import { useTranslation } from 'react-i18next';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function BookingsCard({ rent, user, onDelete, onBookingChange }) {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const [expanded, setExpanded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [rentId, setRentId] = useState(0);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [rentedTimes, setRentedTimes] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [rentalSuccessMessage, setRentalSuccessMessage] = useState('');
  const [unavailabilityDates, setUnavailabilityDates] = useState([]);
  const navigate = useNavigate();

  const isRentButtonDisabled = !startDate || !endDate;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = (carId) => {
    setStartDate(null);
    setEndDate(null);
    setRentalSuccessMessage('');
    fetchUpdatedRentedTimes(carId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  useEffect(() => {
    const fetchRentedTimes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cars/${rent.car.id}/rents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
          const carRentsData = await response.json();
          setRentedTimes(carRentsData);
        } else {
          console.error('Erreur lors de la récupération des plages horaires louées.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des plages horaires louées:', error);
      }
    };
  
    if (rent.car.id && typeof rent.car.id === 'number') {
      fetchRentedTimes();
    }
  }, [rent.car.id, token]);

  useEffect(() => {
    if (startDate && endDate && rent && rent.car.price) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const calculatedTotalPrice = diffDays * rent.car.price;
      setTotalPrice(calculatedTotalPrice);
      setPaymentMethodId(rent.paymentMethodId);
      setRentId(rent.id);
    }
  }, [startDate, endDate, rent]);

  useEffect(() => {
    const unavailability = rent.car.unavailability || [];
    setUnavailabilityDates(unavailability.map(({ date_start, date_end }) => ({
      startDate: new Date(date_start),
      endDate: new Date(date_end),
    })));
  }, [rent]);

  const calculateExcludedDates = (ranges) => {
    return ranges.flatMap(range => {
      const dates = [];
      let currentDate = new Date(range.startDate);
      while (currentDate <= range.endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    });
  };
  
  const fetchUpdatedRentedTimes = async (carId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/cars/${carId}/rents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
      if (response.ok) {
        const carRentsData = await response.json();
        setRentedTimes(carRentsData);
      } else {
        console.error('Erreur lors de la récupération des plages horaires louées.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des plages horaires louées:', error);
    }
  };

  const formattedStartDate = format(new Date(rent.dateStart), "dd/MM/yyyy HH'h'", { locale: fr });
  const formattedEndDate = format(new Date(rent.dateEnd), "dd/MM/yyyy HH'h'", { locale: fr });

  const handleRedirectCarsPage = async (id) => {
    navigate(`/cars/${id}`);
  };

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/rents/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
          }
      });
      if (response.ok) {
        onDelete(id);
        setOpen(false);
      } else {
        console.error('La suppression de la réservation a échoué.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
    }
  };

  const handleRentalSubmit = async (rentId, newPaymentIntent) => {
    if (startDate && endDate) {
      const timezoneOffset = new Date().getTimezoneOffset() * 60000;
      const adjustedStartDate = new Date(startDate.getTime() - timezoneOffset);
      const adjustedEndDate = new Date(endDate.getTime() - timezoneOffset);
      const currentDate = new Date(new Date().getTime() - timezoneOffset);

      const requestData = {
        dateStart: adjustedStartDate.toISOString(),
        dateEnd: adjustedEndDate.toISOString(),
        totalPrice: totalPrice,
        paymentMethodId: newPaymentIntent,
        updatedAt: currentDate.toISOString(),
      };

      try {
        const response = await fetch(`http://localhost:8000/api/rents/${rentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/merge-patch+json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          onBookingChange();
          setRentalSuccessMessage(t('La location a été décalée !'));
        } else {
          console.error('Erreur lors de la décale');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const isDateOverlap = (dateStart, dateEnd) => {
    const selectedStart = startDate.getTime();
    const selectedEnd = endDate.getTime();
  
    return (
      (selectedStart >= dateStart && selectedStart <= dateEnd) ||
      (selectedEnd >= dateStart && selectedEnd <= dateEnd) ||
      (selectedStart <= dateStart && selectedEnd >= dateEnd)
    );
  };

  const handleOpenStripeModal = () => {
    const isDatesOverlapRented = rentedTimes.some(rent => {
      if (rent.id === rentId) return false;
      const rentStart = new Date(rent.dateStart).getTime();
      const rentEnd = new Date(rent.dateEnd).getTime();
      return isDateOverlap(rentStart, rentEnd);
    });
  
    const isDatesOverlapUnavailable = unavailabilityDates.some(({ startDate, endDate }) => {
      const unavailableStart = new Date(startDate).getTime();
      const unavailableEnd = new Date(endDate).getTime();
      return isDateOverlap(unavailableStart, unavailableEnd);
    });
  
    if (isDatesOverlapRented || isDatesOverlapUnavailable) {
      setError('La voiture n\'est pas disponible pour les dates sélectionnées.');
      return;
    }
  
    setError('');
    setIsStripeModalOpen(true);
  };

  const handleStartDateChange = (date) => {
    if (endDate && date > endDate) {
      setError(t('La date de début ne peut pas être après la date de fin.'));
    } else {
      setStartDate(date);
      setError('');
    }
  };
  
  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      setError(t('La date de fin ne peut pas être avant la date de début.'));
    } else {
      setEndDate(date);
      setError('');
    }
  };

  const excludeDates = useMemo(() => {
    const unavailabilityDatesExcluded = calculateExcludedDates(unavailabilityDates);
    return [...unavailabilityDatesExcluded];
  }, [unavailabilityDates]);
  
  const isUnavailable = date => {
    return unavailabilityDates.some(({ startDate, endDate }) => {
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };  

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={rent.car.model.brand.name + ' - ' + rent.car.model.name + ' - ' + rent.car.year}
        subheader={rent.car.companie.name}
      />
      <CardMedia
        component="img"
        height="194"
        image={rent.car.media.length &&  rent.car.media[0].filePath ? `http://localhost:8000/media/${rent.car.media[0].filePath}` : "https://source.unsplash.com/random"}
        alt={`${rent.car.model.name} image`}
        sx={{
          width: '100%',
          height: 194,
          objectFit: 'cover',
        }}
      />
      <CardContent>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <CalendarMonthIcon />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              {formattedStartDate} à {formattedEndDate}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{t('Description:')}</Typography>
          <Typography paragraph>
           {rent.car.description}
          </Typography>
        </CardContent>
      </Collapse>
      <CardActions>
        <Button variant="contained" color="error" onClick={handleClickOpen}>
          {t('Annuler')}
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('Voulez-vous vraiment annuler votre réservation ?')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('Retour')}</Button>
            <Button onClick={() => handleCancel(rent.id)} autoFocus>
              {t('Oui')}
            </Button>
          </DialogActions>
        </Dialog>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal(rent.car.id)}>
          {t('Décaler le RDV')}
        </Button>
        <Button variant="contained" color="success" onClick={() => handleRedirectCarsPage (rent.car.id)}>
          {t('Reprendre RDV')}
        </Button>
      </CardActions>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: '300px' }}>
          <Typography variant="h6" id="modal-title" align="center" gutterBottom>
            {t('Planification de la location')}
          </Typography>
          {rentalSuccessMessage && (
            <Typography color="green" align="center" gutterBottom>
              {rentalSuccessMessage}
            </Typography>
          )}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={60}
                timeCaption={t('Heure de début')}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText={t('Date et heure de début')}
                filterDate={(date) => {
                  const selectedRentId = rent.id;
                  const rentedTimesFiltered = rentedTimes.filter(rent => rent.id !== selectedRentId);
              
                  return rentedTimesFiltered.every(rent => {
                    const rentStart = new Date(rent.dateStart).setHours(0, 0, 0, 0);
                    const rentEnd = new Date(rent.dateEnd).setHours(0, 0, 0, 0);
                    const currentDate = date.setHours(0, 0, 0, 0);
              
                    const isCurrentUserReservation = rent.id === selectedRentId;
                    return (isCurrentUserReservation && currentDate >= rentStart && currentDate <= rentEnd) || (!isCurrentUserReservation && (currentDate < rentStart || currentDate > rentEnd));
                  });
                }}
                excludeDates={excludeDates}
                dayClassName={date => isUnavailable(date) ? 'bg-red-500' : undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={60}
                timeCaption={t('Heure de fin')}
                minDate={startDate || new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText={t('Date et heure de fin')}
                filterDate={(date) => {
                  const selectedRentId = rent.id;
                  const rentedTimesFiltered = rentedTimes.filter(rent => rent.id !== selectedRentId);
              
                  return rentedTimesFiltered.every(rent => {
                    const rentStart = new Date(rent.dateStart).setHours(0, 0, 0, 0);
                    const rentEnd = new Date(rent.dateEnd).setHours(0, 0, 0, 0);
                    const currentDate = date.setHours(0, 0, 0, 0);
              
                    const isCurrentUserReservation = rent.id === selectedRentId;
                    return (isCurrentUserReservation && currentDate >= rentStart && currentDate <= rentEnd) || (!isCurrentUserReservation && (currentDate < rentStart || currentDate > rentEnd));
                  });
                }}
                excludeDates={excludeDates}
                dayClassName={date => isUnavailable(date) ? 'bg-red-500' : undefined}
              />
            </Grid>
            <Grid item xs={12}>
              {startDate && endDate && (
                <Typography variant="h6" gutterBottom>
                  {t('Prix total :')} {totalPrice} €
                </Typography>
              )}
              <Button variant="contained" onClick={handleCloseModal} sx={{ marginRight: '1em' }}>
                {t('Fermer')}
              </Button>
              <Button variant="contained" onClick={handleOpenStripeModal} disabled={isRentButtonDisabled}>
                {t('Louer la voiture')}
              </Button>
            </Grid>
          </Grid>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Modal>
      <Modal
        open={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box >
          <StripePaymentFormUpdate onPaymentSuccess={handleRentalSubmit} rentId={rentId} originalPaymentIntentId={paymentMethodId} carPrice={totalPrice}/>
        </Box>
      </Modal>
    </Card>
  );
}