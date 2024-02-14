import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ClassIcon from '@mui/icons-material/Class';
import BusinessIcon from '@mui/icons-material/Business';
import BallotIcon from '@mui/icons-material/Ballot';
import MessageIcon from '@mui/icons-material/Message';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HomeIcon from '@mui/icons-material/Home';

export const MainListItems = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPage, setSelectedPage] = useState(location.pathname);
    
    const handleListItemClick = (path) => {
        setSelectedPage(path);
        navigate(path);
    };
    
    const isSelected = (path) => selectedPage === path;

    return (
        <React.Fragment>
            <ListItemButton 
                onClick={() => handleListItemClick('/admin/dashboard')}
                selected={isSelected('/admin/dashboard')}
            >
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
                onClick={() => handleListItemClick('/admin/users')}
                selected={isSelected('/admin/users')}
            >
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Utilisateurs" />
            </ListItemButton>
            <ListItemButton
                onClick={() => handleListItemClick('/admin/providers')}
                selected={isSelected('/admin/providers')}
            >
                <ListItemIcon>
                    <GroupAddIcon />
                </ListItemIcon>
                <ListItemText primary="Prestataires" />
            </ListItemButton>
            <ListItemButton 
                onClick={() => handleListItemClick('/admin/brands')}
                selected={isSelected('/admin/brands')}
            >
                <ListItemIcon>
                    <BrandingWatermarkIcon />
                </ListItemIcon>
                <ListItemText primary="Marques" />
            </ListItemButton>
            <ListItemButton
                onClick={() => handleListItemClick('/admin/gears')}
                selected={isSelected('/admin/gears')}
            >
                <ListItemIcon>
                    <SettingsSuggestIcon />
                </ListItemIcon>
                <ListItemText primary="Boîtes de vitesse" />
            </ListItemButton>
            <ListItemButton
                onClick={() => handleListItemClick('/admin/models')}
                selected={isSelected('/admin/models')}
            >
                <ListItemIcon>
                    <WebStoriesIcon />
                </ListItemIcon>
                <ListItemText primary="Modèles" />
            </ListItemButton>
            <ListItemButton
                onClick={() => handleListItemClick('/admin/energies')}
                selected={isSelected('/admin/energies')}
            >
                <ListItemIcon>
                    <LocalGasStationIcon />
                </ListItemIcon>
                <ListItemText primary="Energies" />
            </ListItemButton>
            <ListItemButton
                onClick={() => handleListItemClick('/admin/categories')}
                selected={isSelected('/admin/categories')}
            >
                <ListItemIcon>
                    <ClassIcon />
                </ListItemIcon>
                <ListItemText primary="Catégories" />
            </ListItemButton>
            <ListItemButton
                onClick={() => handleListItemClick('/admin/companies')}
                selected={isSelected('/admin/companies')}
            >
                <ListItemIcon>
                    <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Compagnies" />
            </ListItemButton>
            <ListItemButton 
                onClick={() => handleListItemClick('/admin/rents')}
                selected={isSelected('/admin/rents')}
            >
                <ListItemIcon>
                    <BallotIcon />
                </ListItemIcon>
                <ListItemText primary="Réservations" />
            </ListItemButton>
            <ListItemButton
                onClick={() => handleListItemClick('/admin/comments')}
                selected={isSelected('/admin/comments')}
            >
                <ListItemIcon>
                    <MessageIcon />
                </ListItemIcon>
                <ListItemText primary="Commentaires" />
            </ListItemButton>
        </React.Fragment>
    )
};

export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Saved reports
        </ListSubheader>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Current month" />
        </ListItemButton>
    </React.Fragment>
);