import React, {Fragment, useContext} from "react";
import {SchoolContext} from "../context/SchoolContext";
import {useAuth0} from "@auth0/auth0-react";
import NoSchoolAssigned from "./NoSchoolAssigned";
import {Box, Button, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const staticContentBucket = process.env.REACT_APP_STATIC_CONTENT_BUCKET
    const {user, isAuthenticated, isLoading} = useAuth0();
    const {selectedSchool, isSchoolAssignedToUser} = useContext(SchoolContext);
    const navigate = useNavigate();

    const handleRequestClick = () => {
        navigate('/new-school');
    };

    return (
        <Fragment>
            {isAuthenticated ? (
                !isSchoolAssignedToUser(user) ? (
                    <NoSchoolAssigned/>
                ) : (
                    <Fragment>
                        <h1>Welcome to, {selectedSchool} !!!</h1>
                        <img
                            src={`https://storage.googleapis.com/${staticContentBucket}/${selectedSchool}.jpg`}
                            alt="School image"
                        />
                    </Fragment>
                )
            ) : (
                <Fragment>
                    <Typography variant="h4">Welcome Home !!!</Typography>
                    <Box
                        component="img"
                        src={`https://storage.googleapis.com/${staticContentBucket}/default-school.jpg`}
                        alt="School image"
                        sx={{width: '100%', maxWidth: '600px', mt: 2}}
                    />
                    <Box></Box>
                    <Button variant="contained" color="primary" onClick={handleRequestClick} sx={{mt: 2}}>
                        Want to join? Make a join request!
                    </Button>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;
