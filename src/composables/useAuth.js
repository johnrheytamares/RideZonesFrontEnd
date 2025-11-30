// src/composables/useAuth.js ← FINAL VERSION (NO BACKEND CHANGES NEEDED!)
import { ref } from 'vue'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)

  const fetchUser = async () => {
    try {
      const res = await fetch('https://ridezonesbackends-dzei.onrender.com/authsess', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // Optional: send local user if exists
          'X-User': localStorage.getItem('user') || ''
        }
      })

      const data = await res.json()

      if (data.success && data.user) {
        user.value = data.user
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        user.value = null
        localStorage.removeItem('user')
      }
    } catch (err) {
      // NORMAL LANG ‘YAN SA LOGIN PAGE — WALANG USER PA!
      console.log('No user yet (normal sa login page)')
      user.value = null
      localStorage.removeItem('user')
    } finally {
      // ETO ANG PINAKA-IMPORTANT — ALWAYS FALSE!
      loading.value = false
    }
  }

  // Auto-check on load
  fetchUser()

  const login = async (email, password) => {
    const res = await fetch('https://ridezonesbackends-dzei.onrender.com/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok && data.status === 'success' && data.user) {
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
      await fetchUser() // refresh para sure
      return true
    }
    return false
  }

  const logout = async () => {
    await fetch('https://ridezonesbackends-dzei.onrender.com/logout', {
      method: 'POST',
      credentials: 'include'
    })
    user.value = null
    localStorage.removeItem('user')
  }

  const refresh = async () => {
    loading.value = true
    await fetchUser()
  }

  return { user, loading, login, logout, refresh }
}