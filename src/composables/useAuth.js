// src/composables/useAuth.js ← FINAL & ETERNAL VERSION
import { ref, watch } from 'vue'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)

  const fetchUser = async () => {
    try {
      // 1. PALITAN MO ‘TO — RELATIVE PATH NA FOREVER
      const res = await fetch('https://ridezonesbackends-dzei.onrender.com/auth/me', {  // ← WALA NG FULL URL, GAGANA KAHIT SAAN MO I-DEPLOY
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        user.value = data.success ? data.user : null
      } else {
        user.value = null
      }
    } catch (err) {
      console.warn('Auth check failed:', err)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch on load
  fetchUser()

  // Manual refresh (ginagamit sa Login.vue & Sidebar.vue)
  const refresh = () => fetchUser()

  // 2. IDAGDAG MO ‘TO — PARA GUMANA ANG router guard na may loading
  const waitForAuth = () => {
    return new Promise(resolve => {
      if (!loading.value) return resolve()
      const unwatch = watch(loading, (val) => {
        if (!val) {
          unwatch()
          resolve()
        }
      })
    })
  }

  return { user, loading, refresh, waitForAuth }
}