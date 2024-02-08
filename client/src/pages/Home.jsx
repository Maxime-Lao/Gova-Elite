import Navbar from "../components/navbar/Navbar.jsx"
import Banner from "../components/Banner"
import HomeSectionOne from "../components/HomeSectionOne"
import useGetConnectedUser from "../components/hooks/useGetConnectedUser.jsx";
import HomePro from "./HomePro.jsx";
import {useEffect, useState} from "react";

function Home() {
    const [isPro, setIsPro] = useState();
    const user = useGetConnectedUser();

    useEffect(() => {
        setIsPro(user.connectedUser.roles && user.connectedUser.roles[0] === 'ROLE_PRO')
    }, [user]);

    if (user.connectedUser.id && !user.connectedUser.isVerified) {
        return (
            <>
                <Navbar/>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1>Veuillez activer votre compte pour accéder à votre espace</h1>
                    </div>
                </div>
            </>
        )
    }

    return (
        !isPro ? (
            <>
                <Navbar/>
                <Banner/>
                <HomeSectionOne />
          </>
    ) : (
        <HomePro user = { user }/>
    )
    );
  }
  
  export default Home