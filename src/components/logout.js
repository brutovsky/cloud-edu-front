import {useAuth0} from "@auth0/auth0-react";
import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = () => {
    const {logout} = useAuth0();

    return (
        <LogoutIcon onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}>
            Log Out
        </LogoutIcon>
    );
};

export default LogoutButton;