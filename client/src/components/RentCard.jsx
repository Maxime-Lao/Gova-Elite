import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";

const RentCard = (car) => {
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
                <Typography sx={{ textTransform: 'uppercase' }} color="textSecondary" gutterBottom>
                    {car.car.model.brand.name}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                    {car.car.model.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="textPrimary" component="p">
                        {car.car.price} € / jour
                    </Typography>
                    <Button variant="contained" sx={{ backgroundColor: 'var(--joy-palette-neutral-700, #32383E)', color: 'var(--joy-palette-primary-contrastText, #FFFFFF)' }}>
                        Je loue
                    </Button>
                </Box>
            </CardContent>
        </Card>

    );
};

export default RentCard;
