import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const VerticalTabs = ({ tabsData }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexGrow: 1, bgcolor: 'background.paper' }}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider', minWidth: '120px' }}
            >
                {tabsData.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>
            {tabsData.map((tabContent, index) => (
                <TabPanel key={index} value={selectedTab} index={index}>
                    {tabContent.content}
                </TabPanel>
            ))}
        </Box>
    );
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default VerticalTabs;
