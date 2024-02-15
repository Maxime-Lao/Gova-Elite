import { Box, Grid, Typography, CardContent } from "@mui/material";
import calendar from '../assets/img/calendar.png';
import location from '../assets/img/location.png';
import vehicle from '../assets/img/valet.jpg';
import { useTranslation } from 'react-i18next';

const HomeSectionOne = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ padding: '2em' }}>
            <Typography variant="h4" component="h4" sx={{ marginBottom: '2em', textAlign: 'center', fontWeight: "100" }}>{t('Louez votre véhicule en seulement 3 étapes.')}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                        <Box sx={{ height: '140px' }}>
                            <img src={calendar} alt="calendar" style={{ height: '100%', display: 'flex', margin: 'auto' }} />
                        </Box>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: "300" }} >
                                {t("L'heure et la date.")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('Choisissez quand et où commence votre aventure.')}
                            </Typography>
                        </CardContent>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ height: '140px' }}>
                        <img src={location} alt="location" style={{ height: '100%', display: 'flex', margin: 'auto' }} />
                    </Box>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: "300" }} >
                            {t("L'emplacement.")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('Sélectionnez le point de départ idéal pour votre voyage.')}
                        </Typography>
                    </CardContent>
                </Grid>
                <Grid item xs={12} sm={4}>
                        <Box sx={{ height: '140px' }}>
                            <img src={vehicle} alt="vehicle" style={{ height: '100%', display: 'flex', margin: 'auto' }} />
                        </Box>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: "300" }} >
                                {t("Récupérer votre véhicule.")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('Prenez les clés et écrivez votre histoire sur la route.')}
                            </Typography>
                        </CardContent>
                </Grid>
            </Grid>
        </Box>
    );
}

export default HomeSectionOne;