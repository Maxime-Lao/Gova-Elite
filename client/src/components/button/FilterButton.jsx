import { useState } from 'react';
import Button from '@mui/material/Button';
import FilterPop from '../popup/FilterPop';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const FilterButton = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                startIcon={<FilterAltIcon />}
                onClick={handleOpen}
                disabled={props.disabled}
            >
                Filtrer
            </Button>
            <FilterPop open={open} onClose={handleClose} searchProps={props} />
        </>
    );
};

export default FilterButton;
