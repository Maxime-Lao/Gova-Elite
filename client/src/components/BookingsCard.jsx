import React, { useState } from 'react';
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

export default function BookingsCard({ rent }) {
  const [expanded, setExpanded] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [rentedTimes, setRentedTimes] = React.useState([]);
  const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const isRentButtonDisabled = !startDate || !endDate;
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePostpone = () => {
    // Ajoutez ici la logique pour décaler le rendez-vous avec la date sélectionnée (selectedDate)
    console.log('Rendez-vous reporté au :', selectedDate);
    setOpenModal(false); // Fermer le modal après le traitement
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  React.useEffect(() => {
    const fetchRentedTimes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cars/${rent.car.id}`);
        if (response.ok) {
          const carData = await response.json();
          setRentedTimes(carData.rents);
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
  }, [rent.car.id]);

  const formattedStartDate = format(new Date(rent.dateStart), "dd/MM/yyyy HH'h'", { locale: fr });
  const formattedEndDate = format(new Date(rent.dateEnd), "dd/MM/yyyy HH'h'", { locale: fr });

  const handleRedirectCarsPage = async (id) => {
    navigate(`/cars/${id}`);
  };

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/rents/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Gérer la suppression réussie, par exemple, actualiser la liste après la suppression
        console.log('Réservation annulée avec succès.');
      } else {
        // Gérer les erreurs
        console.error('La suppression de la réservation a échoué.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
    }
  };

  const handleRentalSubmit = async (carId, rentId) => {
    if (startDate && endDate) {
      const requestData = {
        dateStart: startDate.toISOString(),
        dateEnd: endDate.toISOString(),
        totalPrice: 50,
        car: `/api/cars/${carId}`,
        user: `/api/users/1`,
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
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/rents/${rentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          console.log('La location a été décalé !');
        } else {
          console.error('Erreur lors de la décale');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={rent.car.model.name}
        subheader={rent.car.companie.name}
      />
      <CardMedia
        component="img"
        height="194"
        image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Paella dish"
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
          <Typography paragraph>Description:</Typography>
          <Typography paragraph>
           {rent.car.description}
          </Typography>
        </CardContent>
      </Collapse>
      <CardActions>
        <Button variant="contained" color="error" onClick={handleClickOpen}>
          Annuler
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Voulez-vous vraiment annuler votre réservation ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Retour</Button>
            <Button onClick={() => handleCancel(rent.id)} autoFocus>
              Oui
            </Button>
          </DialogActions>
        </Dialog>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Décaler le RDV
        </Button>
        <Button variant="contained" color="success" onClick={() => handleRedirectCarsPage (rent.car.id)}>
          Reprendre RDV
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
            Planification de la location
          </Typography>
          {/* Votre contenu du calendrier ici */}
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
                filterDate={(date) => {
                  const selectedRentId = rent.id;
                  const rentedTimesFiltered = rentedTimes.filter(rent => rent['@id'] !== `/api/rents/${selectedRentId}`);
              
                  return rentedTimesFiltered.every(rent => {
                    const rentStart = new Date(rent.dateStart).setHours(0, 0, 0, 0);
                    const rentEnd = new Date(rent.dateEnd).setHours(0, 0, 0, 0);
                    const currentDate = date.setHours(0, 0, 0, 0);
              
                    return currentDate < rentStart || currentDate > rentEnd;
                  });
                }}
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
                filterDate={(date) => {
                  const selectedRentId = rent.id;
                  const rentedTimesFiltered = rentedTimes.filter(rent => rent['@id'] !== `/api/rents/${selectedRentId}`);
              
                  return rentedTimesFiltered.every(rent => {
                    const rentStart = new Date(rent.dateStart).setHours(0, 0, 0, 0);
                    const rentEnd = new Date(rent.dateEnd).setHours(0, 0, 0, 0);
                    const currentDate = date.setHours(0, 0, 0, 0);
              
                    return currentDate < rentStart || currentDate > rentEnd;
                  });
                }}
              />
            </Grid>
            {/* Ajoutez d'autres éléments si nécessaire */}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleCloseModal} sx={{ marginRight: '1em' }}>
                Fermer
              </Button>
              <Button variant="contained" onClick={() => handleRentalSubmit(rent.car.id, rent.id)} disabled={isRentButtonDisabled}>
                Louer la voiture
              </Button>
            </Grid>
          </Grid>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Modal>
    </Card>
  );
}