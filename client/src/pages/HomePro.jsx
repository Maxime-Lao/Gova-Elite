import Navbar from "../components/navbar/Navbar.jsx";
import VerticalTabs from "../components/others/VerticalTabs.jsx";
import CarList from "../components/pro/CarList.jsx";
import CompanieDetails from "../components/pro/CompanieDetails.jsx";
import CreateCar from "../components/pro/CreateCar.jsx";

const HomePro = ({user}) => {
    if (!user.connectedUser.companie) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1>Nous sommes entrain de vérifier votre compagnie, veuillez attendre la validation pour accéder à votre espace prestataire</h1>
                </div>
            </div>
        );
    }

    const tabsData = [
        { label: 'Ma société', content: <CompanieDetails companie={ user.connectedUser.companie }/> },
        { label: 'Mes voitures', content: <CarList cars={ user.connectedUser.companie.cars }/>
        },
        { label: 'Ajouter une voiture', content: <CreateCar companieId={user.connectedUser.companie.id}/> },
    ];

    return (
        <div>
            <VerticalTabs tabsData={tabsData} />
        </div>
    )
}

export default HomePro