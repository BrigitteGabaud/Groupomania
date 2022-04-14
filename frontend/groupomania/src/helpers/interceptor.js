import axios from 'axios';
import store from "../store";

export default function axiosSetUp() {
    axios.interceptors.request.use(
        function (config) {
            const token = store.state.user.token
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        function (error) {
            this.$store.LOGOUT()
            this.$router.push({name:'Connexion'});
            return Promise.reject(error.message);
        }
    );
   
}