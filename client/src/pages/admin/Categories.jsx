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
import {createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {MainListItems, secondaryListItems} from '../../components/dashboard/ListItems.jsx';
import { useMediaQuery } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from "../../components/navbar/Navbar.jsx";
import NavbarPro from "../../components/navbar/NavbarPro.jsx";

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

export default function Categories() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(!isMobile);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const token = localStorage.getItem('token');
    const [formErrors, setFormErrors] = useState({});

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [libelle, setLibelle] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        const getCategories = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://kame-os.fr/api/categories', {
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
                setCategories(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getCategories();
    }, [token]);


    const handleDelete = (category) => {
        setSelectedCategory(category);
        setOpenDeleteDialog(true);
    };

    useEffect(() => {
        if (selectedCategory) {
            setLibelle(selectedCategory.libelle);
        }
    }, [selectedCategory]);    

    const handleCreate = async () => {
        event.preventDefault();
        
        try {
            const response = await fetch('https://kame-os.fr/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    libelle: libelle,
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
                    setError('Une erreur s\'est produite lors de la création de la catégorie.');
                }
                return;
            } else {
                const data = await response.json();
                setError('');
                setCategories([...categories, data]);
                setOpenCreateDialog(false);
                setSuccess('Catégorie créée avec succès !');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la création de la catégorie.');
        }
    };

    const handleOpenCreateDialog = () => {
        setFormErrors({});
        setLibelle('');
        setOpenCreateDialog(true);
    };
    
    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`https://kame-os.fr/api/categories/${selectedCategory.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }

            const updatedCategories = categories.filter(category => category.id !== selectedCategory.id);
            setError('');
            setCategories(updatedCategories);
            setOpenDeleteDialog(false);
            setSuccess('Catégorie supprimée avec succès !');
        } catch (error) {
            setError('Une erreur s\'est produite lors de la suppression de la catégorie.');
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`https://kame-os.fr/api/categories/${selectedCategory.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    libelle: libelle,
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
                    setError('Une erreur s\'est produite lors de la création de la catégorie.');
                }
                return;
            } else {
                const updatedCategories = categories.map(category => {
                    if (category.id === selectedCategory.id) {
                        return {
                            ...category,
                            libelle: libelle,
                            updatedAt: new Date().toISOString(),
                        };
                    }
                    return category;
                });
    
                setError('');
                setCategories(updatedCategories);
                setOpenEditDialog(false);
                setSuccess('Catégorie modifiée avec succès !');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la mise à jour de la catégorie.');
        }
    };

    if (isLoading) {
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
                            Liste des catégories
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

    if (!categories.length) {
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
                            Liste des catégories
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
                                        Créer une nouvelle catégorie
                                    </Button>
                                </Box>

                                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                                    <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
                                    <form onSubmit={handleCreate}>
                                        <DialogContent>
                                            <TextField
                                                label="Libelle"
                                                value={libelle}
                                                onChange={(e) => setLibelle(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.libelle}
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
                                                <TableCell style={{color: 'white'}} align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" colSpan={8} align="center">
                                                    Aucune catégorie trouvée
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
                            Liste des catégories
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
                                        Créer une nouvelle catégorie
                                    </Button>
                                </Box>

                                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                                    <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
                                    <form onSubmit={handleCreate}>
                                        <DialogContent>
                                            <TextField
                                                label="Libelle"
                                                value={libelle}
                                                onChange={(e) => setLibelle(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.libelle}
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
                                                <TableCell style={{color: 'white'}} align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {categories.map((category) => (
                                                <TableRow
                                                    key={category.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {category.libelle}
                                                    </TableCell>
                                                    <TableCell>{category.createdAt ? format(new Date(category.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell>{category.updatedAt ? format(new Date(category.updatedAt), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleEdit(category)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDelete(category)}>
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
                                                Êtes-vous sûr de vouloir supprimer cette catégorie ?
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
                                            <DialogTitle>Modifier la catégorie</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    label="Libelle"
                                                    type="text"
                                                    value={libelle}
                                                    onChange={(e) => setLibelle(e.target.value)}
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