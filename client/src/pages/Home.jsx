import Navbar from "../components/navbar/Navbar.jsx"
import Banner from "../components/Banner"
import HomeSectionOne from "../components/HomeSectionOne"
import useGetConnectedUser from "../components/hooks/useGetConnectedUser.jsx";
import HomePro from "./HomePro.jsx";

function Home() {

    const user = useGetConnectedUser();

    if (!user) {
        return null;
    }

    const isPro = user.connectedUser.roles && user.connectedUser.roles[0] === 'ROLE_PRO';

    return (
      !isPro ? (
          <>
              <Navbar />
              <Banner />
              <HomeSectionOne />
          </>
    ) : (
        <HomePro user = { user }/>
    )
    );
  }
  
  export default Home