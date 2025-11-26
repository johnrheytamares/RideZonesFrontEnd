import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ridezonesbackends-dzei.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'https://ridezonesbackends-dzei.onrender.com',
        changeOrigin: true,
        secure: false,
        // No rewrite needed — keep /uploads/cars/...
      },
    },
  },
})