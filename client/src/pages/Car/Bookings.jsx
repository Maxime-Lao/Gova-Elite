import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Grid, Typography } from '@mui/material';
import Navbar from "../../components/navbar/Navbar.jsx";
import CurrentBookingsCard from "../../components/user/booking/CurrentBookingsCard.jsx";
import PastBookingsCard from "../../components/PastBookingsCard.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import useGetConnectedUser from "../../components/hooks/useGetConnectedUser.jsx";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';

function Bookings() {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);
  const [userCommentsData, setUserCommentsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useGetConnectedUser();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.connectedUser) {
        try {
          const response = await fetch(`https://kame-os.fr/api/users/${user.connectedUser.id}/rents`);
          const userData = await response.json();
          const commentsResponse = await fetch(`https://kame-os.fr/api/users/${user.connectedUser.id}/comments`);
          const commentsData = await commentsResponse.json();
          setUserData(userData);
          setUserCommentsData(commentsData);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user.connectedUser]);

  const commentedRentIds = new Set();
    if (userCommentsData) {
      userCommentsData.forEach(comment => {
      commentedRentIds.add(comment.rent.id);
    });
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
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

  const currentDate = new Date();

  const currentBookings = userData.filter(rent => new Date(rent.dateEnd) > currentDate);
  const pastBookings = userData.filter(rent => new Date(rent.dateEnd) <= currentDate)
    .map(rent => ({
      ...rent,
      disable: commentedRentIds.has(rent.id) ? 'yes' : 'no'
    }));

  const handleBookingDeletion = (deletedRentId) => {
    setUserData(userData.filter(rent => rent.id !== deletedRentId));
  };

  const refreshBookings = async () => {
    try {
      const response = await fetch(`https://kame-os.fr/api/users/${user.connectedUser.id}/rents`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
          }
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const refreshPastBookings = async () => {
    try {
      const response = await fetch(`https://kame-os.fr/api/users/${user.connectedUser.id}/comments`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
          }
      });
      const data = await response.json();
      setUserCommentsData(data);
    } catch (error) {
      console.error('Error fetching user comments data:', error);
    }
  }

  return (
    <>
      <Navbar />
      {userData && (
        <Grid container spacing={2} justifyContent="center" sx={{marginTop: "2em"}}>
          <Grid item xs={12}>
            <Typography variant="h4">{t("Réservations de voiture pour")} {user.connectedUser.firstname} {user.connectedUser.lastname}</Typography>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Réservations tabs">
              <Tab label={t("En cours")} />
              <Tab label={t("Historique")} />
            </Tabs>
          </Grid>

          {(tabValue === 0 && currentBookings) ? (
            currentBookings.map((rent, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <CurrentBookingsCard rent={rent} user={user.connectedUser.id} onDelete={handleBookingDeletion} onBookingChange={refreshBookings}/>
              </Grid>
            ))
          ) : null}

          {tabValue === 1 && (
            pastBookings.map((rent, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <PastBookingsCard rent={rent} user={user.connectedUser.id} onPastBookingChange={refreshPastBookings}/>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </>
  );
}

export default Bookings;
