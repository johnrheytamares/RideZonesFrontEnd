<template>
  <aside class="sidebar" :class="theme" v-if="isAuthenticated && user">
    <!-- SAME DESIGN MO — PERO MAY v-if NA TALAGA! -->
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <i class="fas fa-crown"></i>
        </div>
        <span class="logo-text">RideZone</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <!-- MAIN SECTION -->
      <div class="nav-section">
        <h3 class="nav-section-title">MAIN</h3>
        <ul class="nav-links">
          <li
            class="nav-item"
            :class="{ active: $route.name === 'dashboard' }"
            @click="navigate('dashboard')"
          >
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
            <div v-if="$route.name === 'dashboard'" class="active-indicator"></div>
          </li>

          <!-- ADMIN ONLY: Vehicle Inventory & Dealers -->
          <template v-if="isAdmin">
            <li
              class="nav-item"
              :class="{ active: $route.name === 'car-inventory' }"
              @click="navigate('car-inventory')"
            >
              <i class="fas fa-car"></i>
              <span>Vehicle Inventory</span>
              <div v-if="$route.name === 'car-inventory'" class="active-indicator"></div>
            </li>

            <li
              class="nav-item"
              :class="{ active: $route.name === 'dealers' }"
              @click="navigate('dealers')"
            >
              <i class="fas fa-store"></i>
              <span>Dealers</span>
              <div v-if="$route.name === 'dealers'" class="active-indicator"></div>
            </li>
          </template>
        </ul>
      </div>

      <!-- MANAGEMENT -->
      <div class="nav-section">
        <h3 class="nav-section-title">MANAGEMENT</h3>
        <ul class="nav-links">
          <li
            class="nav-item"
            :class="{ active: $route.name === 'adminappointment' }"
            @click="navigate('adminappointment')"
          >
            <i class="fas fa-calendar-check"></i>
            <span>Appointments</span>
            <span class="badge" v-if="pendingCount > 0">{{ pendingCount }}</span>
            <div v-if="$route.name === 'adminappointment'" class="active-indicator"></div>
          </li>

          <li
            class="nav-item"
            :class="{ active: $route.name === 'cars-management' }"
            @click="navigate('cars-management')"
          >
            <i class="fas fa-car-side"></i>
            <span>Cars Management</span>
            <div v-if="$route.name === 'cars-management'" class="active-indicator"></div>
          </li>

          <li
            v-if="isAdmin"
            class="nav-item"
            :class="{ active: $route.name === 'user-management' }"
            @click="navigate('user-management')"
          >
            <i class="fas fa-user-cog"></i>
            <span>User Management</span>
            <div v-if="$route.name === 'user-management'" class="active-indicator"></div>
          </li>
        </ul>
      </div>
    </nav>

    <!-- FOOTER -->
    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-info">
          <span class="user-name">{{ user.name || 'User' }}</span>
          <span class="user-role">{{ user.role }}</span>
        </div>
      </div>
      <button @click="logout" class="logout-btn" title="Logout">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, logout, refresh } = useAuth()
const router = useRouter()

const isAdmin = computed(() => user.value?.role === 'admin')
const pendingCount = ref(0)

const navigate = (name) => {
  router.push({ name }).catch(() => {})
}

const fetchPendingAppointments = async () => {
  if (!isAuthenticated.value) return

  try {
    const res = await fetch('https://ridezonesbackends-dzei.onrender.com/listappointment', {
      credentials: 'include'
    })
    const data = await res.json()

    if (data.status === 'success' && Array.isArray(data.appointments)) {
      pendingCount.value = data.appointments.filter(a => a.status === 'pending').length
    }
  } catch (err) {
    console.error('Failed to fetch appointments:', err)
  }
}

// Real-time update kapag nagbago ang user
watch(isAuthenticated, (newVal) => {
  if (newVal) fetchPendingAppointments()
}, { immediate: true })

// Update badge kapag may bagong appointment
const handleBadgeUpdate = () => fetchPendingAppointments()
onMounted(() => {
  window.addEventListener('updateSidebarBadge', handleBadgeUpdate)
  fetchPendingAppointments()
})
onUnmounted(() => {
  window.removeEventListener('updateSidebarBadge', handleBadgeUpdate)
})

// Logout
const handleLogout = async () => {
  await logout()
  router.push('/login')
}

defineProps({
  theme: { type: String, default: 'dark' }
})
</script>

<style scoped>
/* Your epic style remains 100% untouched — perfect as always */
.sidebar { width: 280px; height: 100vh; position: fixed; left: 0; top: 0; background: var(--bg-secondary); border-right: 1px solid var(--border-primary); display: flex; flex-direction: column; z-index: 1000; transition: all 0.3s ease; }
.sidebar-header { padding: 30px 25px; border-bottom: 1px solid var(--border-primary); }
.logo { display: flex; align-items: center; gap: 12px; }
.logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #d40000, #a80000); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; box-shadow: 0 4px 15px rgba(212, 0, 0, 0.3); }
.logo-text { font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, #d40000, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.sidebar-nav { flex: 1; padding: 30px 0; overflow-y: auto; }
.nav-section { margin-bottom: 30px; }
.nav-section-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); padding: 0 25px 10px; margin-bottom: 10px; border-bottom: 1px solid var(--border-primary); }
.nav-links { list-style: none; padding: 0; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 25px; color: var(--text-secondary); cursor: pointer; transition: all 0.3s ease; position: relative; border-left: 3px solid transparent; }
.nav-item:hover { color: var(--text-primary); background: var(--bg-tertiary); border-left-color: var(--text-accent); }
.nav-item.active { color: var(--text-accent); background: linear-gradient(90deg, rgba(212, 0, 0, 0.1), transparent); border-left-color: var(--text-accent); }
.nav-item i { width: 20px; font-size: 1rem; }
.nav-item span { flex: 1; font-weight: 500; }
.badge { background: #d40000; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 700; margin-left: auto; min-width: 20px; text-align: center; }
.active-indicator { position: absolute; right: 15px; width: 8px; height: 8px; background: #d40000; border-radius: 50%; box-shadow: 0 0 10px rgba(212, 0, 0, 0.8); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } }
.sidebar-footer { padding: 20px 25px; border-top: 1px solid var(--border-primary); display: flex; align-items: center; justify-content: space-between; }
.user-profile { display: flex; align-items: center; gap: 12px; }
.avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #2d2d2d, #1a1a1a); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); border: 2px solid var(--border-primary); }
/* FINAL & PERFECT — NAKA-STACK NA, SOBRANG CLEAN AT CLASSY */
.user-info { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.3;}
.user-name { font-weight: 600; color: var(--text-primary, #ffffff); font-size: 0.95rem; letter-spacing: 0.3px;}
.user-role { font-size: 0.75rem; color: var(--text-secondary, #9ca3af);text-transform: capitalize; font-weight: 500; margin-top: 2px; opacity: 0.9;}
.footer-actions { display: flex; gap: 10px; }
.theme-toggle, .logout-btn { width: 40px; height: 40px; border: none; background: var(--bg-tertiary); color: var(--text-secondary); border-radius: 10px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
.theme-toggle:hover, .logout-btn:hover { color: var(--text-accent); background: var(--bg-secondary); transform: scale(1.1); }
@media (max-width: 1200px) { .sidebar { transform: translateX(-100%); } .sidebar.mobile-open { transform: translateX(0); } }
</style>