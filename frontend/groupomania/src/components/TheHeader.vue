<template>

    <div class="container-header ">

        <nav class="navbar .navbar-expand-md">

            <li class="nav-item active ">
                <router-link to="/">Accueil</router-link>
            </li>

            <li
                @click="toggleLogin" :toggleLogin="toggleLogin">
                <router-link to="/Connexion">Connexion</router-link>
            </li>

            <li >
                <router-link to="/Profile">Profil</router-link>
            </li>

        </nav>

        <login 
        :reveleLogin="reveleLogin" :toggleLogin="toggleLogin" ></login>   
        
    </div>
    
</template>

<script>
import Login from '@/components/Auth/Login'

//import UserProfile from '@/components/Profile/UserProfile'

export default {
    name: "TheHeader",
    data() {
        return {
            reveleLogin: false, // = props
           // reveleProfile: false
        }
    },
    components: {
        'login': Login,
       // 'userProfile': UserProfile
    },
    methods: {
        toggleLogin: function() {
            this.reveleLogin = !this.reveleLogin
        },
        toggleSignup: function() {
            this.reveleSignup = !this.reveleSignup
        },
        /* toggleProfile: function() {
            this.reveleProfile = !this.reveleProfile
        }, */
    }
 
}
</script>

<style scoped>
.container-header {
    position: fixed;
    top: 0;
    height: 50px;
    background: gray;
    color: black;
    width: 100%;
    text-align: center;
    line-height: 50px;
    font-size: 20px;

}
.button {
    padding:8px;
    border: none;
    border-radius: 8px;
    background:#a5a3a3!important;
    font-weight: 500!important;
    font-size: 16px;
    flex:1;
    min-width: 100px;
} 
.navbar {
    display: flex;
    justify-content: center!important;
    list-style-type: none;
    
}
li {
    margin-right: 20px;
}
li a {
    text-decoration: none;
    color: black;
}


</style>