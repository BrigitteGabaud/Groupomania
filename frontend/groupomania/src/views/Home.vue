<template>
    <div >
     <posts-list></posts-list>

    </div>

</template>

<script>
import PostsList from '../components/Posts/PostsList.vue'

export default {
    name: "Home",
    data: function() {
        return {

        }
    },
    components: {
    'posts-list': PostsList,
    
    },
    mounted: function () {
        console.log('state user' ,this.$store.state.user);
            if (this.$store.state.user.userId == -1) { // = non connecté
            this.$router.push('/Connexion');
            return ;
            }
    }
}
</script>

<style >

</style>