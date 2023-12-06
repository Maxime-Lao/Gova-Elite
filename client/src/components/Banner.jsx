import bannerImage from '../assets/img/banner.jpg';
import SearchBar from './SearchBar';
import { Typography, Grid, Box } from '@mui/material';

const Banner = () => {
    const bannerStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '500px',
        position: 'relative',
        
    };

    const waveStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
    };

    const searchBarStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
    };

    return (
        <Grid container sx={bannerStyle}>
            <Typography variant="h4" component="h1" sx={{ color: 'white', textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -250%)' }}>
                Réservez Votre Rêve,<br></br>
                Conduisez l&apos;Exception.
            </Typography>
            <Box sx={searchBarStyle}>
                <SearchBar />
            </Box>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={waveStyle}><path fill="#ffffff" fillOpacity="1" d="M0,256L120,261.3C240,267,480,277,720,261.3C960,245,1200,203,1320,181.3L1440,160L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path></svg>
        </Grid>
    );
};

export default Banner;
