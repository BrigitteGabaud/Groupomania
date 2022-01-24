<template>
  <div id="container-app">

    <the-header></the-header>

    <div class="container-views">

      <router-view/>
      
    </div>

    <the-footer></the-footer>

  </div>
</template>

<script>
  import TheHeader from '@/components/TheHeader'
  import TheFooter from '@/components/TheFooter'

  export default {
    name: 'App',
    components: { 
      'the-header': TheHeader,
      'the-footer': TheFooter
    }
  }

</script>

<style >

body {
  padding: 0;
  width: 100%;
  height: 100vh;
}
#app{
  height: auto;
}
#container-app {
  width: 100%;
  height: 100vh;
}
img {
  max-width: 100%;
  border-radius: 8px;
}
.card {
  max-width: 70%;
  width: 70%;
  padding:32px;
  border: none;
  border-radius: 3px;
}
.card__title {
  text-align:center;
  font-weight: 800;
}
.card__subtitle {
  text-align: center;
  color:#667;
  font-weight: 500;
}
.button {
background: rgba(209,81,90,255);
color:black;
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
