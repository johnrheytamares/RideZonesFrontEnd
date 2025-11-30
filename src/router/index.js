// src/router/index.js → FINAL FOREVER VERSION
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'  // ← GAMITIN MO NA ANG @ ALIAS (dapat may vite.config na)

import Dashboard from '../views/Dashboard.vue'
import Login from '../components/Auth/Login.vue'
import Registration from '../components/Auth/Registration.vue'
import CarsManagement from '../components/Cars/CarsManagement.vue'
import CarsPage from '../views/pages/CarsPage.vue'
import AppointmentCard from '../components/Appointments/AppointmentCard.vue'
import AdminAppoinmentsManagemement from '../views/AdminAppoinmentsManagemement.vue'
import UserAppointmentPage from '../views/UserAppointments.vue'
import CarInventory from '../views/pages/CarInventory.vue'
import Dealers from '../views/pages/Dealers.vue'
import UserManagement from '../views/pages/UserManagement.vue'
import CarComparison from '../views/pages/CarComparison.vue'
import HomeView from '../views/HomeView.vue'
import ContactPage from '../views/ContactPage.vue'
import About from '../views/pages/About.vue'
import ForgotPassword from '../components/Auth/ForgotPassword.vue'
import ResetPassword from '../components/Auth/ResetPassword.vue'
import Feedback from '../views/GoogleForm.vue'  // ← IDAGDAG MO KUNG MERON
import AppointmentModal from '../views/pages/AppointmentModal.vue'

const routes = [
  // ===================== PUBLIC PAGES (LAHAT PWEDE) =====================
  { path: '/',                  name: 'home',           component: HomeView,               meta: { public: true } },
  { path: '/login',             name: 'login',          component: Login,                  meta: { public: true } },
  { path: '/register',          name: 'registration',   component: Registration,           meta: { public: true } },
  { path: '/forgot-password',   name: 'forgot-password',component: ForgotPassword,         meta: { public: true } },
  { path: '/reset-password',    name: 'reset-password', component: ResetPassword,          meta: { public: true } },
  { path: '/cars-page',         name: 'cars-page',      component: CarsPage,               meta: { public: true } },
  { path: '/car-comparison',    name: 'car-comparison', component: CarComparison,          meta: { public: true } },
  { path: '/dealers',           name: 'dealers',        component: Dealers,                meta: { public: true } },
  { path: '/about',             name: 'about',          component: About,                  meta: { public: true } },
  { path: '/contact',           name: 'contact',        component: ContactPage,            meta: { public: true } },
  { path: '/google-form',       name: 'google-form',    component: Feedback,               meta: { public: true } },
  { path: '/appointmentpage',   name: 'appointmentpage', component: AppointmentModal,      meta: { public: true } },
  // ===================== PROTECTED PAGES =====================

  // Dealer & Admin lang
  { 
    path: '/dashboard',        
    name: 'dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true, roles: ['dealer', 'admin'] } 
  },
  { 
    path: '/cars-management',   
    name: 'cars-management', 
    component: CarsManagement, 
    meta: { requiresAuth: true, roles: ['dealer', 'admin'] } 
  },
    { 
    ath: '/user-management',   
    name: 'user-management', 
    component: UserAppointmentPage, 
    meta: { requiresAuth: true, roles: ['dealer', 'admin'] } 
  },

  { 
    path: '/appointments',      
    name: 'appointments', 
    component: AppointmentCard, 
    meta: { requiresAuth: true, roles: ['dealer', 'admin'] } 
  },
  { 
    path: '/car-inventory',     
    name: 'car-inventory', 
    component: CarInventory, 
    meta: { requiresAuth: true, roles: ['dealer', 'admin'] } 
  },

  // Admin ONLY
  { 
    path: '/adminappointment',  
    name: 'adminappointment', 
    component: AdminAppoinmentsManagemement, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  { 
    path: '/user-management',   
    name: 'user-management', 
    component: UserManagement, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }  // Always scroll to top
  }
})

// FINAL & UNBREAKABLE NAVIGATION GUARD
router.beforeEach(async (to, from, next) => {
  const { user, loading, waitForAuth } = useAuth()

  // Hintayin matapos ang /auth/me
  if (loading.value) {
    await waitForAuth()
  }

  const isLoggedIn = !!user.value
  const role = user.value?.role || 'guest'

  // 1. PUBLIC PAGES → lahat pwede
  if (to.meta.public) return next()

  // 2. KAILANGAN MAG-LOGIN
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }  // optional: para ma-remember kung saan pupunta
    })
  }

  // 3. ROLE CHECK (admin/dealer only)
  if (to.meta.roles && !to.meta.roles.includes(role)) {
    if (role === 'admin') return next('/adminappointment')
    if (role === 'dealer') return next('/dashboard')
    return next('/')  // buyer or guest
  }

  next()
})

export default router