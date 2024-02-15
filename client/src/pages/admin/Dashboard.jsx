import {useEffect, useState} from 'react';
import {createTheme, styled, ThemeProvider, useTheme} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {MainListItems} from '../../components/dashboard/ListItems.jsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import CardInfo from "../../components/dashboard/CardInfo.jsx";
import {Grid} from "@mui/material";
import { useMediaQuery } from '@mui/material';
import NavPro from "../../components/navbar/NavbarPro.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

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

export default function Dashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(!isMobile);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const token = localStorage.getItem('token');
    const [users, setUsers] = useState([]);

    const data = {
        labels: ['Comptes vérifiés', 'Comptes non vérifiés'],
        datasets: [
            {
                label: '# of Votes',
                data: [users.filter((user) => user.isVerified === true).length, users.filter((user) => user.isVerified === false).length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgb(255,255,255)',
                    'rgb(255,255,255)',
                ],
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const usersData = await response.json();
                    setUsers(usersData);
                } else {
                    console.error('Erreur lors de la récupération des utilisateurs');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        };

        fetchUsers();
    }, [token]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <NavPro />
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
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
                            Statistiques sur les utilisateurs
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} md={4} lg={4}>
                                <CardInfo title="Nombre d'utilisateurs" nbInfo={users.length} />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <CardInfo title="Nombre d'admins" nbInfo={users.filter(user => user.roles.includes('ROLE_ADMIN')).length} />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <CardInfo title="Nombre de prestataires" nbInfo={users.filter(user => user.roles.includes('ROLE_PRO')).length} />
                            </Grid>
                        </Grid>

                        <Typography variant="h2" gutterBottom sx={{ mt: 5, mb: 5 }}>
                            Graphique sur les utilisateurs
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} md={6}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Box sx={{ width: '300px', height: '300px' }}>
                                    <Pie data={data} options={{ maintainAspectRatio: true }} />
                                    </Box>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
