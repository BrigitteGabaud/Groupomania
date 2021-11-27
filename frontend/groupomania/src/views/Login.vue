<template>
    <div class="bloc-login" v-if="reveleLogin">

        <div v-on:click="toggleLogin" class="overlay"></div>

        <div class="login card">
            <div v-on:click="toggleLogin" class="btn-login btn btn-white">X</div>

            <h1 v-if="mode == 'login'" class="card-title">Connexion</h1>
            <h1 v-else class="card-title">Inscription</h1>

            <p v-if="mode == 'login'" class="card-subtitle" @click="switchToCreateAccount">Pas encore de compte ?&nbsp;  <span class="card_action" >Créer un compte </span></p>
            <p v-else class="card-subtitle" @click="switchToLogin">Déjà un compte ? &nbsp;<span class="card_action" > Se connecter</span></p>

            <div v-if="mode == 'create'" class="form-row" >
                <input v-model="firstname" class="form-row_input" type="text" placeholder="Prénom"/>
                <input v-model="lastname" class="form-row_input" type="text" placeholder="Nom"/>
            </div>

            <div class="form-row">
                <input v-model="email" class="form-row_input" type="text" placeholder="Adresse mail"/> 
            </div>

            <div class="form-row">
                <input v-model="password" class="form-row_input" type="password" placeholder="Mot de passe"/>
            </div>

            <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
                Adresse mail et/ou mot de passe invalide.
            </div>
            <div class="form-row" v-if="mode == 'create' && status == 'error_create'">
                Adresse mail déjà utilisée.
            </div>

            <div class="form-row">
                <button  @click="login()" class="button" :class="{'button--disabled' : !validatedFields}"  v-if="mode == 'login'">
                    <span v-if="status == 'loading'">Connexion en cours...</span>
                    <span v-else>Connexion</span>
                </button>
                    <button @click="signup()" class="button" :class="{'button--disabled' : !validatedFields}"  v-else> <span v-if="status == 'loading'">Création en cours...</span>
                    <span v-else>Créer mon compte</span>
                </button>
            </div>

        </div>
    </div>

    
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'Login',
        data: function() {
            return {
                mode: 'login', 
                firstname: '',
                lastname: '',
                email: '',
                password: '',
            }
        },
        mounted: function () {
           /*  console.log(this.$store.state.user);
                if (this.$store.state.user.userId != -1) { // = connecté
                this.$router.push('/profile');
                return ;
                }*/
        }, 
        computed: {
            validatedFields: function() {
                if (this.mode == 'create') {
                    if (this.firstname != "" && this.lastname != "" && this.email != "" && this.password != "") {
                    return true;
                    } else {
                    return false;
                    }
                } else { // si mode login
                    if (this.email != "" && this.password != "") {
                    return true;
                    } else {
                    return false;
                    }
                }
            },
            ...mapState(['status'])
        },
        methods: {
            switchToCreateAccount: function() {
                this.mode = 'create';
            },
            switchToLogin: function() {
                this.mode = 'login';
            },
            login: function() {
                const self = this;
                this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password,
                }).then(function() {
                    self.$router.push('profile')
                }).catch(function(error) {
                    console.log(error)
                })
            },
            signup: function() {
                const self = this;
                this.$store.dispatch('signup', {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password,
                }).then(function() {
                    self.login();
                }).catch(function(error) {
                    console.log(error)
                })
            }
        },
        props: ['reveleLogin', 'toggleLogin']
    }

</script>


<style scopped>
    .bloc-login {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .overlay {
        background: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .login {
        background: #f1f1f1;
        color: #333;
        padding: 50px;
        position: fixed;
    }
    .btn-login {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .card-title {
        display: flex;
        justify-content: center;
    }
    .card-subtitle {
        display: flex;
        justify-content: center;
        margin-bottom: 10px!important;
    }
    .card_action {
        color: blue;
        text-decoration: underline;
    }
    .form-row {
        display: flex;
        margin: 12px 0px;
        gap: 12px;
        flex-wrap: wrap;
    }
    
  .form-row_input {
    padding:8px;
    border: none;
    border-radius: 8px;
    background:#f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex:1;
    min-width: 100px;
  }
  .form-row_input::placeholder {
    color:#aaaaaa;
  }
  /* button {
    padding:8px;
    border: none;
    border-radius: 8px;
    background:#a5a3a3!important;
    font-weight: 500!important;
    font-size: 16px;
    flex:1;
    min-width: 100px;
  } */

</style>   
