<template>

    <div class="background-image" alt='Salle de pause'>
        <div class="card">
            Bonjour, envie de nous rejoindre ? <br>
            Connectez-vous !
        </div>
        <Login></Login>
    </div>

</template>

<script>

import Login from '@/components/Auth/Login.vue'
export default {
     name: "Connexion",
     components: {
         Login
     }
}
</script>

<style scoped>
.background-image {
    background-color: #1D1B1E;
    background-image: url("../assets/break_room.jpg");
    background-position: 8% 50%;
    width: 100%;
    height:100vh;
    position: relative;
}
.card {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 40%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #BEBCBD;
    opacity: 0.95;
    text-align: center;
    box-shadow: 0 0 10px 5px rgba(0,0,0,1);
}
</style>