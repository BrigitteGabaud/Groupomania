<template>
      <div class="container mt-5">
        <ul class="nav">

            <li class="btn">Accueil</li>

            <li @click="toggleLogin" :toggleLogin="toggleLogin" class="btn"><router-link to="/Connexion">Connexion</router-link></li>

            <li class="btn"><router-link to="/Profile">Profil</router-link></li>
        </ul>

        

    </div>
</template>

<script>
export default {
    name: "Header"
}
</script>

<style>
div {
    background-color: red;
    width: 50px;
    height: 50px;
}

</style>