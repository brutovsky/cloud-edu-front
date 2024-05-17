// SchoolContext.js
import React, {createContext, useEffect, useState} from 'react';
import {useAuth0} from "@auth0/auth0-react";

const SchoolContext = createContext();

const SchoolProvider = ({children}) => {
    const [selectedSchool, setSelectedSchool] = useState(undefined);
    const [availableSchools, setAvailableSchools] = useState([]);
    const {user, isAuthenticated} = useAuth0();

    useEffect(() => {
        if (isAuthenticated && user.app_metadata && user.app_metadata.school) {
            setSelectedSchool(user.app_metadata.school);
            setAvailableSchools([user.app_metadata.school]);
        }
    }, [user, isAuthenticated]);

    const isSchoolAssigned = () => {
        return selectedSchool !== undefined && selectedSchool !== '';
    };

    const isSchoolAssignedToUser = (loggedInUser) => {
        return loggedInUser && loggedInUser.app_metadata && loggedInUser.app_metadata.school;
    };

    return (
        <SchoolContext.Provider
            value={{
                selectedSchool,
                setSelectedSchool,
                isSchoolAssigned,
                isSchoolAssignedToUser,
                availableSchools,
                setAvailableSchools
            }}>
            {children}
        </SchoolContext.Provider>
    );
};

export {SchoolContext, SchoolProvider};
