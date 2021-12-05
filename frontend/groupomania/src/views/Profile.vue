<template>
    <div>

        <profile-of-user ></profile-of-user> 

    </div>
</template>

<script>
import ProfileOfUser from '@/components/Profile/ProfileOfUser'

export default {
    name: "Profile",
    data() {
        return {
            //reveleProfile: false, // = props
        }
    },
    components:{
        'profile-of-user': ProfileOfUser },
    methods: {
        /* toggleProfile: function() {
            this.reveleProfile = !this.reveleProfile
        }, */
    },
   /*  mounted: function() { //= quand vue est affichée
        console.log('state user depuis GetOneUser' ,this.$store.state.user);
        if(this.$store.state.userId == -1) { // = déconnecté
            this.$router.push('/Login'); // --> rebascule vers login + affiche erreur
            return;
        }
        this.$store.dispatch('getUserInfos'); // récupère infos user
    },  */
    
}
</script>

<style>

</style>