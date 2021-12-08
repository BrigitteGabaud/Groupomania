import axios from 'axios';
import store from "../store";

export default function axiosSetUp() {

    axios.interceptors.request.use(
        function (config) {
            console.log(config);
            const test = store.state.userLogin;
            console.log(test);
            const token = store.state.userLogin.token
            console.log('token depuis interceptor 1',token);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('token depuis interceptor 2',token);
            }
            return config;
        },
        function (error) {
            return Promise.reject(error.message);
        }
    );
   
}