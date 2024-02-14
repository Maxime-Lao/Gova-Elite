import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useState } from "react";
import AvatarDialog from "./AvatarDialog.jsx";
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";
import { useNavigate } from "react-router-dom";
import NotificationButton from "../button/NotificationButton.jsx";
import CarRentalIcon from '@mui/icons-material/CarRental';
import logo from '../../assets/img/la-gova.png';

const Navbar = () => {
    const localStorageToken = localStorage.getItem('token');
    const [myToken, setMyToken] = useState(localStorageToken);
    const user = useGetConnectedUser();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${myToken}`,
                },
            });
        } catch (error) {
            console.error('Error logging out: ' + error.message);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('email');
        setMyToken(null);
        location.reload();
    }, [myToken]);

    const redirectToLogin = () => {
        navigate('/login');
    };

    const redirectToRegister = () => {
        navigate('/register');
    };

    const redirectToBookings = () => {
        navigate('/bookings');
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
            <Toolbar>
                <Link href="/" underline="none" color="inherit" sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                        <img src={logo} alt="La Gova" style={{ height: '50px' }} />
                    </Typography>
                </Link>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1em' }}>
                    <ul style={{ listStyleType: 'none', display: 'flex', gap: '1em', alignItems: 'center' }}>
                        <li><Button startIcon={<CarRentalIcon />}>Rent my vehicle</Button></li>
                        {!myToken || !user.connectedUser ? (
                            <>
                                <li><Button onClick={redirectToLogin}>Log In</Button></li>
                                <li><Button onClick={redirectToRegister}>Register</Button></li>
                            </>
                        ) : (
                            <>
                                {(user.connectedUser?.roles[0] === 'ROLE_ADMIN' || user.connectedUser?.roles[0] === 'ROLE_PRO') && (
                                    <li><NotificationButton /></li>
                                )}
                                <li><Button onClick={redirectToBookings}>Réservations</Button></li>
                                <li>
                                    <AvatarDialog firstName={user.connectedUser?.firstname} lastName={user.connectedUser?.lastname} handleLogout={handleLogout} />
                                </li>
                            </>
                        )}
                        <li><a href="#"><Button>FR | EN</Button></a></li>
                    </ul>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
