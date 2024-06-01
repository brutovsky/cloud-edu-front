import React, {useContext, useEffect} from 'react';
import {Link, Outlet, useLocation} from 'react-router-dom';
import {AppBar, Avatar, Box, Container, IconButton, MenuItem, Select, Tab, Toolbar, Typography} from '@mui/material';
import logo from "../cloudedu.png";
import LoginButton from "./login";
import {useAuth0} from "@auth0/auth0-react";
import LogoutButton from "./logout";
import {Role, userHasRole} from "../features/auth/Role";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import {SchoolContext} from "../context/SchoolContext";
import Footer from "./Footer";

const tabsConfig = [
    {label: "Home", path: "", roles: [], index: 0},
    {label: "Profile", path: "profile", roles: [Role.Admin, Role.Student], index: 1},
    {label: "School", path: "school", roles: [Role.Admin, Role.Student], index: 2},
    {label: "Lessons", path: "lessons", roles: [Role.Student], index: 3},
    {label: "Students", path: "students", roles: [Role.Admin], index: 4},
    {label: "Personnel", path: "personnel", roles: [Role.Admin], index: 5},
    {label: "Classes", path: "classes", roles: [Role.Admin], index: 6},
    {label: "Reports", path: "reports", roles: [Role.Admin], index: 7},
    {label: "Analytics", path: "analytics", roles: [Role.Admin], index: 8},
    {label: "Data Ingestion", path: "ingestion", roles: [Role.Admin], index: 9},
];

const schoolTabs = [
    "School", "Lessons"
]

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Layout() {
    const {pathname} = useLocation();
    const {user, isAuthenticated, error, getAccessTokenSilently} = useAuth0();
    const {
        selectedSchool,
        setSelectedSchool,
        isSchoolAssignedToUser,
        availableSchools,
        setAvailableSchools
    } = useContext(SchoolContext);

    const handleSchoolChange = (event) => {
        setSelectedSchool(event.target.value);
    };

    useEffect(() => {
        if (isAuthenticated) {
            showToken();
        }
        if (error) {
            console.log(`Oops... ${error.message}`);
        }
    }, [isAuthenticated, user, error, getAccessTokenSilently, isSchoolAssignedToUser]);

    const showToken = async () => {
        const token = await getAccessTokenSilently();
        console.log(token);
    };

    const hasRole = (role) => userHasRole(user, role);

    const filteredTabs = tabsConfig.filter(tab => {
        if (schoolTabs.includes(tab.label) && !isSchoolAssignedToUser(user)) {
            return false;
        }
        return tab.roles.length === 0 || (isAuthenticated && tab.roles.some(role => hasRole(role)));
    });

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Box sx={{width: 100}}>
                        <IconButton edge="start" color="inherit" aria-label="home">
                            <Link to="/" style={{display: 'flex'}}>
                                <img src={logo} alt="Logo" style={{height: 40}}/>
                            </Link>
                        </IconButton>
                    </Box>
                    <TabContext value={pathname.split('/')[1]}>
                        <TabList variant="scrollable" value={pathname.split('/')[1]}
                                 aria-label="teacher dashboard tabs" sx={{marginLeft: 'auto'}}>
                            {filteredTabs.map((tab, index) => (
                                <Tab key={index} value={tab.path} label={tab.label} component={Link}
                                     to={tab.path} {...a11yProps(tab.index)} />
                            ))}
                        </TabList>
                    </TabContext>
                    <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
                        {isAuthenticated ? (
                            <>
                                <Select
                                    value={selectedSchool ?? " "}
                                    onChange={handleSchoolChange}
                                    displayEmpty
                                    inputProps={{'aria-label': 'Without label'}}
                                    sx={{minWidth: 150, marginLeft: 2}}
                                >
                                    {availableSchools.map((school) => (
                                        <MenuItem key={school} value={school}>
                                            <Typography variant="body1" sx={{fontSize: 14}}>
                                                {school}
                                            </Typography>
                                        </MenuItem>
                                    ))
                                    }
                                </Select>
                                <IconButton edge="end" color="inherit">
                                    <Link to="/profile" style={{display: 'flex'}}>
                                        <Avatar alt={user.name} src={user.picture}/>
                                    </Link>
                                </IconButton>
                                <Box sx={{p: 1}}/>
                                <LogoutButton/>
                            </>
                        ) : (
                            <LoginButton/>
                        )}
                    </Box>
                </Toolbar>
                {error && <div>Oops... {error.message}</div>}
            </AppBar>
            <Container component="main" sx={{mt: 3, mb: 2, flexGrow: 1}}>
                <Outlet/>
            </Container>
            <Footer/>
        </Box>
    );
}

export default Layout;
