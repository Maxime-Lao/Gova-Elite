import { useState } from "react";
import { TextField, Button, Grid, Box, Alert } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
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

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBhyfTQwmYXFdOLspNfnqED5ZjsTbR_HsQ",
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
    console.log(place);
    if (place.geometry) {
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

    if (startDate.isAfter(endDate)) {
        setError(true);
        setErrorMessage("La date de début doit être avant la date de fin.");
        return;
    }

    const formattedStartDate = encodeURIComponent(startDate.format("DD/MM/YYYY"));
    const formattedEndDate = encodeURIComponent(endDate.format("DD/MM/YYYY"));
    const formattedLocation = encodeURIComponent(location.name);
    const formattedLocationLat = encodeURIComponent(location.geometry.location.lat());
    const formattedLocationLng = encodeURIComponent(location.geometry.location.lng());
  
    console.log(formattedStartDate);
    console.log(formattedEndDate);
    console.log(formattedLocation);

    navigate(`/search?startDate=${formattedStartDate}&endDate=${formattedEndDate}&location=${formattedLocation}&locationLat=${formattedLocationLat}&locationLng=${formattedLocationLng}`);
    };

    const clearErrors = () => {
    setError(false);
    setErrorMessage("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid spacing={2} container>
                <Box sx={{ background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) )', borderRadius: '5px', padding: '1em', display: 'flex', gap: '1em' }}>
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{ backgroundColor: 'white' }}
                                label="Date de début"
                                value={startDate}
                                onChange={handleStartDateChange}
                                slotProps={{ inputProps: { readOnly: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{ backgroundColor: 'white' }}
                                label="Date de fin"
                                value={endDate}
                                onChange={handleEndDateChange}
                                slotProps={{ inputProps: { readOnly: true } }}
                            />
                        </LocalizationProvider>
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
                                    sx={{ backgroundColor: 'white' }}
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
