// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'  // ← DAPAT GANITO (Pinia)

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
import Feedback from '../views/GoogleForm.vue'
import ForgotPassword from '../components/Auth/ForgotPassword.vue'
import ResetPassword from '../components/Auth/ResetPassword.vue'

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  { path: '/register', name: 'registration', component: Registration, meta: { public: true } },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword, meta: { public: true } },
  { path: '/reset-password', name: 'reset-password', component: ResetPassword, meta: { public: true } },

  // PUBLIC
  { path: '/', name: 'home', component: HomeView, meta: { public: true } },
  { path: '/cars-page', name: 'cars-page', component: CarsPage, meta: { public: true } },
  { path: '/car-comparison', name: 'car-comparison', component: CarComparison, meta: { public: true } },
  { path: '/dealers', name: 'dealer', component: Dealers, meta: { public: true } },
  { path: '/about', name: 'about', component: About, meta: { public: true } },
  { path: '/contact', name: 'contact', component: ContactPage, meta: { public: true } },
  { path: '/google-form', name:'google-form', component: Feedback, meta: {public: true}},

  // BUYER
  { path: '/appointmentpage', name: 'appointmentpage', component: UserAppointmentPage, meta: { requiresAuth: true } },

  // DEALER & ADMIN
  { path: '/dashboard', name: 'dashboards', component: Dashboard, meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },
  { path: '/cars-management', name: 'cars-management', component: CarsManagement, meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },
  { path: '/appointments', name: 'appointments', component: AppointmentCard, meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },
  { path: '/car-inventory', name: 'car-inventorys', component: CarInventory, meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },

  // ADMIN ONLY
  { path: '/adminappointment', name: 'adminappointment', component: AdminAppoinmentsManagemement, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/user-management', name: 'user-management', component: UserManagement, meta: { requiresAuth: true, roles: ['admin'] } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// FINAL & PERFECT NAVIGATION GUARD
router.beforeEach(async (to, from, next) => {
  const authStore = useAuth()  // ← DAPAT NASA LOOB, REACTIVE!

  // Hintayin ang auth check
  if (authStore.loading) {
    await authStore.waitForAuth()
  }

  const isLoggedIn = !!authStore.user
  const userRole = authStore.user?.role || 'buyer'

  // Public pages
  if (to.meta.public) return next()

  // Requires auth but not logged in
  if (to.meta.requiresAuth && !isLoggedIn) return next('/login')

  // Role restriction
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    if (userRole === 'admin') return next('/adminappointment')
    if (userRole === 'dealer') return next('/dashboard')
    return next('/')
  }

  next()
})

export default router