import './App.css';
import SchoolDashboard from "./components/SchoolDashboard";
import React, {useContext} from 'react';
import {CssBaseline} from '@mui/material';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import Layout from "./components/Layout";
import initFontAwesome from "./utils/initFontAwesome";
import {useAuth0} from "@auth0/auth0-react";
import Profile from "./components/Profile";
import Home from "./components/Home";
import {Role, userHasAnyRole} from "./features/auth/Role";
import UploadedFiles from "./components/ingestion/UploadedFiles";
import Lessons from "./components/Lessons";
import NotFound from "./components/error/NotFound";
import Loading from "./components/Loading";
import StudentList from "./components/StudentsList";
import {SchoolContext, SchoolProvider} from "./context/SchoolContext";
import Ingestion from "./components/ingestion/Ingestion";
import Tasks from "./components/ingestion/Tasks";

initFontAwesome();

function PrivateRoute({children}) {
    const {
        isAuthenticated
    } = useAuth0();
    return isAuthenticated ? <>{children}</> : <Navigate to="/"/>;
}

function RoleBasedRoute({children, allowedRoles}) {
    const {user, isAuthenticated} = useAuth0();
    const {isSchoolAssignedToUser} = useContext(SchoolContext);

    if (!isAuthenticated || !userHasAnyRole(user, allowedRoles)) {
        return <Navigate to="/"/>;
    }

    if (!isSchoolAssignedToUser(user)) {
        return <Navigate to="/"/>;
    }

    return children;
}

function App() {
    const {isLoading} = useAuth0();

    if (isLoading) {
        return (
            <div className="page-layout">
                <Loading/>
            </div>
        );
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <SchoolProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<Home/>}/>
                            <Route
                                path="/school"
                                element={
                                    <RoleBasedRoute allowedRoles={[Role.Admin, Role.Student]}>
                                        <SchoolDashboard/>
                                    </RoleBasedRoute>
                                }
                            />
                            <Route
                                path="/lessons"
                                element={
                                    <RoleBasedRoute allowedRoles={[Role.Student]}>
                                        <Lessons/>
                                    </RoleBasedRoute>
                                }
                            />
                            <Route
                                path="/students"
                                element={
                                    <RoleBasedRoute allowedRoles={[Role.Admin]}>
                                        <StudentList/>
                                    </RoleBasedRoute>
                                }
                            />
                            <Route path="ingestion" element={
                                <RoleBasedRoute allowedRoles={[Role.Admin]}>
                                    <Ingestion/>
                                </RoleBasedRoute>
                            }>
                                <Route path="files" element={<UploadedFiles/>}/>
                                <Route path="tasks" element={<Tasks/>}/>
                            </Route>
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <Profile/>
                                    </PrivateRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/404"/>}/>
                            <Route path="/404" element={<NotFound/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </SchoolProvider>
        </React.Fragment>
    );
}

export default App;
