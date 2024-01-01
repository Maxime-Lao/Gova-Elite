import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Button, Link } from '@mui/material';

const AvatarDialog = ({ firstName, lastName, handleLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const initials = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : '';

    return (
        <div>
            <Avatar sx={{ width: 40, height: 40, backgroundColor: '#3f51b5', cursor: 'pointer' }} onClick={handleClick}>
                {initials}
            </Avatar>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>
                    <p>{lastName} {firstName}</p>
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', alignItems: "center" }}>
                    <Link href="/account" underline="hover">Mon compte</Link>
                    <Button onClick={handleLogout} variant="contained" color="secondary">
                        Se déconnecter
                    </Button>
                </div>
            </Popover>
        </div>
    );
};

export default AvatarDialog;
