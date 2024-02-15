import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormGroup,
    FormLabel,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    MenuItem,
    Select,
    Typography,
    Radio,
    Slider,
} from '@mui/material';

const FilterPop = ( data ) => {
    const [filters, setFilters] = useState({
        categories: [],
        selectedCategories: [],
        energies: [],
        selectedEnergies: [],
        gears: [],
        selectedGears: [],
        brands: [],
        selectedBrands: [],
        selectedNbSeats: 0,
        selectedNbDoors: 0,
        selectedPrice: 0.0,
        selectedMilage: 0,
    });

    const getMaxPrice = (cars) => {
        return Math.max(...cars.map((car) => car.price));
    };

    const getMaxMilage = (cars) => {
        return Math.max(...cars.map((car) => car.mileage));
    };


    useEffect(() => {
        const fetchData = async (url, setter) => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setter(data);
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error);
            }
        };

        fetchData('http://195.35.29.110:8000/api/categories', (data) => setFilters(prevState => ({ ...prevState, categories: data })));
        fetchData('http://195.35.29.110:8000/api/energies', (data) => setFilters(prevState => ({ ...prevState, energies: data })));
        fetchData('http://195.35.29.110:8000/api/gears', (data) => setFilters(prevState => ({ ...prevState, gears: data })));
        fetchData('http://195.35.29.110:8000/api/brands', (data) => setFilters(prevState => ({ ...prevState, brands: data })));
    }, []);

    const handleCategoryChange = useCallback((event) => {
        setFilters(prevState => ({ ...prevState, selectedCategories: event.target.value }));
    }, []);

    const handleEnergyChange = useCallback((event) => {
        setFilters(prevState => ({ ...prevState, selectedEnergies: event.target.value }));
    }, []);

    const handleGearChange = useCallback((event) => {
        setFilters(prevState => ({ ...prevState, selectedGears: event.target.value }));
    }, []);

    const handleBrandChange = useCallback((event) => {
        setFilters(prevState => ({ ...prevState, selectedBrands: event.target.value }));
    }, []);

    const handleNbSeatsChange = useCallback((event) => {
        setFilters(prevState => ({ ...prevState, selectedNbSeats: event.target.value }));
    }, []);

    const handleNbDoorsChange = useCallback((event) => {
        setFilters(prevState => ({ ...prevState, selectedNbDoors: event.target.value }));
    }, []);

    const handleApplyFilters = useCallback(() => {
        data.searchProps.onApplyFilters({ 
            category: filters.selectedCategories, 
            energy: filters.selectedEnergies, 
            gear_type: filters.selectedGears, 
            brand: filters.selectedBrands,
            nb_seats: filters.selectedNbSeats,
            nb_doors: filters.selectedNbDoors,
            price: filters.selectedPrice,
            mileage: filters.selectedMilage,
        });
        data.onClose();
    }, [data, filters]);

    return (
        <Dialog open={data.open} onClose={data.onClose} sx={{ width: '100%', height: '100%' }}>
            <DialogTitle>Filtrer les voitures</DialogTitle>
            <DialogContent>
                <FormControl component="fieldset" sx={{ marginBottom: '20px' }}>
                    <FormGroup sx={{ marginBottom: '20px' }}>
                        <Typography variant="h6">Catégorie</Typography>
                          <Select
                            multiple
                            value={filters.selectedCategories}
                            onChange={handleCategoryChange}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 224,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {filters.categories.map((category) => (
                                <MenuItem key={category.libelle} value={category.libelle}>{category.libelle}</MenuItem>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup sx={{ marginBottom: '20px' }}>
                        <FormControl>
                            <Typography variant="h6">Énergie</Typography>
                            <Select
                                multiple
                                value={filters.selectedEnergies}
                                onChange={handleEnergyChange}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 224,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {filters.energies.map((energy) => (
                                    <MenuItem key={energy.name} value={energy.name}>{energy.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </FormGroup>
                    <FormGroup sx={{ marginBottom: '20px' }}>
                        <FormControl>
                            <Typography variant="h6">Boîte de vitesse</Typography>
                            <Select
                                multiple
                                value={filters.selectedGears}
                                onChange={handleGearChange}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 224,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {filters.gears.map((gear) => (
                                    <MenuItem key={gear.name} value={gear.name}>{gear.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </FormGroup>
                    <FormGroup sx={{ marginBottom: '20px' }}>
                        <FormControl>
                            <Typography variant="h6">Marque</Typography>
                            <Select
                                multiple
                                value={filters.selectedBrands}
                                onChange={handleBrandChange}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 224,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {filters.brands.map((brand) => (
                                    <MenuItem key={brand.name} value={brand.name}>{brand.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </FormGroup>
                    <FormGroup sx={{ marginBottom: '20px' }}>
                        <FormControl>
                            <Typography variant="h6">Nombre de places</Typography>
                            <RadioGroup value={filters.selectedNbSeats} onChange={handleNbSeatsChange}>
                                <FormControlLabel value="" control={<Radio />} label="Tous" />
                                <FormControlLabel value="2" control={<Radio />} label="2 ou +" />
                                <FormControlLabel value="4" control={<Radio />} label="4 ou +" />
                                <FormControlLabel value="5" control={<Radio />} label="5 ou +" />
                                <FormControlLabel value="7" control={<Radio />} label="7 ou +" />
                            </RadioGroup>
                        </FormControl>
                    </FormGroup>
                    <FormGroup sx={{ marginBottom: '20px' }}>
                        <FormControl>
                            <Typography variant="h6">Nombre de portes</Typography>
                            <RadioGroup value={filters.selectedNbDoors} onChange={handleNbDoorsChange}>
                                <FormControlLabel value="" control={<Radio />} label="Tous" />
                                <FormControlLabel value="3" control={<Radio />} label="3 ou +" />
                                <FormControlLabel value="5" control={<Radio />} label="5 ou +" />
                            </RadioGroup>
                        </FormControl>
                    </FormGroup>
                    <FormGroup sx={{ marginBottom: '20px' }}>
                        <FormControl>
                            <Typography variant="h6">Prix</Typography>
                            <Slider
                                value={filters.selectedPrice}
                                onChange={(event, newValue) => setFilters(prevState => ({ ...prevState, selectedPrice: newValue }))}
                                valueLabelDisplay="auto"
                                min={0}
                                max={getMaxPrice(data.searchProps.carInfo)}
                            />
                        </FormControl>
                    </FormGroup>
                    <FormGroup sx={{ marginBottom: '20px' }}>
                        <FormControl>
                            <Typography variant="h6">Kilométrage</Typography>
                            <Slider
                                value={filters.selectedMilage}
                                onChange={(event, newValue) => setFilters(prevState => ({ ...prevState, selectedMilage: newValue }))}
                                valueLabelDisplay="auto"
                                min={0}
                                max={getMaxMilage(data.searchProps.carInfo)}
                            />
                        </FormControl>
                    </FormGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleApplyFilters}>Appliquer</Button>
                <Button onClick={data.onClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FilterPop;