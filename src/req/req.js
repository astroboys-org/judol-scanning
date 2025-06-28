import axios from 'axios';
import useNotyf from '../hooks/useNotyf';

const BASE_URL = "https://restful-api.dev/";

export default axios.create({
    baseURL: BASE_URL
});

export const reqPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const errorReqHandler = (error) => {
    const notyf = useNotyf();

    if (error.response) {
        notyf.error(error.response.message);
    } else if (error.request) {
        notyf.error("Request Failed!");
    } else if (error.message) {
        notyf.error("Error: ", error.message);
    } else {
        notyf.error(error)
    }
}