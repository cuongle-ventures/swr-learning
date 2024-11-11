import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
});

instance.interceptors.request.use(
    function beforeRequest(config) {
        return config;
    },
    function afterRequest(err) {
        return Promise.reject(err);
    },
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default instance;
