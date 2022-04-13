<template>

  <div class="comment-container">
    
    <div class=comment>

      <!-- Informations user: photo, identité, date de publication -->
      <div class="container-avatar">
        <img class="img" alt="Photo de profil" :src= commentUser.avatar>
      </div>

      <div class="comment-infos">

        <div class="comment-infos--name-date">

          <div class="comment-infos--fullName">
            <p><strong>{{ fullName }}</strong></p>
          </div>

          <div class="comment-infos--date">
            <p>le {{ dateToLocale(commentDate) }}</p>
          </div>
      
        </div>

        <!-- Contenu du commentaire  non modifié-->
        <p v-show="commentModified == false" class="comment-content">{{ content }}</p>

      </div>

      <!-- Paramètres user ou admin -->
      <div class='container-buttons'>

        <a 
          v-if="commentUserId == user.userId && commentModified == false "
          @click="commentModified = true"
          type="submit" 
          alt="Modifier le commentaire"
          title="Modifier">
          <fa icon='edit'/>
        </a>

        <a v-if="commentUserId == user.userId || user.userRole == 'admin' "  
          @click='deleteComment(commentId)'  
          type="submit" 
          alt="Supprimer le commentaire"
          title="Supprimer">
          <fa icon='trash'/>
        </a>
            
      </div>

    </div>

    <!-- Contenu du commentaire modifié -->
    <div v-show="commentModified" class="comment-modify">

      <label for="commentContentModified" class="visuallyhidden">Ajoutez votre nouveau texte ici</label>
      <textarea
        :id="'commentContentModified' + [[ commentId ]]"
        type="text" 
        class="form-control"
        placeholder="Ajoutez votre nouveau texte ici."
        name='commentContentModified' 
        v-model="commentContent">
      </textarea><br>

      <button 
        @click="modifyComment(commentId)"
        type="submit" 
        class="btn btn-input" 
        :class="{'btn-outline disabled' : !validatedFields}"
        aria-label="Publier un nouveau commentaire">
        <fa icon= 'paper-plane'/>
      </button>

    </div>

  </div>

</template>

<script>
import axios from 'axios'
import { mapState, mapGetters } from 'vuex'

export default {
  name:"Comments",
  props: ['userLoggedIn','commentId', 'commentUserId', 'commentPostId', 'content', 'commentDate', 'getAllComments', 'refreshComments'],
  data() {
    return {
      commentContent: "",
      user: {},
      commentUser:"",
      commentModified: false
    }
  },
  computed: {
    ...mapState([ "userInfos" ]),
    ...mapGetters(["fullName"]),

    validatedFields: function() {
      if (this.commentContent != "") {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    
    /** 
     * @description Cette fonction appelle l'API, modifie le post concerné puis réinitialise la liste des posts et l'affiche
     */
    modifyComment(commentId) {

      axios({
        method: "put",
        url:`http://localhost:3000/api/comment/${commentId}`,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
         data: {content: this.commentContent}
      })
      .then(() => {
        this.commentModified == false
        this.refreshComments()
      })
      .catch(error => { if(error.response) { console.log(error.response) }})
    },

    /** 
     * @description Cette fonction appelle l'API supprime le post concerné puis réinitialise le liste des posts et l'affiche
     */
    deleteComment(commentId) {
      axios({
        method: "delete",
        url: `http://localhost:3000/api/comment/${commentId}`,
        headers: {
          Authorization:  `Bearer ${localStorage.getItem("token")}` 
        }
      })
      .then(() => {
        this.refreshComments()
      })
    },

    /** 
    * @description Cette fonction convertit la date de création du post en format local
    */
    dateToLocale(date) {

    return new Date(date).toLocaleString('fr', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' });
    },

    /** 
     * @description Cette fonction récupère l'user dans le local storage
     */
    getUserInStorage() {
      let user = localStorage.getItem('user');
      
      if(user) {
          this.user = JSON.parse(user);
      }
    },
  },
  created() {
    /** 
     * @description Cette fonction récupère les informations du user
     */
    axios({
      method: "get",
      url: `http://localhost:3000/api/user/${this.commentUserId} `,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then((response) => {
        this.commentUser = response.data
    })
    .catch(error => { if (error.response) { console.log(error.response) }})
  },
  mounted() {
    this.getUserInStorage()
    this.commentContent = this.content
  }

}
</script>

<style scoped>
.comment-container {
  margin-bottom: 10px;
}
.comment {
  display: flex;
}
.container-avatar {
  width: 50px;
}
img {
  border-radius: 50%;
  margin-bottom: 5px;
}
.comment-infos {
  display: flex;
  flex-direction: column;
}
.comment-infos--name-date {
  display: flex;
  height: 2.3rem;
}
.comment-infos--fullName {
  display: flex;
  padding: 5px;
}
.comment-infos--date {
  padding: 5px;
  font-style: italic;
}
.comment-content{
  margin-left: 5px;
}
.comment-modify {
  display: flex;
}
.form-control {
  border: 1px solid #d1515ae6;
}
.btn-input {
  width: 30px;
  height: 46px!important;
  background-color: #d1515ae6;
  color: white;
  outline: none;
  border: none;
  position: relative;
  margin-right: 5px;
  padding: 1px;
  text-align: center;
  border-radius: 0 3px 3px 0!important;
  box-shadow: none;
  margin-top: 0!important;
  transition: none;
}
.svg-inline--fa .fa-paper-plane .fa-w-16 {
  color: white;
}
.container-buttons {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 10px;
}
.container-buttons a {
  padding: 4px  2px 0 5px;
}
/* .svg-inline--fa {
  color: #243653
} */
.svg-inline--fa.fa-edit:hover {
  color: green;
}
.svg-inline--fa.fa-trash:hover {
  color: red;
}

/* Ecrans ordinateur et plus */
@media (min-width: 1024px) {
  .comment-infos {
    font-size: 1.3rem;
  }
  .svg-inline--fa {
    width: 15px;
    height: 15px;
  }
}
</style>