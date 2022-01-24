<template>
    <div class="container-post-create">
         <div class="card" id="create-post">

            <h4>Quoi de neuf ?</h4> <br>

            <textarea id="content" v-model="content"  class="form-control" type="text" placeholder="Ajoutez votre texte ici."></textarea><br>

            <div class="file-input"  >

                <input type="file" id="file" class="file" accept="image/*">
                <label for="file" >Choisir une image</label>
                
                <button type="button" class="btn mt-2 col-4 " 
                        :class="{'btn-outline' : !validatedFields}"
                        @click="createPost()"
                        >Publier
                </button>

            </div>

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

            if(document.getElementById("file").value !== "") {

                console.log(document.getElementById("file").value);
                formData.append('image', document.getElementById("file").files[0])
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
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
}
#create-post {
    width: 50%;
    height: 25%;
    background-color: rgba(193,178,175, 0.90);
    box-shadow: 0 0 10px 3px rgba(0,0,0,0.9);
    margin-top: 10%;
    padding: 15px 10px;
}
.file-input {
    display: flex;
    justify-content: space-between;
}
.file {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
}
.file-input label {
    display: block;
    position: relative;
    width: 157px;
    height: 38px;
    margin-top: 0.5rem!important;
    border-radius: 3px;
    background: #243653;
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: transform .2s ease-out;
}
.btn {
    background-color: #243653;
    box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
    border-radius: 3px;
    color: white;
    outline: none;
    border: none;
    position: relative;
}
.btn:hover, .file-input label:hover  {
    background-color:#d1515a!important;
    color: white;
    top: 2px;
}

</style>