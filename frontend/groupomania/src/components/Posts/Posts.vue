<template>

    <div class="card" id="post">

        <!-- Informations user: photo, identité, date de publication -->
        <div class="publication-infos">
            <div class="container-avatar">
            <img class="img" alt="Photo de profil" :src= postUser.avatar>
            </div>

            <div class="publication-infos--name-date">
                 
                <div class="publication-infos--fullName">
                    <p><strong>{{ postUser.firstname }}</strong></p>
                    <p><strong>{{ postUser.lastname }}</strong></p>
                </div>
                <p id="publication-date">Publié le {{ dateToLocale(postDate) }}</p>

            </div>
            
            
        </div>    

        <!-- Contenu du post non modifié -->
        <div  v-show="postModified == false && postImage!==null" class="container-post--image">
            <img :src= "postImage" alt="Image du post">
        </div>
        
        <p v-show="postModified == false" class="post-content">{{ content }}</p>
        
        <!-- Commentaires -->
        <div v-show="postModified == false">

            <button 
                @click="displayOrNotComments"
                class="btn"
                id="displayOrNotComments--Button"
                type="button" 
                role="button"
                title="Afficher les commentaires"
                alt="Afficher les commentaires">
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
            
            <label for="Votre commentaire"></label>

            <div class="input-group-sm mb-1" id="post-input">

                <textarea 
                    v-model="commentContent"
                    class="post-input--comment " 
                    :id="'post-input--comment' + [[ postId]]"
                    type="text" 
                    placeholder="Votre commentaire" 
                    aria-label="Votre commentaire">
                </textarea><br>

                <button 
                    @click="createComment(commentPostId)"
                    class="btn btn-input"
                    id="post-input--button"
                    type="submit" 
                    role="button"
                    alt="Publier le commentaire"
                    :class="{'btn-outline disabled' : !validatedFields}">
                    <fa icon='comment-dots'/>
                </button>
                
            </div>
            
        </div>

        <!-- Contenu du post modifié -->
        <div v-show="postModified" class="post-modify">

            <textarea
                :id="'postContentModified' + [[ postId ]]"
                name='postContentModified' 
                class="form-control"
                type="text" 
                :value="content"
                placeholder="Ajoutez votre nouveau texte ici.">
            </textarea><br>
            
            <div  class="post-modify--buttons" >

                <input
                    id="file"
                    name='file'
                    class="file" 
                    type="file" 
                    tableindex="-1" 
                    accept="image/*">

                <label for="file" alt="Nouvelle image à joindre au post" ><fa icon= 'image'/></label>
                
                <button 
                    type="submit" 
                    class="btn mt-2 col-4" 
                    id="button"
                    alt="Publier un nouveau post"
                    :class="{'btn-outline disabled' : !validatedFields}"
                    @click="modifyPost(postId)">
                    <fa icon= 'paper-plane'/>
                </button>

            </div>

        </div>
        
        <!-- Paramètres user ou admin -->
        <div class='paramsUserOrAdmin'>

            <a 
                v-if="postUserId == user.userId && postModified == false "
                class="modifyPost"
                type="submit" 
                title="Modifier"
                alt="Modifier le post"
                id="edit-icon"
                @click="postModified = true">
                <fa icon='edit'/>
            </a>

            <a v-if="postUserId == user.userId || user.userRole == 'admin' "  
                @click='deletePost(postId)'  
                class="deletePost"
                type="submit" 
                title="Supprimer"
                alt="Supprimer le post">
                <fa icon='trash'/>
            </a>
            
        </div>
        
    </div>

</template>

<script>
    import axios from 'axios' 
    import Comments from '../Comments.vue'
    import { mapActions, mapState } from 'vuex'

    export default {
        name: "PostsList",
        props: [ 'postId', 'postUserId', 'content', 'postImage', 'postDate', 'getAllPosts', 'refreshPost'],
        components: {
            Comments
        },
        data() {
            return{
                el: 'body',
                userLoggedIn: localStorage.getItem("userId"),
                user: {},
                postUser: "",
                commentsList: [],
                // userInfos:{
                //     firstname:'',
                //     lastname: '',
                //     email: '',
                //     role: '',
                //     avatar: '',
                //     bio: '',
                //     createdAt: '',
                //     updatedAt: ''
                // }, 
                // postInfos: {
                //     id: '',
                //     userId: '',
                //     content: '',
                //     image: '',
                //     createdAt:''
                // },
                postModified: false,
                displayComments: false,
            }
        },
        computed: {
            ...mapState(['userInfos']),

            validatedFields: function() {
                if (this.content != "") {
                    return true;
                } else {
                    return false;
                }
            },
        },
        methods: {
            ...mapActions(['isUserConnected']),
           
           /** 
             * @description Cette fonction appelle l'API, modifie le post concerné puis réinitialise la liste des posts et l'affiche
             */
            modifyPost(postId) {
                const formData = new FormData()
                let file = document.getElementById('file')
                
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
            // getInfosOfUser() {
            //     let user = JSON.parse(localStorage.getItem('user'))
            //     //console.log('user local storage' ,user);;
            //     let userId = user.userId;
            //     //console.log('userId', userId);
                
            //     return axios
            //     .get(`http://localhost:3000/api/user/` +`${userId}`)
            //     .then((res) => {
            //        // console.log(this.userInfos = res.data); 
            //         this.firstname = res.data.firstname ,
            //         this.lastname = res.data.lastname,
            //         this.email = res.data.email,
            //         this.role = res.data.role,
            //         this.bio = res.data.bio,
            //         this.avatar = res.data.avatar,
            //         this.createdAt = res.data.createdAt,
            //         this.updatedAt = res.data.updatedAt
            //     })
            // },
            /** 
             * @description Cette fonction convertit la date de création du post en format local
             */
            dateToLocale(date) {

                return new Date(date).toLocaleString('fr', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' });
            },
            
            /*********************************************COMMENTS***********************************/
            /** 
            * @description Cette fonction montre ou non la section des commentaires
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
             * 
             * @return {object} objet avec les posts, commentaires et infos user
             *  
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
                    this.refreshComments();
                    this.commentContent = ""
                })
                .catch(error => { if(error.response) { console.log(error.response) }})
            }, 
        },
         /** 
         * @description Cette fonction appelle l'API pour récupérer les infos du user créant le post (photo profile / nom) et les stocke dans les data
         */
        created() {
            this.isUserConnected()

            axios({
                method: "get",
                url: `http://localhost:3000/api/user/${this.postUserId} `,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                this.postUser = response.data
                console.log('postUser', this.postUser);
                this.getAllCommentsOfAPost()
            })
            .catch(error => { if (error.response) { console.log(error.response) }})

            
        },
        mounted() {
            if (this.$store.state.user.userId == -1) { // = non connecté
            this.$router.push('/Connexion');
            return ;
            }
            //this.getAllPosts()
            this.getUserInStorage()
            //this.getInfosOfUser()
        }
    
    }
</script>


<style scoped>
#post {
    background-color: rgba(193,178,175, 0.90);
    box-shadow: 0 0 10px 3px rgba(0,0,0,0.9);
    margin-bottom: 10px;
    padding: 1%;
}
#post:last-of-type {
    margin-bottom: 100px;
}
.publication-infos {
    display: flex;
    margin-bottom: 10px;
}
.container-avatar {
    width: 50px;
}
.publication-infos--name-date p {
    margin: 0;
    padding: 2px 0 2px 5px;
}
.publication-infos--fullName {
    display: flex;
    font-size: 1.28rem;
}
#publication-date {
    font-size: 1.15rem;
    font-style: italic;
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
#displayOrNotComments--Button {
    width: 100px;
    background-color: #243653;
    box-shadow: none;
    border-radius: 3px;
    color: white;
    font-size: 1.30rem;
    font-weight: 400;
    margin: 5px 0 10px 0;
}
displayOrNotComments--Button:hover {
    background-color: #aa9591!important;
}
#post-input {
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
.post-input--comment:focus{
    border-color: #243653!important;
    outline-color: #243653!important;
}
#post-input--button{
    border-radius: 0  3px 3px 0;
    box-shadow: none;
    margin-top: 0!important;
    height: 43px!important;
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
#button {
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
        padding: 1%;
    }
    .container-avatar {
        width: 20%;
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
    #post-input {
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
        font-size: 1.80rem;
    }
    #publication-date {
        font-size: 1.30rem;
        font-style: italic;
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

