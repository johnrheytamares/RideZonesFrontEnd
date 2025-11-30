// src/router/index.js → FINAL NA TALAGA, SAME PATHS PA RIN, PERO BULLETPROOF NA
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'  // ← DOT PATHS LANG, WALANG @

// LAZY LOAD LAHAT PARA BILIS (same components mo pa rin)
const HomeView = () => import('../views/HomeView.vue')
const Login = () => import('../components/Auth/Login.vue')
const Registration = () => import('../components/Auth/Registration.vue')
const ForgotPassword = () => import('../components/Auth/ForgotPassword.vue')
const ResetPassword = () => import('../components/Auth/ResetPassword.vue')

const Dashboard = () => import('../views/Dashboard.vue')
const CarsManagement = () => import('../components/Cars/CarsManagement.vue')
const CarsPage = () => import('../views/pages/CarsPage.vue')
const AppointmentCard = () => import('../components/Appointments/AppointmentCard.vue')
const AdminAppoinmentsManagemement = () => import('../views/AdminAppoinmentsManagemement.vue')
const UserAppointmentPage = () => import('../views/UserAppointments.vue')
const CarInventory = () => import('../views/pages/CarInventory.vue')
const Dealers = () => import('../views/pages/Dealers.vue')
const UserManagement = () => import('../views/pages/UserManagement.vue')
const CarComparison = () => import('../views/pages/CarComparison.vue')
const ContactPage = () => import('../views/ContactPage.vue')
const About = () => import('../views/pages/About.vue')
const Feedback = () => import('../views/GoogleForm.vue')
const AppointmentModal = () => import('../views/pages/AppointmentModal.vue')

const routes = [
  // ===================== EXACT SAME PUBLIC PATHS MO =====================
  { path: '/',                  name: 'home',           component: HomeView,               meta: { public: true } },
  { path: '/login',             name: 'login',             component: Login,                  meta: { public: true } },
  { path: '/register',          name: 'registration',   component: Registration,           meta: { public: true } },
  { path: '/forgot-password',   name: 'forgot-password',component: ForgotPassword,         meta: { public: true } },
  { path: '/reset-password',    name: 'reset-password', component: ResetPassword,          meta: { public: true } },
  { path: '/cars-page',         name: 'cars-page',      component: CarsPage,               meta: { public: true } },
  { path: '/car-comparison',    name: 'car-comparison', component: CarComparison,          meta: { public: true } },
  { path: '/about',             name: 'about',          component: About,                  meta: { public: true } },
  { path: '/contact',           name: 'contact',        component: ContactPage,            meta: { public: true } },
  { path: '/google-form',       name: 'google-form',    component: Feedback,               meta: { public: true } },
  { path: '/appointmentpage',   name: 'appointmentpage', component: AppointmentModal,      meta: { public: true } },

  // ===================== EXACT SAME PROTECTED PATHS MO =====================
  { path: '/dashboard',         name: 'dashboard',      component: Dashboard,             meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },
  { path: '/cars-management',   name: 'cars-management',component: CarsManagement,         meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },
  { path: '/appointments',      name: 'appointments',   component: AppointmentCard,        meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },
  { path: '/car-inventory',     name: 'car-inventory',  component: CarInventory,           meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },
  { path: '/dealer',           name: 'dealer',        component: Dealers,                meta: { requiresAuth: true, roles: ['dealer', 'admin'] } },


  // ADMIN ONLY — SAME PATHS MO PA RIN
  { path: '/adminappointment',  name: 'adminappointment', component: AdminAppoinmentsManagemement, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/user-management',   name: 'user-management', component: UserManagement,        meta: { requiresAuth: true, roles: ['admin'] } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// INSTANT GUARD — WALANG await, WALANG loading, WALANG /auth/me
router.beforeEach((to, from, next) => {
  const { user, isAuthenticated } = useAuth()

  const loggedIn = isAuthenticated.value
  const role = user.value?.role || 'guest'

  // Public pages → pasok agad
  if (to.meta.public) return next()

  // Dapat naka-login
  if (to.meta.requiresAuth && !loggedIn) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // Role check
  if (to.meta.roles && !to.meta.roles.includes(role)) {
    if (role === 'admin') return next('/adminappointment')   // same path mo
    if (role === 'dealer') return next('/dashboard')
    return next('/')
  }

  next()
})

export default router