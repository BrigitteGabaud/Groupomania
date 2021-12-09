<template>
    <div  class="container-post">
        <ul class="card">
            <li v-for="post in listPosts" :key="post.id">
                <div
                 class="card">
                 <h1>{{ post.id}}</h1>
                    <p>{{ post.content }}</p>
                    <p>{{ post.description}}</p>
                    <div>
                        <button class="btn btn-primary col-4 ">Commenter</button>
                        <button class="btn btn-primary col-4">Supprimer</button>
                    </div>
                    
                </div>
            </li>
        
        </ul>
    
        
    
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "PostsList",
      
        data () {
            return{
                listPosts: [],
                userInfos: {
                    useId :'',
                    firstname:'',
                    lastname: '',
                    email: '',
                    password: '',
                    role: '',
                    avatar: '',
                    bio: ''
                },
                post: {
                    id: ''
                }
            }
        },

        methods: {
            getAllPosts: function () {
                // return axios.post('http://localhost:3000/api/post/', {data})
                // return axios.get('http://localhost:3000/api/post/'+ `${id}`)
                return axios.get('http://localhost:3000/api/post').then(
                    (res) => {
                    
                        this.listPosts = res.data;
                    }
                )
            },
             deletePost: function() {
                let user = sessionStorage.getItem('user');
                console.log('user local storage fron postlist' ,user);
                user = JSON.parse(user);
                console.log('user P', user);
                return axios.delete('http://localhost:3000/api/post' + `${id}` ) 
                .then((res) =>{
                    this.id = res.data.id
                    console.log(res.data);
                })
            } 
            /* getInfosOfUser: function() {
                this.$store.dispatch('getInfosOfUser', {
                    firstname:this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password,
                    role: this.role,
                    avatar: this.avatar,
                    bio: this.bio, 
                }).then(function(response) {
                    console.log(response)
                }).catch(function(error) {
                    console.log(error);
                })
            }, */
        },
        beforemount() {
            /* const getInfosOfUser = this.store.state.userInfos
            console.log('getInfosOfUser', getInfosOfUser); */
        },
        mounted() {
            
           this.getAllPosts()
           //this.getInfosOfUser()
           this.deletePost()
        }
    
    }
</script>


<style scoped>
.container-post {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
}
ul li {
    list-style-type: none;
    margin-bottom: 5px;
}
.btn  {
    margin-right: 1px!important;
}

</style>

A