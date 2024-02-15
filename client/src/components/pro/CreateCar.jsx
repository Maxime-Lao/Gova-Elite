import React, {useEffect, useState} from "react";
import {Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete.js";
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";
import {convertBytesToMegaBytes} from "../../FileSizeHelper.jsx";
import Loading from "../../assets/img/loading.jpg";

const CreateCar = ({companieId}) => {
    const [photos, setPhotos] = useState([]);
    const [gear, setGear] = useState();
    const [brand, setBrand] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState();
    const [myGears, setMyGears] = useState();
    const [allModels, setAllModels] = useState();
    const [myModels, setMyModels] = useState();
    const [myBrands, setMyBrands] = useState();
    const [year, setYear] = useState('');
    const [horses, setHorses] = useState('');
    const [seats, setSeats] = useState('');
    const [price, setPrice] = useState('');
    const [mileage, setMileage] = useState('');
    const [doors, setDoors] = useState('');
    const [model, setModel] = useState();
    const [myEnergies, setMyEnergies] = useState();
    const [energy, setEnergy] = useState();
    const [myCategories, setMyCategories] = useState();
    const [category, setCategory] = useState();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [description, setDescription] = useState('');
    const [errorPhoto, setErrorPhoto] = useState('');

    const token = localStorage.getItem('token');
    const user = useGetConnectedUser();

    useEffect(() => {
        fetch(`http://localhost:8000/api/gears`)
            .then(response => response.json())
            .then(data => {
                setMyGears(data);
                setGear(data[0].id);
            })
            .catch(error => console.error(error));

        fetch(`http://localhost:8000/api/models`)
            .then(response => response.json())
            .then(data => {
                setAllModels(data);
                setModel(data[0].id);
            })
            .catch(error => console.error(error));

        fetch(`http://localhost:8000/api/brands`)
            .then(response => response.json())
            .then(data => {
                setMyBrands(data);
                setSelectedBrandId(data[0].id);
            })
            .catch(error => console.error(error));

        fetch(`http://localhost:8000/api/energies`)
            .then(response => response.json())
            .then(data => {
                setMyEnergies(data);
                setEnergy(data[0].id);
            })
            .catch(error => console.error(error));

        fetch(`http://localhost:8000/api/categories`)
            .then(response => response.json())
            .then(data => {
                setMyCategories(data);
                setCategory(data[0].id);setMyCategories(data)
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (selectedBrandId && allModels) {
            const models = allModels.filter(model => model.brand.id === selectedBrandId);
            setMyModels(models);
        }
    }, [selectedBrandId]);

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
            const carResponse = await axios.post(`http://localhost:8000/api/cars`, carData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const carId = carResponse.data.id;

            for (const photo of photos) {
                const formData = new FormData();
                formData.append('file', photo);
                formData.append('car_id', carId);
                formData.append('user_id', user.connectedUser.id);

                const mediaResponse = await axios.post('http://localhost:8000/api/media_objects', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

            }

            console.log('Voiture créée avec succès', carResponse.data);
            setSuccess('Voiture créée avec succès');
            setError('');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Erreur lors de la création de la voiture', error);
            setSuccess('');
            setError('Erreur lors de la création de la voiture');
        }
    };

    const handleBrandChange = (e) => {
        setSelectedBrandId(e.target.value)
    }

    const deletePhoto = (index) => {
        const updatedPhotos = [...photos.slice(0, index), ...photos.slice(index + 1)];
        setPhotos(updatedPhotos);
    };

    const handlePhoto = (event) => {
        if (convertBytesToMegaBytes(event.target.files[0].size) > 5) {
            setErrorPhoto(`Votre photo: ${event.target.files[0].name} est volumineuse, veuilleez choisir des photos qui ne dépassent pas 5MO`)
        } else {
            setPhotos(prevPhotos => [...prevPhotos, ...event.target.files])
            setErrorPhoto('')
        }
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
                {
                    (myGears && myEnergies && myCategories && myBrands) ? (
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
                            {
                                myGears ? <FormControl fullWidth margin="normal">
                                    <InputLabel id="gear-label">Boîte de vitesse *</InputLabel>
                                    <Select
                                        labelId="gear-label"
                                        value={gear}
                                        onChange={(e) => setGear(e.target.value)}
                                        required
                                    >
                                        {myGears.map((gear) => (
                                            <MenuItem key={'gear-' + gear.id} value={gear.id}>
                                                {gear.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> : null
                            }
                            {
                                myBrands ? <FormControl fullWidth margin="normal">
                                    <InputLabel id="brand-label">Marque *</InputLabel>
                                    <Select
                                        labelId="brand-label"
                                        value={selectedBrandId}
                                        onChange={handleBrandChange}
                                        required
                                    >
                                        {myBrands && myBrands.map((brand) => (
                                            <MenuItem key={'brand-' + brand.id} value={brand.id}>
                                                {brand.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> : null
                            }
                            { selectedBrandId && myModels ? (
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="model-label">Modèle *</InputLabel>
                                    <Select
                                        labelId="model-label"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        required
                                    >
                                        {myModels.map((model) => (
                                            <MenuItem key={'model-' + model.id} value={model.id}>
                                                {model.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>) : null }
                            {
                                myEnergies ? <FormControl fullWidth margin="normal">
                                    <InputLabel id="energy-label">Carburant *</InputLabel>
                                    <Select
                                        labelId="energy-label"
                                        value={energy}
                                        onChange={(e) => setEnergy(e.target.value)}
                                        required
                                    >
                                        {myEnergies.map((energy) => (
                                            <MenuItem key={'energy-' + energy.id} value={energy.id}>
                                                {energy.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> : null
                            }
                            {
                                myCategories ? <FormControl fullWidth margin="normal">
                                    <InputLabel id="category-label">Catégorie du véhicule *</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        {myCategories && myCategories.map((category) => (
                                            <MenuItem key={'category-' + category.id} value={category.id}>
                                                {category.libelle}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> : null
                            }
                            <TextField
                                label="Description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <h3>Ajouter des images(Taille maximle 5MO)</h3>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload File
                                <input
                                    type="file"
                                    onChange={() => handlePhoto(event)}
                                    multiple
                                    hidden
                                    required
                                />
                            </Button>
                            {
                                errorPhoto.length ? (
                                    <Box mt={2} textAlign="center">
                                        <p style={{color: 'red'}}>{errorPhoto}</p>
                                    </Box>
                                ) : null
                            }
                            <div className="flex space-x-4 mt-4">
                                {photos.map((photo, index) => (
                                    <div key={`photo-container-${index}`} className="border-2">
                                        <img
                                            key={`uploaded-photo-${index}`}
                                            src={URL.createObjectURL(photo)}
                                            alt={`Uploaded Photo ${index + 1}`}
                                            className="max-h-28 max-w-28"
                                        />
                                        <div className="flex justify-end">
                                            <IconButton aria-label="Supprimer" onClick={() => deletePhoto(index)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {
                                error.length ? (
                                    <Box mt={2} textAlign="center">
                                        <p style={{color: 'red'}}>{error}</p>
                                    </Box>
                                ) : null
                            }
                            {
                                success.length ? (
                                    <Box mt={2} textAlign="center">
                                        <p style={{color: 'green'}}>{success}</p>
                                    </Box>
                                ) : null
                            }
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
                        </form>
                    ) : <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <img className='animate-spin w-20' src={Loading} alt="Loading"/>
                        </div>
                    </div>
                }
            </Grid>
        </Grid>
    )
}

export default CreateCar;