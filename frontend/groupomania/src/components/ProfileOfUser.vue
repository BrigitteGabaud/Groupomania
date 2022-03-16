<template>

  <div>

    <section class="container-card-profile" >

      <div class="card-profile">
      
        <h1 class="card-title">{{ fullName }} </h1>

        <div><hr></div>

        <p class="info" v-if="info !== ''">{{ info }}</p>

        <div  id="infos-profile" :class="userInfos">

          <div class="images">
            <h2 class="infos-title" id="profilePicture">Photo de profil:</h2>

            <div class="container-img">
              <img class="img" :src= avatar>
              <button @onclick="modifyProfileImage" type="button" class="imageModify--button">Changer ma photo de profil</button>
            </div>
          </div>

          <div class="infos">
            <h2 class="infos-title"> E-mail:</h2>
            <p>{{ email }} </p>
            <h2 class="infos-title"> À propos:</h2>
            <p>{{ bio }} </p>
          </div>

        </div>

        <div><hr></div>

        <button class="btn" @click="deleteUser" type="button" alt="Supprimer mon profil" title="Supprimer mon profil">
          <fa icon='trash'/>
        </button>

      </div>
    
    </section>

    <div class="container-posts">

      <Posts
        v-for="post in postsProfile"
        :key="post.id" 
        :postId="post.id"
        :postUserId="post.userId"
        :content="post.content"
        :postImage="post.image"
        :postDate="post.createdAt"
        :getAllPosts="getAllPosts"
        :refreshPost="refreshPost"
      />

    </div>

  </div>

</template>

<script>
import axios from 'axios'
import Posts from "./Posts.vue"
import { mapGetters } from "vuex"

export default {
  name: 'ProfileOfUser',
  components: {
    Posts
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
      },
      info : '',
      postsProfile: []
    }
  },
  beforeCreate() {
    console.log('state user depuis GetOneUser' , this.$store.state.user.userId);
    if(this.$store.state.user.userId == -1) { // = déconnecté
    this.$router.push('/Connexion'); // --> rebascule vers login + affiche erreur
    
    return;
    } 
  },
  computed: {
    ...mapGetters(["fullName"])
  },
  methods: {
    getInfosOfUser() {
      let user = localStorage.getItem('user');
      console.log('user local storage' ,user);
      user = JSON.parse(user);
      console.log(user);
      let userId = user.userId;
      console.log('userId', userId);
      
        return axios
        .get(`http://localhost:3000/api/user/${userId}`)
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

    /**
     * @description Cette fonction raffraîchit la liste de posts
     */
    refreshPosts() {
      this.postsProfile = []
    },

    getPostsOfOneUser() {
      let user = localStorage.getItem('user');
      console.log('user local storage' ,user);
      user = JSON.parse(user);
      console.log(user);
      let userId = user.userId;
      console.log('userId', userId);

      axios({
        method: "get",
        url: `http://localhost:3000/api/post/user/${userId}`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      .then(response => {
        console.log('RESPONSE', response.data.posts);
        this.postsProfile.push(...response.data.posts)
      })
      .catch(error => {if(error.response) {this.info = error.response.data.error}})
    },

    deleteUser() {
      let user = localStorage.getItem('user');
      console.log('user local storage' ,user);
      user = JSON.parse(user);
      console.log(user);
      let userId = user.userId;
      console.log('userId', userId);

      axios({
        method: "delete",
        url: `http://localhost:3000/api/user/${userId}`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        this.info = `${response.data.message}`
        setTimeout(() => this.$router.push('/Connexion'), 1000)
      })
      .catch(error => {if(error.response) {this.info = error.response.data.error}})
    }
    
  },
  created() {
    //this.isUserConnected()
    this.getPostsOfOneUser()
  },
  mounted(){
    this.getInfosOfUser()
  
  }
}
</script>

<style scoped>
.container-profile {
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
  display: flex;
  flex-direction: column;
  width: 80%;
  height: auto;
  background-color: rgba(193,178,175, 0.90);
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.9);
  padding: 15px 10px;
  border-radius: 0.4rem;
  margin-bottom: 50px;
}
.card-title {
  display: flex;
  justify-content: center;
  font-size: 1.90rem;
  font-weight: 700;
}
#infos-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
}
.infos-title {
  font-size: 1.44rem;
  font-weight: 700;
}
#profilePicture {
  margin-bottom: 10px;
}
.images {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.container-img {
  width: 150px;
  height: auto;
  box-shadow: 3px 3px 5px 0 #494949;
  flex-shrink: 0!important;
}
.img {
  width: auto;
  height: auto;
  border-radius: 3px!important;
}
.imageModify--button {
  text-align: center;
  font-weight: 400;
  font-style: italic;
  padding: 4px;
  border: none;
  background-color: rgba(193,178,175, 0.90) ;
  width: 100%;
}
.imageModify--button:hover{
   background-color:#d1515a!important;
    color: white;
}
.infos {
  padding:10px;
  margin-top: 10px;
  text-align: center;
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
  font-size: 1.20rem;
  width: auto;
}
.svg-inline--fa.fa-trash:hover {
  color: red;
}

/* Ecrans tablette et plus */
@media (min-width: 768px) {
  .card-profile {
    max-width: 500px;
    padding: 20px;
  }
  .card-title {
    font-size: 2.08rem;
  }
  #infos-profile {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
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
  /* .btn  {
    justify-content: center;
    top: 10px;
    right: 10px;
  } */
}
</style>