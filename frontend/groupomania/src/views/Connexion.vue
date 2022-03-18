<template>

    <div>

        <div class="card">
            Bonjour, envie de nous rejoindre ? <br>
            Connectez-vous !
        </div>
        <Login></Login>
    
    </div>

</template>

<script>
import Login from '@/components/Login.vue'

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
    width: 70%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #BEBCBD;
    opacity: 0.95;
    text-align: center;
    padding: 15px 9px;
    box-shadow: 3px 3px 5px 0 rgba(0,0,0,0.9);
    font-size: 1.30rem;
    font-weight: 500;
}
/* Ecrans tablette et plus */
@media (min-width: 768px) {
    .card {
    max-width: 40%;
    font-size: 1.44rem;
    font-weight: 500;
    }
}

/* Ecrans ordinateur */
@media (min-width: 1024px) {
    .card {
        max-width: 40%;
        height: 100px;
        font-size: 1.60rem;
    }
}

/* Ecrans larges */
@media (min-width: 1440px) {
    .card {
        max-width: 25%;
        height: 100px;
        font-size: 2rem;
    }
}

</style>