<!-- src/App.vue -->
<template>
  <div id="app" :class="theme">
    <!-- SIDEBAR: Lalabas lang kapag PROTECTED PAGE (dashboard, cars-management, etc.) -->
    <Sidebar
      v-if="showSidebar"
      :theme="theme"
      :currentPage="$route.name"
      @toggle-theme="toggleTheme"
    />

    <!-- MAIN CONTENT -->
    <div
      class="main-content"
      :class="{ 'full-width': !showSidebar }"
    >
      <router-view :theme="theme" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './views/Sidebars.vue'
import { useAuth } from './composables/useAuth'

const route = useRoute()
const { isAuthenticated, user } = useAuth()

// Listahan ng PUBLIC PAGES — walang sidebar, full width
const publicPages = [
  'home',
  'login',
  'registration',
  'forgot-password',
  'reset-password',
  'cars-page',
  'car-comparison',
  'about',
  'contact',
  'google-form',
  'appointmentpage',
  // optional: kung may iba ka pang landing page components
  'featured-cars', 'hero-section', 'services-section', 'testimonials-section'
]

// Computed: May sidebar ba o full width?
const showSidebar = computed(() => {
  // Kung public page → walang sidebar
  if (publicPages.includes(route.name)) return false
  
  // Kung naka-login at hindi public → may sidebar
  return isAuthenticated.value && user.value
})

// Theme system — with localStorage save
const theme = ref('dark')

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('ridezone-theme', theme.value)
}

// Load saved theme on mount
onMounted(() => {
  const saved = localStorage.getItem('ridezone-theme')
  if (saved === 'light' || saved === 'dark') {
    theme.value = saved
    document.documentElement.setAttribute('data-theme', theme.value)
  }
})
</script>

<style scoped>
#app {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background 0.3s ease;
}

.main-content {
  flex: 1;
  margin-left: 280px;           /* space para sa sidebar */
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.main-content.full-width {
  margin-left: 0;
  width: 100%;
}

/* Mobile: hide sidebar by default */
@media (max-width: 1200px) {
  .main-content {
    margin-left: 0;
    padding-top: 70px; /* space para sa future mobile header */
  }
}
</style>

<!-- GLOBAL STYLES (same sa dati mo, mas clean lang) -->
<style>
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-accent: #d40000;
  --border-primary: rgba(255, 255, 255, 0.1);
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --text-accent: #d40000;
  --border-primary: rgba(0, 0, 0, 0.1);
}

* { margin: 0; padding:0; box-sizing:border-box; }
html, body, #app {
  width: 100%;
  height: 100%;
  font-family: 'Poppins', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--text-accent); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a80000; }
</style>