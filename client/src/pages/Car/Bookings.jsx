import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Grid, Typography } from '@mui/material';
import Navbar from "../../components/navbar/Navbar.jsx";
import BookingsCard from "../../components/BookingsCard";
import PastBookings from "../../components/PastBookings";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function Bookings() {
  const [userData, setUserData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/1`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!userData) {
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

  const pastBookings = userData.rents.filter(rent => new Date(rent.dateEnd) < new Date());
  const currentBookings = userData.rents.filter(rent => new Date(rent.dateEnd) > new Date());

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
                <BookingsCard rent={rent} />
              </Grid>
            ))
          )}

          {tabValue === 1 && (
            pastBookings.map((rent, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <PastBookings rent={rent} />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </>
  );
}

export default Bookings;
