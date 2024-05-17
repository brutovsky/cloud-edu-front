import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {getConfig} from "./config";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";

// Please see https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html
// for a full list of the available properties on the provider
const config = getConfig();

const onRedirectCallback = (appState) => {
    console.log('Login successful! Redirecting...');
    window.history.replaceState({}, document.title, window.location.pathname);
};

const providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
        redirect_uri: window.location.origin,
        ...(config.audience ? {audience: config.audience} : null),
    },
    cacheLocation: "localstorage",
    useRefreshTokens: true,
    onRedirectCallback: onRedirectCallback
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Auth0Provider{...providerConfig}>
            <App/>
        </Auth0Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
