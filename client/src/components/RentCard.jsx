import { Card, CardMedia, CardContent, Typography, Button, Box, Stack, Link } from "@mui/material";
import DoorBackIcon from '@mui/icons-material/DoorBack';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

const RentCard = (data) => {
    return (
        <Card variant="outlined" orientation="horizontal"
        sx={{
          backgroundColor: 'var(--joy-palette-neutral-100, #F0F4F8)',
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' },
          '&:hover': {
            boxShadow: 'lg',
            borderColor: 'var(--joy-palette-neutral-outlinedDisabledBorder)',
          },
        }}>
            <CardMedia
                image="https://source.unsplash.com/random/345x140?car"
                title="Car Image"
                sx={{ width: '40%' }}
            />
            <CardContent sx={{ display:"flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography sx={{ textTransform: 'uppercase' }} color="textSecondary" gutterBottom>
                            {data.car.model.brand.name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, flexDirection: "column" }}>
                            <DoorBackIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body2" color="textSecondary" component="p">
                                {data.car.nbDoors} portes
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, flexDirection: "column" }}>
                            <EventSeatIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body2" color="textSecondary" component="p">
                                {data.car.nbSeats} places
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, flexDirection: "column" }}>
                            <LocalGasStationIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body2" color="textSecondary" component="p">
                                {data.car.energy.name}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
                <Typography gutterBottom variant="h5" component="h2">
                    {data.car.model.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {data.car.description.length > 75 ? `${data.car.description.slice(0, 75)}...` : data.car.description}
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Typography variant="h6" color="textPrimary" component="p">
                        {data.car.price} € <span style={{ fontSize: '0.8em', fontWeight: "normal" }}>/ jour</span>
                    </Typography>
                    <Link href={`/cars/${data.car.id}?startDate=${data.query.startDate}&endDate=${data.query.endDate}&location=${data.query.location}`}>
                        <Button variant="contained" sx={{ backgroundColor: 'var(--joy-palette-neutral-700, #32383E)', color: 'var(--joy-palette-primary-contrastText, #FFFFFF)' }}>
                            Je loue
                        </Button>
                    </Link>
                </Box>
            </CardContent>
        </Card>

    );
};

export default RentCard;
