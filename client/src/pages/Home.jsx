import Navbar from "../components/navbar/Navbar.jsx"
import Banner from "../components/Banner"
import HomeSectionOne from "../components/HomeSectionOne"
import useGetConnectedUser from "../components/hooks/useGetConnectedUser.jsx";
import HomePro from "./HomePro.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import { useTranslation } from 'react-i18next';
import Loading from "../assets/img/loading.jpg";
import Footer from "../components/others/Footer.jsx";

function Home() {
    const { t } = useTranslation();
    const user = useGetConnectedUser();

    if (user.connectedUser === undefined) {
        return (
            <>
                <Navbar/>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <img className='animate-spin w-20' src={Loading} alt="Loading"/>
                    </div>
                </div>
            </>
        );
    }

    if (user.connectedUser && !user.connectedUser.isVerified) {
        return (
            <>
                <Navbar/>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1>{t("Veuillez activer votre compte pour accéder à votre espace")}</h1>
                    </div>
                </div>
            </>
        )
    }

    if (user.connectedUser === null) {
        return (
            <>
                <Navbar/>
                <Banner/>
                <HomeSectionOne/>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar/>
            {
                user.connectedUser ? user.connectedUser.roles[0] === 'ROLE_PRO' ?
                    <HomePro user={user}/> : user.connectedUser.roles && user.connectedUser.roles[0] === 'ROLE_ADMIN' ?
                        <Dashboard/> : (
                            <>
                                <Banner/>
                                <HomeSectionOne/>
                                <Footer />
                            </>
                        ) : null
            }
        </>
    )
}

export default Home