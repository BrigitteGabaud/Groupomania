<template>
    <div class="home">

        <div class="container-post-create">

            <div class="card" id="post-create">
                
                <h1>Bonjour {{ userInfos.firstname }} : quoi de neuf ?</h1> <br>

                <label for="Ajoutez votre texte ici."></label>

                <textarea 
                    id="content" 
                    v-model="content"  
                    class="form-control" 
                    type="text" 
                    placeholder="Ajoutez votre texte ici.">
                </textarea><br>

                <div class="post-create--buttons"  >

                    <input 
                        type="file" 
                        id="file" 
                        class="file" 
                        tableindex="-1" 
                        accept="image/*">

                    <label for="file" alt="image à joindre au post" ><fa icon= 'image'/></label>
                    
                    <button 
                        type="submit" 
                        class="btn mt-2 col-4" 
                        id="button"
                        alt="Publier mon post"
                        :class="{'btn-outline disabled' : !validatedFields}"
                        @click="createPost()">
                        <fa icon= 'paper-plane'/>
                    </button>

                </div>

            </div>

        </div>

        <div class="container-posts">

            <Posts
                v-for="post in postsList"
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
import Posts from '../components/Posts/Posts.vue'
import { mapState, mapActions } from "vuex"

export default {
    name: "Home",
    components: {
        Posts
    },
    data() {
        return {
            content: '',
            postsList: [],
        }
    },
   
    computed: {
        ...mapState([ 'userInfos' ]),

        validatedFields: function() {
            if (this.content != "") {
                console.log(this.content);
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        ...mapActions([ 'getUserInfos', 'isUserConnected']),

        /** 
         * @description Cette fonction appelle l'API pour récupérer tous les posts
         * 
         * @return {object} objet avec les posts, commentaires et infos user
         *  
         */
        getAllPosts() {

            axios({
                method:"get",
                url:"http://localhost:3000/api/post",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(response => {
                this.postsList.push(...response.data)
                //console.log('liste posts', ...response.data);
            })
            .catch(error => { if(error.response) { console.log(error.response.data.error) }})
        },

         /**
         * @description Cette fonction raffrîchit la liste de posts
         */
        refreshPost() {
            this.postsList = []
            this.getAllPosts()
        },

        /**
         * @description Cette fonction appelle l'API et crée un nouveau post
         */
        createPost() {
            let formData = new FormData();
            let file = document.getElementById("file")

            formData.append("content", this.content)
            formData.append("userId", JSON.stringify(this.user.userId))

            console.log('IMAGE FROM HOME',document.getElementById("file").value);

            if(file.value !== "") {
                formData.append('image', file.files[0])
            }
            
            axios({
                method: "post",
                url: `http://localhost:3000/api/post`,
                headers: {
                    "Content-Type":"multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                data: formData
                
            })
            
            .then(() => {
               this.refreshPost()
               this.content = ""
               file.value = ""
            })
        }
    },
    created() {
        this.isUserConnected()
        this.getAllPosts()
    },
    mounted() {

       this.user = JSON.parse(localStorage.getItem('user'))
    }
}
</script>

<style scopped >
.home {
    width: 100%;
    height: auto;
}
.container-post-create {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
    width: 100%;
    height: auto;
}
#post-create {
    background-color: rgba(193,178,175, 0.90);
    box-shadow: 0 0 10px 3px rgba(0,0,0,0.9);
    margin-top: 25%;
    padding: 15px 10px;
}
#post-create h1 {
    font-size: 1.45rem;
    font-weight: 500;
    padding-left: 1%;
    padding-bottom: 2%;
}
br {
    display: none;
}
#content::placeholder {
    font-size: 1.22rem!important;
}
textarea.form-control {
    font-size: 1.22rem;
}
.post-create--buttons {
    display: flex;
    justify-content: space-between;
}
.file {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
}
.post-create--buttons label {
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
.svg-inline--fa.fa-w-16  {
    vertical-align: middle;
    margin-left: -0.125em;
    width: 1.5em;
    height: 1.5em;
}
.btn:hover, .post-create--buttons label:hover  {
    background-color:#243653!important;
    color: white;
    top: 2px;
}
.btn:focus {
    outline: none!important;
    box-shadow: none;
}
.container-posts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
}
/* Ecrans tablette et plus */
@media (min-width: 768px) {
    #post-create {
        width: 50%;
        height: 25%;
        margin-top: 15%;
        margin-bottom: 5%;
        padding: 15px 10px;
    }
    #post-create h1 {
        font-size: 1.7rem;
        font-weight: 500;
        padding-left: 1%;
        padding-bottom: 2%;
    }
    #post-create p {
        font-size: 2.08rem;
        padding-left: 1%;
    }
    #content::placeholder {
        font-size: 1.6rem;
    }
}
/* Ecrans ordinateur et plus */
@media (min-width: 1024px) {
    #post-create {
        max-width: 40%;
    }
}
</style>