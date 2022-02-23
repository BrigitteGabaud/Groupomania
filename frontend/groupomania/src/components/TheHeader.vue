<template>

    <div class="container-header ">

        <nav class="navbar navbar-expand-md">

            <img
                class="navbar-brand"
                id="logo"
                src="@/assets/icon-left-font-monochrome-black_opttt.png" 
                alt="Logo Groupomania">



            <button
                class="navbar-toggler "
                type="button"
                alt="Ouvrir ou fermer la navigation"
                data-bs-toggle="collapse"
                data-bs-target="#nav-list"
                aria-expanded="false"
                aria-label="Navigation petits écrans">

                <img src="../assets/hamburger.svg" class="navbar-toggler-icon">

            </button>

            <div class="collapse navbar-collapse" id="nav-list">

                <ul class="navbar-nav">

                    <li class="nav-item active ">

                        <router-link aria-label="Aller vers la page accueil" to="/">Accueil </router-link>

                    </li>

                    <li class="nav-item" >

                        <router-link  aria-label="Aller vers la page profil" to="/Profile" >Profil</router-link>

                    </li>

                    <li class="nav-item"
                        v-if="!user"
                        @click="toggleLogin" :toggleLogin="toggleLogin">

                        <router-link aria-label="Aller vers la fenêtre de connexion" to="/Connexion">Connexion </router-link>

                    </li>

                    <li 
                        v-else aria-label="Se déconnecter" 
                        @click="logout" 
                        class="nav-item logout">

                        Déconnexion
                    </li>


                </ul>

            </div>

        </nav>

        <login :reveleLogin="reveleLogin" :toggleLogin="toggleLogin" ></login>

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
        window.location.href = 'http://localhost:8080/connexion'
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
    width: 100%;
    height: 70px;
    background:rgba(209,81,90,0.9);
    color: #000000;
    z-index: 5;
}
.navbar {
    justify-content: space-between;
}
img#logo.navbar-brand {
    padding-bottom: 0;
    margin-right: 0;
    height: 4.8rem;
    margin-left: 5%;
}
#nav-list {
    background:rgba(209,81,90,0.9);
    margin-top: 4.5%;
    padding-left: 4%;
    padding-bottom: 6%;
    font-weight: 500;
}
.nav-item {
    margin: 0 10px;
}
.nav-item a  {
    text-decoration: none;
    color: black;
    font-size: 1.6rem;
}
.logout {
    cursor: pointer;
    font-size: 1.6rem;
}
button .navbar-toggler-icon  {
    width: 2.5em;
    height: 2.5em;
}
button:focus {
    outline: none!important;
    box-shadow: none;
}

/* Ecrans mobiles taille moyenne */
@media (min-width: 375px ) and (max-width: 397px){
    #nav-list {
        margin-top: 3.8%;
    }
}

@media (min-width: 398px ) and (max-width: 425px){
    #nav-list {
        margin-top: 3%;
    }
}

/* Ecrans tablettes */
@media (min-width: 768px) {
    .navbar-expand-md .navbar-collapse {
        justify-content: flex-end;
        margin-left: 5%;
        height: 70px;
    }
    #nav-list {
        background: none;
        margin-right: 5%;
        margin-top: 0.3rem;
        padding: 0;
        font-weight: 500;
    }
    .navbar {
        height: 70px;
    }
    img#logo.navbar-brand {
        height: 6.4rem;
        margin-left: 5%;
    }
    .nav-item a  {
        font-size: 1.92rem;
    }
    .logout {
        cursor: pointer;
        font-size: 1.92rem;
    }
}

</style>