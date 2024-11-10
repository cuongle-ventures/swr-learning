import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000',
});

instance.interceptors.request.use(
    function beforeRequest(config) {
        return config;
    },
    function afterRequest(err) {
        return Promise.reject(err);
    },
);

export default instance;
