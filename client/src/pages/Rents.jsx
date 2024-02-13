import React, { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Input
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';
import EditIcon from "@mui/icons-material/Edit";
import {createTheme, styled, ThemeProvider, useTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {MainListItems, secondaryListItems} from '../components/dashboard/ListItems.jsx';
import { useMediaQuery } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from "../components/navbar/Navbar.jsx";
import NavbarPro from "../components/navbar/NavbarPro.jsx";

export function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {`Copyright © `}
            <Link color="inherit" href="/">
                Gova Elite
            </Link>
            {` ${new Date().getFullYear()}.`}
        </Typography>
    );
}

const drawerWidth = 240;

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

const defaultTheme = createTheme({
    palette: {
      primary: {
        main: '#556cd6',
      },
      secondary: {
        main: '#19857b',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontSize: '2.4rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
          },
        },
      },
    },
});

export default function Rents() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(!isMobile);
    const [isLoading, setIsLoading] = useState(true);
    const [rents, setRents] = useState([]);
    const token = localStorage.getItem('token');

    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        const getRents = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://195.35.29.110:8000/api/rents', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }

                const data = await response.json();
                setRents(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getRents();
    }, [token]);

    if (isLoading) {
        return (

            <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
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
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Box
                        sx={{
                            mt: 4,
                            mb: 4,
                            flexGrow: 1,
                            paddingX: 5,
                        }}
                    >
                        <Typography variant="h2" gutterBottom sx={{ mt: 5, mb: 5 }}>
                            Liste des réservations
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            </div>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
        );
    }
    
    if (!rents.length) {
        return (

            <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <NavbarPro />

                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1
                    }}
                >
                    <Toolbar />
                    <Box
                        sx={{
                            mt: 4,
                            mb: 4,
                            flexGrow: 1,
                            paddingX: 5,
                        }}
                    >
                        <Typography variant="h2" gutterBottom sx={{ mt: 5, mb: 5 }}>
                            Liste des réservations
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow style={{background: '#556cd6'}}>
                                                <TableCell style={{color: 'white'}}>Compagnie</TableCell>
                                                <TableCell style={{color: 'white'}}>Modèle</TableCell>
                                                <TableCell style={{color: 'white'}}>Marque</TableCell>
                                                <TableCell style={{color: 'white'}}>Utilisateur</TableCell>
                                                <TableCell style={{color: 'white'}}>Prix</TableCell>
                                                <TableCell style={{color: 'white'}}>Date de départ</TableCell>
                                                <TableCell style={{color: 'white'}}>Date de fin</TableCell>
                                                <TableCell style={{color: 'white'}}>Crée à</TableCell>
                                                <TableCell style={{color: 'white'}}>Modifié à</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" colSpan={8} align="center">
                                                    Aucune réservation trouvée
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <NavbarPro />

                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1
                    }}
                >
                    <Toolbar />
                    <Box
                        sx={{
                            mt: 4,
                            mb: 4,
                            flexGrow: 1,
                            paddingX: 5,
                        }}
                    >
                        <Typography variant="h2" gutterBottom sx={{ mt: 5, mb: 5 }}>
                            Liste des réservations
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow style={{background: '#556cd6'}}>
                                                <TableCell style={{color: 'white'}}>Compagnie</TableCell>
                                                <TableCell style={{color: 'white'}}>Modèle</TableCell>
                                                <TableCell style={{color: 'white'}}>Marque</TableCell>
                                                <TableCell style={{color: 'white'}}>Utilisateur</TableCell>
                                                <TableCell style={{color: 'white'}}>Prix</TableCell>
                                                <TableCell style={{color: 'white'}}>Date de départ</TableCell>
                                                <TableCell style={{color: 'white'}}>Date de fin</TableCell>
                                                <TableCell style={{color: 'white'}}>Crée à</TableCell>
                                                <TableCell style={{color: 'white'}}>Modifié à</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rents.map((rent) => (
                                                <TableRow
                                                    key={rent.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {rent.car.companie.name}
                                                    </TableCell>
                                                    <TableCell>{rent.car.model.name}</TableCell>
                                                    <TableCell>{rent.car.model.brand.name}</TableCell>
                                                    <TableCell>{rent.user.firstname} {rent.user.lastname}</TableCell>
                                                    <TableCell>{rent.totalPrice}€</TableCell>
                                                    <TableCell>{rent.dateStart ? format(new Date(rent.dateStart), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell>{rent.dateEnd ? format(new Date(rent.dateEnd), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell>{rent.createdAt ? format(new Date(rent.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell>{rent.updatedAt ? format(new Date(rent.updatedAt), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}