import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import CarRentalTwoToneIcon from '@mui/icons-material/CarRentalTwoTone';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const CompanieDetails = ({ companie }) => {
    const token = localStorage.getItem('token');
    const { name, address, city, zipCode, cars } = companie;
    const [rents, setRents] = useState([]);
    const [monthlyIncome, setMonthlyIncome] = useState(0);


    const fetchRentData = useCallback(async () => {
        try {
            const response = await fetch(`http://195.35.29.110:8000/api/companies/${companie.id}/rents`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            setRents(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données de location : ', error);
        }
    }, [companie.id]);

    useEffect(() => {
        fetchRentData();
    }, [fetchRentData]);

    const calculateMonthlyIncome = (rentsData, month, year) => {
        let totalIncome = 0;
        rentsData.forEach(rent => {
            const rentDate = new Date(rent.dateStart);
            if (rentDate.getMonth() === month && rentDate.getFullYear() === year) {
                totalIncome += rent.totalPrice;
            }
        });
        return totalIncome;
    };

    const generateChartData = useCallback(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthlyIncomeData = [];
        for (let month = 0; month <= currentMonth; month++) {
            const income = calculateMonthlyIncome(rents, month, currentYear);
            monthlyIncomeData.push(income);
        }
        setMonthlyIncome(monthlyIncomeData);
    }, [rents]);

    useEffect(() => {
        generateChartData();
    }, [generateChartData]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Informations de la société
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Nom:</strong> {name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Adresse:</strong> {address}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Ville:</strong> {city}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Code Postal:</strong> {zipCode}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ alignItems: 'center' }}>
                        <Typography variant="caption" gutterBottom>
                            Nombre total de voitures
                        </Typography>
                        <Typography variant="h3" gutterBottom align="center">
                            {cars.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent>
                        <CarRentalTwoToneIcon />
                        <Typography variant="caption" gutterBottom>
                            Nombre total de locations
                        </Typography>
                        <Typography variant="h3" gutterBottom align="center">
                            {rents.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Chiffre d'affaires mensuel
                        </Typography>
                        <Box sx={{ position: 'relative', height: 400 }}>
                        <Bar
                            data={{
                                labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                                datasets: [
                                    {
                                        label: 'Revenu mensuel',
                                        data: monthlyIncome,
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                        </Box>
                    </CardContent>

                </Card>
            </Grid>
        </Grid>
    );
};

export default CompanieDetails;
