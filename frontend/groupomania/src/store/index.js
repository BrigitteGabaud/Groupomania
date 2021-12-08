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
let userLogin = sessionStorage.getItem('userLogin');
console.log('user Login' ,userLogin);

if (!userLogin) {
 userLogin = defaultUser;
} else {
  try {
    userLogin = JSON.parse(userLogin); // transforme local storage sous forme tab
    instance.defaults.headers.common['Authorization'] = userLogin.token; // défini header autorisation pour utiliser token
  } catch (ex) {
    userLogin = defaultUser;
  }
}

// Création nouvelle instance store
 const store = createStore({
  state: {
    webSiteName: 'Groupomania',
    status: '', // status de base
    userLogin: defaultUser,

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
    logUser:function(state, userLogin) { // user loggé
      instance.defaults.headers.common['Authorization'] = userLogin.token; // quand logué récupère token dans header
      console.log('userLogin.token', userLogin.token);
      sessionStorage.setItem('userLogin', JSON.stringify(userLogin));// initialise storage en string
      console.log('mut' ,sessionStorage.setItem('userLogin', JSON.stringify(userLogin)));
      state.userLogin = userLogin;
    },
    userInfos: function (state, userInfos) { // récupère infos user
      state.userInfos = userInfos;
    }, 
    logout: function(state) {
      state.userLogin = defaultUser;
      localStorage.removeItem('userLogin');
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
     /*  getUserInfos:({commit}) => {
      
      instance.get(`/user/${userId}`)
      .then(function(response) {
        commit('userInfos', response.data);
      })
      .catch(function(error) {
        commit('userInfos', error.message);
      })
    },  */ 
  }
})

export default store;