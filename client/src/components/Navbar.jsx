import { AppBar, Button } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import CarRentalIcon from '@mui/icons-material/CarRental';
import logo from '../assets/img/la-gova.png';

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <img src={logo} alt="La Gova" style={{ height: '50px' }} />
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1em' }}>
                <ul style={{ listStyleType: 'none', display: 'flex', gap: '1em' }}>
                    <li><a href="#"><Button startIcon={<CarRentalIcon />}>Louer mon véhicule</Button></a></li>
                    <li><a href="#"><Button variant="contained">S&apos;inscrire</Button></a></li>
                    <li><a href="#"><Button variant="outlined">Se connecter</Button></a></li>
                    <li><a href="#"><Button>FR | EN</Button></a></li>
                </ul>
            </Box>
        </Toolbar>
        </AppBar>
    );
    };

export default Navbar;