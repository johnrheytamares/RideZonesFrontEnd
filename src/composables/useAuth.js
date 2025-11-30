// src/composables/useAuth.js ← FINAL WITH LOGIN FUNCTION!
import { ref } from 'vue'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)

  // 1. FETCH CURRENT USER
  const fetchUser = async () => {
    try {
      const res = await fetch('https://ridezonesbackends-dzei.onrender.com/auth/me', {
        credentials: 'include',
        headers: {
          // Optional: send current local user if exists
          'X-User': localStorage.getItem('user') || ''
        }
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success && data.user) {
          user.value = data.user
          localStorage.setItem('user', JSON.stringify(data.user))  // Save to localStorage
          return true
        }
      }
      user.value = null
      localStorage.removeItem('user')
      return false
    } catch (err) {
      console.warn('Auth check failed:', err)
      user.value = null
      localStorage.removeItem('user')
      return false
    } finally {
      loading.value = false
    }
  }

  // 2. LOGIN FUNCTION — ITO ANG KAILANGAN MO!
  const login = async (email, password) => {
    try {
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
        
        // Optional: auto-set X-User header globally (kung ginagamit mo sa iba)
        // window.authUser = data.user

        return true
      } else {
        user.value = null
        localStorage.removeItem('user')
        return false
      }
    } catch (err) {
      console.error('Login failed:', err)
      return false
    }
  }

  // 3. REFRESH (para sa after login)
  const refresh = async () => {
    await fetchUser()
  }

  // 4. LOGOUT
  const logout = async () => {
    try {
      await fetch('https://ridezonesbackends-dzei.onrender.com/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err) {
      console.warn('Logout failed')
    }
    user.value = null
    localStorage.removeItem('user')
    await refresh()
  }

  // Auto-check on load
  fetchUser()

  return {
    user,
    loading,
    login,      // ITO NA!
    logout,     // Bonus
    refresh
  }
}