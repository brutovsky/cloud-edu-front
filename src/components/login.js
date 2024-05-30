import {useAuth0} from "@auth0/auth0-react";
import React from "react";
import LoginIcon from '@mui/icons-material/Login';

const LoginButton = () => {
    const {loginWithRedirect} = useAuth0();

    return <LoginIcon onClick={() => loginWithRedirect()}>Log In</LoginIcon>;
};

export default LoginButton;