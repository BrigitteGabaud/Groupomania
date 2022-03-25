import { createStore, createLogger } from 'vuex'
import axios from 'axios'
import router from '../router/index';
//const axios = require('axios').default;

// Configuration axios
const instance = axios.create({
  baseURL: "http://localhost:3000/api"
})

// état par défaut du user
const defaultUser = {
  userId: -1,
  token: '',
  role: ''
}

// Local Storage
let user = localStorage.getItem('user');
if (!user) {
 user = defaultUser;
 console.log('user2:', user)
} else {
  try {
    user = JSON.parse(user); // récupère user depuis local storage
    instance.defaults.headers.common['Authorization'] = user.token; // défini header autorisation pour utiliser token
    
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
    userInfos: [{
      firstname:'',
      lastname: '',
      email: '',
      role: '',
      avatar: '',
      bio: ''
    }],
    postInfos: [{
      id: '',
      content: '',
      image: '',
    }]
  },
  getters: {
    fullName: (state) => {
      return `${state.userInfos.firstname} ${state.userInfos.lastname}`
    },
    copyright: (state) => {
			const currentYear = new Date().getFullYear()
			return `© ${state.webSiteName} ${currentYear} tous droits réservés.`
		}
  },
  mutations: {
    
    SET_STATUS(state, status) { // Défini le status
      state.status = status;
    },
    LOG_USER(state, user) { // user loggé
      instance.defaults.headers.common['Authorization'] = user.token; // quand logué récupère token dans header
      if(user.token !== undefined) {
        const newUser= localStorage.setItem('user', JSON.stringify(user)); // sauvegarde token
        state.user = newUser;
      }
    },
    // USER_INFOS(state, userInfos) { // récupère infos user
    //   state.userInfos = userInfos;
    // },
    EDIT_FIRST_NAME(state, value) {
      state.userInfos.firstname = value
    }, 
    EDIT_LAST_NAME(state, value) {
      state.userInfos.lastname = value
    }, 
    EDIT_EMAIL(state, value) {
      state.userInfos.email = value
    }, 
    EDIT_ROLE(state, value) {
      state.userInfos.role = value
    }, 
    EDIT_AVATAR(state, value) {
      state.userInfos.avatar = value
    }, 
    EDIT_BIO(state, value) {
      state.userInfos.bio = value
    }, 
    POST_INFOS: function (state, postInfos) { // récupère infos post
      state.postInfos = postInfos;
    }, 
    LOGOUT: function(state) {
      state.user = defaultUser;
      localStorage.removeItem('user');
    }

  },
  actions: {
    /**
     * @description Fonction actualisant le user à partir des userInfos
     */
     getUserInfos({ commit }) {
      axios({
        method: "get",
        url: `http://localhost:3000/api/user/${user.userId}`,
        headers: {
          "Content-type": "application/json",
          "Authorization": ` Bearer ${user.token}`
        }
      })
      .then(user => {
        commit("EDIT_FIRST_NAME", user.data.firstname)
        commit("EDIT_LAST_NAME", user.data.lastname)
        commit("EDIT_EMAIL", user.data.email)
        commit("EDIT_ROLE", user.data.role)
        commit("EDIT_AVATAR", user.data.avatar)
        commit("EDIT_BIO", user.data.bio)
      })
      .catch(error => {
        console.log(error.response)
        localStorage.clear()
        router.push({ name: "Connexion"})
      })
    },

    /**
     * @description Fonction permettant la connexion du user
     */
    login: ({commit}, userInfos) => {
      
      commit('SET_STATUS', 'loading'); // défini status en mode loading
      return new Promise((resolve, reject) => {
      instance.post('/user/login', userInfos) // instance = axios

        .then(function(response) {
          commit('SET_STATUS', ''); // = si logué
          commit('LOG_USER', response.data); // commit LOG_USER + récupère données
          resolve(response);
        })
        .catch(function(error) {
          commit('SET_STATUS', 'error_login'); // si erreur
          console.log(error.message)
          reject(error.message);
        
        })
      })
    },

    /**
     * @description Fonction permettant l'inscription du user
     */
    signup: ({commit}, userInfos) => { // 1er param: commit --> pour exec mut 
      
      commit('SET_STATUS', 'loading'); // défini status en mode loading
      return new Promise((resolve, reject) => {
      instance.post('/user/signup', userInfos) // instance = ref baseURL L7 / appelle méthode signup ds login.vue

        .then(function(response) {
          commit('SET_STATUS', 'created'); // = si compte créé
          resolve(response);
        })
        .catch(function(error) {
          commit('SET_STATUS', 'error_create'); // = si erreur
          reject(error.message);
        })
      })
    },

    /**
     * @description Fonction vérifiant si l'user est connecté
     */
    isUserConnected() {
      if(!user.token || !user.userId) {
        console.log('user token from index',user.token);
        router.push({ name: "Connexion"});
        location.reload()
      }
    }
  },


  // Logger valable en mode developpement
  plugins:  [createLogger()]
})

// Exportation du store
export default store