// src/composables/useAuth.js → NO /auth/me, NO @, NO DRAMA
import { ref, computed, readonly } from 'vue'

export function useAuth() {
  const user = ref(null)

  // Load from localStorage kapag nag-load yung app
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch (e) {
      localStorage.removeItem('user')
    }
  }

  const isAuthenticated = computed(() => !!user.value?.id)

  const login = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    isAdmin: computed(() => user.value?.role === 'admin'),
    isDealer: computed(() => user.value?.role === 'dealer')
  }
}