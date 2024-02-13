import React, { useEffect, useState } from "react";
import {
    Grid,
    Table,
    TableHead,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Paper,
    Box,
    Typography
} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import DeleteIcon from "@mui/icons-material/Delete";
import format from 'date-fns/format';
import { fr } from 'date-fns/locale';

export default function RentList({ companieId }) {
    const [rents, setRents] = useState([]);

    useEffect(() => {
        const getRents = async () => {
            try {
                const response = await fetch(`http://195.35.29.110:8000/api/companies/${companieId}/rents`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }

                const data = await response.json();
                setRents(data);
            } catch (error) {
                console.error(error);
            }
        };

        getRents();
    }, [companieId]);

    return (
<Box sx={{ display: 'flex' }}>
    <CssBaseline />
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
                                <TableCell style={{color: 'white'}}>Voiture</TableCell>
                                <TableCell style={{color: 'white'}}>Utilisateur</TableCell>
                                <TableCell style={{color: 'white'}}>Prix</TableCell>
                                <TableCell style={{color: 'white'}}>Date de départ</TableCell>
                                <TableCell style={{color: 'white'}}>Date de fin</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rents.map((rent) => (
                                <TableRow
                                    key={rent.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{rent.car.model.name} - {rent.car.model.brand.name}</TableCell>
                                    <TableCell>{rent.user.firstname} {rent.user.lastname}</TableCell>
                                    <TableCell>{rent.totalPrice}€</TableCell>
                                    <TableCell>{rent.dateStart ? format(new Date(rent.dateStart), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
                                    <TableCell>{rent.dateEnd ? format(new Date(rent.dateEnd), 'dd/MM/yyyy HH:mm:ss', { locale: fr }) : ''}</TableCell>
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

    );
}