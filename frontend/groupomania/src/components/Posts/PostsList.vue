<template>
    
    <div  class="container-posts">

        <ul class="card">

            <li v-for="post in listPosts" :key="post.id">

                <div>

                 <h1>{{ post.id }}</h1>

                    
                    <p>{{ post.post_fk_user.firstname}}</p>
                    <p>{{ post.content }}</p>
                    <img :src= post.image>
                    <p>{{ post.userId }}</p>

                    <div>

                        <button class="btn btn-primary col-4 ">Commenter</button>

                        <a href="#create-post"
                            v-if="post.userId == user.userId"
                            class="btn btn-primary col-4 "
                            @click='modifyPost(post.id)'
                            >
                            Modifier
                        </a>

                        <button v-if="post.userId == user.userId || user.userRole == 'admin' "  
                                @click='deletePost(post.id)' 
                                class="btn btn-primary col-4"
                                
                                >Supprimer
                        </button>

                    </div>
                    
                </div>

            </li>
        
        </ul>
    
    </div>

</template>

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
                image: ''
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
            getInfosOfUser: function() {
                let user = sessionStorage.getItem('user');
                
                if(user) {
                    this.user = JSON.parse(user);
                }
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
            this.$router.push('/Connexion');
            return ;
            }
            this.getAllPosts()
            this.getInfosOfUser()
            this.getOnePost()
            
           
           
        }
    
    }
</script>


<style scoped>
.container-posts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
    
}
.card {
    background-color: rgba(179,167,164, 0.90);
    box-shadow: 0 0 10px 3px rgba(0,0,0,0.9);
    margin-bottom: 100px;
    width: 50%;
    padding: 1%;
}
ul li {
    list-style-type: none;
    margin-bottom: 5px;
}
li {
    width: 100%;
}
img {
    width: 100%;
    border-radius: 3px;
}
.btn {
    background-color: #243653;
    box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
    border-radius: 3px;
    color: white;
    outline: none;
    border: none;
    position: relative;
    margin-right: 1px;
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

</style>

