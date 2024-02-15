import {useCallback, useState} from 'react';
import { Badge, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MuiAppBar from '@mui/material/AppBar';
import { useMediaQuery } from '@mui/material';
import {createTheme, styled, ThemeProvider, useTheme} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {MainListItems, secondaryListItems} from '../dashboard/ListItems.jsx';
import NotificationButton from '../button/NotificationButton.jsx';
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";
import {useNavigate} from "react-router-dom";
import AvatarDialog from "./AvatarDialog.jsx";


const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const NavbarPro = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(!isMobile);

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

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
    <Box sx={{ display: 'flex' }}>
    <AppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: '24px' }}>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                }}
            >
                <MenuIcon />
            </IconButton>
            <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
            >
                Dashboard
            </Typography>
            <NotificationButton />
            <AvatarDialog firstName={user.connectedUser?.firstname} lastName={user.connectedUser?.lastname} handleLogout={handleLogout} />
        </Toolbar>
    </AppBar>

    <Drawer variant="permanent" open={open}>
        <Toolbar
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
            }}
        >
            <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
            </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
            <MainListItems/>
            <Divider sx={{ my: 1 }} />
            
        </List>
    </Drawer>
    </Box>

    );
}

export default NavbarPro;