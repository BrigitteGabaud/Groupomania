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

<style>

html {
  font-size: 62.5%;
}
body {
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url("../src/assets/break_room.jpg");
  background-size: cover;
  background-attachment: fixed;
}
#app{
  height: auto;
}
#container-app {
  width: 100%;
  height: 100%;
}
img {
  max-width: 100%;
  border-radius: 8px;
}
.card {
  max-width: 80%;
  width: 80%;
  padding:32px;
  border: none;
  border-radius: 3px;
}
/* .card__title {
  text-align:center;
  font-weight: 800;
}
.card__subtitle {
  text-align: center;
  color:#667;
  font-weight: 500;
} */
.btn {
    height: 30px; 
    line-height: 15px;
    width: 30px;
    background-color: #d1515a;
    box-shadow:  0 4px 7px rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    color: white;
    outline: none;
    border: none;
    position: relative;
    margin-top:  0.8rem!important;
    margin-right: 10px;
    padding: 2px;
}
 /* .button {
  background: rgba(209,81,90,255);
  color:black;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  width: 100%;
  padding: 16px;
  transition: .4s background-color;
} */
/*.button--disabled {
  background:#cecece;
  color:#ececec
} */
</style>  
