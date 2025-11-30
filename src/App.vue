<!-- App.vue -->
<template>
  <div id="app" :class="theme">
    <!-- Sidebar: Only show if logged in AND has role (dealer/admin) -->
    <Sidebar 
      v-if="user && user.role !== 'buyer' && !isPublicRoute"
      :theme="theme"
      :currentPage="$route.name"
      @toggle-theme="toggleTheme"
    />

    <div 
      class="main-content" 
      :class="{ 'full-width': !user || isPublicRoute || user.role === 'buyer' }"
    >
      <router-view :theme="theme" :key="$route.fullPath" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Sidebar from './views/Sidebars.vue'

const { user, loading } = useAuth()
const route = useRoute()

const theme = ref('dark')
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
}

// Listahan ng public routes (hindi kailangan ng sidebar)
const publicRoutes = [
  'login', 'registration', 'home', 'cars-page', 'car-comparison',
  'dealer', 'about', 'contact', 'forgot-password', 'reset-password'
]

const isPublicRoute = computed(() => {
  return publicRoutes.includes(route.name)
})
</script>

<style>
:root {
  --bg-primary: #b8afaf;
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
}

#app {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}


.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 0;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: margin-left 0.3s ease;
}

.main-content.full-width {
  margin-left: 0; /* expands content when sidebar hidden */
  width: 100%;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-content {
    margin-left: 0;
    padding-top: 70px;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--text-accent);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a80000;
}
</style>
