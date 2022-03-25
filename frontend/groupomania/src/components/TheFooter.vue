<template>
  <footer class="container-footer">
      <p>{{ copyright }} </p>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "TheFooter",
  computed: {
    ...mapGetters(['copyright'])
  }
}

</script>

<style scoped>
.container-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  height: 30px;
  background: #D1515A;
  opacity: 0.9;
  color: black;
  width: 100%;
  z-index: 5;
}
p {
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 3px;
}

/* Ecrans tablettes */
@media (min-width: 768px) {
  .container-footer {
    height: 40px;
  }
  p {
  font-size: 1.6rem;
  }
}
</style>