<template>
    <div class="container mt-5">
        <ul class="card">
            <li v-for="post in posts" :key="post.id">
                <div class="card">
                    {{ post }}
                </div>
            </li>

        </ul>
        
    </div>
    
</template>

<script>
    import axios from 'axios'

    export default {
        name: "PostsList",
        data: function() {
            return {
                posts: {
                    id: '',
                    content: '',
                    description: ''
                }
            }
        },
        components: {
        
        },
        methods: {
            getAllPosts: function() {
                const post = {
                    content: this.content,
                    description: this.description,
                }
                 axios
                    .get("http://localhost:3000/api/post", post)
                    .then(response => {
                        console.log(response);
                        this.posts = response.data.url
                    }) 
                    .catch(error => {
                        console.log(error.response);
                    })

            }
        }
    
    }
</script>

<style>


</style>