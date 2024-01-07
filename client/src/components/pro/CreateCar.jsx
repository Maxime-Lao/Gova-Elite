import React, {useEffect, useState} from "react";
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import axios from "axios";

const CreateCar = ({companieId}) => {
    const [gear, setGear] = useState();
    const [brand, setBrand] = useState();
    const [selectedBrandId, setSelectedBrandId] = useState();
    const [myGears, setMyGears] = useState();
    const [allModels, setAllModels] = useState();
    const [myModels, setMyModels] = useState();
    const [myBrands, setMyBrands] = useState();
    const [year, setYear] = useState();
    const [horses, setHorses] = useState();
    const [seats, setSeats] = useState();
    const [price, setPrice] = useState();
    const [mileage, setMileage] = useState();
    const [doors, setDoors] = useState();
    const [model, setModel] = useState();
    const [myEnergies, setMyEnergies] = useState();
    const [energy, setEnergy] = useState();
    const [myCategories, setMyCategories] = useState();
    const [category, setCategory] = useState();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [description, setDescription] = useState();

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`http://localhost:8000/api/gears`)
            .then(response => response.json())
            .then(data => setMyGears(data))
            .catch(error => console.error(error));

        fetch(`http://localhost:8000/api/models`)
            .then(response => response.json())
            .then(data => setAllModels(data))
            .catch(error => console.error(error));

        fetch(`http://localhost:8000/api/brands`)
            .then(response => response.json())
            .then(data => setMyBrands(data))
            .catch(error => console.error(error));

        fetch(`http://localhost:8000/api/energies`)
            .then(response => response.json())
            .then(data => setMyEnergies(data))
            .catch(error => console.error(error));

        fetch(`http://localhost:8000/api/categories`)
            .then(response => response.json())
            .then(data => setMyCategories(data))
            .catch(error => console.error(error));
    }, []);

    const carData = {
        description: description,
        year: Number(year),
        horses: Number(horses),
        nbSeats: Number(seats),
        nbDoors: Number(doors),
        price: Number(price),
        mileage: Number(mileage),
        gear: `/api/gears/${gear}`,
        model: `/api/models/${model}`,
        energy: `/api/energies/${energy}`,
        category: `/api/categories/${category}`,
        companie: `/api/companies/${companieId}}`,
        createdAt: new Date().toISOString(),
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/api/cars`, carData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Voiture créée avec succès', response.data);
            setSuccess('Voiture créée avec succès');
            setError('');
        } catch (error) {
            console.error('Erreur lors de la création de la voiture', error);
            setSuccess('');
            setError('Erreur lors de la création de la voiture');
        }
    };

    useEffect(() => {
        selectedBrandId && setMyModels(allModels.filter(model => model.brand.id === selectedBrandId));
    }, [selectedBrandId, allModels]);

    const handleBrandChange = (e) => {
        setSelectedBrandId(e.target.value)
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
                <Box mt={2} textAlign="center">
                    <h1>Ajouter une voiture</h1>
                </Box>
                {
                    success.length ? (
                        <Box mt={2} textAlign="center">
                            <p style={{color: 'green'}}>{success}</p>
                        </Box>
                    ) : null
                }
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Année"
                        value={year}
                        type="number"
                        onChange={(e) => setYear(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Nombre de chevaux"
                        value={horses}
                        type="number"
                        onChange={(e) => setHorses(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Nombre de sièges"
                        type="number"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Nombre de portes"
                        type="number"
                        value={doors}
                        onChange={(e) => setDoors(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Prix (en €)"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Kilométrage"
                        type="number"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="gear-label">Boîte de vitesse *</InputLabel>
                        <Select
                            labelId="gear-label"
                            value={gear}
                            onChange={(e) => setGear(e.target.value)}
                            required
                        >
                            { myGears && myGears.map((gear) => (
                                <MenuItem key={'gear-' + gear.id} value={gear.id}>
                                    {gear.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="brand-label">Marque *</InputLabel>
                        <Select
                            labelId="brand-label"
                            value={brand}
                            onChange={handleBrandChange}
                            required
                        >
                            { myBrands && myBrands.map((brand) => (
                                <MenuItem key={'brand-' + brand.id} value={brand.id}>
                                    {brand.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="model-label">Modèle *</InputLabel>
                        <Select
                            labelId="model-label"
                            value={brand}
                            onChange={(e) => setModel(e.target.value)}
                            required
                        >
                            { (selectedBrandId && myModels) && myModels.map((model) => (
                                <MenuItem key={'model-' + model.id} value={model.id}>
                                    {model.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="energy-label">Carburant *</InputLabel>
                        <Select
                            labelId="energy-label"
                            value={energy}
                            onChange={(e) => setEnergy(e.target.value)}
                            required
                        >
                            { myEnergies && myEnergies.map((energy) => (
                                <MenuItem key={'energy-' + energy.id} value={energy.id}>
                                    {energy.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-label">Catégorie du véhicule *</InputLabel>
                        <Select
                            labelId="category-label"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            { myCategories && myCategories.map((category) => (
                                <MenuItem key={'category-' + category.id} value={category.id}>
                                    {category.libelle}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        style={{marginTop: '1rem'}}
                    >
                        Ajouter
                    </Button>
                    {
                        error.length ? (
                            <Box mt={2} textAlign="center">
                                <p style={{color: 'red'}}>{error}</p>
                            </Box>
                        ) : null
                    }
                </form>
            </Grid>
        </Grid>
    )
}

export default CreateCar;