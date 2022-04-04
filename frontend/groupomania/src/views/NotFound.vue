<template>
    <div class="card">
        <h1> Page introuvable :</h1>
        <h2>"{{ $route.params.wrongPath }}" </h2>
        <button @click="$router.back()"> Revenir en arrière</button>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>
.card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    background-color: rgba(193,178,175, 0.90);
    box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.9);
    padding: 15px 10px;
    border-radius: 0.4rem;
}
button {
    background-color: #243653;
    box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
    border-radius: 3px;
    color: white;
    outline: none;
    border: none;
    position: relative;
    margin: 0 auto;
    font-size: 1.44rem;
    width: auto;
    margin-top: 10px;
}
</style>