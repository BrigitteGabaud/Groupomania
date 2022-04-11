<template>

    <div>

        <section class="card">
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
        </section>
    </div>

</template>

<script>
import { mapState } from 'vuex' 

export default {
    name: "Connexion",
    data: function() {
        return {
            mode: 'login', 
            firstname: '',
            lastname: '',
            email: '',
            password: ''
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
        login: function () {
           try {
                const self = this;
            this.$store.dispatch('login', {
                email: this.email,
                password: this.password,
            }).then(function() {
                console.log('in login?');
                self.$router.push('/Profile');
            }, function(error) {
                console.log(error);
            })
           } catch {
               console.log("ERROR");
           }
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
                //self.switchToLogin(); // redirige vers fenêtre login
                self.login()
            }).catch(function(error) {
                console.log(error)
            })
        }
    }
}
</script>

<style scoped>
.card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #c1b2af;
    opacity: 0.95;
    text-align: center;
    padding: 15px 9px;
    box-shadow: 3px 3px 5px 0 rgba(0,0,0,0.9);
}
.card-title {
    text-align: center;
    font-size: 1.60rem;
    margin-bottom: 12px;
}
.card-subtitle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.10rem;
    margin-bottom: 10px!important;
    font-style: italic;
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
    flex-wrap: wrap;
}
label {
    font-size: 1.25rem;
}
.form-row_input {
    display: block;
    width: 100%;
    height: 30px;
    padding: 5px 0;
    border: none;
    background:none;
    border-bottom: 1px solid black;
    outline-color: #d1515a;
    font-style: italic;
    font-size: 1.25rem;
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
    .card {
        max-width: 40%;
    }
    h1 {
        font-size: 1.44rem;
        font-weight: 500;
    }
}

/* Ecrans ordinateur */
@media (min-width: 1024px) {
    .card {
        max-width: 40%;
        height: 100px;
    }
    h1 {
        font-size: 1.80rem;
    }
}

/* Ecrans larges */
@media (min-width: 1440px) {
    .card {
        max-width: 25%;
    }
    h1 {
        font-size: 2rem;
    }
}

</style>