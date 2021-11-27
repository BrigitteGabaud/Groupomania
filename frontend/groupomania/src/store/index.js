import { createStore } from 'vuex'

const axios = require('axios').default;

const instance = axios.create({
  baseURL: "http://localhost:3000/api/user"
})

const defaultUser = {
  userId: -1,
  token: '',
}

// Local Storage
let user = localStorage.getItem('user');
if (!user) {
 user = defaultUser;
 console.log(user);
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common['Authorization'] = user.token;
  } catch (ex) {
    user = defaultUser;
  }
}

// Création nouvelle instance store
 const store = createStore({
  state: {
    status: '',
    user: {
      defaultUser
    },
    userInfos: {
      firstname:'',
      lastname: '',
      email: '',
      avatar: '',
    },
  },
  mutations: {
    setStatus: function(state, status) {
      state.status= status;
    },
    logUser:function(state, user) {
      instance.defaults.headers.common['Authorization'] = user.token;
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    }, 
    logout: function(state) {
      state.user = defaultUser;
      localStorage.removeItem('user');
    }

  },
  actions: {
    login: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
      instance.post('/login', userInfos)
      .then(function(response) {
        commit('setStatus', '');
        commit('logUser', response.data);
        resolve(response);
      })
      .catch(function(error) {
        commit('setStatus', 'error_login');
        reject(error);
      })
      })
    },
    signup: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
      instance.post('/signup', userInfos)
      .then(function(response) {
        commit('setStatus', 'created');
        resolve(response);
      })
      .catch(function(error) {
        commit('setStatus', 'error_create');
        reject(error);
      })
      })
    },
    getOneUser:({commit}) => {
      instance.post('/'+ user.token.id)
      .then(function(response) {
        commit('userInfos', response.data);
      })
      .catch(function(error) {
        commit('userInfos', error.data);
      })
    },
  }
})

export default store;