import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // DEV: gumagamit ng proxy (zero CORS)
  server: {
    port: 5173,
    proxy: {
      '^/api/.*': {
        target: 'https://ridezonesbackends-dzei.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'https://ridezonesbackends-dzei.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // PRODUCTION: diretso na sa real backend (no localhost ever)
  define: {
    'import.meta.env.VITE_API_BASE': JSON.stringify('https://ridezonesbackends-dzei.onrender.com')
  }
})