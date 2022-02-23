<template>
    
    <div  class="container-posts">

        <ul >

            <li v-for="post in listPosts" :key="post.id">

                <div class="card" id="post">

                    <div class="publication-infos">

                        <div class="container-avatar">
                            <img class="img" alt="Photo de profil" :src= userInfos.avatar>
                        </div>  
                        <div class="publication-infos--name-date">
                            <p><strong>{{ post.post_fk_user.firstname}}</strong></p>
                            <p>Publié le {{ userInfos.createdAt}}</p>
                        </div>
                        
                    </div>    

                    <div class="container-post--image">
                        <img alt="image du post" :src= post.image>
                    </div>
                    
                    <p class="post-comment">{{ post.content }}</p>

                    <p class="post-comment--title">Commentaires</p>

                    <label for="Votre commentaire"></label>

                    <div class="input-group-sm mb-1" id="post-input">
                        <input type="text" 
                            class="form-control" 
                            id="post-input--comment"
                            placeholder="Votre commentaire" 
                            aria-label="Votre commentaire" 
                            aria-describedby="button-addon2">

                        <button 
                            class="btn btn-input" 
                            type="submit" 
                            role="button"
                            alt="Publier le commentaire"
                            id="post-input--button">
                            <fa icon='comment-dots'/>
                        </button>
                    </div>

                    <div class='container-buttons'>

                        <a href="#create-post"
                            v-if="post.userId == user.userId"
                            class="btn col-2"
                            type="submit" 
                            alt="Modifier le commentaire"
                            id="edit-icon"
                            @click='modifyPost(post.id)'>
                            <fa icon='edit'/>
                        </a>

                        <button v-if="post.userId == user.userId || user.userRole == 'admin' "  
                            @click='deletePost(post.id)' 
                            class="btn col-2"
                            type="submit" 
                            alt="Supprimer le commentaire">
                            <fa icon='trash'/>
                        </button>

                    </div>
                    
                </div>

            </li>
        
        </ul>
    
    </div>

</template>

<h1>{{ post.id }}</h1>
<p>{{ post.userId }}</p>

<script>
    import axios from 'axios'
   // import DateTime from 'luxon'

    export default {
        name: "PostsList",
      
        data() {
            return{
                el: 'body',
                user: {},
                listPosts: [],
                listComments: [],
                content: '',
                image: '',
                userInfos:{
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
        computed: {
            validatedFields: function() {
                if (this.content != "") {
                    console.log(this.content);
                    return true;
                } else {
                    return false;
                }
            }
        },
        methods: {
            getAllPosts: function () {
                
                return axios.get('http://localhost:3000/api/post')
                .then((res) => {
                    
                    this.listPosts = res.data;
                    console.log('listposts', this.listPosts);
                    

                })
            },
            getOnePost: function(id) {
                return axios.get(`http://localhost:3000/api/post/${id}`)
                .then((res) => {
                    
                    console.log(res.data);
                })
            },
            /* commentpost: function() {
                return axios.post(`http://localhost:3000/api/comment/`)
                .then((res) => {
                    this.listComments = res.data
                })
                 .catch((error) => {
                    console.log(`Une erreur est survenue pendant la création du commentaire. ${error.message}`);
                })
            }, */
            modifyPost: function() {

                //return axios.put(`http://localhost:3000/api/post/${id}`)
            },
            deletePost: function(id) {
                
                return axios.delete(`http://localhost:3000/api/post/${id}` ) 
                .then(() => {
                    // récupère tous id ne correspondant pas à l'id que je supprime
                    this.listPosts = [...this.listPosts.filter(t => t.id !== +id)] 
                    //this.getAllPosts() // ??? raffraichir page sans latence
                })
                .catch((error) => {
                    console.log(`Une erreur est survenue pendant la suppression du post. ${error.message}`);
                })
            },
            getUserInStorage: function() {
                let user = sessionStorage.getItem('user');
                
                if(user) {
                    this.user = JSON.parse(user);
                }
            },
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
        created() {
           
        },
        beforemount() {
            /* const getInfosOfUser = this.store.state.userInfos
            console.log('getInfosOfUser', getInfosOfUser); */
            
            //this.role = 

            
        },
        mounted() {
            if (this.$store.state.user.userId == -1) { // = non connecté
            //this.$router.push('/Connexion');
            console.log('erreur !');
            return ;
            }
            this.getAllPosts()
            this.getUserInStorage()
            this.getOnePost()
            this.getInfosOfUser()
        }
    
    }
</script>


<style scoped>
.container-posts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
}
#post {
    background-color: rgba(193,178,175, 0.90);
    box-shadow: 0 0 10px 3px rgba(0,0,0,0.9);
    margin-bottom: 10px;
    padding: 1%;
}
ul {
    padding: 0;
    width: 100%;
}
ul li {
    list-style-type: none;
    margin-bottom: 5px;
    display: flex!important;
    flex-direction: column!important;
    align-items: center;
}
ul li:last-child {
    margin-bottom: 50px;
}
.container-avatar {
    width: 40%;
}
.container-post--image {
    width: 100%;
    height: auto;
    overflow: hidden;
}
.post-comment {
    margin: 0;
    padding: 5px;
    font-size: 1.28rem;
}
.post-comment--title {
    font-size: 1.28rem;
    font-weight:500;
    margin: 5px;
}
.publication-infos {
    display: flex;
    margin-bottom: 10px;
}
.publication-infos--name-date {
    display: flex;
    flex-direction: column;
}
.publication-infos--name-date p{
    margin: 0;
    padding: 2px 0 2px 10px;
    font-size: 1.28rem;
}
img {
    width: 100%;
    border-radius: 3px;
}
#post-input {
    display: flex;
}
#post-input--comment {
    border-radius: 3px 0 0 3px;
    font-size: 1.2rem;
}
#post-input--comment:focus{
    border-color: #243653!important;
    outline-color: #243653!important;
}
#post-input--button{
    border-radius: 0  3px 3px 0;
    box-shadow: none;
    margin: 0;
    padding-bottom: 3px;
}
.svg-inline--fa.fa-w-16,
.svg-inline--fa.fa-w-18, 
.svg-inline--fa.fa-w-14 {
    width: 1.5em;
    height: 1.5em;
    vertical-align: middle;
}
.svg-inline--fa.fa-w-18 {
    margin-top: 6px;
}
.container-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}
.btn {
    width:30px;
    height: 30px;
    background-color: #243653;
    box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
    border-radius: 50px;
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
    #post-input--button{
        height: 40px;
        padding-bottom: 3px;
    }
    .container-buttons {
        display: flex;
        justify-content: flex-end;
    }
    .btn {
        background-color: #243653;
        box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
        border-radius: 50px;
        color: white;
        outline: none;
        border: none;
        position: relative;
        margin-right: 5px;
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

}
</style>

