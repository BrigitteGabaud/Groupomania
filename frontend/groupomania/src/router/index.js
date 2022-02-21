import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import Connexion from '@/views/Connexion.vue'
import Admin from '@/views/Admin.vue'


// Création du routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/Connexion',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: Admin
  }
]

// Création du router
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Exportation du router
export default router
