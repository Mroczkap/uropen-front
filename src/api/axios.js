import axios from 'axios';

// Access the environment variable
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});


// 'https://backen-test.vercel.app/';
//'http://localhost:4000';