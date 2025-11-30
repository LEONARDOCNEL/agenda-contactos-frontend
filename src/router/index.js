import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../views/InicioView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/registro',
    name: 'Registro',
    component: () => import('../views/RegistroView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/agenda',
    name: 'Agenda',
    component: () => import('../views/AgendaView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/agenda/crear',
    name: 'CrearContacto',
    component: () => import('../views/CrearContactoView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/agenda/editar/:id',
    name: 'EditarContacto',
    component: () => import('../views/EditarContactoView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../views/PerfilView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/agenda')
  } else {
    next()
  }
})

export default router