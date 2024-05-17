import React, {Fragment, useContext} from "react";
import {SchoolContext} from "../context/SchoolContext";
import {useAuth0} from "@auth0/auth0-react";
import NoSchoolAssigned from "./NoSchoolAssigned";

const Home = () => {
    const staticContentBucket = process.env.REACT_APP_STATIC_CONTENT_BUCKET
    const {user, isAuthenticated, isLoading} = useAuth0();
    const {selectedSchool, isSchoolAssignedToUser} = useContext(SchoolContext);

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
                    <h1>Welcome Home !!!</h1>
                    <img
                        src={`https://storage.googleapis.com/${staticContentBucket}/default-school.jpg`}
                        alt="School image"
                    />
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;
