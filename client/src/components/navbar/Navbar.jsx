import { AppBar, Button, Link } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import CarRentalIcon from '@mui/icons-material/CarRental';
import logo from '../../assets/img/la-gova.png';
import {useCallback, useState} from "react";
import AvatarDialog from "./AvatarDialog.jsx";
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const localStorageToken = localStorage.getItem('token');
    const [myToken, setMyToken] = useState(localStorageToken);
    const user = useGetConnectedUser();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        try {
            const response = fetch('http://localhost:8000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${myToken}`,
                },
            });
            console.log(response);
        } catch (error) {
            console.error('Erreur lors de la déconnexion: ' + error.message);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('email');
        setMyToken(null);
        location.reload();
    }, [localStorageToken, user]);

    const redirectToLogin = () => {
        navigate('/login');
    };

    const redirectToRegister = () => {
        navigate('/register');
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
            <Link href="/" underline="none" color="inherit"  sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                    <img src={logo} alt="La Gova" style={{ height: '50px' }} />
                </Typography>
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1em' }}>
                <ul style={{ listStyleType: 'none', display: 'flex', gap: '1em' }}>
                    <li><a href="#"><Button startIcon={<CarRentalIcon />}>Louer mon véhicule</Button></a></li>
                    {
                        !myToken || !user.connectedUser.id ? (
                            <>
                                <li><Button onClick={redirectToLogin}>Se connecter</Button></li>
                                <li><Button onClick={redirectToRegister}>S'inscrire</Button></li>
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