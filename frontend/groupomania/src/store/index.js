import { createStore, createLogger } from 'vuex'
import axios from 'axios'
//import router from '../router/index';

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
 //user = defaultUser;
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
      console.log('log user');
      instance.defaults.headers.common['Authorization'] = user.token; // quand logué récupère token dans header
      
      localStorage.setItem('user', JSON.stringify(user)); // sauvegarde token
      state.user = user;
      
    },
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
     * @description Fonction permettant la connexion du user
     */
    login: ({commit, dispatch}, userInfos) => {
      console.log(userInfos);
      commit('SET_STATUS', 'loading'); // défini status en mode loading
      return new Promise((resolve, reject) => {
      instance.post('/user/login', userInfos)

        .then(function(response) {
          console.log('response', response.data);
          commit('SET_STATUS', ''); // = si logué
          dispatch('test', response.data)
          .then(() => {
            resolve(response);
          })
        })
        .catch(function(error) {
          commit('SET_STATUS', 'error_login'); // si erreur
          console.log(error.message)
          reject(error.message);
        
        })
      })
    },

    test: ({commit}, value) => {
      console.log('ICI 3');
      commit('LOG_USER', value); // commit LOG_USER + récupère données
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

    //  /**
    //  * @description Fonction actualisant le user à partir des userInfos
    //  */
    async getUserInfos({ commit }) {
      console.log(user.userId, 'userid');
       
         await axios({
            method: "get",
            url: `http://localhost:3000/api/user/${user.userId}`,
            headers: {
              "Content-type": "application/json",
              "Authorization": ` Bearer ${user.token}`
            }
          })
          .then(user => {
            console.log("USER", user);
            commit("EDIT_FIRST_NAME", user.data.firstname)
            commit("EDIT_LAST_NAME", user.data.lastname)
            commit("EDIT_EMAIL", user.data.email)
            commit("EDIT_ROLE", user.data.role)
            commit("EDIT_AVATAR", user.data.avatar)
            commit("EDIT_BIO", user.data.bio)
          })
        
          .catch(error => {
            console.log(error)
            //localStorage.clear()
           // router.push({ name: "Connexion"})
          })
  
        
      },

    /**
     * @description Fonction vérifiant si l'user est connecté
     */
    // isUserConnected() {
    //   console.log('ICI 2 ');
    //   if(user == undefined || user.token == undefined || user.userId == undefined) {
    //     //router.push({ name: "Connexion"});
    //   }
    //}
  },


  // Logger valable en mode developpement
  plugins:  [createLogger()]
})

// Exportation du store
export default store