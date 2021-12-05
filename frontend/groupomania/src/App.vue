<template>
  <div id="app">

    <the-header></the-header>

    <div class="container">

      <router-view/>
      
    </div>

  </div>
</template>

<script>

  import TheHeader from '@/components/TheHeader'

  export default {
    name: 'App',
    components: { 
      'the-header': TheHeader }
  }

</script>

<style>
img {
  max-width: 100%;
  border-radius: 8px;
}
.card {
  max-width: 100%;
  width: 540px;
  background:white;
  border-radius: 16px;
  padding:32px;
}
.card__title {
  text-align:center;
  font-weight: 800;
}
.card__subtitle {
  text-align: center;
  color:#666;
  font-weight: 500;
}

   .button {
    background: #2196F3;
    color:white;
    border-radius: 8px;
    font-weight: 800;
    font-size: 15px;
    border: none;
    width: 100%;
    padding: 16px;
    transition: .4s background-color;
  }
  .button--disabled {
  background:#cecece;
  color:#ececec
  }
</style>  
