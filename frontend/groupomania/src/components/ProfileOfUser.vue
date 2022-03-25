<template>

  <div>

    <section class="container-card-profile" >

      <!-- Informations user -->
      <div class="card-profile">
      
        <h1 class="card-title">{{ fullName }} </h1>

        <div><hr></div>

        <div  id="infos-profile" :class="userInfos">

          <div class="images">
            <h2 class="infos-title" id="profilePicture">Photo de profil:</h2>

            <div class="container-img">
              <img class="img" alt="photo de profil" :src= userInfos.avatar>
            </div>
          </div>

          <div class="infos">
            <h2 class="infos-title"> E-mail:</h2>
            <p>{{ userInfos.email }} </p>
            <h2 class="infos-title"> À propos:</h2>
            <p>{{ userInfos.bio }} </p>
          </div>

        </div>

        <div><hr></div>

        <div class="profilEdit-btn" role="button" aria-label="Modifier mon profil">
          <router-link to="/ProfileEdit" class="btn">
            Modifier mon Profil
          </router-link>
        </div>

      </div>
    
    </section>

    <!-- Posts de l'utilisateur -->
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
import { mapGetters, mapState, mapActions } from "vuex"

export default {
  name: 'ProfileOfUser',
  components: {
    Posts
  },
  data() {
    return { 
      info : '',
      postsProfile: [],
      profileModified: false
    }
  },
  beforeCreate() {
    console.log('verif status depuis profil');
    if(this.$store.state.user.userId == -1) { // = déconnecté
    this.$router.push('/Connexion'); // --> rebascule vers login 
    return;
    } 
  },
  computed: {
    ...mapGetters(["fullName"]),
    ...mapState(["user", "userInfos"])
  },
  methods: {
    ...mapActions(["isUserConnected", "getUserInfos"]),
  
    /**
    * @description Cette fonction raffraîchit la liste de posts
    */
    refreshPosts() {
      this.postsProfile = []
    },

    /**
    * @description Cette fonction récupère la liste des posts de l'tuilisateur et les envoie dans  *               'postsProfile' 
    */
    getPostsOfOneUser() {
      let user = this.user;
      let userId = user.userId;

      axios({
        method: "get",
        url: `http://localhost:3000/api/post/user/${userId}`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        this.postsProfile.push(...response.data.posts)
      })
      .catch(error => {if(error.response) { console.log(error.response) }})
    }
  },
  created() {
    this.isUserConnected()
    this.getUserInfos()
    this.getPostsOfOneUser()
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
  padding-top:100px;
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
.infos {
  padding:10px;
  margin-top: 10px;
  text-align: center;
  font-size: 1.44rem;
}
.profilEdit-btn {
  display: flex;
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
.btn:hover {
  color: black;
  font-weight: 500;
  border: none;
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
}
</style>