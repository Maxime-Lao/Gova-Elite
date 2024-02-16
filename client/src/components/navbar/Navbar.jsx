import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from "react";
import AvatarDialog from "./AvatarDialog.jsx";
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";
import { useNavigate } from "react-router-dom";
import NotificationButton from "../button/NotificationButton.jsx";
import CarRentalIcon from '@mui/icons-material/CarRental';
import logo from '../../assets/img/la-gova.png';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
    };
    const localStorageToken = localStorage.getItem('token');
    const [myToken, setMyToken] = useState(localStorageToken);
    const user = useGetConnectedUser();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        try {
            const response = await fetch('https://kame-os.fr/logout', {
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
                        {!myToken || !user.connectedUser ? (
                            <>
                                <li><Button onClick={redirectToLogin}>{t('Connexion')}</Button></li>
                                <li><Button onClick={redirectToRegister}>{t("S'inscrire")}</Button></li>
                            </>
                        ) : (
                            <>
                                {(user.connectedUser?.roles[0] === 'ROLE_ADMIN' || user.connectedUser?.roles[0] === 'ROLE_PRO') && (
                                    <li><NotificationButton /></li>
                                )}
                                {(user.connectedUser?.roles[0] === 'ROLE_USER') && (
                                    <li><Button onClick={redirectToBookings}>{t('Réservations')}</Button></li>
                                )}
                                <li>
                                    <AvatarDialog firstName={user.connectedUser?.firstname} lastName={user.connectedUser?.lastname} handleLogout={handleLogout} />
                                </li>
                            </>
                        )}
                        <li><Button onClick={() => changeLanguage('en')}>EN</Button></li>
                        <li><Button onClick={() => changeLanguage('fr')}>FR</Button></li>
                    </ul>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
