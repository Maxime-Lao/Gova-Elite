import Navbar from "../components/navbar/Navbar.jsx";
import VerticalTabs from "../components/others/VerticalTabs.jsx";
import CarList from "../components/pro/CarList.jsx";
import CompanieDetails from "../components/pro/CompanieDetails.jsx";
import CreateCar from "../components/pro/CreateCar.jsx";

const HomePro = ({user}) => {
    if (!user.connectedUser.companie) {
        return (
            <h1>Veuillez patienter que votre compagnie soit validée pour pouvoir accéder à votre espace prestataire</h1>
        );
    }

    const tabsData = [
        { label: 'Ma société', content: <CompanieDetails companie={ user.connectedUser.companie }/> },
        { label: 'Mes voitures', content: <CarList cars={ user.connectedUser.companie.cars }/>
        },
        { label: 'Ajouter une voiture', content: <CreateCar companieId={user.connectedUser.companie.id}/> },
        { label: 'PLanning des voitures', content: <p>bababbaa2</p> },
    ];

    return (
        <div>
            <Navbar user={user} />
            <VerticalTabs tabsData={tabsData} />
        </div>
    )
}

export default HomePro