import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Navbar from '../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          p: 3, // padding
        }}
      >
        <Typography variant="h1" component="h2" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Oups! La page que vous cherchez n'existe pas.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate('/')}
        >
          Retour à l'accueil
        </Button>
      </Box>
    </>
  );
}

export default NotFoundPage;