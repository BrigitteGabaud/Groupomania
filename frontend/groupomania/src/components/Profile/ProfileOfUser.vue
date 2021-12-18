<template>
  <main>
    <section class="container-profile" >

      <div class="profile card">
      
        <h1 class="card-title">Mon profil</h1>
        <div :class="userInfos">
          <p>{{ firstname }} </p>
          <p>{{ lastname }} </p>
          <p>{{ email }} </p>
          <p>{{ role }} </p>
          <p>{{ bio }} </p>
          <img :src= avatar>
          
        </div>

      </div>

    </section>
  </main>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ProfileOfUser',

    data() {
      return { 
        userInfos:{
          id :'',
          firstname:'',
          lastname: '',
          email: '',
          role: '',
          avatar: '',
          bio: '',
          createdAt: '',
          updatedAt: ''
        }
      }
    },
    beforeCreate() {
     console.log('state user depuis GetOneUser' , this.$store.state.user.userId);
      if(this.$store.state.user.userId == -1) { // = déconnecté
      this.$router.push('/Connexion'); // --> rebascule vers login + affiche erreur
      
      return;
      } 
    },
    
    methods: {
      getInfosOfUser: function() {
        let user = sessionStorage.getItem('user');
        console.log('user local storage' ,user);
        user = JSON.parse(user);
        let userId = user.userId;
        console.log('userId', userId);
        
          return axios
          .get(`http://localhost:3000/api/user/` +`${userId}`)
          .then((res) => {
            console.log(this.userInfos = res.data); 
            this.firstname = res.data.firstname ,
            this.lastname = res.data.lastname,
            this.email = res.data.email,
            this.role = res.data.role,
            this.bio = res.data.bio,
            this.avatar = res.data.avatar,
            this.createdAt = res.data.createdAt,
            this.updatedAt = res.data.updatedAt
          })
      },
      
    },
    mounted(){
      this.getInfosOfUser()

    }
}
</script>

<style scoped>
    .container-profile {
        margin-top:150px;
        width: 100%;
        height: 100;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .profile {
        background: #f1f1f1;
        color: #333;
        padding: 50px;
        
    }
    .card-title {
        display: flex;
        justify-content: center;
    }
    .btn  {
       justify-content: center;
        top: 10px;
        right: 10px;
    }
</style>