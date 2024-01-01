import { AppBar, Button } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import CarRentalIcon from '@mui/icons-material/CarRental';
import logo from '../../assets/img/la-gova.png';
import {useCallback, useState} from "react";
import AvatarDialog from "./AvatarDialog.jsx";
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";

const Navbar = () => {

    const localStorageToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const [myToken, setMyToken] = useState(localStorageToken);

    const user = useGetConnectedUser();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('email');
        setMyToken(null);
    }, [localStorageToken]);

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <img src={logo} alt="La Gova" style={{ height: '50px' }} />
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1em' }}>
                <ul style={{ listStyleType: 'none', display: 'flex', gap: '1em' }}>
                    <li><a href="#"><Button startIcon={<CarRentalIcon />}>Louer mon véhicule</Button></a></li>
                    {
                        !myToken ? (
                            <>
                                <li><a href="/login"><Button>Se connecter</Button></a></li>
                                <li><a href="/register"><Button>S'inscrire</Button></a></li>
                            </>
                        ) : (
                            <li>
                                <AvatarDialog firstName={user.connectedUser?.firstname} lastName={user.connectedUser?.lastname} handleLogout={ handleLogout }/>
                            </li>
                        )
                    }
                    <li><a href="#"><Button>FR | EN</Button></a></li>
                </ul>
            </Box>
        </Toolbar>
        </AppBar>
    );
    };

export default Navbar;