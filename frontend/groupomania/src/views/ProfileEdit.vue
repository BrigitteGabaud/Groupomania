<template>

  <div class="container-card-profile">

    <div class="card-profile">

      <h1>Modifier mon profil</h1>

      <p class="info" v-if="info !== ''">{{ info }}</p>

      <form>

        <!-- Nouveau Prénom -->
        <div class="mb-3">
          <label for="firstname" class="form-label">Prénom:</label>
          <input type="text" class="form-control" id="firstname" :value="userInfos.firstname">
        </div>

        <!-- Nouveau nom -->
        <div class="mb-3">
          <label for="lastname" class="form-label">Nom:</label>
          <input type="text" class="form-control" id="lastname" :value="userInfos.lastname">
        </div>

        <!-- Nouvel email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input type="text" class="form-control" id="email" :value="userInfos.email">
        </div>

        <!-- Nouvelle biographie -->
        <div class="mb-3">
          <label for="bio" class="form-label">À propos:</label>
          <input 
            type="text" 
            class="form-control" 
            id="bio" 
            placeholder="Veuillez renseigner ce champ" 
            :value="userInfos.bio">
        </div>

        <!--  Nouvelle photo -->
        <div class="mb-3" id="card-profile--file-button">
          <p class="card-profile--avatar-title">Nouvelle photo de profil: </p>

          <label 
            for="avatar" 
            class="form-label" 
            id="avatar-label" 
            aria-label="Nouvelle photo de profil"
            title="Choisir une nouvelle photo de profil" ><fa icon= 'image'/>
          </label> 

          <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg, image/jpg">
        </div>

        <div class="card-profil--buttons">

          <button @click="modifyUser" type="button" class="btn" id="modifyUser" aria-label="Valider mon nouveau profil">Valider</button>

          <button @click="deleteUser" type="button" class="btn" id="deleteUser" title="Supprimer mon profil"><fa icon='trash'/></button>

        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios' 
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'ProfilEdit',
  data() {
    return {
      info: ""
    }
  },
  computed: {
    ...mapState(["user", "userInfos"]),
    ...mapMutations(['LOGOUT'])
  },
  methods: {
    ...mapActions(["getUserInfos"]),

    /**
    * @description Cette fonction modifie le profil de l'utilisateur
    */
    modifyUser() {
      let user = JSON.parse(localStorage.getItem('user'));
      let userId = user.userId

      const formData = new FormData()
      
      formData.set("firstname", document.getElementById("firstname").value)
      
      formData.set("lastname", document.getElementById("lastname").value)

      formData.set("email", document.getElementById("email").value)

      formData.set("bio", document.getElementById("bio").value)

      if(document.getElementById("avatar").value !== "") {
        formData.set("image", document.getElementById("avatar").files[0])
      }
      axios({
        method: "put",
        url: `http://localhost:3000/api/user/${userId}`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        },
        data: formData
      })
      .then(response => { 
        this.info = `${response.data.message}`
        this.$router.push({ name: "Profile" })
      })
      .catch(error => { if(error.response) {console.log( this.info = error.response.data)}});
    },

    /**
    * @description Cette fonction récupère les informations de l'utilisateur et le supprime
    */
    deleteUser() {
      let user = this.user;
      let userId = user.userId;

      axios({
        method: "delete",
        url: `http://localhost:3000/api/user/${userId}`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        this.info = `${response.data.message}`
        localStorage.removeItem('user')
        this.$store.commit('LOGOUT');
        this.$router.push('/Connexion')
      })
      .catch(error => {if(error.response) {this.info = error.response.data.error}})
    }
  },
  created() {
    this.getUserInfos()
  }
}

</script>

<style scoped>
.container-card-profile {
  position: relative;
  padding-top:150px;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  margin: 0!important;
}
.card-profile {
  display: flex;
  flex-direction: column;
  width: 80%;
  height: auto;
  background-color: rgb(193,178,175);
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.9);
  padding: 15px 10px;
  border-radius: 0.4rem;
  margin-bottom: 50px;
}
h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 15px;
}
.form-label, .card-profile--avatar-title {
  font-size: 1.40rem;
  font-weight: 500;
}
.form-control {
  font-size: 1.20rem;
}
#avatar {
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  position: absolute;
}
#avatar-label {
  position: relative;
  width: 60px;
  height: 25px;
  border-radius: 3px!important;
  background: #fff;
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform .2s ease-out;
  margin-bottom: 15px;
}
.card-profil--buttons {
  display: flex;
  justify-content: flex-end;
}
.btn {
  width: fit-content;
  background-color:#243653!important;
  color: white;
  font-size: 1.40rem;
}
#modifyUser:hover {
  background-color: green!important;
  color: white;
  font-weight: 500;
}
#deleteUser:hover {
  background-color: red!important;
  color: white;
}
/* Ecrans tablette et plus */
@media (min-width: 768px) {
  .card-profile {
    width: 60%;
  }
}
/* Ecrans ordinateur et plus */
@media (min-width: 1024px) {
  .card-profile {
    width: 40%;
  }
}
</style>

