<template>
    <div class="container-post-create">
         <div class="card" id="create-post">

            <h3>Exprimez-vous !</h3> <br>

            <input id="content" v-model="content"  class="form-control" type="text" placeholder="Quoi de neuf ?"> <br>

            <form id="form"  >

                <input  type="file" id="postImage" accept="image/*">

                <button type="button" class="btn btn-secondary mt-2 col-4" 
                        :class="{'btn-outline-secondary' : !validatedFields}"
                        @click="createPost()"
                        >Publier
                </button>

            </form>

        </div>
    </div>
</template>

<script>
import axios from 'axios' 

export default {
    name: "PostCreate",

    data() {
        return {
            content: '',
            description: '',
            image: '',
            user: ''
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
        },
       
    },
    methods: {
        createPost: function() {
            let formData = new FormData();

            formData.append("content", JSON.stringify(this.content))
            formData.append("userId", JSON.stringify(this.user.userId))

            if(document.getElementById("postImage").value !== "") {

                console.log(document.getElementById("postImage").value);
                formData.append('image', document.getElementById("postImage").files[0])
            }
            console.log(formData.getAll("post"));
            axios({
                method: "post",
                url: `http://localhost:3000/api/post`,
                headers: {
                    "Content-Type":"multipart/form-data",
                },
                data: formData
                
           })
           
            
            .then((response) => {
                console.log(response);
                document.getElementById("content").value = ""
                window.location.reload();
            })
            .catch(error => {
                if(error.response) {
                    console.log(error.response);
                }
            }) 

        }

             
    },
    mounted() {
         
        this.user = JSON.parse(sessionStorage.getItem('user'))

    }
        
}

</script>

<style scoped>
.container-post-create {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
}
#create-post {
    height: 250px;
    margin-bottom: 10px;
}

</style>