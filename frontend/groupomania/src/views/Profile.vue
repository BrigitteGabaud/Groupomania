<template>
  <div class="bloc-profile">
    <div class="profile card">
        <h1 class="card__title">Espace Perso</h1>
        <p>{{user.firstname}} {{user.lastname}} {{user.email}}</p>
        <img :src="user.avatar"/>
        <div class="form-row">
      <button @click="logout()" class="button">
        Déconnexion
      </button>
    </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Profile',
  /* mounted: function () {
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) { // = déconnecté
      this.$router.push('/');
      return ;
    }
    this.$store.dispatch('getOneUser');
  }, */
  computed: {
    ...mapState({
      user: 'userInfos',
    })
  },
  methods: {
    logout: function () {
      this.$store.commit('logout');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.bloc-profile {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .profile {
        background: #f1f1f1;
        color: #333;
        padding: 50px;
        position: fixed;
    }
</style>>