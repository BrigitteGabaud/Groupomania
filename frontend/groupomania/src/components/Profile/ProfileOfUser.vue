<template>
  <main>
    <section class="container-profile" >

    <div class="profile card">
    
      <h1 class="card-title">Mon profile</h1>
      <div :class="userInfos">
        <p >{{ firstname }} </p>
        <p>{{ lastname }} </p>
        <p>{{ email }} </p>
        <p>{{ password }} </p>
        <p>{{ role }} </p>
        <p>{{ bio }} </p>
        <img src="avatar">{{ avatar }} 
        
      </div>

      <div @click="logout" class="btn btn-primary"> Déconnexion</div>

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
          password: '',
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
    beforeMount(){
            
       /*      //Init
            const userStorageToken = this.$store.state.user.token
            console.log('userStorageToken', userStorageToken); */

            
           // const axios = require('axios')
           // const { DateTime } = require("luxon");
           // let currentLocaleDate = dt.setLocale('fr').toLocaleString(DateTime.DATETIME_FULL);
            
            //Fill in the data
            /* this.role = userStorage.roleId
            this.user_id = userStorage.id
            let creator_id = this.$route.params.id
            axios.get(`http://localhost:3000/api/post/user/${creator_id}`, {
                headers:{
                    'Authorization' : `Token ${userStorage.token}`
                }
            })
            .then(user_posts => {
                this.user = user_posts.data
                this.user.posts.forEach((post) => {
                    let commentsCount = 0
                    post.date = moment(post.date).format('Do MMMM YYYY à HH:mm')
                    post.comments.forEach((comment) => {
                        comment.date = moment(comment.date).format('DD/MM/YY à HH:mm')
                        commentsCount ++
                    })
                    post.commentsNum = commentsCount
                })
            })
            .catch(error => {
                alert(`Quelque chose c'est mal passé. Essayez à nouveau ${error}`)
            }); */
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
            this.password = res.data.password,
            this.role = res.data.role,
            this.bio = res.data.bio,
            this.avatar = res.data.avatar,
            this.createdAt = res.data.createdAt,
            this.updatedAt = res.data.updatedAt

          })
      },
      logout: function() {
        this.$store.commit('logout');
        this.$router.push('/Connexion');
      }
    },
    mounted(){

      this.getInfosOfUser()
     /*function() { //= quand vue est affichée
      console.log('state user depuis GetOneUser' ,this.$store.state.user);
      if(this.$store.state.userId == -1) { // = déconnecté
      this.$router.push('/Login'); // --> rebascule vers login + affiche erreur
      return;
      }*/
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