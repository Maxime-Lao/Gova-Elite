import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Alert, CircularProgress, Skeleton } from '@mui/material';
import Stack from '@mui/joy/Stack';
import RentCard from '../components/RentCard';
import FilterButton from '../components/button/FilterButton';
import { useLocation } from 'react-router-dom';
import Maps from '../components/api/Maps';
import { useTranslation } from 'react-i18next';

const SearchResult = (props) => {
    const { t } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const startDate = params.get('startDate') || '';
    const endDate = params.get('endDate') || '';
    const locationParam = params.get('location') || '';
    const locationLat = parseFloat(params.get('locationLat')) || 0;
    const locationLng = parseFloat(params.get('locationLng')) || 0;

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [carInfo, setCarInfo] = useState([]);
    const containerRef = useRef(null);

    const handleMarkerClick = useCallback(index => {
        const markerElement = containerRef.current.children[index];
        markerElement?.classList.add('selected-marker');
        setTimeout(() => {
            markerElement?.classList.remove('selected-marker');
        }, 3000);
    }, []);

    const handleApplyFilters = useCallback(async (filters) => {
        const searchParams = new URLSearchParams();
        searchParams.append('startDate', startDate);
        searchParams.append('endDate', endDate);
        searchParams.append('location', locationParam);
        searchParams.append('locationLat', locationLat);
        searchParams.append('locationLng', locationLng);
    
        for (const filter in filters) {
            if (Array.isArray(filters[filter]) && filters[filter].length > 0) {
                searchParams.append(filter, filters[filter].join(','));
            } else if (filters[filter] !== 0 && filters[filter] !== '' && filters[filter] != null && filters[filter] !== undefined && !Array.isArray(filters[filter])) {
                searchParams.append(filter, filters[filter]);
            }
        }
    
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://kame-os.fr/api/cars/search?${searchParams.toString()}`);
            if (!response.ok && response.status === 404) {
                throw new Error(t('Aucun résultat n\'a été trouvé.'));
            } else if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
    
            const responseData = await response.json();
            const newMarkers = [];
            const newCarInfo = [];
            for (const car of responseData) {
                const addresses = car.companie.address + ' ' + car.companie.city + ' ' + car.companie.zipCode;
                newMarkers.push(addresses);
                newCarInfo.push({ name: car.model.name, price: car.price, companie: car.companie.name, address: car.companie.address, city: car.companie.city, zipCode: car.companie.zipCode });
            }
            setMarkers(newMarkers);
            setCarInfo(newCarInfo);
            setData(responseData);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate, locationParam, locationLat, locationLng]);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://kame-os.fr/api/cars/search?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&location=${encodeURIComponent(locationParam)}`);
                if (!response.ok && response.status === 404) {
                    throw new Error('Aucun résultat n\'a été trouvé.');
                } else if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }

                const responseData = await response.json();
                const newMarkers = [];
                const newCarInfo = [];
                for (const car of responseData) {
                    const addresses = car.companie.address + ' ' + car.companie.city + ' ' + car.companie.zipCode
                    newMarkers.push(addresses);
                    newCarInfo.push({ name: car.model.name, price: car.price, companie: car.companie.name, address: car.companie.address, city: car.companie.city, zipCode: car.companie.zipCode });
                }
                setMarkers(newMarkers);
                setCarInfo(newCarInfo);
                setData(responseData);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
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
            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 }, minHeight: '100vh', overflow: 'auto' }}>
                <FilterButton carInfo={data} onApplyFilters={handleApplyFilters} disabled={isLoading} />
                {isLoading && (
                    <Stack spacing={2} sx={{ alignItems: 'center' }}>
                        <CircularProgress />
                        <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
                        <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
                        <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
                    </Stack>
                )}
                {!isLoading && error && (
                    <Stack spacing={2} sx={{ alignItems: 'center' }}>
                        <Alert severity="error">{error}</Alert>
                        <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
                        <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
                        <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
                    </Stack>
                )}
                {!isLoading && !error && (
                    <Stack spacing={2}>
                        <Alert severity="success">{data.length} {t('résultat(s) trouvé(s)')}</Alert>
                        <Stack spacing={2} ref={containerRef}>
                            {data.map((car, index) => (
                                <RentCard key={index} car={car} query={{ startDate: encodeURIComponent(startDate), 
                                    endDate: encodeURIComponent(endDate), location: locationParam }} />
                            ))}
                        </Stack>
                    </Stack>
                )}
            </Stack>
            {!isLoading && !error ? (
                <Stack spacing={2} sx={{ overflow: 'auto', width: '100%', height: '100%' }}>
                    <Maps center={{ lat: locationLat, lng: locationLng }} addresses={markers} onMarkerClick={handleMarkerClick} cars={carInfo} isLoaded={props.isMapLoaded} />
                </Stack>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', gap: "1em" }}>
                    <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                </Box>
            )}
        </Box>
    );
};

export default SearchResult;