<template>

    <div class="container-header ">

        <nav class="navbar navbar-expand">

            <!-- Logo -->
            <div class="container-logo">

                <router-link aria-label="Aller vers la page accueil" to="/">
                    <img
                    class="navbar-brand"
                    id="logo"
                    src="@/assets/icon-left-font-monochrome-black_opttt.png" 
                    alt="Logo Groupomania">
                </router-link>

            </div>

            <!-- Liste de navigation si user CONNECTE -->
            <ul v-show="user" class="navbar-nav">
                
                <!-- Accueil -->
                <li :v-if="user !== null" class="nav-item active" title="Accueil">

                    <router-link aria-label="Aller vers la page accueil" to="/">
                    
                        <fa icon='house-user'/>

                    </router-link>

                </li>

                <!-- Profil -->
                <li :v-if="user !== null" class="nav-item" title="Profil">

                    <router-link aria-label="Aller vers le profil" to="/Profile">

                        <img class="profilePicture" :src="userInfos.avatar" alt="Photo de profil">

                    </router-link>

                </li>

                <!-- Déconnexion -->
                <li 
                    :v-if="user !== null"
                    @click="logout" 
                    class="nav-item logout"
                    aria-label="Se déconnecter"
                    title="Déconnexion">

                    <fa icon='power-off'/>
                </li>

            </ul>

        </nav>
    </div>

</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex"

export default {
    name: "TheHeader",
    computed: {
        ...mapState([ "user", "userInfos"]),
        ...mapMutations(['LOGOUT'])
    },
    methods: {
        ...mapActions([ "getUserInfos" ]),

        logout: function() {
            this.$store.commit('LOGOUT');
            this.$router.push({ name:'Connexion' })
        }
    },
    created() {
        this.getUserInfos()
    }
}
</script>

<style scoped>
.container-header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 55px;
    background:#d1515ae6;
    color: #000000;
    z-index: 5;
}
.navbar-expand {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.navbar-nav {
    flex-direction: row;
    align-items: center;
    margin-bottom: 7px;
}
img#logo.navbar-brand {
    padding-bottom: 0;
    margin-right: 0;
    height: 4.5rem;
}
.nav-item {
    margin: 0 5px;
}
.nav-item a  {
    text-decoration: none;
    color: black;
    font-size: 1.6rem;
}
.login {
    font-size: 1.6rem;
    text-decoration: none;
    color: #000000;
    font-weight: 500;
    margin-right: 5%;
}
.svg-inline--fa.fa-house-user.fa-w-18{
    font-size: 1.9rem;
    margin-top: 8px;
}
.profilePicture {
    width: 23px;
    border-radius: 3px;
    border: 1px solid ;
}
.svg-inline--fa.fa-power-off.fa-w-16 {
    font-size: 1.4rem;
} 
.logout {
    cursor: pointer;
}

/* Ecrans tablettes */
@media (min-width: 768px) {
    .container-header {
        height: 70px;
    }
    .navbar {
        height: 70px;
        justify-content: space-between!important
    }
    .container-logo {
        margin-left: 5%;
    }
    img#logo.navbar-brand {
        height: 6.4rem;
    }
    .navbar-nav {
        margin-right: 5%;
    }
    .nav-item {
        margin: 0 8px;
    }
    .svg-inline--fa.fa-house-user.fa-w-18{
        font-size: 2.5rem;
    }
    .profilePicture {
        width: 30px;
    }
    .svg-inline--fa.fa-power-off.fa-w-16 {
        font-size: 1.8rem;
    }
}

</style>