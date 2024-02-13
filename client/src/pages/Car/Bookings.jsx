import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Grid, Typography } from '@mui/material';
import Navbar from "../../components/navbar/Navbar.jsx";
import CurrentBookingsCard from "../../components/CurrentBookingsCard.jsx";
import PastBookingsCard from "../../components/PastBookingsCard.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import useGetConnectedUser from "../../components/hooks/useGetConnectedUser.jsx";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function Bookings() {
  const [userData, setUserData] = useState(null);
  const user = useGetConnectedUser();
  const [userCommentsData, setUserCommentsData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${user.connectedUser.id}/rents`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.connectedUser.id]);

  useEffect(() => {
    const fetchUserCommentsData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${user.connectedUser.id}/comments`);
        const data = await response.json();
        setUserCommentsData(data);
      } catch (error) {
        console.error('Error fetching user comments data:', error);
      }
    };

    fetchUserCommentsData();
  }, [user.connectedUser.id]);

  const commentedRentIds = new Set();
  if (userCommentsData) {
    userCommentsData.forEach(comment => {
      commentedRentIds.add(comment.rent.id);
    });
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!userData || !userCommentsData) {
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
      const response = await fetch(`http://localhost:8000/api/users/${user.connectedUser.id}/rents`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const refreshPastBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.connectedUser.id}/comments`);
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
            <Typography variant="h4">Réservations de voiture pour {userData.firstname} {userData.lastname}</Typography>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Réservations tabs">
              <Tab label="En cours" />
              <Tab label="Historique" />
            </Tabs>
          </Grid>
  
          {tabValue === 0 && (
            currentBookings.map((rent, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <CurrentBookingsCard rent={rent} user={user.connectedUser.id} onDelete={handleBookingDeletion} onBookingChange={refreshBookings}/>
              </Grid>
            ))
          )}

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
