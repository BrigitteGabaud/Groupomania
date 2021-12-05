<template>
    <div>
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
}
</script>

<style>

</style>