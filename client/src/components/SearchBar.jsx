import { useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';

function SearchBar() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [location, setLocation] = useState("");

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with the search values
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid spacing={2} container>
                <Box sx={{ background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) )', borderRadius: '5px', padding: '1em', display: 'flex', gap: '1em' }}>
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{ backgroundColor: 'white' }}
                                label="Date de début"
                                variant="filled"
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
                        <TextField sx={{ backgroundColor: 'white' }}
                            id="location"
                            label="Emplacement"
                            type="text"
                            value={location}
                            onChange={handleLocationChange}
                        />
                    </Grid>
                </Box>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                        Rechercher
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default SearchBar;
