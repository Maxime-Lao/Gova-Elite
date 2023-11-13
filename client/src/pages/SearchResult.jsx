import { Box } from '@mui/material';
import Stack from '@mui/joy/Stack';
import RentCard from '../components/RentCard';

const SearchResult = () => {
    return (
        <Box
        component="main"
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: { xs: 'auto', md: '60% 40%' },
          gridTemplateRows: 'auto 1fr auto',
        }}
        >            
            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0, overflow: 'auto' }}>
                <Stack spacing={2}>
                    <RentCard />
                    <RentCard />
                    <RentCard />
                    <RentCard />
                    <RentCard />
                    <RentCard />
                </Stack>
            </Stack>
            <Box
            sx={{
                gridRow: 'span 3',
                display: { xs: 'none', md: 'flex' },
                backgroundColor: 'background.level1',
                backgroundSize: 'cover',
                backgroundImage:
                'url("https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3731&q=80")',
            }}
            />
        </Box>
    );
}

export default SearchResult;