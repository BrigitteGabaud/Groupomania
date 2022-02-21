<template>

  <div class="background-image" alt='Salle de pause'>

    <section class="container-card-profile" >

      <div class="card-profile">
      
        <h2 class="card-title">{{ firstname }} {{ lastname }} </h2>

        <div><hr></div>

        <div  id="infos-profile" :class="userInfos">

          <div class="images">
            <h6>Photo de profil:</h6>

            <div class="container-img">
              <img class="img" :src= avatar>
            </div>
          </div>

          <div class="infos">
            <h5> E-mail:</h5>
            <p>{{ email }} </p>
            <h5> Description:</h5>
            <p>{{ bio }} </p>
            <p>{{ role }} </p>
          </div>
          
        </div>

      </div>
    
    </section>

  </div>
  
</template>

<script>
import axios from 'axios'



export default {
    name: 'ProfileOfUser',
  computed: {
    
  },
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
    //  console.log('state user depuis GetOneUser' , this.$store.state.user.userId);
    //   if(this.$store.state.user.userId == -1) { // = déconnecté
    //   this.$router.push('/Connexion'); // --> rebascule vers login + affiche erreur
      
    //   return;
    //   } 
    },
    
    methods: {
      getInfosOfUser: function() {
        let user = sessionStorage.getItem('user');
        console.log('user local storage' ,user);
        user = JSON.parse(user);
        console.log(user);
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
  width: 100%;
  height: auto;
}
.background-image {
  background-color: #1D1B1E;
  background-image: url("../../assets/break_room.jpg");
  background-size: cover;
  width: 100%;
  height: 100vh;
} 
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
  width: 70%;
  height: auto;
  background-color: rgba(193,178,175, 0.90);
  box-shadow: 0 0 10px 3px rgba(0,0,0,0.9);
  padding: 15px 10px;
  border-radius: 0.25rem;
}
.card-title {
  display: flex;
  justify-content: center;
  font-size: 1.1rem;
}
#infos-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.images {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.container-img {
  width: 80px;
  height: 80px;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.9);
  flex-shrink: 0!important;
}
.img {
  width: 100%;
  height: 100%;
  border-radius: 3px!important;
  
}
.infos {
  padding:10px;
  margin-top: 10px;
  text-align: center;
  font-size: 0.9rem;
}
h5 {
  font-size: 1rem;
}
.btn  {
  justify-content: center;
  top: 10px;
  right: 10px;
}

/* Ecrans tablette et plus */
@media (min-width: 768px) {
  .card-profile {
    max-width: 500px;
  }
  .card-title {
    font-size: 1.3rem;
  }
  #infos-profile {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  h6 {
    margin-bottom: 10px;
  }
  .container-img {
    width: 120px;
    height: auto;
    /* margin:  10px 10px 10px 50px; */
  }
  .img {
    width: 100%;
    height: 100%;
    border-radius: 3px!important;
    
  }
  .infos {
    padding:10px;
    margin-right: 50px;

  }
  .btn  {
    justify-content: center;
    top: 10px;
    right: 10px;
  }
}
</style>