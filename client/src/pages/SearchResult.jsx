import { useEffect, useState } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import Stack from '@mui/joy/Stack';
import RentCard from '../components/RentCard';
import { useLocation } from 'react-router-dom';

import Maps from '../components/api/Maps';

const SearchResult = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const startDate = encodeURIComponent(params.get('startDate'));
    const endDate = encodeURIComponent(params.get('endDate'));
    const locationParam = params.get('location');
    const locationLat = parseFloat(params.get('locationLat'));
    const locationLng = parseFloat(params.get('locationLng'));

    console.log(locationLng);

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/api/cars/search?startDate=${startDate}&endDate=${endDate}&location=${locationParam}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
            },
        })
        .then((response) => {
            console.log(response);
            if (!response.ok && response.status === 404) {
                throw new Error('Aucun résultat n\'a été trouvé.');
            } else if (!response.ok) {
                throw new Error('Une erreur s\'est produite lors de la récupération des données.');
            }

            return response.json();
        })
        .then((data) => {
            console.log(data);
            setData(data);
        })
        .catch((error) => {
            console.error(error);
            setError(error.message || 'Une erreur s\'est produite lors de la récupération des données.');
        });
    }, [startDate, endDate, locationParam]);

    return (
        <Box
        component="main"
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: { xs: 'auto', md: '60% 40%' },
          gridTemplateRows: 'auto 1fr auto',
        }}
        >   
            {error && (
                <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: '100vh', overflow: 'auto' }}>
                    <Stack spacing={2} sx={{ alignItems: 'center' }}>
                        <CircularProgress />
                        <Alert severity="error">{error}</Alert>
                    </Stack>
                </Stack>
            )}
            {!error && (
                <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: '100vh', overflow: 'auto' }}>
                    <Alert severity="success">{data.length} résultat(s) trouvé(s).</Alert>

                    <Stack spacing={2}>
                        {data.map((car, index) => (
                            <RentCard key={index} car={car} />
                        ))}
                    </Stack>
                </Stack>
            )}
            <Stack spacing={2} sx={{ minHeight: 0, overflow: 'auto', width: '100%', height: '100%' }}>
                <Maps center={{ lat: locationLat, lng: locationLng }} markers={[{ lat: -34.397, lng: 150.644 }, { lat: -34.500, lng: 150.644 }]} />
            </Stack>
        </Box>
    );
}

export default SearchResult;
