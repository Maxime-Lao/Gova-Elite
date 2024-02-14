import { useState } from "react";
import { TextField, Button, Grid, Box, Alert } from "@mui/material";
import DatePicker from 'react-datepicker';
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
//router
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [location, setLocation] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [ autocomplete, setAutocomplete ] = useState(null);

    const [ libraries ] = useState(['places']);

    const navigate = useNavigate();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
      });

    const handleStartDateChange = (date) => {
    setStartDate(date);
    clearErrors();
    };

    const handleEndDateChange = (date) => {
    setEndDate(date);
    clearErrors();
    };

    const handleLocationChange = () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.formatted_address) {
            setLocation(place);
            clearErrors();
        } else {
            setError(true);
            setErrorMessage("Lieu invalide.");
        }
    };

    const handleSubmit = (event) => {
    event.preventDefault();

    if (!startDate || !endDate || !location) {
        setError(true);
        setErrorMessage("Veuillez remplir tous les champs.");
        return;
    }

    if (startDate >= endDate) {
        setError(true);
        setErrorMessage("La date de début doit être antérieure à la date de fin.");
        return;
    }
  
    if (!location.geometry) {
        setError(true);
        setErrorMessage("Lieu invalide.");
        return;
    }

    const formattedStartDate = encodeURIComponent(startDate.toLocaleDateString("fr-FR"));
    const formattedEndDate = encodeURIComponent(endDate.toLocaleDateString("fr-FR"));
    const formattedLocation = encodeURIComponent(location.name);
    const formattedLocationLat = encodeURIComponent(location.geometry.location.lat());
    const formattedLocationLng = encodeURIComponent(location.geometry.location.lng());

    navigate(`/search?startDate=${formattedStartDate}&endDate=${formattedEndDate}&location=${formattedLocation}&locationLat=${formattedLocationLat}&locationLng=${formattedLocationLng}`);
    };

    const clearErrors = () => {
    setError(false);
    setErrorMessage("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid spacing={2} container>
                <Box sx={{ 
                    background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) )', 
                    borderRadius: '5px', 
                    padding: '1em', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1em',
                    marginBottom: '1em',
                    flexDirection: { xs: 'column', sm: 'row'}
                    }}
                >
                    <Grid item xs={12} sm={4}>
                    <DatePicker
                    selected={startDate}
                    selectsStart
                    onChange={handleStartDateChange}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Date de début"
                    className="date-picker"
                    />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                    <DatePicker
                    selectsEnd
                    selected={endDate}
                    onChange={handleEndDateChange}
                    minDate={startDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Date de fin"
                    className="date-picker"
                    />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {isLoaded && (
                            <Autocomplete
                                onLoad={(autocomplete) => {
                                    setAutocomplete(autocomplete);
                                }}
                                onPlaceChanged={() => {handleLocationChange()}}
                                options={{ types: ['(cities)'] }}
                            >
                                <TextField
                                    sx={{ backgroundColor: 'white', borderRadius: '5px' }}
                                    label="Lieu"
                                    variant="filled"
                                    fullWidth
                                />
                            </Autocomplete>
                        )}
                    </Grid>
                </Box>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                        Rechercher
                    </Button>
                </Grid>
                {error && (
                <Grid item xs={12}>
                    <Alert severity="error">{errorMessage}</Alert>
                </Grid>
                )}
            </Grid>
        </form>
    );
}

export default SearchBar;
