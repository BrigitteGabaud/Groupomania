import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import Connexion from '@/views/Connexion.vue'
import Admin from '@/views/Admin.vue'



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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
