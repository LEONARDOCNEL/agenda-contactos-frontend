import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',  // ← CAMBIAR A ESTO
  server: {
    port: 3000
  }
})