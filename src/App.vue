<template>
  <div id="app" :class="theme">
    <!-- SIDEBAR: LILITAW LANG KAPAG MAY AUTHENTICATED USER TALAGA -->
    <Sidebar
      v-if="isAuthenticated && user"
      :theme="theme"
      :currentPage="$route.name"
      @toggle-theme="toggleTheme"
    />

    <!-- MAIN CONTENT -->
    <div
      class="main-content"
      :class="{ 'full-width': !isAuthenticated || !user }"
    >
      <!-- HINTAYIN MATAPOS ANG AUTH BAGO MAG-RENDER NG ANUMAN -->
      <div v-if="authReady">
        <router-view :theme="theme" />
      </div>
      <div v-else class="loading-screen">
        <div class="loader"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'  // ← GAMITIN MO NA ANG @ ALIAS
import Sidebar from './views/Sidebars.vue'

const route = useRoute()
const { user, isAuthenticated, loading, waitForAuth } = useAuth()

// === AUTH STATE ===
const authReady = ref(false)

onMounted(async () => {
  await waitForAuth()     // ← TAMA NA ‘TO! NASA LOOB NG async function
  authReady.value = true  // ← NGAYON LANG MAGRE-RENDER ANG LAHAT
})

// === THEME ===
const theme = ref('dark')

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('ridezone-theme', theme.value)
}

onMounted(() => {
  const saved = localStorage.getItem('ridezone-theme')
  if (saved) {
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

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-primary);
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-primary);
  border-top: 4px solid var(--text-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1200px) {
  .main-content { margin-left: 0; padding-top: 70px; }
}
</style>

<!-- GLOBAL STYLES MO — SAME LANG, PERO MAS CLEAN NA -->
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
body, html, #app { width: 100%; height: 100%; font-family: 'Poppins', sans-serif; background: var(--bg-primary); color: var(--text-primary); }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--text-accent); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a80000; }
</style>