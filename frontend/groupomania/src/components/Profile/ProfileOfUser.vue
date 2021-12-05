<template>
  <div class="bloc-profile" >

    <div class="profile card">
    
      <h1 class="card-title">Mon profile</h1>
      <div class="button"> Déconnexion</div>

    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ProfileOfUser',
    data: function() {
      return { 
        mode: 'login', 
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      }
    },
    //props: ['revele', 'toggleProfile'],
    methods: {
      getOneUser: function() {
        let user = sessionStorage.getItem('user');
        console.log('user local storage' ,user);
        user = JSON.parse(user);
        let userId = user.userId;

        const userProfile = {
          firstname:this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          role: this.role,
          avatar: this.avatar,
          bio: this.bio
        }
        axios
          .get(`http://localhost:3000/api/user/${userId}`, userProfile)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error.message)
          })
      }
    }

    /*mounted: function() { //= quand vue est affichée
      console.log('state user depuis GetOneUser' ,this.$store.state.user);
      if(this.$store.state.userId == -1) { // = déconnecté
      this.$router.push('/Login'); // --> rebascule vers login + affiche erreur
      return;
      }
      this.$store.dispatch('getUserInfos'); // récupère infos user
    }*/
}
</script>

<style scopped>
    .bloc-profile {
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
    .profile {
        background: #f1f1f1;
        color: #333;
        padding: 50px;
        position: fixed;
    }
    .btn-profile {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .card-title {
        display: flex;
        justify-content: center;
    }
</style>