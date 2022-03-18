<template>

    <div class="container-profile">

        <profile-of-user ></profile-of-user> 

    </div>
    
</template>

<script>
import ProfileOfUser from '@/components/ProfileOfUser'

export default {
    name: "Profile",
    data() {
        return {
        }
    },
    components:{
        'profile-of-user': ProfileOfUser
    }
}
</script>

<style scoped>
.container-profile {
  width: 100%;
  height: 100vh;
}
</style>