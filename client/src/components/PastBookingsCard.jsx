import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Rating from '@mui/material/Rating';
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

function PastBookings({ rent, user, onPastBookingChange }) {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const [expanded, setExpanded] = React.useState(false);
  const formattedStartDate = format(new Date(rent.dateStart), "dd/MM/yyyy HH'h'", { locale: fr });
  const formattedEndDate = format(new Date(rent.dateEnd), "dd/MM/yyyy HH'h'", { locale: fr });
  const [openDialog, setOpenDialog] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const isButtonDisabled = rent.disable === 'yes';
  const navigate = useNavigate();

  const [comment, setComment] = React.useState({
    cleanliness: 0,
    maintenance: 0,
    communication: 0,
    convenience: 0,
    accuracy: 0,
    globalRating: 0,
    comment: '',
    rent: `/api/rents/${rent.id}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: `/api/users/${user}`,
    car: `/api/cars/${rent.car.id}`,
  });

  const [errorMessages, setErrorMessages] = useState({
    cleanliness: '',
    maintenance: '',
    communication: '',
    convenience: '',
    accuracy: '',
    globalRating: '',
    comment: '',
  });

  const updateErrorMessages = (fieldName, message) => {
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [fieldName]: message,
    }));
  };

  const resetErrorMessages = () => {
    setErrorMessages({
      cleanliness: '',
      maintenance: '',
      communication: '',
      convenience: '',
      accuracy: '',
      globalRating: '',
      comment: '',
    });
  };

  const handleRatingChange = (criteria, value) => {
    setComment({ ...comment, [criteria]: value });
  };
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const areAllFieldsFilled = () => {
    const requiredFields = ['cleanliness', 'maintenance', 'communication', 'convenience', 'accuracy', 'comment'];
  
    for (const field of requiredFields) {
      if (!comment[field]) {
        updateErrorMessages(field, t('Veuillez remplir tous les champs.'));
        return false;
      }
    }
  
    return true;
  };

  const handleSubmitComment = async () => {
    try {
      resetErrorMessages();

      if (!areAllFieldsFilled()) {
        return;
      }
      
      const {
        cleanliness,
        maintenance,
        communication,
        convenience,
        accuracy,
        comment: commentText,
        rent,
        createdAt,
        updatedAt,
        author,
        car,
      } = comment;
  
      const total =
        cleanliness + maintenance + communication + convenience + accuracy;
      const average = total / 5;
      const globalRating = parseFloat(average.toFixed(1));

      const timezoneOffset = new Date().getTimezoneOffset() * 60000;
      const currentDate = new Date(new Date().getTime() - timezoneOffset);
  
      const commentData = {
        cleanliness,
        maintenance,
        communication,
        convenience,
        accuracy,
        globalRating,
        comment: commentText,
        rent,
        createdAt: currentDate.toISOString(),
        updatedAt: currentDate.toISOString(),
        author,
        car,
      };
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json+ld',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        onPastBookingChange();
        setFeedbackMessage(t('Votre commentaire a été pris en compte.'));
        setOpenDialog(false);
      } else {
        const errorData = await response.json();
        if (errorData.detail) {
          const errorMessagesArray = errorData.detail.split('\n');
          errorMessagesArray.forEach((error) => {
            const [fieldName, errorMessage] = error.split(': ');
            updateErrorMessages(fieldName.trim(), errorMessage.trim());
          });
        } else {
          console.error('Erreur inattendue lors du feedback :', errorData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedirectCarsPage = async (id) => {
    navigate(`/cars/${id}`);
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
        <Button onClick={handleOpenDialog} sx={{
            color: 'white',
            backgroundColor: '#00aaff',
            '&:hover': {
              backgroundColor: '#4bc3ff',
            },
          }}
          disabled={isButtonDisabled}>{t('Noter')}</Button>
            <Button variant="contained" color="success" onClick={() => handleRedirectCarsPage (rent.car.id)}>
              {t('Reprendre RDV')}
            </Button>
      </CardActions>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogContent>
            <Typography component="h2" variant="h6" fontWeight="bold">{t('Note de la voiture :')}</Typography>
            <Typography>{t('Propreté')} :</Typography>
            <Rating
              name="cleanliness"
              value={comment.cleanliness}
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange('cleanliness', newValue)}
            />
            <Typography>{t('Entretien')} :</Typography>
            <Rating
              name="maintenance"
              value={comment.maintenance}
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange('maintenance', newValue)}
            />
            <Typography>Communication :</Typography>
            <Rating
              name="communication"
              value={comment.communication}
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange('communication', newValue)}
            />
            <Typography>{t('Confort')} :</Typography>
            <Rating
              name="convenience"
              value={comment.convenience}
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange('convenience', newValue)}
            />
            <Typography>{t('Précision')} :</Typography>
            <Rating
              name="accuracy"
              value={comment.accuracy}
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange('accuracy', newValue)}
            />

            <Typography>{t('Commentaire')} :</Typography>
            <textarea
              value={comment.comment}
              onChange={(event) => setComment({ ...comment, comment: event.target.value })}
              rows={4}
              cols={40}
              placeholder={t('Ajouter un commentaire...')}
            />

          {Object.keys(errorMessages).map((fieldName) => (
            <Typography key={fieldName} color="error">
              {errorMessages[fieldName]}
            </Typography>
          ))}
          {feedbackMessage && (
            <Typography color="success">
              {feedbackMessage}
            </Typography>
          )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained" color="error">{t('Annuler')}</Button>
            <Button onClick={handleSubmitComment} variant="contained" color="success">{t('Valider')}</Button>
          </DialogActions>
        </Dialog>
    </Card>
  );
}

export default PastBookings;
