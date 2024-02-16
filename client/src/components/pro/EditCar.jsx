// EditCar.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Button, CardMedia,
    FormControl,
    Grid, IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import axios from "axios";
import useGetConnectedUser from "../hooks/useGetConnectedUser.jsx";
import {convertBytesToMegaBytes} from "../../FileSizeHelper.jsx";
import DeleteIcon from "@mui/icons-material/Delete";

const EditCar = ({ carId }) => {
    const [carData, setCarData] = useState({
    });

    const [gear, setGear] = useState();
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
    const [errorPhoto, setErrorPhoto] = useState('');
    const [files, setFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);

    const token = localStorage.getItem('token');
    const user = useGetConnectedUser();

    useEffect(() => {
        setYear(carData.year);
        setHorses(carData.horses);
        setSeats(carData.nbSeats);
        setPrice(carData.price);
        setMileage(carData.mileage);
        setDoors(carData.nbDoors);
        setDescription(carData.description);
        setGear(carData.gear?.id);
        setSelectedBrandId(carData.model?.brand.id);
        setEnergy(carData.energy?.id);
        setCategory(carData.category?.id);
        setFiles(carData.media?.map(media => media));
    }, [carData]);



    useEffect(() => {
        setModel(carData.model?.id);
    }, [selectedBrandId]);

    useEffect(() => {
        const fetchWithAuthorization = async (url, setStateFunction) => {
            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la récupération des données de ${url}`);
                }

                const data = await response.json();
                setStateFunction(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchWithAuthorization('https://kame-os.fr/api/gears', setMyGears);
        fetchWithAuthorization('https://kame-os.fr/api/models', setAllModels);
        fetchWithAuthorization('https://kame-os.fr/api/brands', setMyBrands);
        fetchWithAuthorization('https://kame-os.fr/api/energies', setMyEnergies);
        fetchWithAuthorization('https://kame-os.fr/api/categories', setMyCategories);
    }, []);


    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`https://kame-os.fr/api/cars/${carId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setCarData(response.data);
            } catch (error) {
                console.error("Error fetching car data", error);
            }
        };

        fetchCarData();
    }, [carId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const carDataPayload = {
            year: Number(year),
            horses: Number(horses),
            nbSeats: Number(seats),
            price: Number(price),
            mileage: Number(mileage),
            nbDoors: Number(doors),
            model: `/api/models/${model}`,
            gear: `/api/gears/${gear}`,
            energy: `/api/energies/${energy}`,
            category: `/api/categories/${category}`,
            description,
        };

        try {
            const response = await axios.patch(`https://kame-os.fr/api/cars/${carId}`, carDataPayload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/merge-patch+json',
                },
            });

            if (newFiles.length) {
                for (const photo of newFiles) {
                    const formData = new FormData();
                    formData.append('file', photo);
                    formData.append('car_id', carId);
                    formData.append('user_id', user.connectedUser.id);

                    const mediaResponse = await axios.post('https://kame-os.fr/api/media_objects', formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                }
            }

            const carMediaIds = carData.media?.map(media => media.id) || [];
            for (const photo of carMediaIds) {
                if (!files.some(file => file.id === photo)) {
                    const response = await axios.delete(`https://kame-os.fr/api/media_objects/${photo}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                }
            }

            setSuccess('Voiture modifiée avec succès');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            setError('Erreur lors de la modification de la voiture');
        }
    };

    useEffect(() => {
        selectedBrandId && setMyModels(allModels.filter(model => model.brand.id === selectedBrandId));
    }, [selectedBrandId, allModels]);

    const handleBrandChange = (e) => {
        setSelectedBrandId(e.target.value)
    }

    const deletePhoto = (index) => {
        const updatedPhotos = [...files.slice(0, index), ...files.slice(index + 1)];
        setFiles(updatedPhotos);
    };

    const deleteNewPhoto = (index) => {
        const updatedPhotos = [...newFiles.slice(0, index), ...newFiles.slice(index + 1)];
        setNewFiles(updatedPhotos);
    }

    const handlePhoto = (event) => {
        if (convertBytesToMegaBytes(event.target.files[0].size) > 5) {
            setErrorPhoto(`Votre photo: ${event.target.files[0].name} est volumineuse, veuilleez choisir des photos qui ne dépassent pas 5MO`)
        } else {
            setNewFiles(prevPhotos => [...prevPhotos, ...event.target.files])
            setErrorPhoto('')
        }
    }

    return (
        selectedBrandId ? <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <Box mt={2} textAlign="center">
                        <h1>Modifier la voiture</h1>
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
                                    {myBrands.map((brand) => (
                                        <MenuItem key={'brand-' + brand.id} value={brand.id}>
                                            {brand.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> : null
                        }
                        { selectedBrandId && myModels ? <FormControl fullWidth margin="normal">
                            <InputLabel id="model-label">Modèle *</InputLabel>
                            <Select
                                labelId="model-label"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                required
                            >
                                {(selectedBrandId && myModels) && myModels.map((model) => (
                                    <MenuItem key={'model-' + model.id} value={model.id}>
                                        {model.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> : null}
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
                                    {myCategories.map((category) => (
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
                            />
                        </Button>
                        {
                            errorPhoto.length ? (
                                <Box mt={2} textAlign="center">
                                    <p style={{color: 'red'}}>{errorPhoto}</p>
                                </Box>
                            ) : null
                        }
                        {files.length ? <h3>Photos actuelles</h3> : null}
                        <div className="flex space-x-4 mt-4">
                            {
                                files.map((path, index) => (
                                    <div key={`photo-container-${index}`} className="border-2">
                                        <CardMedia
                                            component="img"
                                            src={`https://kame-os.fr/media/${path.filePath}`}
                                            style={{width: '70px'}}
                                        />
                                        <div className="flex justify-end">
                                            <IconButton aria-label="Supprimer" onClick={() => deletePhoto(index)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {newFiles.length ? <h3>Nouvelles photos</h3> : null}
                        <div className="flex space-x-4 mt-4">
                            {
                                newFiles.map((photo, index) => (
                                    <div key={`photo-container-${index}`} className="border-2">
                                        <img
                                            key={`uploaded-photo-${index}`}
                                            src={URL.createObjectURL(photo)}
                                            alt={`Uploaded Photo ${index + 1}`}
                                            className="max-h-28 max-w-28"
                                        />
                                        <div className="flex justify-end">
                                            <IconButton aria-label="Supprimer" onClick={() => deleteNewPhoto(index)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
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
            : <div>
            </div>
    );
};

export default EditCar;
