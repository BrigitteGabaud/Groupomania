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

            <div v-if="user" class="container-profile-image">
                <img class="profile-image" :src="userInfos.avatar" alt="Photo de profil">
            </div>

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
import { mapState, mapMutations, mapActions } from "vuex"

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
    computed: {
        ...mapState([ "userInfos"]),
        ...mapMutations(['LOGOUT'])
    },
    methods: {
        ...mapActions([ "getUserInfos" ]),

        toggleLogin: function() {
            this.reveleLogin = !this.reveleLogin
        },
        isUserLoggedIn: function() {
            let user = localStorage.getItem('user');

            if(user) {
                this.user = JSON.parse(user);
                this.user == true
            } else {
                this.user == false
            }
        },
        logout: function() {
        this.$store.commit('LOGOUT');
        setTimeout(() => this.$router.push('/Connexion'), 1000)
        document.location.reload()
      }
    },
    created() {
        this.isUserLoggedIn()
        
    },
    mounted() {
        this.getUserInfos()
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
    display: flex;
}
img#logo.navbar-brand {
    padding-bottom: 0;
    margin-right: 0;
    height: 4.8rem;
    margin-left: 5%;
}
.container-profile-image {
    width: 40px;
    border-radius: 3px;
    position: absolute;
    right: 10px;
}
.profile-image {
    border-radius: 3px;  
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
.navbar-toggler {
    margin-right: 50px;

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
    #nav-list {
        background: none;
        justify-content: flex-end;
        height: 70px;
        margin-left: 2%;
        margin-right: 70px;
        margin-top: 0.3rem;
        padding: 0;
        font-weight: 500;
    }
    .navbar {
        height: 70px;
        justify-content: space-between!important
    }
    .container-profile-image {
       width: 50px;
       right: 40%;
       position: absolute;
       right: 15px;
    }
    .profile-image {
        border-radius: 3px;  
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