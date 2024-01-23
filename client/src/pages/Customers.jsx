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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Customers() {
    const [users, setUsers] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const token = localStorage.getItem('token');
    const emailLoggedUser = localStorage.getItem('email');

    //form
    const [email, setEmail] = useState(selectedUser?.email);
    //const [password, setPassword] = useState(selectedUser?.password);
    const [firstname, setFirstname] = useState(selectedUser?.firstname);
    const [lastname, setLastname] = useState(selectedUser?.lastname);
    //const [role, setRole] = useState(selectedUser?.roles[0] === 'ROLE_PRO' ? 'professionnel' ? selectedUser?.roles[0] === 'ROLE_USER' : 'particulier' : 'admin');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data.filter(user => user.email !== emailLoggedUser));
            } catch (error) {
                console.error(error);
            }
        }
        getUsers();
    }, [token]);

    const handleDelete = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    useEffect(() => {
        if (selectedUser) {
            setEmail(selectedUser.email);
            setFirstname(selectedUser.firstname)
            setLastname(selectedUser.lastname)
            //setPassword(selectedUser.password)
            setPhone(selectedUser.phone)
        }
    }, [selectedUser]);

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/users/${selectedUser.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedUsers = users.filter(user => user.id !== selectedUser.id);
            setUsers(updatedUsers);
            setOpenDeleteDialog(false);
            setSuccess('Utilisateur supprimé avec succès !');
        } catch (error) {
            setError(error.response.data['hydra:description'])
            console.error('erreur delete user' ,error);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.patch(`http://localhost:8000/api/users/${selectedUser.id}`, {
                email: email,
                firstname: firstname,
                lastname: lastname,
                //roles: role === 'professionnel' ? ['ROLE_PRO'] : ['ROLE_USER'],
                phone: phone,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/merge-patch+json' // Spécifie le bon type de contenu pour PATCH

                }
            })
            const updatedUsers = users.map(user => {
                if (user.id === selectedUser.id) {
                    return {
                        ...user,
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        //roles: role === 'professionnel' ? ['ROLE_PRO'] : ['ROLE_USER'],
                        phone: phone,
                    };
                }
                return user;
            });
            setUsers(updatedUsers);
            setOpenEditDialog(false);
            setSuccess('Utilisateur modifié avec succès !');
        } catch (error) {
            console.log('Erreur update user' ,error)
            setError(error.response.data['hydra:description'])
        }
    };

    return (
        <>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={10}>
                    <Typography variant="h4" component="h2">
                        Liste des utilisateurs
                    </Typography>
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
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nom</TableCell>
                                    <TableCell align="right">Prénom</TableCell>
                                    <TableCell align="right">Email</TableCell>
                                    <TableCell align="right">Téléphone</TableCell>
                                    <TableCell align="right">Rôle</TableCell>
                                    <TableCell align="right">Actions</TableCell>
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
                                        <TableCell align="right">{user.firstname}</TableCell>
                                        <TableCell align="right">{user.email}</TableCell>
                                        <TableCell align="right">{user.phone}</TableCell>
                                        <TableCell align="right">{user.roles[0]}</TableCell>
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
                            {/* Dialog pour confirmation de suppression */}
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
                            {/* Dialog pour édition */}
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
        </>
    );
}