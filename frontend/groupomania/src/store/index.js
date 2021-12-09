import { createStore } from 'vuex'
const axios = require('axios').default;
const { DateTime } = require("luxon");
DateTime.now().toString();
let dt = DateTime.now();
let currentLocaleDate = dt.setLocale('fr').toLocaleString(DateTime.DATETIME_FULL);
console.log('currentLocaleDate', currentLocaleDate);

const instance = axios.create({
  baseURL: "http://localhost:3000/api"
})

// état par défaut du user
const defaultUser = {
  userId: -1,
  token: '',
  
}

// Local Storage
let user = sessionStorage.getItem('user');
console.log('user local storage' ,user);

if (!user) {
 user = defaultUser;
} else {
  try {
    user = JSON.parse(user); // récupère user depuis local storage
    instance.defaults.headers.common['Authorization'] = user.token; // défini header autorisation pour utiliser token
    console.log(('user:' , user));
  } catch (ex) {
    console.log('erreur recup' ,ex.data);
    user = defaultUser;
  }
}

// Création nouvelle instance store
 const store = createStore({
  state: {
    webSiteName: 'Groupomania',
    status: '', // status de base
    user: user,
    post: {
      id: '',
      content: '',
      description: ''
    },
    userInfos: {
      firstname:'',
      lastname: '',
      email: '',
      password: '',
      role: '',
      avatar: '',
      bio: ''
    },
  },
  mutations: {
    setStatus: function(state, status) { // Défini le status
      state.status= status;
    },
    logUser:function(state, user) { // user loggé
      instance.defaults.headers.common['Authorization'] = user.token; // quand logué récupère token dans header
      sessionStorage.setItem('user', JSON.stringify(user));// sauvegarde token
      console.log('mut' ,sessionStorage.setItem('user', JSON.stringify(user)));
      state.user = user;
    },
    userInfos: function (state, userInfos) { // récupère infos user
      state.userInfos = userInfos;
    }, 
    logout: function(state) {
      state.user = defaultUser;
      sessionStorage.removeItem('user');
    }

  },
  actions: {
    login: ({commit}, userInfos) => {
      commit('setStatus', 'loading'); // défini status en mode loading
      return new Promise((resolve, reject) => {
      instance.post('/user/login', userInfos)
      .then(function(response) {
        commit('setStatus', ''); // = si logué
        commit('logUser', response.data); // commit logUser + récupère données
        resolve(response);
      })
      .catch(function(error) {
        commit('setStatus', 'error_login'); // si erreur
        reject(error);
      })
      })
    },
    signup: ({commit}, userInfos) => { // 1er param: commit --> pour exec mut 
      
      commit('setStatus', 'loading'); // défini status en mode loading
      return new Promise((resolve, reject) => {
      instance.post('/user/signup', userInfos) // instance = ref baseURL L7 / appelle méthode signup ds login.vue
      .then(function(response) {
        commit('setStatus', 'created'); // = si compte créé
        resolve(response);
      })
      .catch(function(error) {
        commit('setStatus', 'error_create'); // = si erreur
        reject(error);
      })
      })
    },
/*       getInfosOfUser:({commit}, userInfos) => {
      
      instance.get(`/user/${userId}`)
      .then(function(response) {
        commit('userInfos', response.data);
      })
      .catch(function(error) {
        commit('userInfos', error.message);
      })
    },    */
  }
})

export default store;