<template>

    <main id="bloc-login" v-if="reveleLogin">

        <div  class="overlay"></div>

        <div class="login card">
            
            <div v-on:click="toggleLogin" class="btn-login ">X</div>

            <!-- Titre et sous-titres selon le souhait du user -->
            <h1
                v-if="mode == 'login'" 
                class="card-title"
                >Bienvenue !  Veuillez vous connecter
            </h1>
            <h1 
                v-else class="card-title"
                >Vous souhaitez nous rejoindre ? Créez votre compte !
            </h1>

            <p  
                v-if="mode == 'login'"
                class="card-subtitle" 
                @click="switchToCreateAccount">Pas encore de compte ?&nbsp; 
                <span class="card_action" role="button">Créer un compte </span></p>

            <p  
                v-else class="card-subtitle"
                @click="switchToLogin">Déjà un compte ? &nbsp;
                <span class="card_action" role="button"> Se connecter</span></p>

            <div class="container-form">

                <!-- Formulaire inscription / connexion -->
                <form class="form-bloc">

                    <div  
                        class="form-row" 
                        id="identity"
                        v-if="mode == 'create'"
                        @submit.prevent="submitForm">

                        <label for="firstname">Entrez votre prénom</label>    
                        <input 
                            v-model="firstname" 
                            class="form-row_input" 
                            type="text" 
                            required
                            placeholder="Prénom"/>
                            
                        <p v-if="!firstnameIsValid" class="error-message"></p>
                    
                        <label for="laststname">Entrez votre nom</label>  
                        <input 
                            v-model="lastname" 
                            class="form-row_input" 
                            type="text" 
                            required
                            placeholder="Nom"/>

                        <p v-if="!lastnameIsValid" class="error-message"></p>

                    </div>

                    <div class="form-row">

                        <label for="email">Entrez votre email</label>  
                        <input 
                            v-model="email" 
                            class="form-row_input" 
                            id="email"
                            type="text"
                            required 
                            placeholder="Adresse mail"/> 
                        
                        
                        <p v-if="mode == 'create' && status == 'error_create'">
                        Adresse mail déjà utilisée.</p>
                

                    </div>

                    <div class="form-row">
                        
                        <label for="password">Entrez votre mot de passe</label>  
                        <input 
                            v-model="password" 
                            class="form-row_input" 
                            id="password"
                            type="password" 
                            required
                            placeholder="Mot de passe"/>
                       
                        
                       

                    </div>

                    <div class="form-row">

                        <button 
                            type= "submit"
                            @click=" login() " 
                            class="btn" 
                            
                            v-if="mode == 'login'">
                            <span v-if="status == 'loading'">Connexion en cours...</span>
                            <span v-else>Connexion</span>

                        </button>

                        <button 
                            type= "submit"
                            @click="signup()" 
                            class="btn" 
                             
                            v-else> 
                            <span v-if="status == 'loading'">Création en cours...</span>
                            <span v-else>Créer mon compte</span>

                        </button>

                    </div>

                </form>
            </div>

        </div>

    </main>

</template>

<script>
    import { mapState } from 'vuex' 
    
    export default {
        name: 'Login ',
        data: function() {
            return {
                mode: 'login', 
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                
            }
        },
        props: ['reveleLogin', 'toggleLogin'],
        directives: {
            focus: {
                beforeMount: function(el) {
                    el.focus
                }
            }
        },
        computed: {
            // Vérification des champs
            completedFields: function() {
                
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
            /** 
             * @description Ces fonctions passent en mode 'login'(connexion) ou 'create'(inscription)
             */
            switchToCreateAccount() {
                this.mode = 'create';
            },
            switchToLogin() {
                this.mode = 'login';
            },

            /** 
             * @description Cette fonction appelle l'API et connecte l'utilisateur
             */
            login() {
                //const self = this;
                this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password,
                }).then(function() {
                    //self.$router.push('/Profile')
                    window.location.href = 'http://localhost:8080'// redirige vers Home
                }).catch(function(error) {
                    console.log(error)
                })
            },
            
            /** 
             * @description Cette fonction appelle l'API et crée un compte utilisateur
             */
            signup() {
                const self = this;
                this.$store.dispatch('signup', { // appel APi via actions dans store/index
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password,
                }).then(function() {
                    self.switchToLogin(); // redirige vers fenêtre login
            
                }).catch(function(error) {
                    console.log(error)
                })
            }
        }
    }
</script>


<style scoped>
    #bloc-login {
        margin-top: 100px;
        margin: 0 auto;
        width: 100%;
        opacity: 1 !important;
        display: flex;
        justify-content: center;
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
        margin-top: 100px;
        background: #c1b2af;
        color: #333;
        padding: 15px;
    }
    .btn-login {
        position: absolute;
        top: 10px;
        right: 10px;
        font-weight: 600;
        color: black;
    }
    .card-title {
        text-align: center;
        font-size: 1.76rem;
        margin-bottom: 12px;
    }
    .card-subtitle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 1.28rem;
        margin-bottom: 10px!important;
    }
    .card_action {
        color: black;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
    }
    .card_action:hover {
        text-decoration: underline;
    }
    .container-form {
        margin: 0 auto;
        width: 100%;
    }
    .form-row {
        display: flex;
        margin: 12px 0px;
        gap: 12px;
        flex-wrap: wrap;
    }
    #identity {
        flex-direction: column;
        align-items: flex-start;
    }
    .error-message {
        font-size: 12px;
        margin-top: 0;
        margin-bottom: 0;
        line-height: 25px;
    }
    .form-row label {
        display: block;
        color: black;
        font-size: 1.44rem;
        text-align: start!important;
    }
    .form-row_input {
        display: block;
        width: 100%;
        height: 30px;
        padding: 5px 0;
        border: none;
        background:none;
        border-bottom: 2px solid black;
        outline-color: #d1515a;
        font-weight: 500;
        font-size: 16px;
    }
    .form-row_input#email::placeholder, .form-row_input#password::placeholder {
        color:#797777!important;
        font-size: 1.44rem;
    }
    .btn {
        background-color: #243653;
        box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
        border-radius: 3px;
        color: white;
        outline: none;
        border: none;
        position: relative;
        margin: 0 auto;
        font-size: 1.44rem;
        width: auto;
    }
    .btn:hover  {
        background-color:#d1515a!important;
        color: white;
        top: 2px;
    }

    /* Ecrans tablette et plus */
    @media (min-width: 768px) {
        #bloc-login {
            width: 80%;
        }
        .login {
            padding: 30px;
        }
        .btn-login {
            font-size: 15px;
        }
        .card-title {
            font-size: 2.24rem;
        }
        .card-subtitle {
            display: flex;
            flex-direction: row;
            justify-content: center;
            font-size: 15px;
            margin-bottom: 10px!important;
        }
        .form-row_input {
            display: block;
            width: 100%;
            height: 45px;
            padding: 5px 0px;
            border: none;
            background:none;
            border-bottom: 2px solid black;
            outline-color: #d1515a;
            font-weight: 500;
            font-size: 16px;
        }
        .form-row_input#email::placeholder, .form-row_input#password::placeholder {
            color:#797777!important;
            font-size: 1.44rem;
        }
    }

</style>   