<template>
    <div class="container mt-5">
        <ul class="nav">

            <li class="btn">Accueil</li>

            <li @click="toggleLogin" :toggleLogin="toggleLogin" class="btn"><router-link to="/Login">Connexion</router-link></li>

            <!-- <li @click="toggleSignup" :toggleSignup="toggleSignup" class="btn"><router-link to="/Signup">Inscription</router-link></li> -->

            <li class="btn"><router-link to="/Profile">Profil</router-link></li>
        </ul>

        <login :reveleLogin="reveleLogin" :toggleLogin="toggleLogin" ></login> 

    </div>
</template>

<script>
    import Login from './Login'

    export default {
        name: 'Header',
        data() {
           return {
               reveleLogin: false, // = props
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
            }
        }
    }
</script>

<style>
    .router-link-active {
        color: blue;
    }
</style>   
