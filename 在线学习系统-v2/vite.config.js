import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  base: '/OpenClawwww/test/',
  plugins: [vue()],
  server: {
    port: 5173
  }
})
