import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import ProfileEdit from '@/views/ProfileEdit.vue'
import Connexion from '@/views/Connexion.vue'
import NotFoundPage from '@/views/NotFound.vue'


// Création du routes
const routes = [
  {
    path: '/Connexion',
    name: 'Connexion',
    component: Connexion,
    meta: {
      title: 'Connexion',
      needLoggedIn: false 
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Accueil',
      needLoggedIn: true
    }
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profil',
      needLoggedIn: true
    }
  },
  {
    path: '/ProfileEdit',
    name: 'ProfileEdit',
    component: ProfileEdit,
    meta: {
      title: 'Modification Profil',
      needLoggedIn: true
    }
  },
  {
    path: '/:wrongPath',
    name: 'NotFound', 
    component: NotFoundPage
  }
]

// Création du router
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach(async(to, next) => {
//   let user = localStorage.getItem('user');
//   console.log('user from router 1', to.meta.needLoggedIn && !user);
//   if(to.meta.needLoggedIn && !user) {
//     console.log('user from router', to.meta.needLoggedIn && !user);
//     //return { name:'Connexion'}
//   }
// })

// Exportation du router
export default router
