import React, {useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    CardMedia, Dialog,
    DialogActions,
    DialogContent, DialogTitle,
    IconButton,
    Typography
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CardActions from "@mui/material/CardActions";
import { Link } from 'react-router-dom';
import EditCar from './EditCar';

const CarItem = ({ car }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const openEditDialogHandler = () => {
        setOpenEditDialog(true);
    };
    
    const closeEditDialogHandler = () => {
        setOpenEditDialog(false);
    };


    const handleDelete = async () => {
        try {
            await fetch(`http://195.35.29.110:8000/api/cars/${car.id}`, {
                method: 'DELETE',
            }, {headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }});
        } catch (error) {
            console.log(error);
        }
        setOpenDeleteDialog(false);
    };


    const openDeleteConfirmation = () => {
        setOpenDeleteDialog(true);
    };


    const closeDeleteConfirmation = () => {
        setOpenDeleteDialog(false);
    };

    const actionsStyle = {
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        marginTop: 'auto',
    };

    console.log(car.media);

    return (
        <Card style={{ display: 'flex' }}>
            <CardMedia
                component="img"
                src={ car.media.length > 0 ? `http://localhost:8000/media/${car.media[0].filePath}` : 'https://source.unsplash.com/random' }
                style={{ width: '200px' }}
            />
            <div style={{ flex: 1 }}>
                <CardContent>
                    <Typography component="h2" variant="h5">
                        { car.model.brand.name } - {car.model.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Kilométrage: {car.mileage} km
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Prix: {car.price} €
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Année: {car.year}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Cheveaux: {car.horses}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Carburant: {car.energy.name}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing style={actionsStyle}>
                    <Link to={`/car-details/${car.id}`} className="hover:text-blue-500">
                        Plus de détails...
                    </Link>
                    <IconButton aria-label="Modifier" onClick={openEditDialogHandler}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="Supprimer" onClick={openDeleteConfirmation}>
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
                <Dialog open={openEditDialog} onClose={closeEditDialogHandler}>
                    <EditCar carId={car.id}/>
                </Dialog>
                <Dialog open={openDeleteDialog} onClose={closeDeleteConfirmation}>
                    <DialogTitle>Confirmation de suppression</DialogTitle>
                    <DialogContent>
                        <p>Êtes-vous sûr de vouloir supprimer cette voiture ?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDeleteConfirmation}>Annuler</Button>
                        <Button onClick={handleDelete} variant="contained" color="error">
                            Supprimer
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Card>
    );
};

export default CarItem;
