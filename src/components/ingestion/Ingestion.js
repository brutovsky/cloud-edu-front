// Ingestion.js
import React from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {Box, Tab, Tabs, Toolbar} from '@mui/material';

const Ingestion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentTab = location.pathname.split('/').pop();

    const handleTabChange = (event, newValue) => {
        navigate(`/ingestion/${newValue}`);
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <Toolbar/>
            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="Ingestion Tabs">
                        <Tab label="Files" value="files"/>
                        <Tab label="Tasks" value="tasks"/>
                    </Tabs>
                </Box>
                <Box sx={{flexGrow: 1, p: 3}}>
                    <Outlet/>
                </Box>
            </Box>
        </Box>
    );
};

export default Ingestion;
