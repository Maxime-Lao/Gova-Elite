import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import calendar from '../assets/img/calendar.png';
import location from '../assets/img/location.png';
import vehicle from '../assets/img/valet.jpg';

const HomeSectionOne = () => {
    return (
        <Box sx={{ padding: '2em' }}>
            <Typography variant="h5" component="h6" sx={{ marginBottom: '2em', textAlign: 'center' }}>Louez votre véhicule en seulement 3 étapes.</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <Box sx={{ height: '140px' }}>
                            <img src={calendar} alt="calendar" style={{ width: '40%', height: '100%', display: 'flex', margin: 'auto' }} />
                        </Box>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                            L&apos;heure et la date.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                <Card>
                    <Box sx={{ height: '140px' }}>
                        <img src={location} alt="location" style={{ width: '43%', height: '100%', display: 'flex', margin: 'auto' }} />
                    </Box>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                        L&apos;emplacement.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <Box sx={{ height: '140px' }}>
                            <img src={vehicle} alt="vehicle" style={{ width: '40%', height: '100%', display: 'flex', margin: 'auto' }} />
                        </Box>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                            Récuperer votre véhicule.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default HomeSectionOne;