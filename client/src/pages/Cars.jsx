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
import { set } from "date-fns";

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

export default function Cars() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(!isMobile);
    const [isLoading, setIsLoading] = useState(true);
    const [cars, setCars] = useState([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const token = localStorage.getItem('token');
    const [formErrors, setFormErrors] = useState({});

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [description, setDescription] = useState('');
    const [year, setYear] = useState('');
    const [horses, setHorses] = useState('');
    const [nbSeats, setNbSeats] = useState('');
    const [nbDoors, setNbDoors] = useState('');
    const [price, setPrice] = useState('');
    const [mileage, setMileage] = useState('');
    const [media, setMedia] = useState('');
    const [gears, setGears] = useState([]);
    const [models, setModels] = useState([]);
    const [energies, setEnergies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedGear, setSelectedGear] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedEnergy, setSelectedEnergy] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        const loadData = async () => {
            const fetchData = async (url, setter) => {
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (!response.ok) throw new Error('Erreur lors de la récupération des données');
                    const data = await response.json();
                    setter(data);
                } catch (error) {
                    console.error(error);
                }
            };
    
            fetchData('http://localhost:8000/api/gears', setGears);
            fetchData('http://localhost:8000/api/models', setModels);
            fetchData('http://localhost:8000/api/energies', setEnergies);
            fetchData('http://localhost:8000/api/categories', setCategories);
            fetchData('http://localhost:8000/api/companies', setCompanies);
        };
    
        loadData();
    }, [token]);

    useEffect(() => {
        const getCars = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/cars', {
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
                setCars(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getCars();
    }, [token]);
    
    const handleDelete = (car) => {
        setSelectedCar(car);
        setOpenDeleteDialog(true);
    };

    useEffect(() => {
        if (selectedCar) {
            setDescription(selectedCar.description);
            setYear(selectedCar.year);
            setHorses(selectedCar.horses);
            setNbSeats(selectedCar.nbSeats);
            setNbDoors(selectedCar.nbDoors);
            setPrice(selectedCar.price);
            setMileage(selectedCar.mileage);
            setMedia(selectedCar.media);
            setSelectedGear(selectedCar.gear.id);
            setSelectedModel(selectedCar.model.id);
            setSelectedEnergy(selectedCar.energy.id);
            setSelectedCategory(selectedCar.category.id);
            setSelectedCompany(selectedCar.companie.id);
        }
    }, [selectedCar]);    

    const handleCreate = async () => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8000/api/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    year: year,
                    horses: horses,
                    nbSeats: nbSeats,
                    nbDoors: nbDoors,
                    price: price,
                    mileage: mileage,
                    media: media,
                    gear: `/api/gears/${selectedGear}`,
                    model: `/api/models/${selectedModel}`,
                    energy: `/api/energies/${selectedEnergy}`,
                    category: `/api/categories/${selectedCategory}`,
                    companie: `/api/companies/${selectedCompany}`,
                    description: description,
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
                    setError('Une erreur s\'est produite lors de la création de la voiture.');
                }
                return;
            } else {
                const data = await response.json();
                setError('');
                setCars([...cars, data]);
                setOpenCreateDialog(false);
                setSuccess('Voiture créée avec succès !');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la création de la voiture.');
        }
    };

    const handleOpenCreateDialog = () => {
        setFormErrors({});
        setDescription('');
        setYear('');
        setHorses('');
        setNbSeats('');
        setNbDoors('');
        setPrice('');
        setMileage('');
        setMedia('');
        setSelectedGear('');
        setSelectedModel('');
        setSelectedEnergy('');
        setSelectedCategory('');
        setSelectedCompany('');
        setOpenCreateDialog(true);
    };
    
    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/cars/${selectedCar.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }

            const updatedCars = cars.filter(car => car.id !== selectedCar.id);
            setError('');
            setCars(updatedCars);
            setOpenDeleteDialog(false);
            setSuccess('Voiture supprimée avec succès !');
        } catch (error) {
            setError('Une erreur s\'est produite lors de la suppression de la voiture.');
        }
    };

    const handleEdit = (car) => {
        setFormErrors({});
        setSelectedCar(car);
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/cars/${selectedCar.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: description,
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
                    setError('Une erreur s\'est produite lors de la création de la voiture.');
                }
                return;
            } else {
                const updatedCars = cars.map(car => {
                    if (car.id === selectedCar.id) {
                        return {
                            ...car,
                            description: description,
                            updatedAt: new Date().toISOString(),
                        };
                    }
                    return car;
                });
                setError('');
                setCars(updatedCars);
                setOpenEditDialog(false);
                setSuccess('Voiture modifiée avec succès !');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la mise à jour de la voiture.');
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
                        {secondaryListItems}
                    </List>
                </Drawer>
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
                            Liste des voitures
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

    if (!cars.length) {
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
                        {secondaryListItems}
                    </List>
                </Drawer>
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
                            Liste des voitures
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
                                        Créer une nouvelle voiture
                                    </Button>
                                </Box>

                                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                                    <DialogTitle>Créer une nouvelle voiture</DialogTitle>
                                    <form onSubmit={handleCreate}>
                                        <DialogContent>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Compagnie</InputLabel>
                                                <Select
                                                    value={selectedCompany}
                                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                                    required
                                                >
                                                    {companies.map((company) => (
                                                        <MenuItem key={company.id} value={company.id}>
                                                            {company.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Modèle</InputLabel>
                                                <Select
                                                    value={selectedModel}
                                                    onChange={(e) => setSelectedModel(e.target.value)}
                                                    required
                                                >
                                                    {models.map((model) => (
                                                        <MenuItem key={model.id} value={model.id}>
                                                            {model.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                label="Année"
                                                type="number"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.year}
                                                required
                                            />
                                            <TextField
                                                label="Chevaux"
                                                type="number"
                                                value={horses}
                                                onChange={(e) => setHorses(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.horses}
                                                required
                                            />
                                            <TextField
                                                label="Nombre de siège"
                                                type="number"
                                                value={nbSeats}
                                                onChange={(e) => setNbSeats(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.nbSeats}
                                                required
                                            />
                                            <TextField
                                                label="Nombre de porte"
                                                type="number"
                                                value={nbDoors}
                                                onChange={(e) => setNbDoors(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.nbDoors}
                                                required
                                            />
                                            <TextField
                                                label="Prix"
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.price}
                                                required
                                            />
                                            <TextField
                                                label="Kilométrage"
                                                type="number"
                                                value={mileage}
                                                onChange={(e) => setMileage(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.mileage}
                                                required
                                            />
                                            <TextField
                                                label="Média"
                                                type="text"
                                                value={media}
                                                onChange={(e) => setMedia(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.media}
                                                required
                                            />
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Boîte de vitesse</InputLabel>
                                                <Select
                                                    value={selectedGear}
                                                    onChange={(e) => setSelectedGear(e.target.value)}
                                                    required
                                                >
                                                    {gears.map((gear) => (
                                                        <MenuItem key={gear.id} value={gear.id}>
                                                            {gear.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                           
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Energie</InputLabel>
                                                <Select
                                                    value={selectedEnergy}
                                                    onChange={(e) => setSelectedEnergy(e.target.value)}
                                                    required
                                                >
                                                    {energies.map((energy) => (
                                                        <MenuItem key={energy.id} value={energy.id}>
                                                            {energy.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Catégorie</InputLabel>
                                                <Select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    required
                                                >
                                                    {categories.map((category) => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            {category.libelle}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                label="Description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.description}
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
                                                <TableCell style={{color: 'white'}}>Compagnie</TableCell>
                                                <TableCell style={{color: 'white'}}>Modèle</TableCell>
                                                <TableCell style={{color: 'white'}}>Marque</TableCell>
                                                <TableCell style={{color: 'white'}}>Année</TableCell>
                                                <TableCell style={{color: 'white'}}>Chevaux</TableCell>
                                                <TableCell style={{color: 'white'}}>Nombre de siège</TableCell>
                                                <TableCell style={{color: 'white'}}>Nombre de porte</TableCell>
                                                <TableCell style={{color: 'white'}}>Prix</TableCell>
                                                <TableCell style={{color: 'white'}}>Kilométrage</TableCell>
                                                <TableCell style={{color: 'white'}}>Boîte de vitesse</TableCell>
                                                <TableCell style={{color: 'white'}}>Energie</TableCell>
                                                <TableCell style={{color: 'white'}}>Catégorie</TableCell>
                                                <TableCell style={{color: 'white'}}>Média</TableCell>
                                                <TableCell style={{color: 'white'}}>Nombre de réservation</TableCell>
                                                <TableCell style={{color: 'white'}}>Description</TableCell>
                                                <TableCell style={{color: 'white'}}>Crée à</TableCell>
                                                <TableCell style={{color: 'white'}}>Modifié à</TableCell>
                                                <TableCell style={{color: 'white'}} align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" colSpan={8} align="center">
                                                    Aucune voiture trouvée
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
                        {secondaryListItems}
                    </List>
                </Drawer>
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
                            Liste des voitures
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
                                        Créer une nouvelle voiture
                                    </Button>
                                </Box>

                                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                                    <DialogTitle>Créer une nouvelle voiture</DialogTitle>
                                    <form onSubmit={handleCreate}>
                                        <DialogContent>
                                        <FormControl fullWidth margin="normal">
                                                <InputLabel>Compagnie</InputLabel>
                                                <Select
                                                    value={selectedCompany}
                                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                                    required
                                                >
                                                    {companies.map((company) => (
                                                        <MenuItem key={company.id} value={company.id}>
                                                            {company.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Modèle</InputLabel>
                                                <Select
                                                    value={selectedModel}
                                                    onChange={(e) => setSelectedModel(e.target.value)}
                                                    required
                                                >
                                                    {models.map((model) => (
                                                        <MenuItem key={model.id} value={model.id}>
                                                            {model.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                label="Année"
                                                type="number"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.year}
                                                required
                                            />
                                            <TextField
                                                label="Chevaux"
                                                type="number"
                                                value={horses}
                                                onChange={(e) => setHorses(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.horses}
                                                required
                                            />
                                            <TextField
                                                label="Nombre de siège"
                                                type="number"
                                                value={nbSeats}
                                                onChange={(e) => setNbSeats(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.nbSeats}
                                                required
                                            />
                                            <TextField
                                                label="Nombre de porte"
                                                type="number"
                                                value={nbDoors}
                                                onChange={(e) => setNbDoors(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.nbDoors}
                                                required
                                            />
                                            <TextField
                                                label="Prix"
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.price}
                                                required
                                            />
                                            <TextField
                                                label="Kilométrage"
                                                type="number"
                                                value={mileage}
                                                onChange={(e) => setMileage(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.mileage}
                                                required
                                            />
                                            <TextField
                                                label="Média"
                                                type="text"
                                                value={media}
                                                onChange={(e) => setMedia(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.media}
                                                required
                                            />
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Boîte de vitesse</InputLabel>
                                                <Select
                                                    value={selectedGear}
                                                    onChange={(e) => setSelectedGear(e.target.value)}
                                                    required
                                                >
                                                    {gears.map((gear) => (
                                                        <MenuItem key={gear.id} value={gear.id}>
                                                            {gear.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                           
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Energie</InputLabel>
                                                <Select
                                                    value={selectedEnergy}
                                                    onChange={(e) => setSelectedEnergy(e.target.value)}
                                                    required
                                                >
                                                    {energies.map((energy) => (
                                                        <MenuItem key={energy.id} value={energy.id}>
                                                            {energy.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Catégorie</InputLabel>
                                                <Select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    required
                                                >
                                                    {categories.map((category) => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            {category.libelle}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                label="Description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.description}
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
                                                <TableCell style={{color: 'white'}}>Compagnie</TableCell>
                                                <TableCell style={{color: 'white'}}>Modèle</TableCell>
                                                <TableCell style={{color: 'white'}}>Marque</TableCell>
                                                <TableCell style={{color: 'white'}}>Année</TableCell>
                                                <TableCell style={{color: 'white'}}>Chevaux</TableCell>
                                                <TableCell style={{color: 'white'}}>Nombre de siège</TableCell>
                                                <TableCell style={{color: 'white'}}>Nombre de porte</TableCell>
                                                <TableCell style={{color: 'white'}}>Prix</TableCell>
                                                <TableCell style={{color: 'white'}}>Kilométrage</TableCell>
                                                <TableCell style={{color: 'white'}}>Boîte de vitesse</TableCell>
                                                <TableCell style={{color: 'white'}}>Energie</TableCell>
                                                <TableCell style={{color: 'white'}}>Catégorie</TableCell>
                                                <TableCell style={{color: 'white'}}>Média</TableCell>
                                                <TableCell style={{color: 'white'}}>Nombre de réservation</TableCell>
                                                <TableCell style={{color: 'white'}}>Description</TableCell>
                                                <TableCell style={{color: 'white'}}>Crée à</TableCell>
                                                <TableCell style={{color: 'white'}}>Modifié à</TableCell>
                                                <TableCell style={{color: 'white'}} align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cars.map((car) => (
                                                <TableRow
                                                    key={car.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {car.companie.name}
                                                    </TableCell>
                                                    <TableCell>{car.model.name}</TableCell>
                                                    <TableCell>{car.model.brand.name}</TableCell>
                                                    <TableCell>{car.year}</TableCell>
                                                    <TableCell>{car.horses}</TableCell>
                                                    <TableCell>{car.nbSeats}</TableCell>
                                                    <TableCell>{car.nbDoors}</TableCell>
                                                    <TableCell>{car.price}</TableCell>
                                                    <TableCell>{car.mileage}</TableCell>
                                                    <TableCell>{car.gear.name}</TableCell>
                                                    <TableCell>{car.energy.name}</TableCell>
                                                    <TableCell>{car.category.libelle}</TableCell>
                                                    <TableCell>
                                                        {car.media.map((mediaItem, index) => (
                                                            <img key={index} src={mediaItem.filePath} alt={`${mediaItem.filePath}`} style={{ width: "100px", marginRight: "5px" }} />
                                                        ))}
                                                    </TableCell>
                                                    <TableCell>{car.rents.length}</TableCell>
                                                    <TableCell>{car.description}</TableCell>
                                                    <TableCell>{car.createdAt ? format(new Date(car.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell>{car.updatedAt ? format(new Date(car.updatedAt), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleEdit(car)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDelete(car)}>
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
                                                Êtes-vous sûr de vouloir supprimer cette voiture ?
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
                                            <DialogTitle>Modifier la voiture</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    label="Description"
                                                    type="text"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
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