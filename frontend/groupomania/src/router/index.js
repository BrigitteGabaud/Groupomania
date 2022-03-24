import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import ProfileEdit from '@/views/ProfileEdit.vue'
import Connexion from '@/views/Connexion.vue'
import Admin from '@/views/Admin.vue'


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
    path: '/Admin',
    name: 'Admin',
    component: Admin,
    meta: {
      title: 'Administrateur',
      needLoggedIn: true 
    }
  }
]

// Création du router
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if(to.meta.needLoggedIn && !localStorage.getItem('user')) {
    return '/Connexion'
  }
})

// Exportation du router
export default router
