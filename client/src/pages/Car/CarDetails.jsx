import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar.jsx";
import Calendar from "../../components/Calendar";
import { Grid, Typography, List, ListItem, ListItemText, ListItemIcon, Card, CardContent, IconButton } from '@mui/material';
import { CarRental, DirectionsCar, ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Slider from "react-slick";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import BedroomBabyIcon from '@mui/icons-material/BedroomBaby';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import EuroIcon from '@mui/icons-material/Euro';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BusinessIcon from '@mui/icons-material/Business';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

const cardStyle = {
  marginBottom: "2em",
  position: "relative",
};

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <IconButton
      className={className}
      style={{ ...style, display: "block", color: "black", right: "-25px" }}
      onClick={onClick}
    >
      <ArrowForwardIos />
    </IconButton>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <IconButton
      className={className}
      style={{ ...style, display: "block", color: "black", left: "-25px", zIndex: 1 }}
      onClick={onClick}
    >
      <ArrowBackIos />
    </IconButton>
  );
}


function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [comments, setComments] = useState([]);

  const getSliderSettings = (numberOfImages) => {
    return {
      dots: true,
      infinite: numberOfImages > 1,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: numberOfImages > 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };
  };

  const imageStyle = {
    width: "100%",
    height: "500px",
    objectFit: "cover",
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/cars/${id}/comments`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error('Unexpected response structure for comments:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/cars/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Car not found');
        }
        return response.json();
      })
      .then(data => setCar(data))
      .catch(error => {
        console.error(error);
        navigate('/not-found');
      });
  }, [id, navigate]);

  const calculateAverageRating = () => {
    if (!comments) {
      return 0;
    }

    const totalRating = comments.reduce((acc, comment) => acc + comment.globalRating, 0);
    return totalRating / comments.length;
  };

  if (!car) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <Grid container spacing={2} justifyContent="center" sx={{marginTop: "2em"}}>
      <Grid item xs={12} sm={8} md={6}>
          <Card sx={cardStyle}>
            <Slider {...getSliderSettings(car.media.length)}>
              {car.media.length > 0 ? car.media.map((media, index) => (
                <div key={index}>
                  <img src={`http://localhost:8000/media/${media.filePath}`} alt={`Image de voiture ${index + 1}`} style={imageStyle} />
                </div>
              )) : (
                <div>
                  <img src="https://source.unsplash.com/random" alt="Image par défaut" style={imageStyle} />
                </div>
              )}
            </Slider>
          </Card>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4" component="h2">
                <strong>{car.model.brand.name} - {car.model.name} - {car.year}</strong>
                <Typography component={'span'} variant={'body1'} gutterBottom>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating name="half-rating-read" value={calculateAverageRating()} precision={0.5} readOnly />
                    <Typography variant="body1">
                      ({comments ? comments.length : 0} avis)
                    </Typography>
                  </Stack>
                </Typography>
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <BedroomBabyIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${car.horses} chevaux`} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SettingsSuggestIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${car.gear.name}`} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AirlineSeatReclineExtraIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${car.nbSeats} sièges`} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CarRental />
                      </ListItemIcon>
                      <ListItemText primary={`${car.nbDoors} portes`} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EuroIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${car.price}€`} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CarCrashIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${car.mileage} km`} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocalGasStationIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${car.energy.name}`} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${car.companie.name}`} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Calendar carId={id} companieId={car.companie.id}/>
            </Grid>
          </Grid>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Commentaires:
            </Typography>
            {comments.length === 0 ? (
              <Typography variant="subtitle1">Pas de commentaire pour l'instant</Typography>
            ) : (
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {comments.map(comment => (
                  <ListItem alignItems="flex-start" key={comment.id}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="https://images.unsplash.com/photo-1520283818086-3f6dffb019c0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Grid container alignItems="center">
                          <Grid item sx={{ marginLeft: '8px' }}>
                            {`${comment.author.firstname} ${comment.author.lastname}`}
                          </Grid>
                          <Grid item sx={{ marginLeft: '12px' }}>
                            <Stack spacing={1}>
                              <Rating name="half-rating-read" defaultValue={comment.globalRating} precision={0.5} readOnly />
                            </Stack>
                          </Grid>
                        </Grid>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {format(new Date(comment.createdAt), "d MMM yyyy", { locale: fr })}
                          </Typography>
                          {" — " + comment.comment}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Grid>
      </Grid>
    </div>
  );
}

export default CarDetails;
