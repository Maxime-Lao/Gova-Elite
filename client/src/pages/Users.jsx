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

export default function Users() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(!isMobile);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const token = localStorage.getItem('token');
    const emailLoggedUser = localStorage.getItem('email');
    const [formErrors, setFormErrors] = useState({});

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [kbis, setKbis] = useState('');
    const [showKbis, setShowKbis] = useState(false);

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        const getUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://195.35.29.110:8000/api/users', {
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
                setUsers(data.filter(user => user.email !== emailLoggedUser));
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getUsers();
    }, [token, emailLoggedUser]);


    const handleDelete = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    useEffect(() => {
        if (selectedUser) {
            setEmail(selectedUser.email);
            setFirstname(selectedUser.firstname)
            setLastname(selectedUser.lastname)
            setPassword(selectedUser.password)
            setPhone(selectedUser.phone)
            setRole(selectedUser.roles)
        }
    }, [selectedUser]);    

    const handleCreate = async () => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://195.35.29.110:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: email,
                    plainPassword: password,
                    firstname: firstname,
                    lastname: lastname,
                    phone: phone,
                    password: password,
                    roles: role === 'professionnel' ? ['ROLE_PRO'] : role === 'particulier' ? ['ROLE_USER'] : ['ROLE_ADMIN'],
                    isVerified: true
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
                    setError('Une erreur s\'est produite lors de la création de l\'utilisateur.');
                }
                return;
            } else {
                const data = await response.json();
                setError('');
                setUsers([...users, data]);
                setOpenCreateDialog(false);
                setSuccess('Utilisateur créé avec succès !');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la création de l\'utilisateur.');
        }
    };

    const handleOpenCreateDialog = () => {
        setFormErrors({});
        setEmail('');
        setFirstname('')
        setLastname('')
        setPassword('')
        setPhone('')
        setRole('')
        setOpenCreateDialog(true);
    };
    
    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        if (e.target.value === 'professionnel') {
            setShowKbis(true);
        } else {
            setShowKbis(false);
            setKbis('');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://195.35.29.110:8000/api/users/${selectedUser.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }

            const updatedUsers = users.filter(user => user.id !== selectedUser.id);
            setError('');
            setUsers(updatedUsers);
            setOpenDeleteDialog(false);
            setSuccess('Utilisateur supprimé avec succès !');
        } catch (error) {
            setError('Une erreur s\'est produite lors de la suppression de l\'utilisateur.');
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://195.35.29.110:8000/api/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    phone: phone,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }

            const updatedUsers = users.map(user => {
                if (user.id === selectedUser.id) {
                    return {
                        ...user,
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        phone: phone,
                    };
                }
                return user;
            });

            setError('');
            setUsers(updatedUsers);
            setOpenEditDialog(false);
            setSuccess('Utilisateur modifié avec succès !');
        } catch (error) {
            setError('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur.');
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
                            Liste des utilisateurs
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

    if (!users.length) {
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
                            Liste des utilisateurs
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
                                        Créer un nouvel utilisateur
                                    </Button>
                                </Box>

                                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                                    <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                                    <form onSubmit={handleCreate}>
                                        <DialogContent>
                                            <TextField
                                                label="Nom"
                                                value={firstname}
                                                onChange={(e) => setFirstname(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.firstname}
                                                required
                                            />
                                            <TextField
                                                label="Prénom"
                                                value={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.lastname}
                                                required
                                            />
                                            <TextField
                                                label="Email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                autoComplete="email"
                                                error={!!formErrors.email}
                                                required
                                            />
                                            <TextField
                                                label="Mot de passe"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.password}
                                                autoComplete="new-password"
                                                required
                                            />
                                            <TextField
                                                label="Téléphone"
                                                type="tel"
                                                value={phone}
                                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                                onChange={(e) => setPhone(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.phone}
                                                required
                                            />
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel id="role-label">Rôle *</InputLabel>
                                                <Select
                                                    labelId="role-label"
                                                    value={role}
                                                    onChange={handleRoleChange}
                                                    error={!!formErrors.role}
                                                    required
                                                >
                                                    <MenuItem value="particulier">Particulier</MenuItem>
                                                    <MenuItem value="professionnel">Professionnel</MenuItem>
                                                    <MenuItem value="administrateur">Administrateur</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {showKbis && (
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel htmlFor="kbis-file">KBIS</InputLabel>
                                                    <Input
                                                        id="kbis-file"
                                                        type="file"
                                                        onChange={(e) => setKbisFile(e.target.files[0])}
                                                        fullWidth
                                                    />
                                                </FormControl>
                                            )}
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
                                                <TableCell style={{color: 'white'}}>Prénom</TableCell>
                                                <TableCell style={{color: 'white'}}>Email</TableCell>
                                                <TableCell style={{color: 'white'}}>Téléphone</TableCell>
                                                <TableCell style={{color: 'white'}}>Rôle</TableCell>
                                                <TableCell style={{color: 'white'}} align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" colSpan={8} align="center">
                                                    Aucun utilisateur trouvé
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
                            Liste des utilisateurs
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
                                        Créer un nouvel utilisateur
                                    </Button>
                                </Box>

                                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                                    <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                                    <form onSubmit={handleCreate}>
                                        <DialogContent>
                                            <TextField
                                                label="Nom"
                                                value={firstname}
                                                onChange={(e) => setFirstname(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.firstname}
                                                required
                                            />
                                            <TextField
                                                label="Prénom"
                                                value={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.lastname}
                                                required
                                            />
                                            <TextField
                                                label="Email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                autoComplete="email"
                                                error={!!formErrors.email}
                                                required
                                            />
                                            <TextField
                                                label="Mot de passe"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.password}
                                                autoComplete="new-password"
                                                required
                                            />
                                            <TextField
                                                label="Téléphone"
                                                type="tel"
                                                value={phone}
                                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                                onChange={(e) => setPhone(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                error={!!formErrors.phone}
                                                required
                                            />
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel id="role-label">Rôle *</InputLabel>
                                                <Select
                                                    labelId="role-label"
                                                    value={role}
                                                    onChange={handleRoleChange}
                                                    error={!!formErrors.role}
                                                    required
                                                >
                                                    <MenuItem value="particulier">Particulier</MenuItem>
                                                    <MenuItem value="professionnel">Professionnel</MenuItem>
                                                    <MenuItem value="administrateur">Administrateur</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {showKbis && (
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel htmlFor="kbis-file">KBIS</InputLabel>
                                                    <Input
                                                        id="kbis-file"
                                                        type="file"
                                                        onChange={(e) => setKbisFile(e.target.files[0])}
                                                        fullWidth
                                                    />
                                                </FormControl>
                                            )}
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
                                                <TableCell style={{color: 'white'}}>Prénom</TableCell>
                                                <TableCell style={{color: 'white'}}>Email</TableCell>
                                                <TableCell style={{color: 'white'}}>Téléphone</TableCell>
                                                <TableCell style={{color: 'white'}}>Rôle</TableCell>
                                                <TableCell style={{color: 'white'}} align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {users.map((user) => (
                                                <TableRow
                                                    key={user.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {user.lastname}
                                                    </TableCell>
                                                    <TableCell>{user.firstname}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.phone}</TableCell>
                                                    <TableCell>{
                                                        user.roles[0] === 'ROLE_PRO' ? 'Préstataire' : user.roles[0] === 'ROLE_USER' ? 'Particulier' : user.roles[0] === 'ROLE_ADMIN' ? 'Administrateur' : ''
                                                    }</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleEdit(user)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDelete(user)}>
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
                                                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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
                                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    label="Email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Nom"
                                                    value={firstname}
                                                    onChange={(e) => setFirstname(e.target.value)}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Prénom"
                                                    value={lastname}
                                                    onChange={(e) => setLastname(e.target.value)}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Téléphone"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
                                                <Button onClick={handleUpdate} autoFocus>Enregistrer</Button>
                                            </DialogActions>
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