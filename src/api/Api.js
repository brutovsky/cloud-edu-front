import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const API = axios.create({
    baseURL: API_ENDPOINT + "/api/v1/",
    headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}
});

API.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
}, null, {synchronous: true});
export default API;

export function initHeaders(jwtToken) {
    return {
        headers: {Authorization: `Bearer ${jwtToken}`}
    }
}