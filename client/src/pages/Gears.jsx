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
import EditIcon from "@mui/icons-material/Edit";
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';
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

export default function Gears() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(!isMobile);
    const [isLoading, setIsLoading] = useState(true);
    const [gears, setGears] = useState([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedGear, setSelectedGear] = useState(null);
    const token = localStorage.getItem('token');
    const [formErrors, setFormErrors] = useState({});

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        const getGears = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/gears', {
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
                setGears(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getGears();
    }, [token]);


    const handleDelete = (gear) => {
        setSelectedGear(gear);
        setOpenDeleteDialog(true);
    };

    useEffect(() => {
        if (selectedGear) {
            setName(selectedGear.name);
        }
    }, [selectedGear]);    

    const handleCreate = async () => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8000/api/gears', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    createdAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                setFormErrors({});

                const data = await response.json();

                if (data.violations) {
                    const errors = {};
                    data.violations.forEach(violation => {
                        errors[violation.propertyPath] = violation.message;
                    });
                    setFormErrors(errors);
                } else {
                    setError('Une erreur s\'est produite lors de la création de la boîte de vitesse.');
                }
                return;
            } else {
                const data = await response.json();
                setError('');
                setGears([...gears, data]);
                setOpenCreateDialog(false);
                setSuccess('Boîte de vitesse créée avec succès !');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la création de la boîte de vitesse.');
        }
    };

    const handleOpenCreateDialog = () => {
        setFormErrors({});
        setName('');
        setOpenCreateDialog(true);
    };
    
    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/gears/${selectedGear.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }

            const updatedGears = gears.filter(gear => gear.id !== selectedGear.id);
            setError('');
            setGears(updatedGears);
            setOpenDeleteDialog(false);
            setSuccess('Boîte de vitesse supprimée avec succès !');
        } catch (error) {
            setError('Une erreur s\'est produite lors de la suppression de la boîte de vitesse.');
        }
    };

    const handleEdit = (gear) => {
        setFormErrors({});
        setSelectedGear(gear);
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/gears/${selectedGear.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    updatedAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                setFormErrors({});

                const data = await response.json();

                if (data.violations) {
                    const errors = {};
                    data.violations.forEach(violation => {
                        errors[violation.propertyPath] = violation.message;
                    });
                    setFormErrors(errors);
                } else {
                    setError('Une erreur s\'est produite lors de la création de la boîte de vitesse.');
                }
                return;
            } else {
                const updatedGears = gears.map(gear => {
                    if (gear.id === selectedGear.id) {
                        return {
                            ...gear,
                            name: name,
                            updatedAt: new Date().toISOString(),
                        };
                    }
                    return gear;
                });
    
                setError('');
                setGears(updatedGears);
                setOpenEditDialog(false);
                setSuccess('Boîte de vitesse modifiée avec succès !');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la mise à jour de la boîte de vitesse.');
        }
    };

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
                            Liste des boîtes de vitesse
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

    if (!gears.length) {
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
                            Liste des boîtes de vitesse
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12}>
                                {
                                    success.length ? (
                                        <Box mt={2} textAlign="center">
                                            <p style={{color: 'green'}}>{success}</p>
                                        </Box>
                                    ) : null
                                }
                                {
                                    error.length ? (
                                        <Box mt={2} textAlign="center">
                                            <p style={{color: 'red'}}>{error}</p>
                                        </Box>
                                    ) : null
                                }
                                
                                <Box sx={{ mb: 2 }}>
                                    <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
                                        Créer une nouvelle boîte de vitesse
                                    </Button>
                                </Box>

                                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                                    <DialogTitle>Créer une nouvelle boîte de vitesse</DialogTitle>
                                    <form onSubmit={handleCreate}>
                                        <DialogContent>
                                            <TextField
                                                label="Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.name}
                                                required
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseCreateDialog}>Annuler</Button>
                                            <Button type="submit">Créer</Button>
                                        </DialogActions>
                                    </form>
                                    {Object.keys(formErrors).length > 0 && (
                                        <Box sx={{ margin: 2 }}>
                                            {Object.values(formErrors).map((error, index) => (
                                                <Typography key={index} color="error">
                                                    - {error}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                </Dialog>

                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow style={{background: '#556cd6'}}>
                                                <TableCell style={{color: 'white'}}>Nom</TableCell>
                                                <TableCell style={{color: 'white'}}>Crée à</TableCell>
                                                <TableCell style={{color: 'white'}}>Modifié à</TableCell>
                                                <TableCell  style={{color: 'white'}}align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" colSpan={8} align="center">
                                                    Aucune boîte de vitesse trouvée
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
                            Liste des boîtes de vitesse
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12}>
                                {
                                    success.length ? (
                                        <Box mt={2} textAlign="center">
                                            <p style={{color: 'green'}}>{success}</p>
                                        </Box>
                                    ) : null
                                }
                                {
                                    error.length ? (
                                        <Box mt={2} textAlign="center">
                                            <p style={{color: 'red'}}>{error}</p>
                                        </Box>
                                    ) : null
                                }
                                
                                <Box sx={{ mb: 2 }}>
                                    <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
                                        Créer une nouvelle boîte de vitesse
                                    </Button>
                                </Box>

                                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                                    <DialogTitle>Créer une nouvelle boîte de vitesse</DialogTitle>
                                    <form onSubmit={handleCreate}>
                                        <DialogContent>
                                            <TextField
                                                label="Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.name}
                                                required
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseCreateDialog}>Annuler</Button>
                                            <Button type="submit">Créer</Button>
                                        </DialogActions>
                                    </form>
                                    {Object.keys(formErrors).length > 0 && (
                                        <Box sx={{ margin: 2 }}>
                                            {Object.values(formErrors).map((error, index) => (
                                                <Typography key={index} color="error">
                                                    - {error}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                </Dialog>

                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow style={{background: '#556cd6'}}>
                                                <TableCell style={{color: 'white'}}>Nom</TableCell>
                                                <TableCell style={{color: 'white'}}>Crée à</TableCell>
                                                <TableCell style={{color: 'white'}}>Modifié à</TableCell>
                                                <TableCell  style={{color: 'white'}}align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {gears.map((gear) => (
                                                <TableRow
                                                    key={gear.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {gear.name}
                                                    </TableCell>
                                                    <TableCell>{gear.createdAt ? format(new Date(gear.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell>{gear.updatedAt ? format(new Date(gear.updatedAt), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleEdit(gear)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDelete(gear)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                               
                                        <Dialog
                                            open={openDeleteDialog}
                                            onClose={() => setOpenDeleteDialog(false)}
                                        >
                                            <DialogTitle>Confirmation</DialogTitle>
                                            <DialogContent>
                                                Êtes-vous sûr de vouloir supprimer cette boîte de vitesse ?
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
                                                <Button onClick={handleConfirmDelete} autoFocus>Supprimer</Button>
                                            </DialogActions>
                                        </Dialog>
                                 
                                        <Dialog
                                            open={openEditDialog}
                                            onClose={() => setOpenEditDialog(false)}
                                        >
                                            <DialogTitle>Modifier la boîte de vitesse</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    label="Name"
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
                                                <Button onClick={handleUpdate} autoFocus>Enregistrer</Button>
                                            </DialogActions>
                                            {Object.keys(formErrors).length > 0 && (
                                                <Box sx={{ margin: 2 }}>
                                                    {Object.values(formErrors).map((error, index) => (
                                                        <Typography key={index} color="error">
                                                            - {error}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            )}
                                        </Dialog>
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