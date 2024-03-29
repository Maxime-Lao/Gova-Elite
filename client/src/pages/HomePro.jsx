import Navbar from "../components/navbar/Navbar.jsx";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerticalTabs from "../components/others/VerticalTabs.jsx";
import CarList from "../components/pro/CarList.jsx";
import CompanieDetails from "../components/pro/CompanieDetails.jsx";
import CreateCar from "../components/pro/CreateCar.jsx";
import RentList from "../components/pro/RentList.jsx";

const HomePro = ({user}) => {
    if(user.connectedUser.companie){
        if (!user.connectedUser.companie.isVerified) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1>Nous sommes entrain de vérifier votre compagnie, veuillez attendre la validation pour accéder à votre espace prestataire</h1>
                    </div>
                </div>
            );
        }
    }
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.connectedUser.companie) {
            navigate('/createCompanie');
        }
    }, [user.connectedUser.companie, navigate]);

    if (!user.connectedUser.companie) {
        return null; 
    }

    const tabsData = [
        { label: 'Mes voitures', content: <CarList cars={ user.connectedUser.companie.cars } />},
        { label: 'Ma société', content: <CompanieDetails companie={ user.connectedUser.companie }/> },
        { label: 'Ajouter une voiture', content: <CreateCar companieId={user.connectedUser.companie.id}/> },
        { label: 'Historique des réservations', content: <RentList companieId={user.connectedUser.companie.id}/> },
    ];

    return (
        <div>
            <VerticalTabs tabsData={tabsData} />
        </div>
    );
}

export default HomePro;