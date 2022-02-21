<template>
    <div class="home">
        <div class="background-image" alt='Salle de pause'>
            <post-create></post-create>
            <posts-list></posts-list>
        </div>
            

    </div>

</template>

<script>
import PostsList from '../components/Posts/PostsList.vue'
import PostCreate from '../components/Posts/PostCreate.vue'

export default {
    name: "Home",
    data: function() {
        return {

        }
    },
    components: {
    'posts-list': PostsList,
    'post-create': PostCreate
    },
    mounted: function () {
       
    }
}
</script>

<style scoped>
/* .container-app {
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 10;
} */
.home {
    width: 100%;
    height: auto;
}
.background-image {
    background-color: #1D1B1E;
    background-image: url("../assets/break_room.jpg");
    background-size: cover;
    width: 100%;
    height: auto;
}

</style>