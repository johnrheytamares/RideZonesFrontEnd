<template>
  <div id="app" :class="theme">
    <!-- AUTOMATIC SIDEBAR LOGIC — WALANG MANUAL NA LISTAHAN! -->
    <Sidebar
      v-if="shouldShowSidebar"
      :theme="theme"
      :currentPage="$route.name"
      @toggle-theme="toggleTheme"
    />

    <!-- MAIN CONTENT -->
    <div
      class="main-content"
      :class="{ 'full-width': !shouldShowSidebar }"
    >
      <router-view :theme="theme" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './views/Sidebars.vue'

const route = useRoute()

// Theme logic
const theme = ref('dark')

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('ridezone-theme', theme.value) // optional: save preference
}

// Load saved theme
onMounted(() => {
  const saved = localStorage.getItem('ridezone-theme')
  if (saved) {
    theme.value = saved
    document.documentElement.setAttribute('data-theme', theme.value)
  }
})

// AUTOMATIC: HIDE SIDEBAR SA MGA PUBLIC PAGES LANG
const shouldShowSidebar = computed(() => {
  const publicRoutes = [
    'login',
    'registration',
    'forgot-password',
    'reset-password',
    'home',
    'cars-page',
    'car-comparison',
    'dealers',
    'about',
    'contact',
    'google-form'
  ]

  return !publicRoutes.includes(route.name)
})
</script>

<style scoped>
#app {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: margin-left 0.3s ease;
}

.main-content.full-width {
  margin-left: 0;
  width: 100%;
}

/* Responsive */
@media (max-width: 1200px) {
  .main-content {
    margin-left: 0;
    padding-top: 70px;
  }
}
</style>

<!-- GLOBAL STYLES (ILAGAY MO SA App.vue O SA SEPARATE FILE) -->
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

* { margin: 0; padding: 0; box-sizing: border-box; }

body, html, #app {
  width: 100%;
  height: 100%;
  font-family: 'Poppins', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--text-accent); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a80000; }
</style>