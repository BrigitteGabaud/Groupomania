<template>

    <div class="card">

        <!-- Informations user: photo, identité, date de publication -->
        <div class="publication-infos">

            <div class="container-avatar">
                <img class="avatar" alt="Photo de profil" :src= postUser.avatar>
            </div>

            <div class="publication-infos--name-date">
                 
                <div class="publication-infos--fullName">
                    <p><strong>{{ postUser.firstname }}</strong></p>
                    <p><strong>{{ postUser.lastname }}</strong></p>
                </div>
                <p class="publication-date">Publié le {{ dateToLocale(postDate) }}</p>

            </div>
             
        </div>    

        <!-- Contenu du post non modifié -->
        <div  v-show="postModified == false && postImage !== null" class="container-post--image">
            <img :src= "postImage" alt="Image du post">
        </div>
        
        <p v-show="postModified == false" class="post-content">{{ content }}</p>
        
        <!-- Commentaires -->
        <div v-show="postModified == false">

            <button 
                @click="displayOrNotComments"
                type="button"
                role="button"
                class="displayOrNotComments--Button"
                alt="Afficher les commentaires"
                title="Afficher les commentaires">
                    <span>Commentaires</span>
            </button>

        </div>

        <div v-show="displayComments && postModified == false">

            <Comments
                v-for="comment in commentsList"
                :key="comment.id"
                :commentId="comment.id"
                :commentUserId='comment.userId'
                :commentPostId='comment.postId'
                :content="comment.content"
                :commentDate="comment.createdAt"
                :getAllCommentsOfAPost="getAllCommentsOfAPost"
                :refreshComments="refreshComments"
            />
            
            <label for="'post-input--comment' + [[ postId]]" class="visuallyhidden">Votre commentaire</label>

            <div class="post-input">

                <textarea 
                    type="text" 
                    class="post-input--comment " 
                    :id="'post-input--comment' + [[ postId]]"
                    placeholder="Votre commentaire" 
                    aria-label="Votre commentaire"
                    v-model="commentContent">
                </textarea><br>

                <button 
                    @click="createComment(commentPostId)"
                    type="submit" 
                    role="button"
                    class="btn btn-input"
                    :class="{'btn-outline disabled' : !validatedFields}"
                    aria-label="Publier le commentaire">
                    <fa icon='comment-dots'/>
                </button>
                
            </div>
            
        </div>

        <!-- Contenu du post modifié -->
        <div v-show="postModified" class="post-modify">
            
            <label for="postContentModified" class="visuallyhidden">Ajoutez votre nouveau texte ici</label>

            <textarea
                type="text" 
                class="form-control"
                :id="'postContentModified' + [[ postId ]]"
                name='postContentModified' 
                :value="content"
                placeholder="Ajoutez votre nouveau texte ici."
                aria-label="Ajoutez votre nouveau texte ici">
            </textarea><br>
            
            <div  class="post-modify--buttons" >

                <input
                    type="file" 
                    class="file"
                    :id="'file' + [[ postId ]]"
                    name="file" 
                    aria-label="Nouvelle image à joindre au post"
                    tableindex="-1" 
                    accept="image/*">

                <label :for="'file' + [[ postId ]]" alt="Nouvelle image à joindre au post" 
                aria-label="Nouvelle image à joindre au post"
                ><fa icon= 'image'/><span class="visually-hidden">Image</span> </label>
                
                <button 
                    @click="modifyPost(postId)"
                    type="submit" 
                    class="button" 
                    :class="{'btn-outline disabled' : !validatedFields}"
                    aria-label="Publier un nouveau post">
                    <fa icon= 'paper-plane'/>
                </button>

            </div>

        </div>
        
        <!-- Paramètres user ou admin -->
        <div class='paramsUserOrAdmin'>

            <a 
                v-if="postUserId == user.userId && postModified == false "
                @click="postModified = true"
                type="submit" 
                class="modifyPost"
                alt="Modifier le post"
                title="Modifier">
                <fa icon='edit'/>
            </a>

            <a 
                v-if="postUserId == user.userId || user.userRole == 'admin' "  
                @click='deletePost(postId)'  
                type="submit" 
                class="deletePost"
                alt="Supprimer le post"
                title="Supprimer">
                <fa icon='trash'/>
            </a>
            
        </div>
        
    </div>

</template>

<script>
    import axios from 'axios' 
    import Comments from './Comments.vue'
    import { mapState, mapActions } from 'vuex'

    export default {
        name: "PostsList",
        props: [ 'postId', 'postUserId', 'content', 'postImage', 'postDate', 'getAllPosts', 'refreshPost'],
        components: {
            Comments
        },
        data() {
            return{
                el: 'body',
                //userLoggedIn: localStorage.getItem("userId"),
                user: {},
                postUser: "",
                commentsList: [],
                postModified: false,
                displayComments: false,
            }
        },
        computed: {
            ...mapState(['userInfos']),

            /** 
            * @description Cette fonction vérifie si les champs sont remplis
            */
            validatedFields() {
                if (this.content != "") {
                    return true;
                } else {
                    return false;
                }
            },
        },
        methods: {
            ...mapActions(['isUserConnected', "getUserInfos"]),
           
            /** 
             * @description Cette fonction appelle l'API, modifie le post concerné puis réinitialise la liste des posts et l'affiche
             */
            modifyPost(postId) {
                const formData = new FormData()
                let file = document.getElementById(`file${postId}`)
                console.log('file', file);
                formData.set("content", document.getElementById(`postContentModified${postId}`).value)

                if(file.value !== "") {
                    formData.set("image", file.files[0])
                }

                axios({
                    method: "put",
                    url:`http://localhost:3000/api/post/${postId}`,
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                    data: formData
                })
                .then(() => {
                    this.postModified == false
                    this.refreshPost()
                })
                .catch(error => { if(error.response) { console.log(error.response) }})
            },

            /** 
             * @description Cette fonction appelle l'API supprime le post concerné puis réinitialise le liste des posts et l'affiche
             */
            deletePost(postId) {
                axios({
                    method: "delete",
                    url: `http://localhost:3000/api/post/${postId}`,
                    headers: {
                        Authorization:  `Bearer ${localStorage.getItem("token")}` 
                    }
                })
                .then(() => {
                    this.refreshPost()
                })
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

            /** 
             * @description Cette fonction convertit la date de création du post en format local
             */
            dateToLocale(date) {
                return new Date(date).toLocaleString('fr', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' });
            },
            
            /********************************************* COMMENTS ***********************************/
            /** 
            * @description Cette fonction affiche ou non la section des commentaires
            */
            displayOrNotComments() {
              if(this.displayComments == false) {
                this.displayComments = true
              } else if (this.displayComments) {
                this.displayComments = false
              }
            },

            /** 
            * @description Cette fonction appelle l'API pour récupérer tous les commentaires d'un post 
            */
            getAllCommentsOfAPost() {

                axios({
                    method:"get",
                    url: `http://localhost:3000/api/comment/${this.postId}`,
                    headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                .then(response => {
                    for (let i in response.data) {
                        this.commentsList.push(response.data[i])
                    } 
                })
                .catch(error => { if(error.response) { console.log(error.response.data.error) }})
            },

            /**
            * @description Cette fonction raffraîchit la liste de commentaires
            */
            refreshComments() {
                this.commentsList = []
                this.getAllCommentsOfAPost()
            },

            /** 
            * @description Cette fonction appelle l'API et crée un commentaire
            */
            createComment() {
                
                axios({
                    method: "post",
                    url:`http://localhost:3000/api/comment/${this.postId}`,
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    data: {content: this.commentContent}
                })
                .then(() => {
                    //this.isUserConnected()
                    this.refreshComments();
                    this.commentContent = ""
                })
                .catch(error => { if(error.response) { console.log(error.response) }})
            }, 
        },

        /** 
        * @description Cette fonction appelle l'API pour récupérer les infos du user créant le post (photo profile / nom) et les stocke dans les datas
        */
        created() {
            //this.isUserConnected()

            axios({
                method: "get",
                url: `http://localhost:3000/api/user/${this.postUserId} `,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                this.postUser = response.data
                this.getAllCommentsOfAPost()
            })
            .catch(error => { if (error.response) { console.log(error.response) }})
        },
        /** 
        * @description Quand la page est montée: vérifie si l'user est connecté
        */
        mounted() {
            this.getUserInStorage()
        }
    }
</script>


<style scoped>
.card {
    background-color: rgba(193,178,175, 0.90);
    box-shadow: 3px 3px 5px 0 rgba(0,0,0,0.9);
    margin-bottom: 10px;
    padding: 4px;
}
.card:last-of-type {
    margin-bottom: 100px;
}
.publication-infos {
    display: flex;
    margin-bottom: 10px;
}
.container-avatar {
    width: 50px;
}
.avatar {
    width: 100%;
    height: 100%;
    border-radius: 3px;
}
.publication-infos--name-date p {
    margin: 0;
    padding: 2px 0 2px 5px;
    font-size: 1.15rem;
    font-style: italic;
}
.publication-infos--fullName {
    display: flex;
    font-size: 1.28rem;
}
.container-post--image {
    width: 100%;
    height: auto;
    overflow: hidden;
}
img {
    width: 100%;
    border-radius: 3px;
}
.post-content {
    margin: 0;
    padding: 5px;
    font-size: 1.20rem;
}
.displayOrNotComments--Button {
    width: 100px;
    height: 30px;
    background-color: #243653;
    box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
    border: none;
    border-radius: 3px;
    color: white;
    font-size: 1.30rem;
    font-weight: 400;
    margin: 5px 0 10px 0;
}
.displayOrNotComments--Button:hover {
    background-color: #d1515a;
    color: black;
    font-weight: 500;
}
.post-input {
    display: flex;
}
.post-input--comment  {
    display: block;
    width: 100%;
    height: fit-content;
    padding: 0.25rem 0.5rem;
    border-radius: 3px 0 0 3px;
    font-size: 1.2rem!important;
    min-height: calc(1.5em + 0.75rem + 2px);
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
}
.visuallyhidden {
    display: none;
}
.post-input--comment:focus{
    border-color: #243653!important;
    outline-color: #243653!important;
    outline-width: 0.5px;
}
.btn-input {
    border-radius: 0  3px 3px 0!important;
    box-shadow: none;
    margin-top: 0!important;
    height: 43px!important;
    transition: none;
}
.svg-inline--fa.fa-w-18, 
.svg-inline--fa.fa-w-14 {
    width: 1.5em;
    height: 1.5em;
    margin: 5px ;
}
.svg-inline--fa.fa-edit:hover {
  color: green;
}
.svg-inline--fa.fa-trash:hover {
  color: red;
}
.paramsUserOrAdmin {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}
.modifyPost, .deletePost {
    color: #243653;
}
.btn {
    width:30px;
    height: 30px;
    background-color: #243653;
    box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    color: white;
    outline: none;
    border: none;
    position: relative;
    margin-right: 5px;
    padding: 1px;
    text-align: center;
}
.btn:hover, .file-input label:hover  {
    background-color:#d1515a!important;
    color: white;
    top: 2px;
}
p {
    margin-top:36px;
    margin-left: 5px;
}
.post-modify--buttons {
    display: flex;
    justify-content: space-between;
}
.file {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
}
.post-modify--buttons label {
    position: relative;
    width: 30px;
    height: 30px;
    margin-top: 0.8rem!important;
    border-radius: 10px!important;
    background: #d1515a;
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: transform .2s ease-out;
    margin-left: 10px;
}
.button {
    height: 30px; 
    line-height: 15px;
    width: 30px;
    background-color: #d1515a;
    box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    color: white;
    outline: none;
    border: none;
    position: relative;
    margin-top:  0.8rem!important;
    margin-right: 10px;
    padding: 2px;
}
.btn:hover, .post-modify--buttons label:hover  {
    background-color:#243653!important;
    color: white;
    top: 2px;
}
.btn:focus {
    outline: none!important;
    box-shadow: none;
}
/* Ecrans tablette et plus */
@media (min-width: 768px) {
    .card {
        width: 50%;
        padding: 4px;
    }
    .container-avatar {
        width: 60px;
    }
    .publication-infos--name-date p{
        margin: 0;
        padding: 2px 0 2px 10px;
        font-size: 1.44rem;
    }
    img {
        width: 100%;
        border-radius: 3px;
    }
    .post-comment {
        font-size: 1.44rem;
    }
    .post-comment--title {
        font-size: 1.44rem;
    }
    .post-input {
        height: 40px;
    }
    .form-control {
        height: fit-content;
    }
}

/* Ecrans ordinateur et plus */
@media (min-width: 1024px) {
    .card {
        max-width: 40%;
    }
    .publication-infos--name-date p{
        font-size: 1.35rem;
    }
    .post-content {
        margin: 0;
        padding: 5px;
        font-size: 1.35rem;
    }
    .svg-inline--fa.fa-w-18, 
    .svg-inline--fa.fa-w-14 {
        width: 1.8em;
        height: 1.8em;
        margin: 5px ;
    }
}
</style>

