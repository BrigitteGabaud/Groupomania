import axios from 'axios';
import store from "../store";

export default function axiosSetUp() {
    axios.interceptors.request.use(
        function (config) {

            const token = store.state.user.token
          //  console.log(store.state.user.token);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        function (error) {
            return Promise.reject(error.message);
        }
    );
   
}