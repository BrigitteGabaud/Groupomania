<template>

    <div class="container-header ">

        <nav class="navbar .navbar-expand-md">

            <li class="nav-item active ">
                <router-link to="/">Accueil</router-link>
            </li>

            <li v-if="!user"
                @click="toggleLogin" :toggleLogin="toggleLogin">
                <router-link to="/Connexion">Connexion</router-link>

            </li>

            <li v-else @click="logout" class="logout"> 
                Déconnexion
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


export default {
    name: "TheHeader",
    data() {
        return {
            reveleLogin: false, // = props
            user: false
        }
    },
    components: {
        'login': Login
    },
    methods: {
        toggleLogin: function() {
            this.reveleLogin = !this.reveleLogin
        },
        toggleSignup: function() {
            this.reveleSignup = !this.reveleSignup
        },
        isUserLoggedIn: function() {
            let user = sessionStorage.getItem('user');
            
            if(user) {
                this.user = JSON.parse(user);
                this.user == true
            } else {
                this.user == false
            }
        },
        logout: function() {
        this.$store.commit('logout');
        this.$router.push('/Connexion');
      }
    },
    
    mounted() {
        this.isUserLoggedIn()
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
.logout {
    cursor: pointer;
}


</style>